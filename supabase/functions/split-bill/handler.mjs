import { totals, validateBill, suggestPlan, validatePlan, progress, reportPayment, decidePayment } from '../../../split-core.mjs';

const uuid = value => typeof value==='string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
export async function hashToken(token) {
  const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token));
  return [...new Uint8Array(bytes)].map(n=>n.toString(16).padStart(2,'0')).join('');
}
function cleanOwner(b) {
  return {...b,participants:b.participants.map(({tokenHash,...p})=>({...p,hasLink:Boolean(tokenHash)}))};
}
export function participantView(b,id) {
  const t=totals(b),state=progress(b), lines=state.lines.filter(l=>l.from===id || l.to===id);
  const visible=new Set([id,...lines.flatMap(l=>[l.from,l.to])]);
  return {id:b.id,name:b.name,date:b.date,revision:b.revision,participantId:id,
    participants:b.participants.filter(p=>visible.has(p.id)).map(p=>({id:p.id,name:p.name,instructions:p.instructions || ''})),
    person:t.people.find(p=>p.id===id) && Object.fromEntries(Object.entries(t.people.find(p=>p.id===id)).filter(([k])=>!['tokenHash','instructions','isSelf'].includes(k))),
    items:t.itemShares.filter(i=>i.participants.includes(id)).map(i=>({name:i.name,cents:i.shares[id]})),
    lines,payments:(b.payments || []).filter(p=>p.from===id || p.to===id),complete:state.complete};
}
export function createSplitService(db) {
  async function notify(owner,b,title,message,key) {
    // Notification failure must not undo or misreport an already saved payment.
    await db.from('notifications').upsert({user_id:owner,kind:'system',severity:'info',title,message,target_page:'transactions',target_hash:'transactions',dedupe_key:`split:${b.id}:${key}`},{onConflict:'user_id,dedupe_key',ignoreDuplicates:true});
  }
  async function read(id) {
    if (!uuid(id)) throw new Error('Invalid bill link.');
    const {data,error}=await db.from('split_bills').select('id,user_id,revision,document').eq('id',id).single();
    if(error || !data) throw new Error('Bill unavailable.');
    return {owner:data.user_id,b:{...data.document,id:data.id,revision:data.revision}};
  }
  async function save(b,owner,expected,rows=[],linked=null,linkedReport=null) {
    const {data,error}=await db.rpc('save_split_bill',{p_id:b.id,p_owner:owner,p_expected:expected,p_document:b,p_rows:rows,p_link:linked,p_link_report:linkedReport});
    if(error) throw new Error(error.message.includes('changed') ? 'Bill changed in another window. Refresh and try again.' : error.message);
    return {...b,revision:data};
  }
  async function account(id,owner) {
    if(!uuid(id)) throw new Error('Choose your account.');
    const {data}=await db.from('accounts').select('id,is_active').eq('id',id).eq('user_id',owner).single();
    if(!data?.is_active) throw new Error('Choose an active account belonging to you.');
    return id;
  }
  async function category(id,owner) {
    const {data}=await db.from('categories').select('id,type,is_active').eq('id',id).eq('user_id',owner).single();
    if(!data?.is_active || !['expense','both'].includes(data.type)) throw new Error('Choose an expense category belonging to you.');
    return id;
  }
  function row(b,accountId,amount,reportAmount,cashAmount,type,date,description) {
    return {id:crypto.randomUUID(),account_id:accountId,category_id:b.categoryId,amount:amount/100,report_amount:reportAmount/100,cash_amount:cashAmount/100,type,transaction_date:date,description,notes:'Managed by Split Bill. Repayments are excluded from income and spending.'};
  }
  return async function run(input,userId=null) {
    if(!input || typeof input.action!=='string') throw new Error('Invalid request.');
    if(input.action==='list') {
      if(!userId) throw new Error('Sign in to Kira.');
      const {data,error}=await db.from('split_bills').select('id,revision,document').eq('user_id',userId).order('created_at',{ascending:false}).limit(500);
      if(error) throw new Error('Unable to load split bills.');
      return {bills:data.filter(x=>!x.document.cancelled).map(x=>cleanOwner({...x.document,id:x.id,revision:x.revision}))};
    }
    if(input.action==='create') {
      if(!userId) throw new Error('Sign in to Kira.');
      const raw=input.bill;
      validateBill(raw);
      if(raw.id && !uuid(raw.id)) throw new Error('Invalid draft ID.');
      if(raw.id) {
        const {data:existing}=await db.from('split_bills').select('id,user_id,revision,document').eq('id',raw.id).eq('user_id',userId).single();
        if(existing){if(existing.document.cancelled)throw new Error('This draft was cancelled. Create a new bill.');return {bill:cleanOwner({...existing.document,id:existing.id,revision:existing.revision})};}
      }
      const b={id:raw.id || crypto.randomUUID(),name:raw.name.trim(),date:raw.date,mode:raw.mode,
        participants:raw.participants.map(p=>({id:p.id,name:p.name.trim(),isSelf:p.isSelf===true,instructions:p.instructions || ''})),
        items:raw.items.map(i=>({id:i.id,name:i.name.trim(),cents:i.cents,participants:i.participants})),
        discountCents:raw.discountCents,chargeCents:raw.chargeCents,chargeMode:raw.chargeMode,
        paid:raw.paid.map(p=>({id:p.id,participantId:p.participantId,cents:p.cents,accountId:p.accountId || null})),
        categoryId:await category(raw.categoryId,userId),accountId:await account(raw.accountId,userId),payments:[],revision:0};
      b.plan=raw.plan || suggestPlan(b); validatePlan(b,b.plan);
      const self=totals(b).people.find(p=>p.isSelf),ownPaid=b.paid.filter(p=>p.participantId===self.id),rows=[];
      for(const p of ownPaid) await account(p.accountId || b.accountId,userId);
      let linked=null;
      if(raw.linkedTransactionId) {
        if(!uuid(raw.linkedTransactionId)) throw new Error('Invalid transaction.');
        const {data:tx}=await db.from('transactions').select('*').eq('id',raw.linkedTransactionId).eq('user_id',userId).is('deleted_at',null).single();
        if(!tx || tx.type!=='expense' || tx.split_bill_id || tx.recurring_id || tx.linked_transfer_id) throw new Error('Choose an ordinary expense that has not been split.');
        if(ownPaid.length!==1 || Math.round(Number(tx.amount)*100)!==ownPaid[0].cents || tx.account_id!==(ownPaid[0].accountId || b.accountId) || tx.transaction_date!==b.date || tx.category_id!==b.categoryId) throw new Error('Your shop payment, account, category and date must match the existing transaction.');
        linked=tx.id;b.linkedTransactionId=tx.id;
      } else if(ownPaid.length) {
        ownPaid.forEach((p,i)=>rows.push(row(b,p.accountId || b.accountId,Math.max(p.cents,i===0 ? self.share : 0),i===0 ? self.share : 0,p.cents,'expense',b.date,`Split: ${b.name}`)));
      } else if(self.share>0) rows.push(row(b,b.accountId,self.share,self.share,0,'expense',b.date,`Split: ${b.name}`));
      return {bill:cleanOwner(await save(b,userId,0,rows,linked,self.share/100))};
    }
    const {owner,b}=await read(input.id);
    let actor;
    if(userId===owner && !input.token) actor='owner';
    else {
      if(typeof input.token!=='string' || !/^[a-f0-9]{64}$/.test(input.token)) throw new Error('This participant link is invalid or has expired.');
      const hash=await hashToken(input.token);
      actor=b.participants.find(p=>p.tokenHash===hash)?.id;
      if(!actor) throw new Error('This participant link is invalid or has expired.');
    }
    if(b.cancelled) throw new Error('This bill has been cancelled.');
    const view=value=>actor==='owner' ? {bill:cleanOwner(value)} : {view:participantView(value,actor)};
    if(input.action==='get') {
      const result=view(b),payments=result.bill?.payments || result.view?.payments || [];
      for(const p of payments) if(p.proofPath) {
        const {data}=await db.storage.from('receipts').createSignedUrl(p.proofPath,300);
        p.proofUrl=data?.signedUrl || null;
      }
      return result;
    }
    if(input.revision!==b.revision) throw new Error('Bill changed in another window. Refresh and try again.');
    if(input.action==='cancel') {
      if(actor!=='owner') throw new Error('Only the bill creator can cancel a bill.');
      if((b.payments || []).some(p=>p.status!=='rejected')) throw new Error('Cannot cancel a bill with reported or confirmed repayments.');
      const {error}=await db.rpc('cancel_split_bill',{p_id:b.id,p_owner:owner,p_expected:b.revision});
      if(error) throw new Error(error.message);
      return {cancelled:true};
    }
    if(input.action==='person') {
      if(actor!=='owner') throw new Error('Only the bill creator can edit participants.');
      if(!b.participants.some(p=>p.id===input.participantId)) throw new Error('Participant not found.');
      const next={...b,participants:b.participants.map(p=>p.id===input.participantId ? {...p,name:input.name,instructions:input.instructions || ''} : p)};
      validateBill(next);return view(await save(next,owner,b.revision));
    }
    if(input.action==='plan') {
      if(actor!=='owner') throw new Error('Only the bill creator can change the plan.');
      if((b.payments || []).some(p=>p.status!=='rejected')) throw new Error('A repayment was already reported. The plan is locked to preserve payment history.');
      validatePlan(b,input.plan); return view(await save({...b,plan:input.plan},owner,b.revision));
    }
    if(input.action==='link') {
      if(actor!=='owner') throw new Error('Only the bill creator can share participant links.');
      if(!b.participants.some(p=>p.id===input.participantId)) throw new Error('Participant not found.');
      const bytes=crypto.getRandomValues(new Uint8Array(32)),token=[...bytes].map(n=>n.toString(16).padStart(2,'0')).join('');
      const tokenHash=await hashToken(token);
      const updated=await save({...b,participants:b.participants.map(p=>p.id===input.participantId ? {...p,tokenHash} : p)},owner,b.revision);
      return {...view(updated),token};
    }
    if(input.action==='report') {
      let next=reportPayment(b,{...input.payment,proofPath:null},actor),path=null;
      if(input.proof) {
        if(!['image/jpeg','image/png','image/webp','application/pdf'].includes(input.proof.type) || typeof input.proof.base64!=='string' || input.proof.base64.length>6990600) throw new Error('Use JPG, PNG, WebP or PDF up to 5 MB.');
        const bytes=Uint8Array.from(atob(input.proof.base64),c=>c.charCodeAt(0));
        const png=bytes[0]===137 && bytes[1]===80 && bytes[2]===78 && bytes[3]===71;
        const jpg=bytes[0]===255 && bytes[1]===216 && bytes[2]===255;
        const pdf=new TextDecoder().decode(bytes.slice(0,5))==='%PDF-';
        const webp=new TextDecoder().decode(bytes.slice(0,4))==='RIFF' && new TextDecoder().decode(bytes.slice(8,12))==='WEBP';
        if(!bytes.length || bytes.length>5242880 || !({ 'image/png':png,'image/jpeg':jpg,'application/pdf':pdf,'image/webp':webp }[input.proof.type])) throw new Error('Invalid proof file.');
        path=`${owner}/split/${b.id}/${crypto.randomUUID()}`;
        const {error}=await db.storage.from('receipts').upload(path,bytes,{contentType:input.proof.type,upsert:false});
        if(error) throw new Error('Unable to upload proof.');
        next={...next,payments:next.payments.map(p=>p.id===input.payment.id ? {...p,proofPath:path} : p)};
      }
      try {
        const saved=await save(next,owner,b.revision);
        if(actor!=='owner') {
          try {await notify(owner,b,'Split payment reported',`${b.participants.find(p=>p.id===input.payment.from)?.name} reported RM${(input.payment.cents/100).toFixed(2)} for ${b.name}. Review it in Split Bills.`,`${input.payment.id}:reported`);} catch {}
        }
        return view(saved);
      }
      catch(error) {if(path) await db.storage.from('receipts').remove([path]);throw error;}
    }
    if(input.action==='decision') {
      const next=decidePayment(b,input.paymentId,input.decision,actor),p=next.payments.find(p=>p.id===input.paymentId),self=b.participants.find(p=>p.isSelf),rows=[];
      if(input.decision==='confirmed' && (p.from===self.id || p.to===self.id)) {
        const accountId=await account(actor==='owner' ? (input.accountId || b.accountId) : b.accountId,owner);
        rows.push(row(b,accountId,p.cents,0,p.cents,p.to===self.id ? 'income' : 'expense',p.date,`Split repayment: ${b.name}`));
      }
      const saved=await save(next,owner,b.revision,rows);
      if(actor!=='owner') {
        try {await notify(owner,b,'Split payment updated',`${b.participants.find(p=>p.id===actor)?.name} ${input.decision} a repayment for ${b.name}.`,`${p.id}:${input.decision}`);} catch {}
      }
      return view(saved);
    }
    throw new Error('Unsupported split action.');
  };
}
