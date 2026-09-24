import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { schemas, reader, balances } from '../server/tools.mjs';
import { configuration, validateClaims } from '../server/auth.mjs';
import { handler } from '../server/handler.mjs';
const user='00000000-0000-4000-8000-000000000001';
const other='00000000-0000-4000-8000-000000000002';
const config={url:'https://example.supabase.co',key:'sb_publishable_test',issuer:'https://example.supabase.co/auth/v1',resource:'http://127.0.0.1:8787/mcp',clients:['chatgpt-client']};
function database(tables) {
  return {from(table) {
    assert.ok(['accounts','transactions','account_transfers','categories','credit_cards','credit_card_statements'].includes(table));
    const filters=[];
    const q={select(){return q;},eq(k,v){filters.push(x=>x[k]===v);return q;},is(k,v){filters.push(x=>(x[k]??null)===v);return q;},gte(k,v){filters.push(x=>x[k]>=v);return q;},lte(k,v){filters.push(x=>x[k]<=v);return q;},lt(k,v){filters.push(x=>x[k]<v);return q;},order(){return q;},async range(start,end){return {data:(tables[table]||[]).filter(x=>filters.every(f=>f(x))).sort((a,b)=>a.id.localeCompare(b.id)).slice(start,end+1),error:null};}};
    return q;
  }};
}
const tables={accounts:[{id:'a',user_id:user,name:'Bank',opening_balance:100},{id:'b',user_id:other,name:'Secret',opening_balance:9000}],transactions:[{id:'1',user_id:user,account_id:'a',type:'expense',amount:20,transaction_date:'2026-09-01',category_id:'food'},{id:'2',user_id:user,account_id:'a',type:'income',amount:50,transaction_date:'2026-09-30'},{id:'3',user_id:user,account_id:'a',type:'expense',amount:999,transaction_date:'2026-09-05',deleted_at:'2026-09-06'},{id:'4',user_id:other,account_id:'b',type:'expense',amount:900,transaction_date:'2026-09-01'},{id:'5',user_id:user,account_id:'a',type:'income',amount:10,transaction_date:'2026-10-01'}],account_transfers:[{id:'x',user_id:user,from_account_id:'a',to_account_id:'c',amount:30},{id:'y',user_id:user,from_account_id:'a',to_account_id:'c',amount:700,deleted_at:'2026-09-01'}],categories:[{id:'food',user_id:user,name:'Food'}]};
test('owner filters, deleted records and transfers match account semantics',async()=>{const r=await reader(database(tables),user)('get_accounts',{});assert.equal(r.accounts.length,1);assert.equal(r.accounts[0].balance,110);});
test('month boundaries exclude transfers and deleted/other-user records',async()=>{assert.deepEqual(await reader(database(tables),user)('get_monthly_summary',{month:'2026-09'}),{month:'2026-09',income:50,expense:20,net:30,transfers_excluded:true});});
test('category totals only include own expenses',async()=>{const r=await reader(database(tables),user)('get_category_spending',{month:'2026-09'});assert.deepEqual(r.categories,[{category_id:'food',name:'Food',total:20}]);});
test('aggregation paginates beyond first database page',async()=>{const db=database({transactions:Array.from({length:251},(_,i)=>({id:String(i).padStart(4,'0'),user_id:user,type:'expense',amount:1,transaction_date:'2026-09-01'}))});assert.equal((await reader(db,user)('get_monthly_summary',{month:'2026-09'})).expense,251);});
test('transaction pagination has no duplicate or leaked rows',async()=>{const read=reader(database(tables),user);const first=await read('list_transactions',{limit:1});const second=await read('list_transactions',{limit:1,offset:first.next_offset});assert.equal(first.transactions[0].id,'1');assert.equal(second.transactions[0].id,'2');});
test('debt tool explicitly limits coverage and uses card balance',async()=>{const db=database({accounts:[{id:'c',user_id:user,opening_balance:-100}],credit_cards:[{id:'card',user_id:user,account_id:'c',card_name:'Card'}]});const r=await reader(db,user)('get_debts',{});assert.equal(r.total,100);assert.equal(r.general_debts_supported,false);});
test('reject arbitrary user identifiers, invalid dates and excessive page size',()=>{assert.throws(()=>schemas.get_accounts.parse({user_id:other}));assert.throws(()=>schemas.list_transactions.parse({from:'2026-02-30'}));assert.throws(()=>schemas.list_transactions.parse({limit:101}));assert.throws(()=>schemas.get_monthly_summary.parse({month:'2026-13'}));});
test('fail closed on database errors rather than return zero totals',async()=>{const db=database(tables);const original=db.from;db.from=t=>{const q=original(t);q.range=async()=>({data:null,error:{message:'private database error'}});return q;};await assert.rejects(reader(db,user)('get_accounts',{}),/Database read failed/);});
test('config forbids service keys and unconfigured client IDs',()=>{assert.throws(()=>configuration({SUPABASE_URL:config.url,SUPABASE_PUBLISHABLE_KEY:'sb_secret_no',MCP_RESOURCE_URL:config.resource,MCP_CLIENT_IDS:'x'}));assert.throws(()=>configuration({}));});
test('token claims reject role escalation, anonymous users, other clients and missing scope',()=>{const good={sub:user,role:'authenticated',client_id:'chatgpt-client',scope:'openid'};assert.equal(validateClaims(good,config),good);for(const patch of [{role:'service_role'},{is_anonymous:true},{client_id:'other'},{scope:''},{sub:''}])assert.throws(()=>validateClaims({...good,...patch},config));});
test('HTTP discovery, auth challenges, MCP initialize, list and read-only dispatch',async t=>{
  const app=createServer(handler(config,async token=>{if(token!=='valid')throw Error();return {db:database(tables),userId:user};}));
  await new Promise(resolve=>app.listen(0,'127.0.0.1',resolve));t.after(()=>new Promise(resolve=>app.close(resolve)));
  const base=`http://127.0.0.1:${app.address().port}`;
  const meta=await fetch(`${base}/.well-known/oauth-protected-resource`);assert.equal((await meta.json()).resource,config.resource);
  const unauthorized=await fetch(`${base}/mcp`,{method:'POST'});assert.equal(unauthorized.status,401);assert.match(unauthorized.headers.get('www-authenticate'),/resource_metadata/);
  const wrong=await fetch(`${base}/mcp`,{method:'POST',headers:{authorization:'Bearer bad'}});assert.equal(wrong.status,401);
  const call=async(method,params={})=>{const r=await fetch(`${base}/mcp`,{method:'POST',headers:{authorization:'Bearer valid','content-type':'application/json',accept:'application/json, text/event-stream'},body:JSON.stringify({jsonrpc:'2.0',id:1,method,params})});assert.equal(r.status,200);return r.json();};
  assert.equal((await call('initialize',{protocolVersion:'2025-03-26',capabilities:{},clientInfo:{name:'test',version:'1'}})).result.serverInfo.name,'kira');
  const list=(await call('tools/list')).result.tools;assert.equal(list.length,6);assert.ok(list.every(x=>x.annotations.readOnlyHint && !x.annotations.destructiveHint));
  assert.equal((await call('tools/call',{name:'get_accounts',arguments:{}})).result.structuredContent.accounts[0].balance,110);
  const write=await call('tools/call',{name:'delete_transaction',arguments:{}});assert.ok(write.error || write.result?.isError);
});

import { generateKeyPair, SignJWT } from 'jose';
import { verifyAccessToken } from '../server/auth.mjs';
test('cryptographic verification rejects forged, expired, wrong issuer and wrong audience JWTs',async()=>{
  const {privateKey,publicKey}=await generateKeyPair('ES256');
  const otherKey=await generateKeyPair('ES256');
  const issue=(overrides={},key=privateKey)=>new SignJWT({sub:user,role:'authenticated',client_id:'chatgpt-client',scope:'openid',iss:config.issuer,aud:config.resource,exp:Math.floor(Date.now()/1000)+60,iat:Math.floor(Date.now()/1000),...overrides}).setProtectedHeader({alg:'ES256'}).sign(key);
  assert.equal((await verifyAccessToken(await issue(),config,publicKey)).sub,user);
  for(const patch of [{exp:1},{iss:'https://attacker.example'},{aud:'authenticated'},{role:'service_role'}]) await assert.rejects(verifyAccessToken(await issue(patch),config,publicKey));
  await assert.rejects(verifyAccessToken(await issue({},otherKey.privateKey),config,publicKey));
});
test('unexpected lower database row cap does not silently undercount totals',async()=>{
  const db=database({transactions:Array.from({length:70},(_,i)=>({id:String(i),user_id:user,type:'expense',amount:1,transaction_date:'2026-09-01'}))});
  const original=db.from;db.from=table=>{const q=original(table);const range=q.range;q.range=async(s,e)=>({...await range(s,Math.min(e,s+49)),count:70});return q;};
  await assert.rejects(reader(db,user)('get_monthly_summary',{month:'2026-09'}),/row cap/);
});

import { mcpClaims } from '../server/oauth-claims.mjs';
test('audience transform preserves ordinary logins and only adds audience for approved OAuth clients',()=>{
  const event={claims:{aud:'authenticated',role:'authenticated',sub:user}};
  assert.deepEqual(mcpClaims(event,{clientIds:['x'],resource:config.resource}),event);
  assert.deepEqual(mcpClaims({...event,client_id:'x'},{clientIds:['x'],resource:config.resource}).claims.aud,['authenticated',config.resource]);
});
