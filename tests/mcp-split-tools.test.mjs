import test from 'node:test';
import assert from 'node:assert/strict';
import { createSplitRunner, splitSchemas } from '../server/split-mcp.mjs';

const billId='00000000-0000-4000-8000-000000000101';
const accountId='00000000-0000-4000-8000-000000000102';
const categoryId='00000000-0000-4000-8000-000000000103';

function sampleBill() {
  return {
    id:billId,
    name:'Dinner',
    date:'2026-10-02',
    revision:3,
    mode:'mixed',
    participants:[
      {id:'me',name:'Me',isSelf:true,instructions:'',hasLink:false},
      {id:'aina',name:'Aina',instructions:'',hasLink:false}
    ],
    items:[{id:'food',name:'Food',cents:10000,participants:['me','aina']}],
    discountCents:0,
    chargeCents:0,
    chargeMode:'proportional',
    paid:[{id:'shop',participantId:'me',cents:10000,accountId}],
    categoryId,
    accountId,
    payments:[],
    plan:[{id:'aina:me',from:'aina',to:'me',cents:5000}]
  };
}

function mockDb() {
  const calls=[];
  const bill=sampleBill();
  return {
    calls,
    db:{
      functions:{
        invoke:async(name,{body})=>{
          assert.equal(name,'split-bill');
          calls.push(body);
          if(body.action==='list') return {data:{bills:[bill]},error:null};
          if(body.action==='link') return {data:{bill:{...bill,revision:4},token:'a'.repeat(64)},error:null};
          if(body.action==='cancel') return {data:{cancelled:true},error:null};
          return {data:{bill:{...bill,revision:4}},error:null};
        }
      }
    }
  };
}

test('Split Bill schemas expose complete creator controls',()=>{
  for(const name of [
    'get_split_bill_options','list_split_bills','get_split_bill','create_split_bill',
    'update_split_bill_participant','set_split_bill_repayment_plan',
    'create_split_bill_participant_link','report_split_bill_payment',
    'decide_split_bill_payment','cancel_split_bill'
  ]) assert.ok(splitSchemas[name],name);
});

test('list returns compact split summaries',async()=>{
  const {db}=mockDb();
  const run=createSplitRunner(db,{appOrigin:'https://kira.example'});
  const result=await run('list_split_bills',{limit:20,offset:0});
  assert.equal(result.total_count,1);
  assert.equal(result.split_bills[0].total_amount,100);
  assert.equal(result.split_bills[0].repayment_remaining,50);
});

test('create maps MYR values to backend cents',async()=>{
  const {db,calls}=mockDb();
  const run=createSplitRunner(db,{appOrigin:'https://kira.example'});
  await run('create_split_bill',{
    name:'Dinner',date:'2026-10-02',mode:'mixed',
    participants:[
      {id:'me',name:'Me',is_self:true,payment_instructions:''},
      {id:'aina',name:'Aina',is_self:false,payment_instructions:''}
    ],
    items:[{id:'food',name:'Food',amount:100,participant_ids:['me','aina']}],
    discount_amount:5,extra_charge_amount:10,charge_split:'proportional',
    shop_payments:[{id:'shop',participant_id:'me',amount:105,account_id:accountId}],
    category_id:categoryId,account_id:accountId,
    confirmed:true
  });
  const body=calls.at(-1);
  assert.equal(body.action,'create');
  assert.equal(body.bill.items[0].cents,10000);
  assert.equal(body.bill.discountCents,500);
  assert.equal(body.bill.chargeCents,1000);
  assert.equal(body.bill.paid[0].cents,10500);
});

test('participant edit and repayment plan map to service actions',async()=>{
  const {db,calls}=mockDb();
  const run=createSplitRunner(db);
  await run('update_split_bill_participant',{
    bill_id:billId,revision:3,participant_id:'aina',name:'Aina A.',
    payment_instructions:'TNG',confirmed:true
  });
  assert.equal(calls.at(-1).action,'person');
  await run('set_split_bill_repayment_plan',{
    bill_id:billId,revision:3,
    plan:[{from_participant_id:'aina',to_participant_id:'me',amount:50}],
    confirmed:true
  });
  assert.equal(calls.at(-1).action,'plan');
  assert.equal(calls.at(-1).plan[0].cents,5000);
});

test('participant link is returned as a ready-to-share private URL',async()=>{
  const {db}=mockDb();
  const run=createSplitRunner(db,{appOrigin:'https://kira.example'});
  const result=await run('create_split_bill_participant_link',{
    bill_id:billId,revision:3,participant_id:'aina',confirmed:true
  });
  assert.equal(result.token,'a'.repeat(64));
  assert.equal(result.participant_link,'https://kira.example/split.html#'+billId+'.'+'a'.repeat(64));
});

test('payment report and decision expose full repayment workflow',async()=>{
  const {db,calls}=mockDb();
  const run=createSplitRunner(db);
  await run('report_split_bill_payment',{
    bill_id:billId,revision:3,from_participant_id:'aina',to_participant_id:'me',
    amount:25,payment_date:'2026-10-02',reference:'partial',confirmed:true
  });
  const report=calls.at(-1);
  assert.equal(report.action,'report');
  assert.equal(report.payment.cents,2500);
  assert.equal(report.payment.from,'aina');
  assert.equal(report.payment.to,'me');

  await run('decide_split_bill_payment',{
    bill_id:billId,revision:3,payment_id:'payment-1',
    decision:'confirmed',account_id:accountId,confirmed:true
  });
  const decision=calls.at(-1);
  assert.equal(decision.action,'decision');
  assert.equal(decision.accountId,accountId);
});

test('participant token can scope reads and payment actions',async()=>{
  const {db,calls}=mockDb();
  const run=createSplitRunner(db);
  const token='b'.repeat(64);
  await run('get_split_bill',{bill_id:billId,participant_token:token});
  assert.equal(calls.at(-1).token,token);
  await run('decide_split_bill_payment',{
    bill_id:billId,revision:3,payment_id:'payment-1',
    decision:'confirmed',participant_token:token,confirmed:true
  });
  assert.equal(calls.at(-1).token,token);
});

test('cancel maps to destructive backend action',async()=>{
  const {db,calls}=mockDb();
  const run=createSplitRunner(db);
  const result=await run('cancel_split_bill',{bill_id:billId,revision:3,confirmed:true});
  assert.equal(calls.at(-1).action,'cancel');
  assert.equal(result.cancelled,true);
});

test('schemas require explicit confirmation for Split Bill writes',()=>{
  assert.throws(()=>splitSchemas.cancel_split_bill.parse({bill_id:billId,revision:3}));
  assert.throws(()=>splitSchemas.create_split_bill_participant_link.parse({bill_id:billId,revision:3,participant_id:'aina'}));
});
