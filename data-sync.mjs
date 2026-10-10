// Kira data synchronization: pull-to-refresh, app resume, and scoped Realtime.
const WATCHED_TABLES = [
  'transactions',
  'transaction_tags',
  'accounts',
  'account_transfers',
  'credit_cards',
  'credit_card_statements',
  'credit_card_reconciliations',
  'recurring_transactions',
  'savings_goals',
  'savings_movements',
  'split_bills'
];

export function createDataSync({ supabase, appRoot, getUserId, refreshData }) {
  let userId = null;
  let channel = null;
  let timer = null;
  let polling = null;
  let feedbackTimer = null;
  let pendingReason = null;
  const pendingTables = new Set();
  let syncing = false;
  let lastSync = 0;
  let touch = null;

  const indicator = document.createElement('div');
  indicator.className = 'kira-sync-indicator';
  indicator.setAttribute('role', 'status');
  indicator.setAttribute('aria-live', 'polite');
  indicator.innerHTML = '<span class="kira-sync-spinner" aria-hidden="true"></span><span class="kira-sync-label"></span>';
  const label = indicator.querySelector('.kira-sync-label');
  document.body.append(indicator);

  const isActive = () => Boolean(userId && getUserId() === userId && appRoot.style.display !== 'none');
  const isOnline = () => navigator.onLine !== false;

  function feedback(message, kind = 'loading', delay = 0) {
    window.clearTimeout(feedbackTimer);
    label.textContent = message;
    indicator.dataset.state = kind;
    indicator.classList.add('kira-sync-visible');
    if (delay) {
      feedbackTimer = window.setTimeout(() => {
        if (!syncing && !touch) indicator.classList.remove('kira-sync-visible');
      }, delay);
    }
  }

  function clearFeedback() {
    window.clearTimeout(feedbackTimer);
    indicator.classList.remove('kira-sync-visible');
  }

  async function flush() {
    window.clearTimeout(timer);
    timer = null;
    if (!pendingReason || !isActive() || !isOnline()) {
      pendingReason = null;
      pendingTables.clear();
      if (!syncing) clearFeedback();
      return;
    }
    if (syncing) return;
    const reason = pendingReason;
    const tables = [...pendingTables];
    pendingReason = null;
    pendingTables.clear();

    // The same tab can fire both visibilitychange and focus on resume.
    if ((reason === 'resume' || reason === 'poll') && Date.now() - lastSync < 2000) return;

    const activeId = userId;
    syncing = true;
    if (reason === 'pull') feedback('Refreshing Kira…');
    try {
      await refreshData({ reason, tables });
      if (userId !== activeId || !isActive()) return;
      lastSync = Date.now();
      if (reason === 'pull') feedback('Up to date', 'success', 1250);
      else clearFeedback();
    } catch (error) {
      console.warn('Kira data sync failed:', error);
      if (userId === activeId && isActive()) feedback('Could not refresh. Pull down to retry.', 'error', 2600);
    } finally {
      syncing = false;
      if (pendingReason) timer = window.setTimeout(flush, 350);
    }
  }

  function schedule(reason, table = null) {
    if (!isActive()) return;
    if (!isOnline()) {
      if (reason === 'pull') feedback('Offline. Connect to refresh.', 'error', 2000);
      return;
    }
    if (table) pendingTables.add(table);
    // A user-initiated pull refresh takes priority over a background signal.
    if (!pendingReason || reason === 'pull' || (pendingReason === 'realtime' && reason !== 'realtime')) {
      pendingReason = reason;
    }
    if (syncing) return;
    window.clearTimeout(timer);
    timer = window.setTimeout(flush, reason === 'realtime' ? 450 : 60);
  }

  function atTop(target) {
    if (window.scrollY > 2 || document.scrollingElement?.scrollTop > 2) return false;
    for (let element = target; element && element !== appRoot; element = element.parentElement) {
      if (element.scrollHeight <= element.clientHeight + 4) continue;
      const overflow = getComputedStyle(element).overflowY;
      if ((overflow === 'auto' || overflow === 'scroll') && element.scrollTop > 2) return false;
    }
    return true;
  }

  function onTouchStart(event) {
    if (!isActive() || event.touches.length !== 1) return;
    const target = event.target;
    if (!target.closest('.app-page.active-page')) return;
    if (target.closest('input, textarea, select, button, dialog, [role="dialog"], .split-root')) return;
    if (document.querySelector('dialog[open], .kira-onboarding-open, .kira-notification-open')) return;
    if (!atTop(target)) return;
    const finger = event.touches[0];
    touch = { x: finger.clientX, y: finger.clientY, distance: 0 };
  }

  function onTouchMove(event) {
    if (!touch || event.touches.length !== 1 || syncing) return;
    const finger = event.touches[0];
    const dy = finger.clientY - touch.y;
    const dx = finger.clientX - touch.x;
    if (dy < 9 || Math.abs(dx) > dy) return;
    if (!atTop(event.target)) {
      touch = null;
      return;
    }
    if (event.cancelable) event.preventDefault();
    touch.distance = Math.min(75, (dy - 9) * 0.62);
    feedback(touch.distance >= 48 ? 'Release to refresh' : 'Pull to refresh', 'pull');
    indicator.style.setProperty('--kira-pull', String(touch.distance) + 'px');
  }

  function onTouchEnd() {
    if (!touch) return;
    const distance = touch.distance;
    touch = null;
    indicator.style.removeProperty('--kira-pull');
    if (distance >= 48) schedule('pull');
    else if (!syncing) clearFeedback();
  }

  function onVisibility() {
    if (document.visibilityState === 'visible') schedule('resume');
  }
  function onFocus() { if (document.visibilityState !== 'hidden') schedule('resume'); }
  function onOnline() { schedule('resume'); }

  appRoot.addEventListener('touchstart', onTouchStart, { passive: true });
  appRoot.addEventListener('touchmove', onTouchMove, { passive: false });
  appRoot.addEventListener('touchend', onTouchEnd, { passive: true });
  appRoot.addEventListener('touchcancel', onTouchEnd, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('focus', onFocus);
  window.addEventListener('pageshow', onFocus);
  window.addEventListener('online', onOnline);

  function stop() {
    userId = null;
    touch = null;
    pendingReason = null;
    pendingTables.clear();
    window.clearTimeout(timer);
    window.clearInterval(polling);
    polling = null;
    if (channel) {
      void supabase.removeChannel(channel);
      channel = null;
    }
    clearFeedback();
  }

  function start(nextUserId) {
    if (!nextUserId || getUserId() !== nextUserId) return;
    if (userId === nextUserId && channel) return;
    stop();
    userId = nextUserId;

    channel = supabase.channel('kira-data-sync-' + nextUserId);
    for (const table of WATCHED_TABLES) {
      // All published tables use user-owned SELECT RLS and user_id filters.
      // Soft deletion of transactions is an UPDATE. Physical DELETE remains
      // covered by resume/pull sync (Postgres DELETE filters are restricted).
      for (const event of ['INSERT', 'UPDATE']) {
        channel.on('postgres_changes', {
          schema: 'public',
          table,
          event,
          filter: 'user_id=eq.' + nextUserId
        }, () => schedule('realtime', table));
      }
    }
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') schedule('resume');
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        console.warn('Kira Realtime disconnected; resume/pull sync remain available.');
      }
    });

    // Safety net for mobile browsers that suspend websocket connections.
    polling = window.setInterval(() => {
      if (document.visibilityState === 'visible' && Date.now() - lastSync > 90000) {
        schedule('poll');
      }
    }, 90000);
  }

  return { start, stop, refresh: () => schedule('pull') };
}
