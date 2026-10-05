// Money is stored as integer sen. Shared by the browser and trusted API.
export const MAX_CENTS = 100000000;
export function cents(value) {
  if (!/^\d+(\.\d{1,2})?$/.test(String(value).trim())) throw new Error('Enter a positive amount with up to two decimals.');
  const n = Math.round(Number(value) * 100);
  if (!Number.isSafeInteger(n) || n > MAX_CENTS) throw new Error('Amount is too large.');
  return n;
}
export function adjustmentCents(value, type='fixed', baseCents=0, label='Adjustment') {
  if (type === 'fixed') return cents(value);
  if (type !== 'percent') throw new Error(`${label} type is invalid.`);
  const raw=String(value).trim();
  if (!/^\d+(\.\d{1,2})?$/.test(raw)) throw new Error(`${label} percentage must be between 0 and 100 with up to two decimals.`);
  const percent=Number(raw);
  if (!Number.isFinite(percent) || percent < 0 || percent > 100) throw new Error(`${label} percentage must be between 0 and 100.`);
  if (!Number.isSafeInteger(baseCents) || baseCents < 0 || baseCents > MAX_CENTS) throw new Error(`${label} base is invalid.`);
  return Math.round(baseCents * percent / 100);
}
export function money(n) { return new Intl.NumberFormat('en-MY', { style:'currency', currency:'MYR' }).format(n / 100); }
function integer(n, name, positive = false) {
  if (!Number.isSafeInteger(n) || n < (positive ? 1 : 0) || n > MAX_CENTS) throw new Error(`${name} is invalid.`);
}
export function allocate(total, weights) {
  integer(total, 'Total');
  if(weights.some(w=>!Number.isSafeInteger(w) || w<0)) throw new Error('Invalid allocation weight.');
  const sum = weights.reduce((s,w) => s+w, 0);
  if (!sum) { if (total) throw new Error('Nothing to allocate.'); return weights.map(()=>0); }
  const totalBig=BigInt(total),sumBig=BigInt(sum);
  const result = weights.map(w=>Number(totalBig*BigInt(w)/sumBig));
  const order = weights.map((w,i)=>({i,r:totalBig*BigInt(w)%sumBig})).sort((a,b)=>a.r===b.r ? a.i-b.i : a.r>b.r ? -1 : 1);
  let rest = total-result.reduce((s,n)=>s+n,0);
  for (const {i} of order) { if (!rest) break; result[i]++; rest--; }
  return result;
}
export function validateBill(b) {
  if (!b || typeof b.name !== 'string' || !b.name.trim() || b.name.length > 120) throw new Error('Enter a bill name (up to 120 characters).');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(b.date) || Number.isNaN(Date.parse(b.date))) throw new Error('Choose a bill date.');
  if (!['equal','items','mixed'].includes(b.mode)) throw new Error('Choose a split method.');
  if (!Array.isArray(b.participants) || b.participants.length < 2 || b.participants.length > 50) throw new Error('Add between 2 and 50 participants.');
  const ids = new Set();
  for (const p of b.participants) {
    if (typeof p.id !== 'string' || !p.id || ids.has(p.id) || typeof p.name !== 'string' || !p.name.trim() || p.name.length > 60) throw new Error('Participants need distinct IDs and valid names.');
    ids.add(p.id);
    if ((p.instructions || '').length > 1000) throw new Error('Payment instructions are too long.');
  }
  if (b.participants.filter(p=>p.isSelf === true).length !== 1) throw new Error('Choose exactly one participant as yourself.');
  if (!Array.isArray(b.items) || !b.items.length || b.items.length > 200) throw new Error('Add at least one item (up to 200).');
  const itemIds = new Set();
  for (const i of b.items) {
    if (!i.id || itemIds.has(i.id) || typeof i.name !== 'string' || !i.name.trim() || i.name.length > 120) throw new Error('Each item needs a distinct ID and a name.');
    itemIds.add(i.id); integer(i.cents, 'Item price', true);
    if (!Array.isArray(i.participants) || !i.participants.length || new Set(i.participants).size !== i.participants.length || i.participants.some(id=>!ids.has(id))) throw new Error('Assign every item to valid participants.');
    if (b.mode === 'items' && i.participants.length !== 1) throw new Error('Own items mode assigns each item to one person. Choose Mixed for shared items.');
    if (b.mode === 'equal' && (i.participants.length !== ids.size || i.participants.some(id=>!ids.has(id)))) throw new Error('Equal split includes everyone.');
  }
  integer(b.discountCents, 'Discount'); integer(b.chargeCents, 'Charges');
  if (!['proportional','equal'].includes(b.chargeMode)) throw new Error('Choose how to split extra charges.');
  const subtotal=b.items.reduce((s,i)=>s+i.cents,0);
  if (b.discountCents > subtotal) throw new Error('Discount exceeds the item subtotal.');
  const total=subtotal-b.discountCents+b.chargeCents;
  integer(total,'Bill total',true);
  if (!Array.isArray(b.paid) || !b.paid.length || b.paid.length > 100) throw new Error('Record payment to the shop.');
  const paidIds=new Set();
  for (const p of b.paid) {
    if (!p.id || paidIds.has(p.id) || !ids.has(p.participantId)) throw new Error('Choose a valid payer.');
    paidIds.add(p.id); integer(p.cents, 'Payment', true);
  }
  if (b.paid.reduce((s,p)=>s+p.cents,0) !== total) throw new Error('Payments to the shop must equal the bill total.');
  return total;
}
export function totals(b) {
  const total=validateBill(b), ps=b.participants;
  const base=ps.map(()=>0), itemShares=[];
  for (const item of b.items) {
    const selected=ps.filter(p=>item.participants.includes(p.id));
    const parts=allocate(item.cents, selected.map(()=>1));
    const shares=Object.fromEntries(selected.map((p,i)=>[p.id,parts[i]]));
    selected.forEach((p,i)=>base[ps.findIndex(x=>x.id===p.id)]+=parts[i]);
    itemShares.push({ ...item, shares });
  }
  const discounts=allocate(b.discountCents, base);
  const net=base.map((v,i)=>v-discounts[i]);
  const charges=allocate(b.chargeCents, b.chargeMode==='equal' ? ps.map(()=>1) : net.some(n=>n>0) ? net : base);
  const people=ps.map((p,i)=>{
    const share=net[i]+charges[i], paid=b.paid.filter(x=>x.participantId===p.id).reduce((s,x)=>s+x.cents,0);
    return {...p,base:base[i],discount:discounts[i],charge:charges[i],share,paid,balance:paid-share};
  });
  return {total,subtotal:base.reduce((s,n)=>s+n,0),people,itemShares};
}
export function suggestPlan(b) {
  const {people}=totals(b);
  const debt=people.filter(p=>p.balance<0).map(p=>({id:p.id,n:-p.balance}));
  const credit=people.filter(p=>p.balance>0).map(p=>({id:p.id,n:p.balance}));
  debt.sort((a,b)=>b.n-a.n); credit.sort((a,b)=>b.n-a.n);
  const plan=[];
  // Match exact debts first to avoid unnecessary split repayments.
  for (const d of debt) {
    const c=credit.find(c=>c.n===d.n && c.n>0);
    if(c){plan.push({id:`${d.id}:${c.id}`,from:d.id,to:c.id,cents:d.n});d.n=0;c.n=0;}
  }
  let i=0,j=0;
  while(i<debt.length && j<credit.length) {
    if(!debt[i].n){i++;continue;}if(!credit[j].n){j++;continue;}
    const n=Math.min(debt[i].n,credit[j].n);
    plan.push({id:`${debt[i].id}:${credit[j].id}`,from:debt[i].id,to:credit[j].id,cents:n});
    debt[i].n-=n; credit[j].n-=n;
    if (!debt[i].n) i++; if (!credit[j].n) j++;
  }
  return plan;
}
export function validatePlan(b, plan) {
  const {people}=totals(b), balances=Object.fromEntries(people.map(p=>[p.id,p.balance]));
  if (!Array.isArray(plan) || plan.length>2500) throw new Error('Invalid repayment plan.');
  const ids=new Set(), pairs=new Set();
  for (const line of plan) {
    integer(line.cents,'Repayment',true);
    const pair=`${line.from}:${line.to}`;
    if (!line.id || ids.has(line.id) || pairs.has(pair) || !(people.find(p=>p.id===line.from)?.balance<0) || !(people.find(p=>p.id===line.to)?.balance>0)) throw new Error('Repayments must go from someone who owes to someone owed.');
    ids.add(line.id); pairs.add(pair); balances[line.from]+=line.cents; balances[line.to]-=line.cents;
  }
  if (Object.values(balances).some(n=>n!==0)) throw new Error('Repayment plan does not match every participant’s balance.');
  return plan;
}
export function progress(b) {
  const payments=b.payments || [];
  const lines=(b.plan || []).map(line=>{
    const related=payments.filter(p=>p.from===line.from && p.to===line.to);
    const confirmed=related.filter(p=>p.status==='confirmed').reduce((s,p)=>s+p.cents,0);
    const pending=related.filter(p=>p.status==='pending').reduce((s,p)=>s+p.cents,0);
    return {...line,confirmed,pending,remaining:line.cents-confirmed,available:line.cents-confirmed-pending};
  });
  return {lines,remaining:lines.reduce((s,l)=>s+l.remaining,0),pending:payments.filter(p=>p.status==='pending').length,
    complete:lines.every(l=>l.remaining===0) && !payments.some(p=>p.status==='pending')};
}
export function reportPayment(b, input, actor) {
  if((b.payments || []).length>=500) throw new Error('This bill has reached its payment history limit.');
  integer(input.cents,'Payment',true);
  if (!input.id || (b.payments || []).some(p=>p.id===input.id)) throw new Error('This payment has already been submitted. Refresh the bill.');
  const line=progress(b).lines.find(l=>l.from===input.from && l.to===input.to);
  if (!line || input.cents>line.available) throw new Error('Payment exceeds the unreported balance.');
  if (actor!=='owner' && actor!==input.from) throw new Error('You can only report your own payment.');
  if ((input.reference || '').length>500) throw new Error('Reference is too long.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date) || Number.isNaN(Date.parse(input.date))) throw new Error('Choose a payment date.');
  const p={id:input.id,from:input.from,to:input.to,cents:input.cents,date:input.date,reference:input.reference || '',proofPath:input.proofPath || null,status:'pending',reportedBy:actor,reportedAt:new Date().toISOString()};
  return {...b,payments:[...(b.payments || []),p]};
}
export function decidePayment(b,id,decision,actor) {
  const p=(b.payments || []).find(p=>p.id===id);
  if (!p || p.status!=='pending') throw new Error('This payment is no longer pending. Refresh the bill.');
  if (!['confirmed','rejected'].includes(decision)) throw new Error('Invalid decision.');
  if (actor!=='owner' && actor!==p.to) throw new Error('Only the recipient can confirm this payment.');
  return {...b,payments:b.payments.map(p=>p.id===id ? {...p,status:decision,confirmedBy:actor,confirmedAt:new Date().toISOString()} : p)};
}
export function normalizeTransaction(t) {
  return {...t, cash_amount:Number(t.cash_amount ?? t.amount),amount:Number(t.report_amount ?? t.amount)};
}
