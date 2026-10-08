import { createClient } from 'npm:@supabase/supabase-js@2.116.0';

const cors={
  'Access-Control-Allow-Origin':'*',
  'Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods':'POST, OPTIONS'
};
const reply=(body:unknown,status=200)=>new Response(JSON.stringify(body),{
  status,
  headers:{...cors,'Content-Type':'application/json','Cache-Control':'no-store'}
});
const uuid=(value:unknown)=>typeof value==='string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
const clean=(value:unknown,max=160)=>String(value ?? '').trim().replace(/\s+/g,' ').slice(0,max);
const money=(value:number)=>`RM${value.toFixed(2)}`;

async function hashToken(token:string) {
  const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token));
  return [...new Uint8Array(bytes)].map(n=>n.toString(16).padStart(2,'0')).join('');
}
function newToken() {
  const bytes=crypto.getRandomValues(new Uint8Array(32));
  return [...bytes].map(n=>n.toString(16).padStart(2,'0')).join('');
}
async function ownerFromRequest(req:Request,db:any) {
  const token=req.headers.get('Authorization')?.replace(/^Bearer\s+/i,'')?.trim();
  if(!token) return null;
  const {data,error}=await db.auth.getUser(token);
  return error || !data?.user ? null : data.user;
}
async function proofUpload(db:any,owner:string,id:string,proof:any) {
  if(!proof) return null;
  if(!['image/jpeg','image/png','image/webp','application/pdf'].includes(proof.type) || typeof proof.base64!=='string' || proof.base64.length>6990600) {
    throw new Error('Use JPG, PNG, WebP or PDF up to 5 MB.');
  }
  const bytes=Uint8Array.from(atob(proof.base64),c=>c.charCodeAt(0));
  const png=bytes[0]===137 && bytes[1]===80 && bytes[2]===78 && bytes[3]===71;
  const jpg=bytes[0]===255 && bytes[1]===216 && bytes[2]===255;
  const pdf=new TextDecoder().decode(bytes.slice(0,5))==='%PDF-';
  const webp=new TextDecoder().decode(bytes.slice(0,4))==='RIFF' && new TextDecoder().decode(bytes.slice(8,12))==='WEBP';
  if(!bytes.length || bytes.length>5242880 || !({ 'image/png':png,'image/jpeg':jpg,'application/pdf':pdf,'image/webp':webp } as Record<string,boolean>)[proof.type]) {
    throw new Error('Invalid proof file.');
  }
  const path=`${owner}/request-money/${id}/${crypto.randomUUID()}`;
  const {error}=await db.storage.from('receipts').upload(path,bytes,{contentType:proof.type,upsert:false});
  if(error) throw new Error('Unable to upload payment proof.');
  return path;
}
async function publicRow(db:any,id:string,token:string) {
  if(!uuid(id) || typeof token!=='string' || token.length<32) throw new Error('Invalid payment request link.');
  const tokenHash=await hashToken(token);
  const {data,error}=await db.from('payment_requests').select('*').eq('id',id).eq('public_token_hash',tokenHash).maybeSingle();
  if(error || !data) throw new Error('Payment request unavailable.');
  return data;
}
async function qrUrl(db:any,userId:string) {
  const {data}=await db.from('split_payment_profiles').select('qr_path').eq('user_id',userId).maybeSingle();
  if(!data?.qr_path) return null;
  const {data:signed}=await db.storage.from('receipts').createSignedUrl(data.qr_path,300);
  return signed?.signedUrl || null;
}
function view(row:any,qr:string|null=null) {
  const expired=new Date(row.expires_at).getTime()<Date.now() && !['paid','cancelled'].includes(row.status);
  return {
    id:row.id,
    requesterName:row.requester_name,
    recipientName:row.recipient_name || '',
    amount:Number(row.amount),
    note:row.note || '',
    status:row.status,
    expired,
    expiresAt:row.expires_at,
    report:row.report || null,
    transactionId:row.transaction_id || null,
    createdAt:row.created_at,
    qrUrl:qr
  };
}

Deno.serve(async(req:Request)=>{
  if(req.method==='OPTIONS') return new Response('ok',{headers:cors});
  if(req.method!=='POST') return reply({error:'Method not allowed'},405);

  try {
    const raw=await req.text();
    if(raw.length>7200000) return reply({error:'Request too large'},413);
    const input=JSON.parse(raw || '{}');
    const db=createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      {auth:{persistSession:false,autoRefreshToken:false}}
    );

    if(input.action==='get') {
      const row=await publicRow(db,input.id,input.token);
      return reply({request:view(row,await qrUrl(db,row.user_id))});
    }

    if(input.action==='report') {
      const row=await publicRow(db,input.id,input.token);
      if(row.status==='paid') return reply({request:view(row,await qrUrl(db,row.user_id))});
      if(row.status==='cancelled') throw new Error('This payment request was cancelled.');
      if(new Date(row.expires_at).getTime()<Date.now()) throw new Error('This payment request has expired.');
      if(row.status==='reported') return reply({request:view(row,await qrUrl(db,row.user_id))});

      const proofPath=await proofUpload(db,row.user_id,row.id,input.proof);
      const payerName=clean(input.payerName || row.recipient_name || 'Someone',80);
      const reportData={
        payer_name:payerName || 'Someone',
        reported_at:new Date().toISOString(),
        proof_path:proofPath
      };

      const {data:updated,error:updateError}=await db.from('payment_requests')
        .update({status:'reported',report:reportData,updated_at:new Date().toISOString()})
        .eq('id',row.id).eq('status','pending')
        .select('*').single();
      if(updateError) throw new Error('Unable to report this payment.');

      await db.from('notifications').upsert({
        user_id:row.user_id,
        kind:'system',
        severity:'info',
        title:'Payment reported',
        message:`${payerName || 'Someone'} reported ${money(Number(row.amount))}${row.note ? ` for ${clean(row.note,80)}` : ''}. Review it in Request Money.`,
        target_page:'transactions',
        target_hash:'money-requests',
        dedupe_key:`request-money:${row.id}:reported`
      },{onConflict:'user_id,dedupe_key',ignoreDuplicates:true});

      return reply({request:view(updated,await qrUrl(db,row.user_id))});
    }

    const user=await ownerFromRequest(req,db);
    if(!user) return reply({error:'Sign in to Kira.'},401);
    const userId=user.id;

    if(input.action==='create') {
      const amount=Number(input.amount);
      if(!Number.isFinite(amount) || amount<=0 || amount>9999999.99) throw new Error('Enter a valid amount.');
      const {data:profile}=await db.from('split_payment_profiles').select('qr_path').eq('user_id',userId).maybeSingle();
      if(!profile?.qr_path) throw new Error('Set your Payment QR in Split Bills before creating a money request.');

      const token=newToken(),tokenHash=await hashToken(token);
      const recipientName=clean(input.recipientName,80) || null;
      const note=clean(input.note,160) || null;
      const metadataName=clean(user.user_metadata?.display_name || user.user_metadata?.full_name || '',80);
      const requesterName=metadataName || clean(user.email?.split('@')[0] || 'Kira user',80);
      const expiresAt=new Date(Date.now()+7*24*60*60*1000).toISOString();

      const {data,error}=await db.from('payment_requests').insert({
        user_id:userId,
        requester_name:requesterName,
        recipient_name:recipientName,
        amount:Math.round(amount*100)/100,
        note,
        public_token_hash:tokenHash,
        expires_at:expiresAt
      }).select('*').single();
      if(error) throw error;
      return reply({request:view(data),token});
    }

    if(input.action==='list') {
      const {data,error}=await db.from('payment_requests').select('*').eq('user_id',userId).order('created_at',{ascending:false}).limit(100);
      if(error) throw error;
      return reply({requests:(data || []).map((row:any)=>view(row))});
    }

    if(input.action==='confirm') {
      if(!uuid(input.id) || !uuid(input.accountId)) throw new Error('Choose a valid account.');
      const date=/^\d{4}-\d{2}-\d{2}$/.test(input.date || '') ? input.date : new Date().toISOString().slice(0,10);
      const {data:row}=await db.from('payment_requests').select('*').eq('id',input.id).eq('user_id',userId).maybeSingle();
      if(!row) throw new Error('Payment request not found.');

      const {data:transactionId,error}=await db.rpc('confirm_payment_request',{
        p_id:input.id,
        p_owner:userId,
        p_account:input.accountId,
        p_date:date
      });
      if(error) throw new Error(error.message || 'Unable to confirm payment.');

      const {data:updated}=await db.from('payment_requests').select('*').eq('id',input.id).eq('user_id',userId).single();
      return reply({request:view(updated),transactionId});
    }

    if(input.action==='reject') {
      if(!uuid(input.id)) throw new Error('Invalid payment request.');
      const {data:row,error}=await db.from('payment_requests').select('*').eq('id',input.id).eq('user_id',userId).maybeSingle();
      if(error || !row) throw new Error('Payment request not found.');
      if(row.status!=='reported') throw new Error('There is no reported payment to reject.');
      if(row.report?.proof_path) {
        try { await db.storage.from('receipts').remove([row.report.proof_path]); } catch {}
      }
      const {data:updated,error:updateError}=await db.from('payment_requests')
        .update({status:'pending',report:null,updated_at:new Date().toISOString()})
        .eq('id',row.id).eq('user_id',userId).select('*').single();
      if(updateError) throw new Error('Unable to reject payment report.');
      return reply({request:view(updated)});
    }

    if(input.action==='cancel') {
      if(!uuid(input.id)) throw new Error('Invalid payment request.');
      const {data:row,error}=await db.from('payment_requests').select('*').eq('id',input.id).eq('user_id',userId).maybeSingle();
      if(error || !row) throw new Error('Payment request not found.');
      if(row.status==='paid') throw new Error('A paid request cannot be cancelled.');
      if(row.status==='cancelled') return reply({request:view(row)});
      if(row.report?.proof_path) {
        try { await db.storage.from('receipts').remove([row.report.proof_path]); } catch {}
      }
      const {data:updated,error:updateError}=await db.from('payment_requests')
        .update({status:'cancelled',report:null,updated_at:new Date().toISOString()})
        .eq('id',row.id).eq('user_id',userId).select('*').single();
      if(updateError) throw new Error('Unable to cancel payment request.');
      return reply({request:view(updated)});
    }

    throw new Error('Unsupported Request Money action.');
  } catch(error) {
    return reply({error:error instanceof Error ? error.message : 'Unable to process Request Money.'},400);
  }
});
