import { splitRequest } from './split-api.js';
import { cents, money, totals, suggestPlan, validatePlan, progress, adjustmentCents } from './split-core.mjs';
import { isNativeApp } from './native-platform.js';
import './split.css';

const escape = value=>String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
const uid=()=>crypto.randomUUID();
const button=(text,action,primary=false)=>`<button type="button" class="split-button ${primary?'primary':''}" data-split-action="${action}">${escape(text)}</button>`;
function options(rows,value){return rows.map(x=>`<option value="${escape(x.id)}" ${x.id===value?'selected':''}>${escape(x.name)}</option>`).join('');}
async function proof(file) {
  if(!file) return null;
  if(file.size>5242880 || !['image/jpeg','image/png','image/webp','application/pdf'].includes(file.type)) throw new Error('Use JPG, PNG, WebP or PDF up to 5 MB.');
  const data=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file);});
  return {type:file.type,base64:String(data).split(',')[1]};
}
async function qrImage(file) {
  if(!file) throw new Error('Choose your payment QR image.');
  if(file.size>2097152 || !['image/jpeg','image/png','image/webp'].includes(file.type)) throw new Error('Use a JPG, PNG or WebP QR image up to 2 MB.');
  const data=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file);});
  return {type:file.type,base64:String(data).split(',')[1]};
}
function openDialog(title,body) {
  const d=document.createElement('dialog');d.className='split-dialog';
  d.innerHTML=`<div class="split-toolbar"><h3>${escape(title)}</h3><button type="button" class="split-button" data-close aria-label="Close dialog">✕</button></div>${body}<p class="split-message" role="alert"></p>`;
  document.body.append(d);d.querySelector('[data-close]').onclick=()=>d.close();d.addEventListener('close',()=>d.remove());d.showModal();return d;
}
async function busy(element,fn,errorElement) {
  const controls=[...element.querySelectorAll('button')];controls.forEach(b=>b.disabled=true);
  try {await fn();} catch(e){if(errorElement) errorElement.textContent=e.message;else throw e;}
  finally{controls.forEach(b=>b.disabled=false);}
}
export function mountSplitUI(context) {
  const page=document.getElementById('transactions-page'),list=page.querySelector('.transactions-section'),form=document.getElementById('transaction-form');
  const tabs=document.createElement('div');tabs.className='split-tabs';tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','Transaction views');
  tabs.innerHTML='<button type="button" role="tab" aria-selected="true" data-tab="transactions">Transactions</button><button type="button" role="tab" aria-selected="false" data-tab="split">Split Bills</button>';
  page.querySelector('.content-page-header').after(tabs);
  const root=document.createElement('div');root.className='split-root split-hidden';root.id='split-bills';page.append(root);
  let bills=[],selected=null,draft=null;
  function show(active=true,navigate=true) {
    if(navigate)context.navigate(); root.classList.toggle('split-hidden',!active);list.classList.toggle('split-hidden',active);form.classList.toggle('split-hidden',active);
    tabs.querySelectorAll('button').forEach(b=>b.setAttribute('aria-selected',String((b.dataset.tab==='split')===active)));
    page.querySelector('.content-page-header .primary-link-button').classList.toggle('split-hidden',active);
  }
  tabs.onclick=e=>{const t=e.target.closest('[data-tab]');if(!t)return;show(t.dataset.tab==='split');if(t.dataset.tab==='split') load();};
  page.querySelector('.content-page-header').insertAdjacentHTML('beforeend',button('+ Split Bill','new',true));
  page.querySelector('[data-split-action=new]').onclick=()=>start();
  async function load() {
    root.innerHTML='<p role="status">Loading split bills…</p>';
    try {bills=(await splitRequest({action:'list'})).bills;renderList();} catch(e){root.innerHTML=`<p class="split-message" role="alert">${escape(e.message)}</p>${button('Try again','refresh')}`;}
  }
  function renderList() {
    selected=null;root.innerHTML=`<div class="split-toolbar"><div><h2>Split Bills</h2><p class="split-muted">Share the cost. Track repayments until everyone is settled.</p></div><div>${button('Payment QR','profile')} ${button('Refresh','refresh')} ${button('+ Split Bill','new',true)}</div></div><p class="split-message" role="alert"></p>${bills.length ? bills.map(b=>{
      const t=totals(b),p=progress(b),self=t.people.find(x=>x.isSelf);
      return `<section class="split-card"><div class="split-toolbar"><div><h3>${escape(b.name)}</h3><span class="split-muted">${escape(b.date)} · ${b.participants.length} people</span></div><span class="split-status ${p.complete?'complete':''}">${p.complete?'Settled':p.pending?'Awaiting confirmation':'Unsettled'}</span></div><p>Bill: <strong>${money(t.total)}</strong> · Your share: <strong>${money(self.share)}</strong></p><p class="split-muted">Outstanding repayments: ${money(p.remaining)}</p>${button('Open bill',`open:${b.id}`)}</section>`;
    }).join('') : '<section class="split-card"><h3>Your first shared bill</h3><p>Add people, assign items and record who paid the shop.</p></section>'}`;
  }
  function start(tx=null) {
    show();selected=null;const self=uid();draft={id:uid(),name:tx?.description || '',date:tx?.transaction_date || today(),mode:'mixed',participants:[{id:self,name:'Me',isSelf:true,instructions:''},{id:uid(),name:'',instructions:''}],items:[{id:uid(),name:tx?.description || '',price:tx ? Number(tx.cash_amount ?? tx.amount).toFixed(2) : '',participants:[self]}],paid:[{id:uid(),participantId:self,price:tx ? Number(tx.cash_amount ?? tx.amount).toFixed(2) : '',accountId:tx?.account_id || ''}],discount:'0',discountType:'fixed',charge:'0',chargeType:'fixed',chargeMode:'proportional',categoryId:tx?.category_id || '',accountId:tx?.account_id || '',linkedTransactionId:tx?.id || null};renderForm();
  }
  function capture() {
    const f=root.querySelector('#split-form');if(!f)return;
    for(const field of ['name','date','mode','discount','discountType','charge','chargeType','chargeMode','categoryId','accountId']) draft[field]=f.elements.namedItem(field)?.value ?? draft[field];
    draft.participants=draft.participants.map((p,i)=>({...p,name:f.querySelector(`[data-person-name="${i}"]`).value,instructions:f.querySelector(`[data-person-instructions="${i}"]`).value}));
    draft.items=draft.items.map((x,i)=>({...x,name:f.querySelector(`[data-item-name="${i}"]`).value,price:f.querySelector(`[data-item-price="${i}"]`).value,participants:draft.mode==='equal' ? draft.participants.map(p=>p.id) : [...f.querySelectorAll(`[data-item-person="${i}"]:checked`)].map(n=>n.value)}));
    draft.paid=draft.paid.map((p,i)=>({...p,participantId:f.querySelector(`[data-paid-person="${i}"]`).value,price:f.querySelector(`[data-paid-price="${i}"]`).value,accountId:f.querySelector(`[data-paid-account="${i}"]`).value}));
  }
  function payload(preview=false) {
    const items=draft.items.map(({price,...i})=>({...i,cents:cents(price)}));
    const subtotal=items.reduce((s,i)=>s+i.cents,0);
    const discountType=draft.discountType || 'fixed',chargeType=draft.chargeType || 'fixed';
    const discountCents=adjustmentCents(draft.discount,discountType,subtotal,'Discount');
    const chargeCents=adjustmentCents(draft.charge,chargeType,subtotal-discountCents,'Charges');
    const b={...draft,items,discountType,discountValue:Number(draft.discount || 0),discountCents,chargeType,chargeValue:Number(draft.charge || 0),chargeCents,paid:draft.paid.map(({price,...p})=>({...p,cents:cents(price || '0')}))};
    if(preview) b.paid=[{id:'preview',participantId:b.participants[0].id,cents:subtotal-discountCents+chargeCents}];
    return b;
  }
  function renderForm() {
    const c=context.get(),as=c.accounts.filter(a=>a.is_active),cats=c.categories.filter(x=>x.is_active && ['expense','both'].includes(x.type));
    root.innerHTML=`<div class="split-toolbar"><h2>${draft.linkedTransactionId?'Split this expense':'New Split Bill'}</h2>${button('Back to bills','refresh')}</div><form id="split-form"><section class="split-card"><div class="split-grid"><label>Bill name<input name="name" maxlength="120" value="${escape(draft.name)}" required></label><label>Date<input name="date" type="date" value="${draft.date}" required ${draft.linkedTransactionId?'readonly':''}></label><label>Split method<select name="mode"><option value="equal" ${draft.mode==='equal'?'selected':''}>Equal split</option><option value="items" ${draft.mode==='items'?'selected':''}>Own items</option><option value="mixed" ${draft.mode==='mixed'?'selected':''}>Mixed / shared items</option></select></label><label>Expense category<select name="categoryId" required><option value="">Choose category</option>${options(cats,draft.categoryId)}</select></label><label>Your default payment / receipt account<select name="accountId" required><option value="">Choose account</option>${options(as,draft.accountId)}</select></label></div><p class="split-muted">Your account is used only for your money movements. Other people’s payments do not change your balance.</p></section><section class="split-card"><div class="split-toolbar"><h3>Participants</h3>${button('+ Add person','add-person')}</div>${draft.participants.map((p,i)=>`<div class="split-row"><label><span class="split-avatar">${escape((p.name || '?')[0].toUpperCase())}</span>${p.isSelf?'You':'Person '+(i+1)}<input data-person-name="${i}" value="${escape(p.name)}" maxlength="60" placeholder="Name / nickname" required></label>${!p.isSelf?`<button type="button" class="split-remove" data-split-action="remove-person:${i}">Remove</button>`:''}</div><details><summary class="split-muted">Payment instructions for ${escape(p.name || 'this person')} (optional)</summary><textarea data-person-instructions="${i}" maxlength="1000" placeholder="Bank, account name and number or e-wallet instructions">${escape(p.instructions)}</textarea></details>`).join('')}</section><section class="split-card"><div class="split-toolbar"><h3>${draft.mode==='equal'?'Bill amount / items':'Items'}</h3>${button('+ Add item','add-item')}</div>${draft.items.map((x,i)=>`<div class="split-form-item"><div class="split-row"><label>Item<input data-item-name="${i}" value="${escape(x.name)}" maxlength="120" placeholder="Pizza / bill" required></label><label>Price (RM)<input data-item-price="${i}" inputmode="decimal" value="${escape(x.price)}" placeholder="0.00" required></label>${draft.items.length>1?`<button type="button" class="split-remove" data-split-action="remove-item:${i}">Remove</button>`:''}</div>${draft.mode==='equal'?'<p class="split-muted">Shared equally by everyone.</p>':`<div class="split-chips" role="group" aria-label="Who shares item ${i+1}">${draft.participants.map(p=>`<label class="split-chip"><input type="${draft.mode==='items'?'radio':'checkbox'}" name="item-${i}" data-item-person="${i}" value="${escape(p.id)}" ${x.participants.includes(p.id)?'checked':''}>${escape(p.name || 'Person')}</label>`).join('')}</div>`}</div>`).join('')}<div class="split-grid"><label>Whole-bill discount<div class="split-adjustment-control"><select name="discountType" aria-label="Discount type"><option value="fixed" ${(draft.discountType || 'fixed')==='fixed'?'selected':''}>RM</option><option value="percent" ${draft.discountType==='percent'?'selected':''}>%</option></select><input name="discount" inputmode="decimal" value="${escape(draft.discount)}" placeholder="0"></div></label><label>Tax / service / other charges<div class="split-adjustment-control"><select name="chargeType" aria-label="Charge type"><option value="fixed" ${(draft.chargeType || 'fixed')==='fixed'?'selected':''}>RM</option><option value="percent" ${draft.chargeType==='percent'?'selected':''}>%</option></select><input name="charge" inputmode="decimal" value="${escape(draft.charge)}" placeholder="0"></div></label><label>Split extra charges<select name="chargeMode"><option value="proportional" ${draft.chargeMode==='proportional'?'selected':''}>By food value after discount</option><option value="equal" ${draft.chargeMode==='equal'?'selected':''}>Equally among everyone</option></select></label></div><div id="split-preview" aria-live="polite"></div></section><section class="split-card"><div class="split-toolbar"><h3>Payments to the shop</h3>${button('+ Add payer','add-payer')}</div><p class="split-muted">Include people who paid their own share directly. These payments must cover the entire bill.</p>${draft.paid.map((p,i)=>`<div class="split-row"><label>Who paid<select data-paid-person="${i}">${options(draft.participants,p.participantId)}</select></label><label>Paid (RM)<input data-paid-price="${i}" inputmode="decimal" value="${escape(p.price)}" required></label><label>Your account (if you paid)<select data-paid-account="${i}"><option value="">Use default account</option>${options(as,p.accountId)}</select></label>${draft.paid.length>1?`<button type="button" class="split-remove" data-split-action="remove-payer:${i}">Remove</button>`:''}</div>`).join('')}</section><p class="split-message" role="alert"></p><p class="split-muted">Saving records your share and your shop payment in Kira. Review prices and people before saving. Financial allocations are locked once saved; names and payment instructions can be edited.</p><button class="split-button primary" type="submit">Save bill & review repayments</button></form>`;
    const f=root.querySelector('form');
    const syncNames=()=>{
      draft.participants.forEach((p,i)=>{
        f.querySelector(`[data-person-name="${i}"]`).closest('label').querySelector('.split-avatar').textContent=(p.name || '?')[0].toUpperCase();
        f.querySelectorAll('[data-item-person]').forEach(input=>{if(input.value===p.id)input.parentElement.lastChild.textContent=p.name || 'Person';});
        f.querySelectorAll('details')[i].querySelector('summary').textContent=`Payment instructions for ${p.name || 'this person'} (optional)`;
      });
      f.querySelectorAll('[data-paid-person]').forEach(select=>{const value=select.value;select.innerHTML=options(draft.participants,value);});
    };
    f.oninput=e=>{capture();if(e.target.dataset.personName!=null)syncNames();renderPreview();};
    f.onchange=e=>{capture();if(e.target.name==='mode'){if(draft.mode==='items')draft.items.forEach(i=>i.participants=i.participants.slice(0,1));renderForm();}else renderPreview();};
    f.onsubmit=async e=>{e.preventDefault();capture();await busy(f,async()=>{const data=await splitRequest({action:'create',bill:payload()});await context.refresh();selected=data.bill;renderDetail();},f.querySelector('.split-message'));};renderPreview();
  }
  function renderPreview() {
    const el=root.querySelector('#split-preview');if(!el)return;
    try {const b=payload(true),t=totals(b),discountText=b.discountType==='percent'?`${escape(String(b.discountValue))}% = ${money(b.discountCents)}`:money(b.discountCents),chargeText=b.chargeType==='percent'?`${escape(String(b.chargeValue))}% = ${money(b.chargeCents)}`:money(b.chargeCents);el.innerHTML=`<div class="split-summary"><strong>Total: ${money(t.total)}</strong><div>${t.people.map(p=>`${escape(p.name)}: ${money(p.share)}`).join(' · ')}</div><div class="split-muted">Discount: ${discountText} · Charges: ${chargeText}</div></div>`;} catch(e){el.innerHTML=`<p class="split-muted">${escape(e.message)}</p>`;}
  }
  async function open(id) {show();selected=(await splitRequest({action:'get',id})).bill;renderDetail();}
  function renderDetail() {
    const b=selected,t=totals(b),p=progress(b),name=id=>b.participants.find(x=>x.id===id)?.name || '',self=t.people.find(x=>x.isSelf);
    root.innerHTML=`<div class="split-toolbar"><div><h2>${escape(b.name)}</h2><p class="split-muted">${escape(b.date)} · ${money(t.total)} total</p></div><div>${button('Back','refresh')} ${button('Refresh',`open:${b.id}`)}</div></div><p class="split-message" role="alert"></p><section class="split-card"><div class="split-toolbar"><h3>Participants</h3><span class="split-status ${p.complete?'complete':''}">${p.complete?'Settled':p.pending?'Awaiting confirmation':'Unsettled'}</span></div><div class="split-summary">Your share: <strong>${money(self.share)}</strong> · You paid the shop: <strong>${money(self.paid)}</strong><br>Outstanding repayments: <strong>${money(p.remaining)}</strong></div><div class="split-table-wrap"><table class="split-table"><thead><tr><th>Person</th><th>Share</th><th>Paid shop</th><th>Repayment status</th><th>Actions</th></tr></thead><tbody>${t.people.map(person=>{const lines=p.lines.filter(l=>l.from===person.id || l.to===person.id),remain=lines.reduce((s,l)=>s+l.remaining,0);return `<tr><td><span class="split-avatar">${escape(person.name[0].toUpperCase())}</span>${escape(person.name)}${person.isSelf?' (You)':''}</td><td>${money(person.share)}</td><td>${money(person.paid)}</td><td>${remain?`${person.balance>0?'To receive':'To pay'} ${money(remain)}`:'Settled ✓'}</td><td>${button('Edit',`person:${person.id}`)} ${!person.isSelf?button(person.hasLink?'Replace link':'Share link',`link:${person.id}`):''}</td></tr>`;}).join('')}</tbody></table></div></section><section class="split-card"><details><summary>Items, discount and charges</summary><div class="split-table-wrap"><table class="split-table"><thead><tr><th>Item</th><th>Price</th><th>Shares</th></tr></thead><tbody>${t.itemShares.map(i=>`<tr><td>${escape(i.name)}</td><td>${money(i.cents)}</td><td>${Object.entries(i.shares).map(([id,v])=>`${escape(name(id))}: ${money(v)}`).join(', ')}</td></tr>`).join('')}</tbody></table></div><p class="split-muted">Discount: ${b.discountType==='percent'?`${escape(String(b.discountValue))}% = ${money(b.discountCents)}`:money(b.discountCents)} · Charges: ${b.chargeType==='percent'?`${escape(String(b.chargeValue))}% = ${money(b.chargeCents)}`:money(b.chargeCents)} (${b.chargeMode})</p></details></section><section class="split-card"><div class="split-toolbar"><h3>Repayments</h3>${button('Change repayment plan','plan')}</div>${p.lines.length?p.lines.map(l=>`<div class="split-toolbar"><div><strong>${escape(name(l.from))} → ${escape(name(l.to))}</strong><p class="split-muted">${money(l.confirmed)} confirmed · ${money(l.pending)} pending · ${money(l.remaining)} remaining</p></div>${l.available>0?button('Record payment',`report:${l.id}`):'<span class="split-status">'+(l.remaining?'Awaiting confirmation':'Settled ✓')+'</span>'}</div>`).join(''):'<p>Everyone paid their own share. No repayments needed.</p>'}<p class="split-muted">Recording a payment does not transfer money. Confirm after the recipient receives it.</p></section>${history(b.payments,name,true)}${!b.payments.some(p=>p.status!=='rejected')?button('Cancel bill','cancel'):''}<p class="split-muted">Participant links show only that person’s item shares and related repayments. Replacing a link invalidates the previous one.</p>`;
  }
  async function link(id) {
    const person=selected.participants.find(p=>p.id===id);
    const d=openDialog(`Share with ${person.name}`,`<p>Anyone with this link can view ${escape(person.name)}’s split details and act as this participant. Share it only with them.${person.hasLink?' Creating this link will invalidate their previous link.':''}</p>${button('Create participant link','make-link',true)}`);
    d.querySelector('[data-split-action]').onclick=()=>busy(d,async()=>{
      const data=await splitRequest({action:'link',id:selected.id,revision:selected.revision,participantId:id});selected=data.bill;
      const origin=isNativeApp ? 'https://kiraapp.vercel.app' : location.origin;
      const url=`${origin}/split.html#${selected.id}.${data.token}`;
      d.querySelector('[data-split-action]').remove();const label=document.createElement('label');label.textContent='Participant link';const input=document.createElement('textarea');input.readOnly=true;input.value=url;label.append(input);d.append(label);
      const shareText=`Hi ${person.name}, your share for ${selected.name} is ${money(totals(selected).people.find(p=>p.id===id)?.share || 0)}. Open your split bill in Kira.`;
      const actions=document.createElement('div');actions.className='split-row';
      const share=document.createElement('button');share.type='button';share.className='split-button primary';share.textContent='Share to…';share.onclick=async()=>{if(navigator.share){try{await navigator.share({title:`Kira Split Bill · ${selected.name}`,text:shareText,url});}catch(error){if(error?.name!=='AbortError')d.querySelector('.split-message').textContent='Unable to open sharing. You can still copy the link.';}}else{try{await navigator.clipboard.writeText(url);share.textContent='Link copied';}catch{input.select();share.textContent='Select and copy the link';}}};
      const copy=document.createElement('button');copy.type='button';copy.className='split-button';copy.textContent='Copy link';copy.onclick=async()=>{try{await navigator.clipboard.writeText(url);copy.textContent='Copied';}catch{input.select();copy.textContent='Select and copy the link';}};
      actions.append(share,copy);d.append(actions);renderDetail();
    },d.querySelector('.split-message'));
  }
  async function paymentProfile() {
    const data=await splitRequest({action:'profile-get'}),profile=data.profile || {};
    const d=openDialog('Your payment QR',`<p>Upload your DuitNow, bank or e-wallet QR once. Kira will show it to participants who still need to repay you.</p>${profile.qrUrl?`<div class="split-qr-wrap"><img class="split-qr" src="${escape(profile.qrUrl)}" alt="Your payment QR"></div>`:''}<form><label>Payment QR image<input name="qr" type="file" accept="image/jpeg,image/png,image/webp" ${profile.hasQr?'':'required'}></label><div class="split-row"><button class="split-button primary">Save QR</button>${profile.hasQr?button('Remove QR','remove-profile-qr'):''}</div></form>`);
    const form=d.querySelector('form');
    form.onsubmit=e=>{e.preventDefault();busy(d,async()=>{const file=form.elements.qr.files[0];if(!file && profile.hasQr){d.close();return;}await splitRequest({action:'profile-save',qr:await qrImage(file)});d.close();},d.querySelector('.split-message'));};
    d.querySelector('[data-split-action=remove-profile-qr]')?.addEventListener('click',()=>busy(d,async()=>{await splitRequest({action:'profile-delete'});d.close();},d.querySelector('.split-message')));
  }
  function editPerson(id) {
    const p=selected.participants.find(p=>p.id===id),d=openDialog('Edit participant',`<form><label>Name<input name="name" value="${escape(p.name)}" maxlength="60" required></label><label>Payment instructions<textarea name="instructions" maxlength="1000">${escape(p.instructions || '')}</textarea></label><button class="split-button primary">Save</button></form>`);
    d.querySelector('form').onsubmit=e=>{e.preventDefault();busy(d,async()=>{selected=(await splitRequest({action:'person',id:selected.id,revision:selected.revision,participantId:id,name:d.querySelector('[name=name]').value,instructions:d.querySelector('[name=instructions]').value})).bill;d.close();renderDetail();},d.querySelector('.split-message'));};
  }
  function editPlan() {
    const b=selected;if(b.payments.some(p=>p.status!=='rejected')) {root.querySelector('.split-message').textContent='A payment was already reported. The repayment plan is locked to preserve its history.';return;}
    let plan=b.plan.map(l=>({...l}));const t=totals(b),debt=t.people.filter(p=>p.balance<0),credit=t.people.filter(p=>p.balance>0),d=openDialog('Repayment plan','<div data-plan></div>');
    function draw(){d.querySelector('[data-plan]').innerHTML=`<p class="split-muted">Choose who pays whom. Every person’s balance must match.</p><form>${plan.map((l,i)=>`<div class="split-row"><label>From<select data-from="${i}">${options(debt,l.from)}</select></label><label>To<select data-to="${i}">${options(credit,l.to)}</select></label><label>RM<input data-value="${i}" inputmode="decimal" value="${(l.cents/100).toFixed(2)}" required></label><button type="button" class="split-remove" data-remove="${i}">Remove</button></div>`).join('')}<div class="split-row">${button('+ Add repayment','add-plan')}${button('Use suggestion','auto-plan')}<button class="split-button primary">Save plan</button></div></form>`;
      const capturePlan=()=>plan=plan.map((l,i)=>({...l,from:d.querySelector(`[data-from="${i}"]`).value,to:d.querySelector(`[data-to="${i}"]`).value,cents:cents(d.querySelector(`[data-value="${i}"]`).value)}));
      d.querySelector('[data-plan]').onclick=e=>{const btn=e.target.closest('button[type=button]');if(!btn)return;try{capturePlan();if(btn.dataset.remove!=null)plan.splice(Number(btn.dataset.remove),1);else if(btn.dataset.splitAction==='auto-plan')plan=suggestPlan(b);else if(btn.dataset.splitAction==='add-plan'){if(!debt.length || !credit.length)throw new Error('No repayments are needed.');plan.push({id:uid(),from:debt[0].id,to:credit[0].id,cents:0});}draw();}catch(err){d.querySelector('.split-message').textContent=err.message;}};
      d.querySelector('form').onsubmit=e=>{e.preventDefault();busy(d,async()=>{capturePlan();validatePlan(b,plan);selected=(await splitRequest({action:'plan',id:b.id,revision:b.revision,plan})).bill;d.close();renderDetail();},d.querySelector('.split-message'));};
    }draw();
  }
  async function mutate(input) {selected=(await splitRequest({id:selected.id,revision:selected.revision,...input})).bill;await context.refresh();renderDetail();}
  function cancelBill() {
    const d=openDialog('Cancel this split bill',`<p>Cancel this bill before any repayments have been reported. Its participant links will stop working.</p><p>${selected.linkedTransactionId?'The original expense will return to an ordinary transaction.':'The spending and shop-payment entries created by this bill will be removed from Kira.'}</p><p class="split-muted">This does not reverse money already paid to the shop.</p>${button('Cancel bill','cancel-bill',true)}`);
    d.querySelector('[data-split-action]').onclick=()=>busy(d,async()=>{await splitRequest({action:'cancel',id:selected.id,revision:selected.revision});await context.refresh();d.close();await load();},d.querySelector('.split-message'));
  }
  root.onclick=e=>{const btn=e.target.closest('[data-split-action]');if(!btn)return;const [action,arg]=btn.dataset.splitAction.split(/:(.*)/s);
    if(draft && root.querySelector('#split-form'))capture();
    if(action==='new')return start();
    if(action==='profile')return busy(root,paymentProfile,root.querySelector('.split-message'));
    if(action==='refresh')return busy(root,load,root.querySelector('.split-message'));
    if(action==='open')return busy(root,()=>open(arg),root.querySelector('.split-message'));
    if(action==='add-person'){draft.participants.push({id:uid(),name:'',instructions:''});if(draft.mode==='equal')draft.items.forEach(i=>i.participants=draft.participants.map(p=>p.id));return renderForm();}
    if(action==='remove-person'){const id=draft.participants[Number(arg)].id;if(draft.paid.some(p=>p.participantId===id) || draft.items.some(i=>i.participants.includes(id))){root.querySelector('.split-message').textContent='Remove this person from items and shop payments first.';return;}draft.participants.splice(Number(arg),1);return renderForm();}
    if(action==='add-item'){draft.items.push({id:uid(),name:'',price:'',participants:draft.mode==='equal'?draft.participants.map(p=>p.id):[]});return renderForm();}
    if(action==='remove-item'){draft.items.splice(Number(arg),1);return renderForm();}
    if(action==='add-payer'){draft.paid.push({id:uid(),participantId:draft.participants[0].id,price:'',accountId:''});return renderForm();}
    if(action==='remove-payer'){draft.paid.splice(Number(arg),1);return renderForm();}
    if(action==='link')return link(arg);
    if(action==='person')return editPerson(arg);
    if(action==='plan')return editPlan();
    if(action==='cancel')return cancelBill();
    if(action==='report'){const line=progress(selected).lines.find(l=>l.id===arg);return paymentDialog(line,selected.participants,async payment=>{await mutate({action:'report',payment:payment.payment,proof:payment.proof});});}
    if(action==='confirm' || action==='reject')return decisionDialog(selected,arg,action==='confirm'?'confirmed':'rejected',context.get().accounts,mutate);
  };
  // Existing Add links keep their transaction destination; the mobile plus offers both actions.
  document.querySelector('.mobile-add-action')?.addEventListener('click',e=>{e.preventDefault();const d=openDialog('Add to Kira',`${button('Add transaction','ordinary')}${button('Split Bill','split',true)}`);d.querySelector('[data-split-action=ordinary]').onclick=()=>{show(false);d.close();form.scrollIntoView({behavior:'smooth'});};d.querySelector('[data-split-action=split]').onclick=()=>{d.close();start();};});
  document.querySelectorAll('a[href="#transaction-form"]:not(.mobile-add-action)').forEach(a=>a.addEventListener('click',()=>show(false)));
  return {start,open,reset(){bills=[];selected=null;draft=null;root.innerHTML='';show(false,false);}};
}

function history(payments,name,owner) {
  return `<section class="split-card"><h3>Payment history</h3>${payments.length?payments.slice().reverse().map(p=>`<div class="split-toolbar"><div><strong>${escape(name(p.from))} → ${escape(name(p.to))} · ${money(p.cents)}</strong><p class="split-muted">${escape(p.date)} · ${escape(p.status)}${p.reference?' · '+escape(p.reference):''}</p>${p.proofUrl?`<a href="${escape(p.proofUrl)}" target="_blank" rel="noopener noreferrer">View payment proof</a>`:''}${p.confirmedBy?`<p class="split-muted">${p.status==='confirmed'?'Confirmed':'Rejected'} by ${p.confirmedBy==='owner'?'bill creator (recorded on recipient’s behalf)':escape(name(p.confirmedBy))}</p>`:''}</div>${p.status==='pending' && owner ? `<div>${button('Confirm received',`confirm:${p.id}`,true)} ${button('Not received',`reject:${p.id}`)}</div>`:''}</div>`).join(''):'<p class="split-muted">No repayments recorded yet.</p>'}</section>`;
}
function paymentDialog(line,people,save) {
  const name=id=>people.find(p=>p.id===id)?.name || '',d=openDialog(`${name(line.from)} → ${name(line.to)}`,`<p>Unreported balance: <strong>${money(line.available)}</strong></p><form><label>Amount paid (RM)<input name="amount" inputmode="decimal" value="${(line.available/100).toFixed(2)}" required></label><label>Payment date<input name="date" type="date" value="${today()}" required></label><label>Reference / note (optional)<input name="reference" maxlength="500"></label><label>Payment proof (optional, up to 5 MB)<input name="proof" type="file" accept="image/jpeg,image/png,image/webp,application/pdf"></label><p class="split-muted">Pay through your bank, e-wallet or cash first. The recipient confirms after receiving it.</p><button class="split-button primary">Report payment</button></form>`);
  const id=uid();d.querySelector('form').onsubmit=e=>{e.preventDefault();busy(d,async()=>{const f=d.querySelector('form');await save({payment:{id,from:line.from,to:line.to,cents:cents(f.elements.amount.value),date:f.elements.date.value,reference:f.elements.reference.value},proof:await proof(f.elements.proof.files[0])});d.close();},d.querySelector('.split-message'));};return d;
}
function decisionDialog(b,paymentId,decision,accounts,save) {
  const p=b.payments.find(p=>p.id===paymentId),self=b.participants.find(p=>p.isSelf),own=p.from===self?.id || p.to===self?.id;
  const d=openDialog(decision==='confirmed'?'Confirm payment received':'Payment not received',`<p>${decision==='confirmed'?'Confirm the recipient has received':'Reject this report for'} <strong>${money(p.cents)}</strong>.</p>${own && decision==='confirmed'?`<label>Your account for this payment<select name="account">${options(accounts.filter(a=>a.is_active),b.accountId)}</select></label>`:''}<p class="split-muted">This action is recorded as confirmation by the bill creator${p.to!==self?.id?' on the recipient’s behalf':''}.</p>${button(decision==='confirmed'?'Confirm received':'Reject report','decide',true)}`);
  d.querySelector('[data-split-action]').onclick=()=>busy(d,async()=>{await save({action:'decision',paymentId,decision,accountId:d.querySelector('[name=account]')?.value});d.close();},d.querySelector('.split-message'));
}

export async function mountParticipantPortal(root) {
  const match=location.hash.slice(1).match(/^([a-f0-9-]{36})\.([a-f0-9]{64})$/);let view=null;
  if(!match){root.innerHTML='<p class="split-message">Open the participant link shared by your bill creator.</p>';return;}
  const id=match[1],token=match[2];
  async function request(input){return splitRequest({id,token,revision:view?.revision,...input});}
  async function refresh(){view=(await request({action:'get'})).view;draw();}
  function draw(){const name=id=>view.participants.find(p=>p.id===id)?.name || '',outgoing=view.lines.filter(l=>l.from===view.participantId),incoming=view.lines.filter(l=>l.to===view.participantId);
    root.innerHTML=`<header><strong>Kira · Split Bill</strong><h1>${escape(view.name)}</h1><p>Hi ${escape(view.person.name)} · ${escape(view.date)}</p></header><p class="split-message" role="alert"></p><section class="split-card"><div class="split-toolbar"><h3>Your share: ${money(view.person.share)}</h3>${button('Refresh','refresh')}</div><p>Already paid to the shop: ${money(view.person.paid)}</p>${view.items.map(i=>`<div class="split-toolbar"><span>${escape(i.name)}</span><strong>${money(i.cents)}</strong></div>`).join('')}<p class="split-muted">Your discount: ${money(view.person.discount)} · Extra charges: ${money(view.person.charge)}</p></section><section class="split-card"><h3>Your repayments</h3>${outgoing.map(l=>`<div><p>Pay <strong>${escape(name(l.to))}</strong> · Remaining <strong>${money(l.remaining)}</strong></p><p class="split-muted">${money(l.confirmed)} confirmed · ${money(l.pending)} awaiting confirmation</p><p style="white-space:pre-wrap">${escape(view.participants.find(p=>p.id===l.to)?.instructions || 'Ask the recipient for their bank or e-wallet details.')}</p>${l.available>0 && view.paymentProfile?.recipientId===l.to && view.paymentProfile?.qrUrl?`<div class="split-qr-wrap"><strong>Scan to pay ${escape(name(l.to))}</strong><img class="split-qr" src="${escape(view.paymentProfile.qrUrl)}" alt="Payment QR for ${escape(name(l.to))}"></div>`:''}${l.available>0?button('I have paid',`pay:${l.id}`,true):''}</div>`).join('')}${incoming.map(l=>`<p>Receive from <strong>${escape(name(l.from))}</strong> · Remaining ${money(l.remaining)}</p>`).join('')}${!view.lines.length?'<p>You are settled. No repayments needed.</p>':''}</section>${history(view.payments,name,false)}${view.payments.filter(p=>p.status==='pending' && p.to===view.participantId).map(p=>`<section class="split-card"><p>${escape(name(p.from))} reported ${money(p.cents)}.</p>${button('Confirm received',`confirm:${p.id}`,true)} ${button('Not received',`reject:${p.id}`)}</section>`).join('')}<p class="split-muted">${view.lines.every(l=>l.remaining===0) && !view.payments.some(p=>p.status==='pending')?'Your payments are settled ✓':'Your payments are still being tracked.'} Keep this link private. Payment reports require recipient confirmation.</p>`;
  }
  root.onclick=e=>{const btn=e.target.closest('[data-split-action]');if(!btn)return;const [action,arg]=btn.dataset.splitAction.split(/:(.*)/s);
    if(action==='refresh')return busy(root,refresh,root.querySelector('.split-message'));
    if(action==='pay')return paymentDialog(view.lines.find(l=>l.id===arg),view.participants,async data=>{await request({action:'report',payment:data.payment,proof:data.proof});await refresh();});
    if(action==='confirm' || action==='reject'){const d=openDialog(action==='confirm'?'Confirm received':'Not received',`<p>${action==='confirm'?'Confirm the money has arrived in your bank, wallet or cash.':'Reject this report. The sender can report a corrected payment.'}</p>${button(action==='confirm'?'Confirm received':'Reject report','decide',true)}`);d.querySelector('[data-split-action]').onclick=()=>busy(d,async()=>{await request({action:'decision',paymentId:arg,decision:action==='confirm'?'confirmed':'rejected'});await refresh();d.close();},d.querySelector('.split-message'));}
  };
  root.innerHTML='<p role="status">Loading your bill…</p>';try{await refresh();}catch(e){root.innerHTML=`<p class="split-message" role="alert">${escape(e.message)}</p>`;}
}
