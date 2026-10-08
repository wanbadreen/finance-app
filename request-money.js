import { paymentRequest } from './payment-request-api.js';
import './request-money.css';

const esc=value=>String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=value=>new Intl.NumberFormat('en-MY',{style:'currency',currency:'MYR'}).format(Number(value || 0));
const today=()=>new Date().toISOString().slice(0,10);

function openDialog(title,body) {
  const d=document.createElement('dialog');
  d.className='request-dialog';
  d.innerHTML=`<div class="request-dialog-toolbar"><h3>${esc(title)}</h3><button type="button" class="request-money-button" data-close aria-label="Close">✕</button></div>${body}<p class="request-message" role="alert"></p>`;
  document.body.append(d);
  d.querySelector('[data-close]').onclick=()=>d.close();
  d.addEventListener('close',()=>d.remove());
  d.showModal();
  return d;
}
function publicLink(id,token) {
  return `${window.location.origin}/request.html#${id}.${token}`;
}
async function copyText(value) {
  await navigator.clipboard.writeText(value);
}
async function shareRequest(request,token) {
  const link=publicLink(request.id,token);
  const subject=request.recipientName ? `${request.recipientName}, ` : '';
  const note=request.note ? ` for ${request.note}` : '';
  const text=`${subject}${request.requesterName} requested ${money(request.amount)}${note}.`;
  if(navigator.share) {
    try {
      await navigator.share({title:'Kira · Request Money',text,url:link});
      return {shared:true,link};
    } catch(error) {
      if(error?.name!=='AbortError') throw error;
      return {shared:false,link};
    }
  }
  await copyText(link);
  return {shared:false,link,copied:true};
}
function requestStatus(request) {
  if(request.expired) return ['Expired','expired'];
  if(request.status==='reported') return ['Payment reported','reported'];
  if(request.status==='paid') return ['Paid','paid'];
  if(request.status==='cancelled') return ['Cancelled','cancelled'];
  return ['Pending','pending'];
}
async function busy(container,fn) {
  const buttons=[...container.querySelectorAll('button')];
  buttons.forEach(button=>button.disabled=true);
  const message=container.querySelector('.request-message');
  if(message) message.textContent='';
  try { return await fn(); }
  catch(error) {
    if(message) message.textContent=error?.message || 'Something went wrong.';
    else throw error;
  } finally {
    buttons.forEach(button=>button.disabled=false);
  }
}

export function mountRequestMoneyUI(context) {
  const txPage=document.getElementById('transactions-page');
  const dashboard=document.getElementById('dashboard-page');
  if(!txPage || !dashboard) return { openCreate:()=>{}, openList:()=>{} };

  const header=txPage.querySelector('.content-page-header');
  const headerActions=document.createElement('div');
  headerActions.className='request-money-actions';
  headerActions.innerHTML='<button type="button" class="request-money-button" data-request-list>Money Requests</button><button type="button" class="request-money-button primary" data-request-create>Request Money</button>';
  header?.append(headerActions);

  const summary=dashboard.querySelector('.summary-grid');
  const dash=document.createElement('section');
  dash.className='request-money-dashboard';
  dash.innerHTML='<div><h3>Request Money</h3><p>Send a simple payment link with your QR and the exact amount.</p></div><div class="request-money-actions"><button type="button" class="request-money-button" data-request-list>View Requests</button><button type="button" class="request-money-button primary" data-request-create>Request Money</button></div>';
  summary?.after(dash);

  async function showCreated(request,token) {
    const link=publicLink(request.id,token);
    const d=openDialog('Request ready',`
      <p><strong>${money(request.amount)}</strong>${request.recipientName ? ` requested from ${esc(request.recipientName)}` : ''}</p>
      ${request.note ? `<p class="request-muted">${esc(request.note)}</p>` : ''}
      <p class="request-muted">This link expires in 7 days.</p>
      <div class="request-share-link">${esc(link)}</div>
      <div class="request-money-actions" style="margin-top:12px">
        <button type="button" class="request-money-button primary" data-share>Share</button>
        <button type="button" class="request-money-button" data-copy>Copy Link</button>
      </div>
    `);
    d.querySelector('[data-share]').onclick=()=>busy(d,async()=>{
      const result=await shareRequest(request,token);
      d.querySelector('.request-message').textContent=result.shared ? 'Share sheet opened.' : 'Share cancelled. Your request is still ready.';
    });
    d.querySelector('[data-copy]').onclick=()=>busy(d,async()=>{
      await copyText(link);
      d.querySelector('.request-message').textContent='Link copied.';
    });
  }

  async function openCreate() {
    const d=openDialog('Request Money',`
      <form>
        <label>Amount (RM)
          <input name="amount" type="number" min="0.01" step="0.01" inputmode="decimal" placeholder="20.00" required>
        </label>
        <label>Person <span class="request-muted">(optional)</span>
          <input name="recipientName" maxlength="80" placeholder="e.g. Riena">
        </label>
        <label>Note <span class="request-muted">(optional)</span>
          <textarea name="note" maxlength="160" placeholder="e.g. Cendol semalam"></textarea>
        </label>
        <button class="request-money-button primary" type="submit">Create & Share</button>
      </form>
    `);
    const form=d.querySelector('form');
    form.onsubmit=event=>{
      event.preventDefault();
      busy(d,async()=>{
        const data=await paymentRequest({
          action:'create',
          amount:Number(form.elements.amount.value),
          recipientName:form.elements.recipientName.value,
          note:form.elements.note.value
        });
        d.close();
        try { await shareRequest(data.request,data.token); } catch {}
        await showCreated(data.request,data.token);
      });
    };
  }

  function accountOptions(selected='') {
    const accounts=(context.get()?.accounts || []).filter(account=>account.is_active!==false);
    return accounts.map(account=>`<option value="${esc(account.id)}" ${account.id===selected?'selected':''}>${esc(account.name)}</option>`).join('');
  }

  async function confirmRequest(request,onDone) {
    const accounts=(context.get()?.accounts || []).filter(account=>account.is_active!==false);
    if(!accounts.length) throw new Error('Create an active account first.');
    const d=openDialog(request.status==='reported' ? 'Confirm payment received' : 'Mark request as paid',`
      <p>You are recording <strong>${money(request.amount)}</strong> as a repayment. It will increase account cash but stay excluded from income reporting.</p>
      <form>
        <label>Received into
          <select name="accountId" required>${accountOptions(accounts[0]?.id)}</select>
        </label>
        <label>Date received
          <input name="date" type="date" value="${today()}" required>
        </label>
        <button type="submit" class="request-money-button primary">Confirm & Record</button>
      </form>
    `);
    d.querySelector('form').onsubmit=event=>{
      event.preventDefault();
      busy(d,async()=>{
        const form=event.currentTarget;
        await paymentRequest({
          action:'confirm',
          id:request.id,
          accountId:form.elements.accountId.value,
          date:form.elements.date.value
        });
        d.close();
        await context.refresh?.();
        await onDone?.();
      });
    };
  }

  async function openList() {
    context.navigate?.();
    const d=openDialog('Money Requests','<div class="request-list"><p class="request-muted">Loading requests…</p></div>');
    const list=d.querySelector('.request-list');

    async function load() {
      const data=await paymentRequest({action:'list'});
      const requests=data.requests || [];
      if(!requests.length) {
        list.innerHTML='<div class="request-card"><strong>No money requests yet.</strong><p class="request-muted">Create one when you need someone to pay you back.</p></div>';
        return;
      }
      list.innerHTML=requests.map(request=>{
        const [label,statusClass]=requestStatus(request);
        const canShare=!request.expired && !['paid','cancelled'].includes(request.status);
        const canConfirm=!request.expired && !['paid','cancelled'].includes(request.status);
        const report=request.report ? `<p class="request-muted">${esc(request.report.payerName || 'Someone')} reported payment${request.report.reportedAt ? ` · ${new Date(request.report.reportedAt).toLocaleString()}` : ''}.</p>` : '';
        const proof=request.reportProofUrl ? `<a class="request-proof-link" href="${esc(request.reportProofUrl)}" target="_blank" rel="noopener">View payment proof</a>` : '';
        return `<section class="request-card" data-request-id="${esc(request.id)}">
          <div class="request-card-head">
            <div>
              <div class="request-amount">${money(request.amount)}</div>
              <strong>${esc(request.recipientName || 'Open request')}</strong>
            </div>
            <span class="request-status ${statusClass}">${label}</span>
          </div>
          ${request.note ? `<p>${esc(request.note)}</p>` : ''}
          ${report}${proof}
          <p class="request-muted">Created ${new Date(request.createdAt).toLocaleString()} · Expires ${new Date(request.expiresAt).toLocaleDateString()}</p>
          <div class="request-money-actions">
            ${canShare ? '<button type="button" class="request-money-button" data-action="share">New Share Link</button>' : ''}
            ${canConfirm ? `<button type="button" class="request-money-button primary" data-action="confirm">${request.status==='reported'?'Confirm Received':'Mark Paid'}</button>` : ''}
            ${request.status==='reported' ? '<button type="button" class="request-money-button" data-action="reject">Not Received</button>' : ''}
            ${!['paid','cancelled'].includes(request.status) ? '<button type="button" class="request-money-button danger" data-action="cancel">Cancel</button>' : ''}
          </div>
        </section>`;
      }).join('');

      list.onclick=event=>{
        const button=event.target.closest('[data-action]');
        const card=event.target.closest('[data-request-id]');
        if(!button || !card) return;
        const request=requests.find(item=>item.id===card.dataset.requestId);
        if(!request) return;
        busy(d,async()=>{
          if(button.dataset.action==='share') {
            const data=await paymentRequest({action:'rotate-link',id:request.id});
            const result=await shareRequest(data.request,data.token);
            d.querySelector('.request-message').textContent=result.shared ? 'New link shared.' : 'New link created. Previous link is now invalid.';
          } else if(button.dataset.action==='confirm') {
            await confirmRequest(request,load);
          } else if(button.dataset.action==='reject') {
            if(!window.confirm('Mark this payment report as not received?')) return;
            await paymentRequest({action:'reject',id:request.id});
            await load();
          } else if(button.dataset.action==='cancel') {
            if(!window.confirm('Cancel this payment request? The link will stop working.')) return;
            await paymentRequest({action:'cancel',id:request.id});
            await load();
          }
        });
      };
    }

    busy(d,load);
  }

  document.querySelectorAll('[data-request-create]').forEach(button=>button.addEventListener('click',openCreate));
  document.querySelectorAll('[data-request-list]').forEach(button=>button.addEventListener('click',openList));

  return {openCreate,openList};
}
