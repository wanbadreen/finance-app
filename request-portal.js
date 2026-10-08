import { paymentRequest } from './payment-request-api.js';
import './request-money.css';

const esc=value=>String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=value=>new Intl.NumberFormat('en-MY',{style:'currency',currency:'MYR'}).format(Number(value || 0));

function parseLink() {
  const raw=location.hash.replace(/^#/,'');
  const dot=raw.indexOf('.');
  if(dot<1) return null;
  return {id:raw.slice(0,dot),token:raw.slice(dot+1)};
}
async function copyAmount(amount) {
  const value=Number(amount).toFixed(2);
  await navigator.clipboard.writeText(value);
  return value;
}
async function qrBlob(url) {
  const response=await fetch(url);
  if(!response.ok) throw new Error('Unable to load payment QR.');
  return response.blob();
}
async function shareQr(request) {
  await copyAmount(request.amount);
  const blob=await qrBlob(request.qrUrl);
  const file=new File([blob],`kira-request-${Number(request.amount).toFixed(2).replace('.','-')}.png`,{type:blob.type || 'image/png'});
  if(navigator.share && navigator.canShare?.({files:[file]})) {
    await navigator.share({files:[file],title:'Kira payment QR'});
    return 'QR share sheet opened. Amount copied.';
  }
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download=file.name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  return 'QR saved/downloaded. Amount copied.';
}
async function proof(file) {
  if(!file) return null;
  if(file.size>5242880 || !['image/jpeg','image/png','image/webp','application/pdf'].includes(file.type)) {
    throw new Error('Use JPG, PNG, WebP or PDF up to 5 MB.');
  }
  const data=await new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>resolve(reader.result);
    reader.onerror=reject;
    reader.readAsDataURL(file);
  });
  return {type:file.type,base64:String(data).split(',')[1]};
}

export async function mountRequestPortal(root) {
  const link=parseLink();
  if(!link) {
    root.innerHTML='<div class="request-public-card"><h2>Invalid payment request</h2><p>This link is incomplete.</p></div>';
    return;
  }

  let request=null;

  async function load() {
    root.innerHTML='<div class="request-public-card"><p>Loading payment request…</p></div>';
    try {
      const data=await paymentRequest({action:'get',id:link.id,token:link.token});
      request=data.request;
      render();
    } catch(error) {
      root.innerHTML=`<div class="request-public-card"><h2>Payment request unavailable</h2><p>${esc(error?.message || 'This link may be invalid or expired.')}</p></div>`;
    }
  }

  function render() {
    if(request.status==='paid') {
      root.innerHTML=`<div class="request-public-card"><h2>Payment completed ✅</h2><div class="request-public-amount">${money(request.amount)}</div><p>${esc(request.requesterName)} has marked this request as paid.</p></div>`;
      return;
    }
    if(request.status==='cancelled') {
      root.innerHTML='<div class="request-public-card"><h2>Request cancelled</h2><p>This payment request is no longer active.</p></div>';
      return;
    }
    if(request.expired) {
      root.innerHTML='<div class="request-public-card"><h2>Request expired</h2><p>This payment link has expired. Ask the requester for a new link.</p></div>';
      return;
    }
    if(request.status==='reported') {
      root.innerHTML=`<div class="request-public-card"><h2>Payment reported</h2><div class="request-public-amount">${money(request.amount)}</div><p>Your payment was reported to ${esc(request.requesterName)}. Waiting for confirmation.</p></div>`;
      return;
    }

    root.innerHTML=`<div class="request-public-card">
      <p class="request-muted">Kira · Request Money</p>
      <h2>${esc(request.requesterName)} is requesting</h2>
      <div class="request-public-amount">${money(request.amount)}</div>
      ${request.recipientName ? `<p>For <strong>${esc(request.recipientName)}</strong></p>` : ''}
      ${request.note ? `<p>${esc(request.note)}</p>` : ''}
      ${request.qrUrl ? `<img class="request-qr" src="${esc(request.qrUrl)}" alt="Payment QR for ${esc(request.requesterName)}">` : '<p>Payment QR is temporarily unavailable.</p>'}
      <div class="request-public-actions">
        ${request.qrUrl ? '<button type="button" class="request-money-button primary" data-save-qr>Save / Share QR</button>' : ''}
        <button type="button" class="request-money-button" data-copy-amount>Copy ${money(request.amount)}</button>
        <button type="button" class="request-money-button" data-paid>I've paid</button>
      </div>
      <p class="request-muted">Enter the amount manually in your banking app. Kira can copy the exact amount for you.</p>
      <p class="request-message" role="alert"></p>
    </div>`;

    root.querySelector('[data-copy-amount]').onclick=async()=>{
      const message=root.querySelector('.request-message');
      try {
        await copyAmount(request.amount);
        message.textContent=`${money(request.amount)} copied.`;
      } catch(error) {
        message.textContent=error?.message || 'Unable to copy amount.';
      }
    };
    root.querySelector('[data-save-qr]')?.addEventListener('click',async event=>{
      const button=event.currentTarget;
      const message=root.querySelector('.request-message');
      button.disabled=true;
      try { message.textContent=await shareQr(request); }
      catch(error) { message.textContent=error?.message || 'Unable to prepare the QR.'; }
      finally { button.disabled=false; }
    });
    root.querySelector('[data-paid]').onclick=()=>openReport();
  }

  function openReport() {
    const card=root.querySelector('.request-public-card');
    card.innerHTML=`
      <p class="request-muted">Kira · Request Money</p>
      <h2>Report payment</h2>
      <p>You are reporting <strong>${money(request.amount)}</strong> to ${esc(request.requesterName)}.</p>
      <form class="request-public-actions">
        <label>Your name
          <input name="payerName" maxlength="80" value="${esc(request.recipientName || '')}" placeholder="Your name">
        </label>
        <label>Payment proof <span class="request-muted">(optional)</span>
          <input name="proof" type="file" accept="image/jpeg,image/png,image/webp,application/pdf">
        </label>
        <button type="submit" class="request-money-button primary">Send Payment Report</button>
        <button type="button" class="request-money-button" data-back>Back</button>
      </form>
      <p class="request-message" role="alert"></p>
    `;
    card.querySelector('[data-back]').onclick=render;
    card.querySelector('form').onsubmit=async event=>{
      event.preventDefault();
      const form=event.currentTarget;
      const buttons=[...form.querySelectorAll('button')];
      const message=card.querySelector('.request-message');
      buttons.forEach(button=>button.disabled=true);
      message.textContent='';
      try {
        const data=await paymentRequest({
          action:'report',
          id:link.id,
          token:link.token,
          payerName:form.elements.payerName.value,
          proof:await proof(form.elements.proof.files[0])
        });
        request=data.request;
        render();
      } catch(error) {
        message.textContent=error?.message || 'Unable to report payment.';
        buttons.forEach(button=>button.disabled=false);
      }
    };
  }

  await load();
}
