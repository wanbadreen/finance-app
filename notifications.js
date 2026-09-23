import { isNativeApp } from "./native-platform.js";
import { supabase } from "./supabase.js";

const KIRA_NOTIFICATION_REFRESH_MS = 60_000;
const DEFAULT_NOTIFICATION_PREFERENCES = {
    recurring_enabled: true,
    credit_card_enabled: true,
    budget_enabled: true,
    goal_enabled: true,
    cashflow_enabled: true,
    push_enabled: false
};

const state = {
    user: null,
    preferences: null,
    notifications: [],
    refreshTimer: null,
    initialized: false,
    busy: false,
    currentPushSubscription: null,
    devicePushSupported: null
};

const els = {};

function qs(selector, root = document) {
    return root.querySelector(selector);
}

function qsa(selector, root = document) {
    return [...root.querySelectorAll(selector)];
}

function formatMoney(value) {
    return new Intl.NumberFormat("en-MY", {
        style: "currency",
        currency: "MYR",
        minimumFractionDigits: 2
    }).format(Number(value || 0));
}

function todayIso() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function currentMonthStart() {
    return `${todayIso().slice(0, 7)}-01`;
}

function nextMonthStart() {
    const [year, month] = currentMonthStart().split("-").map(Number);
    const d = new Date(Date.UTC(year, month, 1));
    return d.toISOString().slice(0, 10);
}

function addDays(dateText, days) {
    const d = new Date(`${dateText}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().slice(0, 10);
}

function diffDays(fromDate, toDate) {
    const a = new Date(`${fromDate}T00:00:00Z`).getTime();
    const b = new Date(`${toDate}T00:00:00Z`).getTime();
    return Math.round((b - a) / 86_400_000);
}

function safeText(value) {
    return String(value ?? "").trim();
}

function getNotificationIcon(kind, severity) {
    if (severity === "critical") return "!";
    if (kind === "recurring") return "↻";
    if (kind === "credit_card") return "◈";
    if (kind === "budget") return "%";
    if (kind === "goal") return "◎";
    if (kind === "cashflow") return "↗";
    return "•";
}

function getTargetHash(notification) {
    if (notification?.target_hash) {
        return notification.target_hash.startsWith("#")
            ? notification.target_hash
            : `#${notification.target_hash}`;
    }

    const page = notification?.target_page || "dashboard";
    return `#${page}`;
}

function timeAgo(value) {
    if (!value) return "";
    const timestamp = new Date(value).getTime();
    if (!Number.isFinite(timestamp)) return "";
    const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(value).toLocaleDateString("en-MY", {
        day: "numeric",
        month: "short"
    });
}

function ensureUi() {
    if (!document.body || qs("#kira-notification-center")) {
        cacheElements();
        return;
    }

    const topbarActions = qs(".topbar-actions");
    if (topbarActions) {
        const bell = document.createElement("button");
        bell.type = "button";
        bell.id = "kira-notification-bell";
        bell.className = "kira-notification-bell";
        bell.setAttribute("aria-label", "Open notifications");
        bell.setAttribute("aria-expanded", "false");
        bell.innerHTML = `
            <span class="kira-notification-bell-icon" aria-hidden="true">♢</span>
            <span id="kira-notification-badge" class="kira-notification-badge" hidden>0</span>
        `;
        topbarActions.prepend(bell);
    }

    const center = document.createElement("div");
    center.id = "kira-notification-center";
    center.className = "kira-notification-center";
    center.setAttribute("aria-hidden", "true");
    center.innerHTML = `
        <div class="kira-notification-backdrop" data-notification-close></div>
        <aside class="kira-notification-panel" role="dialog" aria-modal="true" aria-labelledby="kira-notification-title">
            <div class="kira-notification-header">
                <div>
                    <p class="kira-notification-eyebrow">Kira Alerts</p>
                    <h2 id="kira-notification-title">Notifications</h2>
                    <p id="kira-notification-summary">You're all caught up.</p>
                </div>
                <button type="button" class="kira-notification-close" data-notification-close aria-label="Close notifications">×</button>
            </div>
            <div class="kira-notification-toolbar">
                <button type="button" id="kira-mark-all-read">Mark all as read</button>
                <button type="button" id="kira-refresh-notifications">Refresh</button>
            </div>
            <div id="kira-notification-list" class="kira-notification-list"></div>
            <div class="kira-notification-footer">
                <button type="button" id="kira-open-notification-settings">Notification settings</button>
            </div>
        </aside>
    `;
    document.body.appendChild(center);

    const settingsPage = qs("#settings-page") || qs('[data-page="settings"].app-page');
    if (settingsPage && !qs("#kira-notification-preferences")) {
        const section = document.createElement("section");
        section.id = "kira-notification-preferences";
        section.className = "settings-section kira-notification-preferences";
        section.innerHTML = `
            <div class="content-section-header kira-notification-settings-heading">
                <div>
                    <h2>Notifications</h2>
                    <p>Choose what Kira should alert you about.</p>
                </div>
            </div>
            <article class="settings-card kira-notification-settings-card">
                <div class="kira-notification-preference-row">
                    <div>
                        <strong>Recurring reminders</strong>
                        <span>Due soon, due today and overdue commitments.</span>
                    </div>
                    <label class="kira-switch"><input type="checkbox" id="kira-pref-recurring"><span></span></label>
                </div>
                <div class="kira-notification-preference-row">
                    <div>
                        <strong>Credit card reminders</strong>
                        <span>Upcoming card payments, due today and overdue statement balances.</span>
                    </div>
                    <label class="kira-switch"><input type="checkbox" id="kira-pref-credit-card"><span></span></label>
                </div>
                <div class="kira-notification-preference-row">
                    <div>
                        <strong>Budget alerts</strong>
                        <span>Warnings at 80%, 100% and when you go over budget.</span>
                    </div>
                    <label class="kira-switch"><input type="checkbox" id="kira-pref-budget"><span></span></label>
                </div>
                <div class="kira-notification-preference-row">
                    <div>
                        <strong>Goal alerts</strong>
                        <span>Goal completion, deadlines and progress warnings.</span>
                    </div>
                    <label class="kira-switch"><input type="checkbox" id="kira-pref-goal"><span></span></label>
                </div>
                <div class="kira-notification-preference-row">
                    <div>
                        <strong>Cash-flow warnings</strong>
                        <span>Warn me when upcoming commitments may push my balance below zero.</span>
                    </div>
                    <label class="kira-switch"><input type="checkbox" id="kira-pref-cashflow"><span></span></label>
                </div>
                <div class="kira-notification-preference-row kira-push-row">
                    <div>
                        <strong>Push notifications</strong>
                        <span id="kira-push-status">Browser notifications are off.</span>
                    </div>
                    <label class="kira-switch"><input type="checkbox" id="kira-pref-push"><span></span></label>
                </div>
                <div class="kira-notification-settings-actions">
                    <button type="button" id="kira-save-notification-preferences">Save notification settings</button>
                    <button type="button" id="kira-send-test-notification" class="secondary-action-button">Send test notification</button>
                </div>
                <p id="kira-notification-settings-message" class="settings-inline-message" aria-live="polite"></p>
            </article>
        `;
        settingsPage.appendChild(section);
    }

    const mobileMoreGrid = qs("#more-page .more-hub-grid");
    if (mobileMoreGrid && !qs("#kira-more-notifications")) {
        const link = document.createElement("a");
        link.id = "kira-more-notifications";
        link.href = "#notifications";
        link.className = "more-hub-card more-hub-link";
        link.innerHTML = `
            <div class="more-hub-icon">♢</div>
            <div class="more-hub-content">
                <div class="more-hub-title-row">
                    <h3>Notifications</h3>
                    <span id="kira-more-notification-count" class="kira-more-count" hidden>0</span>
                </div>
                <p>View reminders, budget alerts and financial warnings.</p>
            </div>
            <span class="more-hub-arrow" aria-hidden="true">›</span>
        `;
        mobileMoreGrid.prepend(link);
    }

    cacheElements();
    bindUi();
}

function cacheElements() {
    els.center = qs("#kira-notification-center");
    els.bell = qs("#kira-notification-bell");
    els.badge = qs("#kira-notification-badge");
    els.list = qs("#kira-notification-list");
    els.summary = qs("#kira-notification-summary");
    els.markAll = qs("#kira-mark-all-read");
    els.refresh = qs("#kira-refresh-notifications");
    els.openSettings = qs("#kira-open-notification-settings");
    els.moreLink = qs("#kira-more-notifications");
    els.moreCount = qs("#kira-more-notification-count");
    els.prefRecurring = qs("#kira-pref-recurring");
    els.prefCreditCard = qs("#kira-pref-credit-card");
    els.prefBudget = qs("#kira-pref-budget");
    els.prefGoal = qs("#kira-pref-goal");
    els.prefCashflow = qs("#kira-pref-cashflow");
    els.prefPush = qs("#kira-pref-push");
    els.pushStatus = qs("#kira-push-status");
    els.savePreferences = qs("#kira-save-notification-preferences");
    els.testNotification = qs("#kira-send-test-notification");
    els.settingsMessage = qs("#kira-notification-settings-message");
}

function bindUi() {
    if (state.initialized) return;
    state.initialized = true;

    els.bell?.addEventListener("click", openCenter);
    qsa("[data-notification-close]", els.center).forEach(button => {
        button.addEventListener("click", closeCenter);
    });
    els.markAll?.addEventListener("click", markAllRead);
    els.refresh?.addEventListener("click", () => refreshNotifications({ generate: true }));
    els.openSettings?.addEventListener("click", () => {
        closeCenter();
        window.location.hash = "#settings";
        window.setTimeout(() => {
            qs("#kira-notification-preferences")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 250);
    });
    els.moreLink?.addEventListener("click", event => {
        event.preventDefault();
        openCenter();
    });
    els.savePreferences?.addEventListener("click", savePreferences);
    els.testNotification?.addEventListener("click", sendTestNotification);

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && els.center?.classList.contains("open")) {
            closeCenter();
        }
    });

    ["transaction-form", "budget-form", "recurring-form", "goal-form", "account-form", "credit-card-form", "credit-card-statement-form", "credit-card-payment-form"].forEach(id => {
        qs(`#${id}`)?.addEventListener("submit", () => {
            window.setTimeout(() => refreshNotifications({ generate: true }), 1200);
        });
    });

    window.addEventListener("focus", () => refreshNotifications({ generate: true }));
    window.addEventListener("online", () => refreshNotifications({ generate: true }));
    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) refreshNotifications({ generate: true });
    });
}

function openCenter() {
    if (!els.center) return;
    els.center.classList.add("open");
    els.center.setAttribute("aria-hidden", "false");
    els.bell?.setAttribute("aria-expanded", "true");
    document.body.classList.add("kira-notification-open");
    refreshNotifications({ generate: true });
}

function closeCenter() {
    els.center?.classList.remove("open");
    els.center?.setAttribute("aria-hidden", "true");
    els.bell?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("kira-notification-open");
}

async function getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) return null;
    return data.user;
}

async function ensurePreferenceRow() {
    if (!state.user) return null;

    const { data, error } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", state.user.id)
        .maybeSingle();

    if (error) {
        console.warn("Notification preference lookup failed:", error);
        return null;
    }

    if (data) {
        state.preferences = data;
        return data;
    }

    const payload = {
        user_id: state.user.id,
        ...DEFAULT_NOTIFICATION_PREFERENCES
    };

    const { data: created, error: insertError } = await supabase
        .from("notification_preferences")
        .insert(payload)
        .select("*")
        .single();

    if (insertError) {
        console.warn("Notification preference creation failed:", insertError);
        return null;
    }

    state.preferences = created;
    return created;
}

function renderPreferences() {
    const pref = state.preferences || DEFAULT_NOTIFICATION_PREFERENCES;
    if (els.prefRecurring) els.prefRecurring.checked = Boolean(pref.recurring_enabled);
    if (els.prefCreditCard) els.prefCreditCard.checked = Boolean(pref.credit_card_enabled);
    if (els.prefBudget) els.prefBudget.checked = Boolean(pref.budget_enabled);
    if (els.prefGoal) els.prefGoal.checked = Boolean(pref.goal_enabled);
    if (els.prefCashflow) els.prefCashflow.checked = Boolean(pref.cashflow_enabled);

    if (els.prefPush) {
        els.prefPush.disabled = state.devicePushSupported === false;
        els.prefPush.checked = Boolean(state.currentPushSubscription);
    }

    updatePushStatus();
}

async function savePreferences() {
    if (!state.user || !els.savePreferences) return;

    els.savePreferences.disabled = true;
    if (els.testNotification) els.testNotification.disabled = true;
    if (els.settingsMessage) els.settingsMessage.textContent = "Saving notification settings…";

    try {
        const enablePushOnThisDevice = Boolean(els.prefPush?.checked);
        let accountPushEnabled = Boolean(state.preferences?.push_enabled);

        if (enablePushOnThisDevice) {
            const subscription = await ensurePushSubscription();

            if (!subscription) {
                throw new Error(
                    "This device could not finish push setup. Please close and reopen Kira, then try again."
                );
            }

            accountPushEnabled = true;
        } else {
            accountPushEnabled = await deactivateCurrentPushSubscription();
        }

        const payload = {
            user_id: state.user.id,
            recurring_enabled: Boolean(els.prefRecurring?.checked),
            credit_card_enabled: Boolean(els.prefCreditCard?.checked),
            budget_enabled: Boolean(els.prefBudget?.checked),
            goal_enabled: Boolean(els.prefGoal?.checked),
            cashflow_enabled: Boolean(els.prefCashflow?.checked),
            push_enabled: accountPushEnabled
        };

        const { data, error } = await supabase
            .from("notification_preferences")
            .upsert(payload, { onConflict: "user_id" })
            .select("*")
            .single();

        if (error) throw error;

        state.preferences = data;
        await refreshCurrentDevicePushState({ registerIfMissing: false });
        renderPreferences();

        if (els.settingsMessage) {
            els.settingsMessage.textContent = state.currentPushSubscription
                ? "Notification settings saved. Push is active on this device."
                : accountPushEnabled
                    ? "Notification settings saved. Push remains active on another device."
                    : "Notification settings saved.";
        }

        await refreshNotifications({ generate: true });
    } catch (error) {
        console.error("Save notification preferences error:", error);

        await refreshCurrentDevicePushState({ registerIfMissing: false });
        renderPreferences();

        if (els.settingsMessage) {
            els.settingsMessage.textContent =
                error?.message ||
                "Unable to save notification settings.";
        }
    } finally {
        els.savePreferences.disabled = false;
        if (els.testNotification) els.testNotification.disabled = false;
    }
}

async function generateLocalNotifications() {
    if (!state.user || !state.preferences) return;

    const pref = state.preferences;
    const [recurringRes, budgetsRes, transactionsRes, goalsRes, accountsRes, categoriesRes, creditCardsRes, cardStatementsRes, transfersRes] = await Promise.all([
        supabase.from("recurring_transactions").select("id,name,type,amount,next_due_date,is_active,reminder_enabled,reminder_days_before").eq("is_active", true),
        supabase.from("budgets").select("id,category_id,amount,month_start").eq("month_start", currentMonthStart()),
        supabase.from("transactions").select("id,account_id,category_id,amount,type,transaction_date").is("deleted_at", null),
        supabase.from("savings_goals").select("id,name,target_amount,current_amount,target_date,status,created_at"),
        supabase.from("accounts").select("id,opening_balance"),
        supabase.from("categories").select("id,name"),
        supabase.from("credit_cards").select("id,account_id,card_name,is_active").eq("is_active", true),
        supabase.from("credit_card_statements").select("id,credit_card_id,statement_date,due_date,statement_balance,minimum_payment").order("statement_date", { ascending: false }),
        supabase.from("account_transfers").select("id,to_account_id,amount,transfer_date,deleted_at").is("deleted_at", null)
    ]);

    const responses = [recurringRes, budgetsRes, transactionsRes, goalsRes, accountsRes, categoriesRes, creditCardsRes, cardStatementsRes, transfersRes];
    const firstError = responses.find(result => result.error)?.error;
    if (firstError) {
        console.warn("Notification data refresh failed:", firstError);
        return;
    }

    const recurring = recurringRes.data || [];
    const budgets = budgetsRes.data || [];
    const transactions = transactionsRes.data || [];
    const goals = goalsRes.data || [];
    const accounts = accountsRes.data || [];
    const categories = new Map((categoriesRes.data || []).map(item => [item.id, item.name]));
    const creditCards = creditCardsRes.data || [];
    const cardStatements = cardStatementsRes.data || [];
    const transfers = transfersRes.data || [];
    const rows = [];
    const today = todayIso();

    if (pref.recurring_enabled) {
        for (const item of recurring) {
            if (!item.reminder_enabled) continue;
            const days = diffDays(today, item.next_due_date);
            const reminderDays = Math.max(0, Number(item.reminder_days_before ?? 3));
            let stage = null;
            let title = "";
            let message = "";
            let severity = "info";

            if (days < 0) {
                stage = "overdue";
                severity = "critical";
                title = `${item.name} is overdue`;
                message = `${formatMoney(item.amount)} was due ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago.`;
            } else if (days === 0) {
                stage = "today";
                severity = "warning";
                title = `${item.name} is due today`;
                message = `${formatMoney(item.amount)} is due today.`;
            } else if (days <= reminderDays) {
                stage = "soon";
                title = `${item.name} is due soon`;
                message = `${formatMoney(item.amount)} is due in ${days} day${days === 1 ? "" : "s"}.`;
            }

            if (stage) {
                rows.push({
                    user_id: state.user.id,
                    kind: "recurring",
                    severity,
                    title,
                    message,
                    target_page: "recurring",
                    target_hash: "recurring",
                    dedupe_key: `recurring:${item.id}:${item.next_due_date}:${stage}`
                });
            }
        }
    }

    if (pref.credit_card_enabled) {
        for (const card of creditCards) {
            const statement = cardStatements
                .filter(item => item.credit_card_id === card.id)
                .sort((a, b) => b.statement_date.localeCompare(a.statement_date))[0];

            if (!statement) continue;

            const startingDue = Number(
                statement.statement_balance ?? 0
            );

            const paidSinceStatement = transfers
                .filter(transfer =>
                    transfer.to_account_id === card.account_id &&
                    transfer.transfer_date >= statement.statement_date &&
                    transfer.transfer_date <= today
                )
                .reduce((sum, transfer) => sum + Number(transfer.amount || 0), 0);

            const remainingDue = Math.max(0, startingDue - paidSinceStatement);
            if (remainingDue <= 0.009) continue;

            const days = diffDays(today, statement.due_date);
            let stage = null;
            let severity = "info";
            let title = "";
            let message = "";

            if (days < 0) {
                stage = "overdue";
                severity = "critical";
                title = `${card.card_name} payment is overdue`;
                message = `${formatMoney(remainingDue)} remains unpaid from the latest statement.`;
            } else if (days === 0) {
                stage = "today";
                severity = "warning";
                title = `${card.card_name} is due today`;
                message = `${formatMoney(remainingDue)} remains due today.`;
            } else if (days <= 3) {
                stage = "soon";
                severity = "warning";
                title = `${card.card_name} payment is due soon`;
                message = `${formatMoney(remainingDue)} remains due in ${days} day${days === 1 ? "" : "s"}.`;
            }

            if (stage) {
                rows.push({
                    user_id: state.user.id,
                    kind: "credit_card",
                    severity,
                    title,
                    message,
                    target_page: "credit-cards",
                    target_hash: "credit-cards",
                    dedupe_key: `credit-card:${card.id}:${statement.statement_date}:${stage}`
                });
            }
        }
    }

    if (pref.budget_enabled) {
        const monthStart = currentMonthStart();
        const monthEnd = nextMonthStart();
        const monthlyExpenses = transactions.filter(tx =>
            tx.type === "expense" &&
            tx.transaction_date >= monthStart &&
            tx.transaction_date < monthEnd
        );

        for (const budget of budgets) {
            const spent = monthlyExpenses
                .filter(tx => tx.category_id === budget.category_id)
                .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
            const limit = Number(budget.amount || 0);
            if (limit <= 0) continue;
            const percent = spent / limit * 100;
            let stage = null;
            let severity = "warning";
            let title = "";
            let message = "";
            const categoryName = categories.get(budget.category_id) || "Category";

            if (percent > 100) {
                stage = "over";
                severity = "critical";
                title = `${categoryName} is over budget`;
                message = `${formatMoney(spent)} spent of ${formatMoney(limit)} (${percent.toFixed(0)}%).`;
            } else if (percent >= 100) {
                stage = "100";
                severity = "critical";
                title = `${categoryName} budget reached`;
                message = `${formatMoney(spent)} of ${formatMoney(limit)} has been used.`;
            } else if (percent >= 80) {
                stage = "80";
                title = `${categoryName} budget is ${percent.toFixed(0)}% used`;
                message = `${formatMoney(Math.max(0, limit - spent))} remains this month.`;
            }

            if (stage) {
                rows.push({
                    user_id: state.user.id,
                    kind: "budget",
                    severity,
                    title,
                    message,
                    target_page: "budgets",
                    target_hash: "budgets",
                    dedupe_key: `budget:${budget.id}:${monthStart}:${stage}`
                });
            }
        }
    }

    if (pref.goal_enabled) {
        for (const goal of goals) {
            const target = Number(goal.target_amount || 0);
            const current = Number(goal.current_amount || 0);
            const progress = target > 0 ? current / target : 0;

            if (target > 0 && current >= target) {
                rows.push({
                    user_id: state.user.id,
                    kind: "goal",
                    severity: "success",
                    title: `${goal.name} reached 100%`,
                    message: `You've reached your ${formatMoney(target)} target.`,
                    target_page: "goals",
                    target_hash: "goals",
                    dedupe_key: `goal:${goal.id}:completed`
                });
                continue;
            }

            if (goal.status !== "active" || !goal.target_date) continue;
            const daysLeft = diffDays(today, goal.target_date);

            if (daysLeft >= 0 && daysLeft <= 7) {
                rows.push({
                    user_id: state.user.id,
                    kind: "goal",
                    severity: daysLeft <= 2 ? "warning" : "info",
                    title: `${goal.name} target date is near`,
                    message: `${daysLeft === 0 ? "Due today" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`} with ${formatMoney(Math.max(0, target - current))} remaining.`,
                    target_page: "goals",
                    target_hash: "goals",
                    dedupe_key: `goal:${goal.id}:${goal.target_date}:due-soon`
                });
            }

            const createdDate = safeText(goal.created_at).slice(0, 10);
            if (createdDate && createdDate < today && goal.target_date > createdDate) {
                const totalDays = Math.max(1, diffDays(createdDate, goal.target_date));
                const elapsedDays = Math.max(0, diffDays(createdDate, today));
                const expected = Math.min(1, elapsedDays / totalDays);
                if (expected >= 0.25 && progress + 0.20 < expected) {
                    rows.push({
                        user_id: state.user.id,
                        kind: "goal",
                        severity: "warning",
                        title: `${goal.name} is behind plan`,
                        message: `Current progress is ${(progress * 100).toFixed(0)}%; around ${(expected * 100).toFixed(0)}% would keep you on pace.`,
                        target_page: "goals",
                        target_hash: "goals",
                        dedupe_key: `goal:${goal.id}:${today.slice(0, 7)}:behind`
                    });
                }
            }
        }
    }

    if (pref.cashflow_enabled) {
        const opening = accounts.reduce((sum, account) => sum + Number(account.opening_balance || 0), 0);
        const txNet = transactions.reduce((sum, tx) => {
            const amount = Number(tx.amount || 0);
            return sum + (tx.type === "income" ? amount : -amount);
        }, 0);
        const currentBalance = opening + txNet;
        const next30 = addDays(today, 30);
        const upcomingExpenses = recurring
            .filter(item => item.type === "expense" && item.next_due_date >= today && item.next_due_date <= next30)
            .reduce((sum, item) => sum + Number(item.amount || 0), 0);
        const projected = currentBalance - upcomingExpenses;

        if (upcomingExpenses > 0 && projected < 0) {
            rows.push({
                user_id: state.user.id,
                kind: "cashflow",
                severity: "critical",
                title: "Cash-flow warning",
                message: `${formatMoney(upcomingExpenses)} in upcoming commitments could take your projected balance to ${formatMoney(projected)}.`,
                target_page: "insights",
                target_hash: "insights",
                dedupe_key: `cashflow:${today.slice(0, 7)}:negative-projection`
            });
        }
    }

    if (!rows.length) return;

    const { error } = await supabase
        .from("notifications")
        .upsert(rows, {
            onConflict: "user_id,dedupe_key",
            ignoreDuplicates: true
        });

    if (error) {
        console.warn("Notification generation failed:", error);
    }
}

async function loadNotifications() {
    if (!state.user) return;

    const { data, error } = await supabase
        .from("notifications")
        .select("id,kind,severity,title,message,target_page,target_hash,dedupe_key,read_at,dismissed_at,push_sent_at,created_at")
        .is("dismissed_at", null)
        .order("created_at", { ascending: false })
        .limit(60);

    if (error) {
        console.warn("Load notifications failed:", error);
        return;
    }

    state.notifications = data || [];
    renderNotifications();
}

function renderNotifications() {
    if (!els.list) return;

    const unread = state.notifications.filter(item => !item.read_at).length;
    if (els.badge) {
        els.badge.hidden = unread === 0;
        els.badge.textContent = unread > 99 ? "99+" : String(unread);
    }
    if (els.moreCount) {
        els.moreCount.hidden = unread === 0;
        els.moreCount.textContent = unread > 99 ? "99+" : String(unread);
    }
    if (els.summary) {
        els.summary.textContent = unread
            ? `${unread} unread notification${unread === 1 ? "" : "s"}`
            : "You're all caught up.";
    }

    els.list.innerHTML = "";

    if (!state.notifications.length) {
        const empty = document.createElement("div");
        empty.className = "kira-notification-empty";
        empty.innerHTML = `<strong>No alerts right now</strong><span>Kira will surface recurring, budget, goal and cash-flow alerts here.</span>`;
        els.list.appendChild(empty);
        return;
    }

    for (const notification of state.notifications) {
        const card = document.createElement("article");
        card.className = `kira-notification-item severity-${notification.severity || "info"}${notification.read_at ? " is-read" : " is-unread"}`;
        card.dataset.notificationId = notification.id;

        const icon = document.createElement("div");
        icon.className = "kira-notification-item-icon";
        icon.textContent = getNotificationIcon(notification.kind, notification.severity);

        const content = document.createElement("button");
        content.type = "button";
        content.className = "kira-notification-content";
        content.innerHTML = `
            <span class="kira-notification-item-title"></span>
            <span class="kira-notification-item-message"></span>
            <span class="kira-notification-item-time"></span>
        `;
        qs(".kira-notification-item-title", content).textContent = notification.title;
        qs(".kira-notification-item-message", content).textContent = notification.message;
        qs(".kira-notification-item-time", content).textContent = timeAgo(notification.created_at);
        content.addEventListener("click", async () => {
            await markNotificationRead(notification.id);
            closeCenter();
            window.location.hash = getTargetHash(notification);
        });

        const dismiss = document.createElement("button");
        dismiss.type = "button";
        dismiss.className = "kira-notification-dismiss";
        dismiss.setAttribute("aria-label", `Dismiss ${notification.title}`);
        dismiss.textContent = "×";
        dismiss.addEventListener("click", () => dismissNotification(notification.id));

        card.append(icon, content, dismiss);
        els.list.appendChild(card);
    }
}

async function markNotificationRead(id) {
    const { error } = await supabase
        .from("notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("id", id);
    if (!error) {
        const item = state.notifications.find(entry => entry.id === id);
        if (item) item.read_at = new Date().toISOString();
        renderNotifications();
    }
}

async function markAllRead() {
    if (!state.user) return;
    const { error } = await supabase
        .from("notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("user_id", state.user.id)
        .is("read_at", null)
        .is("dismissed_at", null);
    if (!error) {
        const now = new Date().toISOString();
        state.notifications.forEach(item => { if (!item.read_at) item.read_at = now; });
        renderNotifications();
    }
}

async function dismissNotification(id) {
    const now = new Date().toISOString();
    const { error } = await supabase
        .from("notifications")
        .update({ dismissed_at: now, read_at: now })
        .eq("id", id);
    if (!error) {
        state.notifications = state.notifications.filter(item => item.id !== id);
        renderNotifications();
    }
}

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

function withTimeout(promise, timeoutMs, message) {
    let timeoutId;

    const timeoutPromise = new Promise((_, reject) => {
        timeoutId = window.setTimeout(() => {
            reject(new Error(message));
        }, timeoutMs);
    });

    return Promise.race([
        Promise.resolve(promise).finally(() => window.clearTimeout(timeoutId)),
        timeoutPromise
    ]);
}

function canUsePushApi() {
    return (
        !isNativeApp &&
        "serviceWorker" in navigator &&
        "Notification" in window &&
        "PushManager" in window
    );
}

async function waitForActiveServiceWorker(registration, timeoutMs = 20000) {
    if (!registration) {
        return null;
    }

    if (registration.active) {
        return registration;
    }

    const worker = registration.installing || registration.waiting;

    if (!worker) {
        try {
            const readyRegistration = await withTimeout(
                navigator.serviceWorker.ready,
                timeoutMs,
                "Kira could not activate its service worker in time."
            );
            return readyRegistration?.active ? readyRegistration : registration;
        } catch {
            throw new Error(
                "Kira could not activate its service worker. Remove Kira from the Home Screen, add it again, then retry push setup."
            );
        }
    }

    if (registration.waiting) {
        try {
            registration.waiting.postMessage({ type: "SKIP_WAITING" });
        } catch (error) {
            console.warn("Service worker skip-waiting message warning:", error);
        }
    }

    await withTimeout(
        new Promise((resolve, reject) => {
            const finish = () => {
                if (registration.active || worker.state === "activated") {
                    resolve(true);
                    return true;
                }

                if (worker.state === "redundant") {
                    reject(
                        new Error(
                            "Kira's service worker installation failed. Please reload Kira and try again."
                        )
                    );
                    return true;
                }

                return false;
            };

            if (finish()) return;

            const onStateChange = () => {
                if (finish()) {
                    worker.removeEventListener("statechange", onStateChange);
                }
            };

            worker.addEventListener("statechange", onStateChange);
        }),
        timeoutMs,
        "Kira's service worker is taking too long to activate."
    );

    return registration;
}

async function getServiceWorkerRegistration({
    registerIfMissing = false,
    waitForActive = registerIfMissing
} = {}) {
    if (isNativeApp || !("serviceWorker" in navigator)) {
        return null;
    }

    let registration = null;

    try {
        registration = await withTimeout(
            navigator.serviceWorker.getRegistration(),
            5000,
            "Kira could not check the service worker in time."
        );
    } catch (error) {
        console.warn("Service worker lookup warning:", error);
    }

    if (!registration && registerIfMissing) {
        registration = await withTimeout(
            navigator.serviceWorker.register("/service-worker.js", {
                scope: "/"
            }),
            10000,
            "Kira could not register its push service worker in time."
        );
    }

    if (!registration) {
        return null;
    }

    if (registration.active) {
        try {
            await withTimeout(
                registration.update(),
                5000,
                "Service worker update timed out."
            );
        } catch (error) {
            console.warn("Service worker update warning:", error);
        }
    }

    if (waitForActive && !registration.active) {
        registration = await waitForActiveServiceWorker(registration);
    }

    return registration;
}

async function primeServiceWorker() {
    if (isNativeApp || !("serviceWorker" in navigator)) {
        return;
    }

    try {
        const registration = await getServiceWorkerRegistration({
            registerIfMissing: true,
            waitForActive: false
        });

        if (registration && !registration.active) {
            waitForActiveServiceWorker(registration, 30000).catch(error => {
                console.warn("Background service worker activation warning:", error);
            });
        }
    } catch (error) {
        console.warn("Service worker bootstrap warning:", error);
    }
}

async function refreshCurrentDevicePushState({ registerIfMissing = false } = {}) {
    if (!canUsePushApi()) {
        state.devicePushSupported = false;
        state.currentPushSubscription = null;
        updatePushStatus();
        return null;
    }

    state.devicePushSupported = true;

    try {
        const registration = await getServiceWorkerRegistration({
            registerIfMissing
        });

        if (!registration?.pushManager) {
            state.currentPushSubscription = null;
            updatePushStatus();
            return null;
        }

        state.currentPushSubscription = await withTimeout(
            registration.pushManager.getSubscription(),
            8000,
            "Kira could not check this device's push subscription in time."
        );

        updatePushStatus();
        return state.currentPushSubscription;
    } catch (error) {
        console.warn("Current device push check warning:", error);
        state.currentPushSubscription = null;
        updatePushStatus();
        return null;
    }
}

async function savePushSubscription(subscription) {
    if (!state.user || !subscription) {
        return false;
    }

    const json = subscription.toJSON();
    const endpoint = json.endpoint || subscription.endpoint;

    if (!endpoint) {
        throw new Error("The browser did not return a valid push endpoint.");
    }

    const { error } = await supabase
        .from("push_subscriptions")
        .upsert({
            user_id: state.user.id,
            endpoint,
            p256dh: json.keys?.p256dh || "",
            auth: json.keys?.auth || "",
            user_agent: navigator.userAgent,
            is_active: true,
            updated_at: new Date().toISOString()
        }, {
            onConflict: "user_id,endpoint"
        });

    if (error) {
        throw error;
    }

    return true;
}

async function ensurePushSubscription() {
    if (!canUsePushApi()) {
        state.devicePushSupported = false;
        updatePushStatus();

        if (els.settingsMessage) {
            els.settingsMessage.textContent =
                "Push notifications are not supported on this device.";
        }

        return null;
    }

    state.devicePushSupported = true;

    const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

    if (!vapidPublicKey) {
        throw new Error(
            "Push is not configured yet. VITE_VAPID_PUBLIC_KEY is missing."
        );
    }

    const permission =
        Notification.permission === "granted"
            ? "granted"
            : await withTimeout(
                Notification.requestPermission(),
                15000,
                "The notification permission request timed out."
            );

    if (permission !== "granted") {
        updatePushStatus();

        throw new Error(
            permission === "denied"
                ? "Notifications are blocked for Kira. Enable them in your device settings and try again."
                : "Notification permission was not granted."
        );
    }

    if (els.settingsMessage) {
        els.settingsMessage.textContent =
            "Permission granted. Registering this device for push…";
    }

    const registration = await getServiceWorkerRegistration({
        registerIfMissing: true
    });

    if (!registration?.pushManager) {
        throw new Error(
            "Kira could not access PushManager on this device."
        );
    }

    let subscription = await withTimeout(
        registration.pushManager.getSubscription(),
        8000,
        "Kira could not check the existing push subscription in time."
    );

    if (!subscription) {
        subscription = await withTimeout(
            registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                    vapidPublicKey
                )
            }),
            20000,
            "Push registration took too long. Close and reopen Kira, then try again."
        );
    }

    if (els.settingsMessage) {
        els.settingsMessage.textContent =
            "Push subscription created. Saving this device…";
    }

    await savePushSubscription(subscription);

    state.currentPushSubscription = subscription;
    updatePushStatus();

    return subscription;
}

async function hasAnyActivePushSubscription() {
    if (!state.user) {
        return false;
    }

    const { data, error } = await supabase
        .from("push_subscriptions")
        .select("id")
        .eq("user_id", state.user.id)
        .eq("is_active", true)
        .limit(1);

    if (error) {
        throw error;
    }

    return Boolean(data?.length);
}

async function deactivateCurrentPushSubscription() {
    if (!state.user) {
        state.currentPushSubscription = null;
        updatePushStatus();
        return false;
    }

    let subscription = state.currentPushSubscription;

    if (!subscription && canUsePushApi()) {
        try {
            const registration = await getServiceWorkerRegistration({
                registerIfMissing: false
            });

            if (registration?.pushManager) {
                subscription = await withTimeout(
                    registration.pushManager.getSubscription(),
                    8000,
                    "Kira could not check this device's push subscription in time."
                );
            }
        } catch (error) {
            console.warn("Push unsubscribe lookup warning:", error);
        }
    }

    const endpoint = subscription?.endpoint;

    if (endpoint) {
        const { error } = await supabase
            .from("push_subscriptions")
            .update({
                is_active: false,
                updated_at: new Date().toISOString()
            })
            .eq("user_id", state.user.id)
            .eq("endpoint", endpoint);

        if (error) {
            throw error;
        }

        try {
            await withTimeout(
                subscription.unsubscribe(),
                8000,
                "Kira could not finish disabling push on this device in time."
            );
        } catch (error) {
            console.warn("Push unsubscribe warning:", error);
        }
    }

    state.currentPushSubscription = null;
    updatePushStatus();

    return hasAnyActivePushSubscription();
}

function updatePushStatus() {
    if (!els.pushStatus) return;

    if (state.devicePushSupported === false || !canUsePushApi()) {
        els.pushStatus.textContent =
            isNativeApp
                ? "Android push is not configured yet. In-app notifications remain available."
                : "Push is not supported on this device.";
        return;
    }

    if (Notification.permission === "denied") {
        els.pushStatus.textContent =
            "Notifications are blocked in this device's settings.";
        return;
    }

    if (state.currentPushSubscription) {
        els.pushStatus.textContent =
            "Push notifications are enabled on this device.";
        return;
    }

    if (
        state.preferences?.push_enabled &&
        Notification.permission === "granted"
    ) {
        els.pushStatus.textContent =
            "Permission is allowed, but this device is not subscribed yet.";
        return;
    }

    if (state.preferences?.push_enabled) {
        els.pushStatus.textContent =
            "Push is active on another device. Enable it here to receive alerts on this device.";
        return;
    }

    els.pushStatus.textContent =
        "Push notifications are off on this device.";
}

async function sendTestNotification() {
    if (!state.user || !els.testNotification) return;

    els.testNotification.disabled = true;

    if (els.settingsMessage) {
        els.settingsMessage.textContent =
            "Checking this device before sending a test…";
    }

    try {
        const subscription =
            state.currentPushSubscription ||
            await refreshCurrentDevicePushState({
                registerIfMissing: false
            });

        if (!subscription) {
            throw new Error(
                "This device is not subscribed to push yet. Turn on Push notifications and save the settings first."
            );
        }

        if (els.settingsMessage) {
            els.settingsMessage.textContent =
                "Sending test notification…";
        }

        const { data, error } = await supabase.functions.invoke(
            "notification-dispatch",
            {
                body: {
                    mode: "test"
                }
            }
        );

        if (error) throw error;
        if (data?.ok === false) {
            throw new Error(
                data.error ||
                "Test notification failed."
            );
        }

        if (els.settingsMessage) {
            els.settingsMessage.textContent = data?.pushed
                ? "Test notification sent to your active push devices."
                : "Test alert created, but no push delivery was confirmed.";
        }

        await loadNotifications();
    } catch (error) {
        if (els.settingsMessage) {
            els.settingsMessage.textContent =
                error?.message ||
                "Unable to send test notification.";
        }
    } finally {
        els.testNotification.disabled = false;
    }
}

async function refreshNotifications({ generate = false } = {}) {
    if (state.busy) return;
    state.busy = true;
    try {
        const user = await getCurrentUser();
        if (!user) {
            state.user = null;
            state.preferences = null;
            state.notifications = [];
            renderNotifications();
            return;
        }

        state.user = user;
        await ensurePreferenceRow();
        await refreshCurrentDevicePushState({ registerIfMissing: false });
        renderPreferences();
        if (generate) await generateLocalNotifications();
        await loadNotifications();
    } catch (error) {
        console.warn("Kira notification refresh warning:", error);
    } finally {
        state.busy = false;
    }
}

function startRefreshTimer() {
    if (state.refreshTimer) window.clearInterval(state.refreshTimer);
    state.refreshTimer = window.setInterval(() => {
        if (!document.hidden) refreshNotifications({ generate: true });
    }, KIRA_NOTIFICATION_REFRESH_MS);
}

async function boot() {
    ensureUi();

    // Start service-worker installation as early as possible so iOS
    // Home Screen apps have an active worker before push is enabled.
    primeServiceWorker();

    await refreshNotifications({ generate: true });
    startRefreshTimer();

    supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
            window.setTimeout(() => refreshNotifications({ generate: true }), 250);
        } else if (event === "SIGNED_OUT") {
            state.user = null;
            state.preferences = null;
            state.notifications = [];
            state.currentPushSubscription = null;
            state.devicePushSupported = null;
            renderNotifications();
            renderPreferences();
        }
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
    boot();
}
