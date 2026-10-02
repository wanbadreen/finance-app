import { createClient } from 'npm:@supabase/supabase-js@2.116.0';
import { createSplitService } from './handler.mjs';

// Custom auth: owner requests validate a Supabase JWT; guests validate a
// cryptographically random, hashed, participant-scoped capability token.
const cors={ 'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS' };
const reply=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json','Cache-Control':'no-store'}});
Deno.serve(async(req:Request)=>{
  if(req.method==='OPTIONS') return new Response('ok',{headers:cors});
  if(req.method!=='POST') return reply({error:'Method not allowed'},405);
  try {
    const text=await req.text();
    if(text.length>7200000) return reply({error:'Request too large'},413);
    const input=JSON.parse(text);
    const db=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false,autoRefreshToken:false}});
    let userId=null;
    if(!input.token) {
      const token=req.headers.get('Authorization')?.replace(/^Bearer\s+/i,'');
      if(!token) return reply({error:'Sign in to Kira.'},401);
      const {data,error}=await db.auth.getUser(token);
      if(error || !data.user) return reply({error:'Sign in to Kira.'},401);
      userId=data.user.id;
    }
    return reply(await createSplitService(db)(input,userId));
  } catch(error) { return reply({error:error instanceof Error ? error.message : 'Unable to process this bill.'},400); }
});
