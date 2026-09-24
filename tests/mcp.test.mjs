import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { schemas, reader, balances } from '../server/tools.mjs';
import { configuration, validateClaims } from '../server/auth.mjs';
import { handler } from '../server/handler.mjs';

const user='00000000-0000-4000-8000-000000000001';
const other='00000000-0000-4000-8000-000000000002';
const accountId='00000000-0000-4000-8000-000000000011';
const categoryId='00000000-0000-4000-8000-000000000012';
const incomeCategoryId='00000000-0000-4000-8000-000000000013';
const sourceId='00000000-0000-4000-8000-000000000014';
const methodId='00000000-0000-4000-8000-000000000015';
const otherAccountId='00000000-0000-4000-8000-000000000016';

const config={
  url:'https://example.supabase.co',
  key:'sb_publishable_test',
  issuer:'https://example.supabase.co/auth/v1',
  resource:'http://127.0.0.1:8787/mcp',
  clients:['chatgpt-client']
};

function database(seed) {
  const tables = Object.fromEntries(
    Object.entries(seed).map(([name,rows])=>[name,rows.map(row=>({...row}))])
  );

  return {
    tables,
    from(table) {
      assert.ok([
        'accounts','transactions','account_transfers','categories',
        'income_sources','payment_methods','credit_cards','credit_card_statements'
      ].includes(table));

      const filters=[];
      let insertRows=null;
      let updateRow=null;
      let selected=null;

      const q={
        select(columns){
          selected=columns || null;
          return q;
        },
        eq(k,v){filters.push(x=>x[k]===v);return q;},
        is(k,v){filters.push(x=>(x[k]??null)===v);return q;},
        gte(k,v){filters.push(x=>x[k]>=v);return q;},
        lte(k,v){filters.push(x=>x[k]<=v);return q;},
        lt(k,v){filters.push(x=>x[k]<v);return q;},
        order(){return q;},
        insert(rows){
          insertRows=(Array.isArray(rows)?rows:[rows]).map(row=>({...row}));
          return q;
        },
        update(row){
          updateRow={...row};
          return q;
        },
        async single(){
          const target=tables[table] ||= [];
          let row;
          if (insertRows) {
            row={id:'00000000-0000-4000-8000-000000000099',...insertRows[0]};
            target.push(row);
          } else if (updateRow) {
            row=target.find(x=>filters.every(f=>f(x)));
            if (!row) return {data:null,error:{message:'No matching row'}};
            Object.assign(row,updateRow);
          } else {
            return {data:null,error:{message:'No mutation row'}};
          }
          if (!selected) return {data:row,error:null};
          const fields=String(selected).split(',').map(x=>x.trim());
          return {data:Object.fromEntries(fields.map(key=>[key,row[key]??null])),error:null};
        },
        async range(start,end){
          const rows=(tables[table]||[])
            .filter(x=>filters.every(f=>f(x)))
            .sort((a,b)=>String(a.id).localeCompare(String(b.id)))
            .slice(start,end+1);
          return {data:rows,error:null};
        }
      };
      return q;
    }
  };
}

const tables={
  accounts:[
    {id:'a',user_id:user,name:'Bank',opening_balance:100,is_active:true},
    {id:'b',user_id:other,name:'Secret',opening_balance:9000,is_active:true}
  ],
  transactions:[
    {id:'1',user_id:user,account_id:'a',type:'expense',amount:20,transaction_date:'2026-09-01',category_id:'food'},
    {id:'2',user_id:user,account_id:'a',type:'income',amount:50,transaction_date:'2026-09-30'},
    {id:'3',user_id:user,account_id:'a',type:'expense',amount:999,transaction_date:'2026-09-05',deleted_at:'2026-09-06'},
    {id:'4',user_id:other,account_id:'b',type:'expense',amount:900,transaction_date:'2026-09-01'},
    {id:'5',user_id:user,account_id:'a',type:'income',amount:10,transaction_date:'2026-10-01'}
  ],
  account_transfers:[
    {id:'x',user_id:user,from_account_id:'a',to_account_id:'c',amount:30},
    {id:'y',user_id:user,from_account_id:'a',to_account_id:'c',amount:700,deleted_at:'2026-09-01'}
  ],
  categories:[{id:'food',user_id:user,name:'Food',type:'expense',is_active:true}],
  income_sources:[],
  payment_methods:[]
};

test('owner filters, deleted records and transfers match account semantics',async()=>{
  const r=await reader(database(tables),user)('get_accounts',{});
  assert.equal(r.accounts.length,1);
  assert.equal(r.accounts[0].balance,110);
});

test('month boundaries exclude transfers and deleted/other-user records',async()=>{
  assert.deepEqual(
    await reader(database(tables),user)('get_monthly_summary',{month:'2026-09'}),
    {month:'2026-09',income:50,expense:20,net:30,transfers_excluded:true}
  );
});

test('category totals only include own expenses',async()=>{
  const r=await reader(database(tables),user)('get_category_spending',{month:'2026-09'});
  assert.deepEqual(r.categories,[{category_id:'food',name:'Food',total:20}]);
});

test('aggregation paginates beyond first database page',async()=>{
  const db=database({
    transactions:Array.from({length:251},(_,i)=>({
      id:String(i).padStart(4,'0'),user_id:user,type:'expense',amount:1,transaction_date:'2026-09-01'
    }))
  });
  assert.equal((await reader(db,user)('get_monthly_summary',{month:'2026-09'})).expense,251);
});

test('transaction pagination has no duplicate or leaked rows',async()=>{
  const read=reader(database(tables),user);
  const first=await read('list_transactions',{limit:1});
  const second=await read('list_transactions',{limit:1,offset:first.next_offset});
  assert.equal(first.transactions[0].id,'1');
  assert.equal(second.transactions[0].id,'2');
});

test('debt tool explicitly limits coverage and uses card balance',async()=>{
  const db=database({
    accounts:[{id:'c',user_id:user,opening_balance:-100,is_active:true}],
    credit_cards:[{id:'card',user_id:user,account_id:'c',card_name:'Card'}]
  });
  const r=await reader(db,user)('get_debts',{});
  assert.equal(r.total,100);
  assert.equal(r.general_debts_supported,false);
});

test('transaction options expose only own active choices and filter category type',async()=>{
  const db=database({
    accounts:[
      {id:accountId,user_id:user,name:'Maybank',account_type:'bank',opening_balance:0,is_active:true},
      {id:otherAccountId,user_id:other,name:'Other',account_type:'bank',opening_balance:0,is_active:true}
    ],
    categories:[
      {id:categoryId,user_id:user,name:'Food',type:'expense',is_active:true},
      {id:incomeCategoryId,user_id:user,name:'Salary',type:'income',is_active:true}
    ],
    income_sources:[{id:sourceId,user_id:user,name:'Salary',is_active:true}],
    payment_methods:[{id:methodId,user_id:user,name:'QR',method_type:'qr',system_key:null,is_active:true,sort_order:1}]
  });
  const r=await reader(db,user)('get_transaction_options',{type:'expense'});
  assert.deepEqual(r.accounts,[{id:accountId,name:'Maybank',account_type:'bank'}]);
  assert.deepEqual(r.categories,[{id:categoryId,name:'Food',type:'expense'}]);
  assert.deepEqual(r.income_sources,[]);
  assert.equal(r.payment_methods[0].name,'QR');
});

test('create transaction requires explicit confirmation and validates owned references',async()=>{
  assert.throws(()=>schemas.create_transaction.parse({
    type:'expense',amount:10,transaction_date:'2026-09-24',description:'Lunch',
    account_id:accountId,category_id:categoryId
  }));

  const db=database({
    accounts:[
      {id:accountId,user_id:user,name:'Maybank',account_type:'bank',opening_balance:0,is_active:true},
      {id:otherAccountId,user_id:other,name:'Other',account_type:'bank',opening_balance:0,is_active:true}
    ],
    categories:[
      {id:categoryId,user_id:user,name:'Food',type:'expense',is_active:true},
      {id:incomeCategoryId,user_id:user,name:'Salary',type:'income',is_active:true}
    ],
    income_sources:[{id:sourceId,user_id:user,name:'Salary',is_active:true}],
    payment_methods:[{id:methodId,user_id:user,name:'QR',method_type:'qr',system_key:null,is_active:true,sort_order:1}],
    transactions:[]
  });

  await assert.rejects(
    reader(db,user)('create_transaction',{
      type:'expense',amount:10,transaction_date:'2026-09-24',description:'Lunch',
      account_id:otherAccountId,category_id:categoryId,confirmed:true
    }),
    /active account/
  );

  const created=await reader(db,user)('create_transaction',{
    type:'expense',amount:10.5,transaction_date:'2026-09-24',description:'Lunch',
    account_id:accountId,category_id:categoryId,payment_method_id:methodId,
    notes:'Office',confirmed:true
  });
  assert.equal(created.created,true);
  assert.equal(created.transaction.amount,10.5);
  assert.equal(created.transaction.account_name,'Maybank');
  assert.equal(created.transaction.category_name,'Food');
  assert.equal(db.tables.transactions.length,1);
  assert.equal(db.tables.transactions[0].user_id,user);
});

test('edit transaction updates only an owned ordinary transaction after confirmation',async()=>{
  const db=database({
    accounts:[{id:accountId,user_id:user,name:'Maybank',account_type:'bank',opening_balance:0,is_active:true}],
    categories:[{id:categoryId,user_id:user,name:'Food',type:'expense',is_active:true}],
    income_sources:[],
    payment_methods:[{id:methodId,user_id:user,name:'QR',method_type:'bank_transfer',system_key:null,is_active:true,sort_order:1}],
    transactions:[{
      id:'00000000-0000-4000-8000-000000000021',user_id:user,account_id:accountId,
      category_id:categoryId,income_source_id:null,payment_method_id:null,type:'expense',
      amount:10,transaction_date:'2026-09-24',description:'Dinner',notes:null,deleted_at:null,
      recurring_id:null,linked_transfer_id:null
    }]
  });
  const r=await reader(db,user)('edit_transaction',{
    transaction_id:'00000000-0000-4000-8000-000000000021',
    amount:12.5,
    description:'Late dinner',
    payment_method_id:methodId,
    confirmed:true
  });
  assert.equal(r.updated,true);
  assert.equal(r.before.amount,10);
  assert.equal(r.transaction.amount,12.5);
  assert.equal(r.transaction.description,'Late dinner');
  assert.equal(db.tables.transactions[0].amount,12.5);
});

test('edit and delete refuse recurring and automatic transfer-fee transactions',async()=>{
  const base={
    id:'00000000-0000-4000-8000-000000000022',user_id:user,account_id:accountId,
    category_id:categoryId,income_source_id:null,payment_method_id:null,type:'expense',
    amount:10,transaction_date:'2026-09-24',description:'Protected',notes:null,deleted_at:null
  };
  const recurringDb=database({
    accounts:[{id:accountId,user_id:user,name:'Maybank',account_type:'bank',opening_balance:0,is_active:true}],
    categories:[{id:categoryId,user_id:user,name:'Food',type:'expense',is_active:true}],
    income_sources:[],payment_methods:[],
    transactions:[{...base,recurring_id:'00000000-0000-4000-8000-000000000030',linked_transfer_id:null}]
  });
  await assert.rejects(reader(recurringDb,user)('delete_transaction',{
    transaction_id:base.id,confirmed:true
  }),/Recurring-generated/);

  const feeDb=database({
    accounts:[{id:accountId,user_id:user,name:'Maybank',account_type:'bank',opening_balance:0,is_active:true}],
    categories:[{id:categoryId,user_id:user,name:'Food',type:'expense',is_active:true}],
    income_sources:[],payment_methods:[],
    transactions:[{...base,recurring_id:null,linked_transfer_id:'00000000-0000-4000-8000-000000000031'}]
  });
  await assert.rejects(reader(feeDb,user)('edit_transaction',{
    transaction_id:base.id,amount:20,confirmed:true
  }),/Automatic transfer-fee/);
});

test('delete transaction uses a confirmed soft delete',async()=>{
  const txId='00000000-0000-4000-8000-000000000023';
  const db=database({
    transactions:[{
      id:txId,user_id:user,account_id:accountId,category_id:categoryId,type:'expense',
      amount:10,transaction_date:'2026-09-24',description:'Dinner',notes:null,deleted_at:null,
      recurring_id:null,linked_transfer_id:null
    }]
  });
  const r=await reader(db,user)('delete_transaction',{transaction_id:txId,confirmed:true});
  assert.equal(r.deleted,true);
  assert.equal(r.deletion_mode,'soft_delete');
  assert.ok(db.tables.transactions[0].deleted_at);
});

test('account transfer validates owned active accounts and records an internal transfer',async()=>{
  const toId='00000000-0000-4000-8000-000000000024';
  const db=database({
    accounts:[
      {id:accountId,user_id:user,name:'Maybank',account_type:'bank',opening_balance:100,is_active:true},
      {id:toId,user_id:user,name:'Cash',account_type:'cash',opening_balance:0,is_active:true},
      {id:otherAccountId,user_id:other,name:'Other',account_type:'bank',opening_balance:0,is_active:true}
    ],
    account_transfers:[]
  });
  await assert.rejects(reader(db,user)('create_account_transfer',{
    from_account_id:otherAccountId,to_account_id:toId,amount:20,transfer_date:'2026-09-24',
    description:'Transfer',confirmed:true
  }),/active source account/);

  const r=await reader(db,user)('create_account_transfer',{
    from_account_id:accountId,to_account_id:toId,amount:20,transfer_date:'2026-09-24',
    description:'Move cash',confirmed:true
  });
  assert.equal(r.created,true);
  assert.equal(r.transfer.from_account_name,'Maybank');
  assert.equal(r.transfer.to_account_name,'Cash');
  assert.equal(db.tables.account_transfers.length,1);
});

test('TNG credit-card transfer defaults to the same one-percent fee used by Kira UI',async()=>{
  const cardId='00000000-0000-4000-8000-000000000025';
  const tngId='00000000-0000-4000-8000-000000000026';
  const db=database({
    accounts:[
      {id:cardId,user_id:user,name:'UOB Card',account_type:'credit_card',opening_balance:0,is_active:true},
      {id:tngId,user_id:user,name:'TNG eWallet',account_type:'e_wallet',opening_balance:0,is_active:true}
    ],
    account_transfers:[]
  });
  const r=await reader(db,user)('create_account_transfer',{
    from_account_id:cardId,to_account_id:tngId,amount:100,transfer_date:'2026-09-24',
    description:'TNG top up',confirmed:true
  });
  assert.equal(r.transfer.fee_percent,1);
  assert.equal(r.transfer.fee_amount,1);
});

test('income create requires a matching income category and source',async()=>{
  const db=database({
    accounts:[{id:accountId,user_id:user,name:'Maybank',account_type:'bank',opening_balance:0,is_active:true}],
    categories:[
      {id:categoryId,user_id:user,name:'Food',type:'expense',is_active:true},
      {id:incomeCategoryId,user_id:user,name:'Salary',type:'income',is_active:true}
    ],
    income_sources:[{id:sourceId,user_id:user,name:'Salary',is_active:true}],
    payment_methods:[],
    transactions:[]
  });
  await assert.rejects(
    reader(db,user)('create_transaction',{
      type:'income',amount:100,transaction_date:'2026-09-24',description:'Pay',
      account_id:accountId,category_id:incomeCategoryId,confirmed:true
    }),
    /require an active income source/
  );
  const created=await reader(db,user)('create_transaction',{
    type:'income',amount:100,transaction_date:'2026-09-24',description:'Pay',
    account_id:accountId,category_id:incomeCategoryId,income_source_id:sourceId,confirmed:true
  });
  assert.equal(created.transaction.income_source_name,'Salary');
});

test('reject arbitrary user identifiers, invalid dates and excessive page size',()=>{
  assert.throws(()=>schemas.get_accounts.parse({user_id:other}));
  assert.throws(()=>schemas.list_transactions.parse({from:'2026-02-30'}));
  assert.throws(()=>schemas.list_transactions.parse({limit:101}));
  assert.throws(()=>schemas.get_monthly_summary.parse({month:'2026-13'}));
  assert.throws(()=>schemas.create_transaction.parse({
    type:'expense',amount:1.001,transaction_date:'2026-09-24',description:'x',
    account_id:accountId,category_id:categoryId,confirmed:true
  }));
});

test('fail closed on database errors rather than return zero totals',async()=>{
  const db=database(tables);
  const original=db.from;
  db.from=t=>{
    const q=original(t);
    q.range=async()=>({data:null,error:{message:'private database error'}});
    return q;
  };
  await assert.rejects(reader(db,user)('get_accounts',{}),/Database read failed/);
});

test('config forbids service keys and unconfigured client IDs',()=>{
  assert.throws(()=>configuration({
    SUPABASE_URL:config.url,SUPABASE_PUBLISHABLE_KEY:'sb_secret_no',
    MCP_RESOURCE_URL:config.resource,MCP_CLIENT_IDS:'x'
  }));
  assert.throws(()=>configuration({}));
});

test('token claims reject role escalation, anonymous users, other clients and missing scope',()=>{
  const good={sub:user,role:'authenticated',client_id:'chatgpt-client',scope:'openid'};
  assert.equal(validateClaims(good,config),good);
  for(const patch of [
    {role:'service_role'},{is_anonymous:true},{client_id:'other'},{scope:''},{sub:''}
  ]) assert.throws(()=>validateClaims({...good,...patch},config));
});

test('HTTP discovery, auth challenges, MCP initialize, tool metadata and dispatch',async t=>{
  const app=createServer(handler(config,async token=>{
    if(token!=='valid')throw Error();
    return {db:database(tables),userId:user};
  }));
  await new Promise(resolve=>app.listen(0,'127.0.0.1',resolve));
  t.after(()=>new Promise(resolve=>app.close(resolve)));

  const base=`http://127.0.0.1:${app.address().port}`;
  const meta=await fetch(`${base}/.well-known/oauth-protected-resource`);
  assert.equal((await meta.json()).resource,config.resource);

  const unauthorized=await fetch(`${base}/mcp`,{method:'POST'});
  assert.equal(unauthorized.status,401);
  assert.match(unauthorized.headers.get('www-authenticate'),/resource_metadata/);

  const wrong=await fetch(`${base}/mcp`,{method:'POST',headers:{authorization:'Bearer bad'}});
  assert.equal(wrong.status,401);

  const call=async(method,params={})=>{
    const r=await fetch(`${base}/mcp`,{
      method:'POST',
      headers:{
        authorization:'Bearer valid',
        'content-type':'application/json',
        accept:'application/json, text/event-stream'
      },
      body:JSON.stringify({jsonrpc:'2.0',id:1,method,params})
    });
    assert.equal(r.status,200);
    return r.json();
  };

  assert.equal(
    (await call('initialize',{
      protocolVersion:'2025-03-26',
      capabilities:{},
      clientInfo:{name:'test',version:'1'}
    })).result.serverInfo.name,
    'kira'
  );

  const list=(await call('tools/list')).result.tools;
  assert.equal(list.length,11);
  assert.equal(list.filter(x=>!x.annotations.readOnlyHint).length,4);
  assert.equal(list.find(x=>x.name==='create_transaction').annotations.destructiveHint,false);
  assert.equal(list.find(x=>x.name==='edit_transaction').annotations.destructiveHint,false);
  assert.equal(list.find(x=>x.name==='create_account_transfer').annotations.destructiveHint,false);
  assert.equal(list.find(x=>x.name==='delete_transaction').annotations.destructiveHint,true);
  assert.equal(list.find(x=>x.name==='create_transaction').annotations.idempotentHint,false);

  assert.equal(
    (await call('tools/call',{name:'get_accounts',arguments:{}}))
      .result.structuredContent.accounts[0].balance,
    110
  );
});

import { generateKeyPair, SignJWT } from 'jose';
import { verifyAccessToken } from '../server/auth.mjs';

test('cryptographic verification rejects forged, expired, wrong issuer and wrong audience JWTs',async()=>{
  const {privateKey,publicKey}=await generateKeyPair('ES256');
  const otherKey=await generateKeyPair('ES256');
  const issue=(overrides={},key=privateKey)=>new SignJWT({
    sub:user,role:'authenticated',client_id:'chatgpt-client',scope:'openid',
    iss:config.issuer,aud:config.resource,
    exp:Math.floor(Date.now()/1000)+60,iat:Math.floor(Date.now()/1000),
    ...overrides
  }).setProtectedHeader({alg:'ES256'}).sign(key);

  assert.equal((await verifyAccessToken(await issue(),config,publicKey)).sub,user);
  for(const patch of [
    {exp:1},{iss:'https://attacker.example'},{aud:'authenticated'},{role:'service_role'}
  ]) await assert.rejects(verifyAccessToken(await issue(patch),config,publicKey));
  await assert.rejects(verifyAccessToken(await issue({},otherKey.privateKey),config,publicKey));
});

test('unexpected lower database row cap does not silently undercount totals',async()=>{
  const db=database({
    transactions:Array.from({length:70},(_,i)=>({
      id:String(i),user_id:user,type:'expense',amount:1,transaction_date:'2026-09-01'
    }))
  });
  const original=db.from;
  db.from=table=>{
    const q=original(table);
    const range=q.range;
    q.range=async(s,e)=>({...await range(s,Math.min(e,s+49)),count:70});
    return q;
  };
  await assert.rejects(reader(db,user)('get_monthly_summary',{month:'2026-09'}),/row cap/);
});

import { mcpClaims } from '../server/oauth-claims.mjs';
test('audience transform preserves ordinary logins and only adds audience for approved OAuth clients',()=>{
  const event={claims:{aud:'authenticated',role:'authenticated',sub:user}};
  assert.deepEqual(mcpClaims(event,{clientIds:['x'],resource:config.resource}),event);
  assert.deepEqual(
    mcpClaims({...event,client_id:'x'},{clientIds:['x'],resource:config.resource}).claims.aud,
    ['authenticated',config.resource]
  );
});
