import { createClient } from "jsr:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY") ?? "";
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY") ?? "";
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT") ?? "mailto:appkira2026@gmail.com";

const service = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function isoDate(date = new Date()) {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

function addDays(dateText: string, days: number) {
  const date = new Date(`${dateText}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return isoDate(date);
}

function diffDays(fromText: string, toText: string) {
  const from = new Date(`${fromText}T00:00:00Z`).getTime();
  const to = new Date(`${toText}T00:00:00Z`).getTime();
  return Math.round((to - from) / 86_400_000);
}

function currentMonthStart(today: string) {
  return `${today.slice(0, 7)}-01`;
}

function nextMonthStart(today: string) {
  const [year, month] = today.slice(0, 7).split("-").map(Number);
  return isoDate(new Date(Date.UTC(year, month, 1)));
}

function money(value: number) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
}

async function authenticateManual(req: Request) {
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;

  const client = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

async function authenticateCron(req: Request) {
  const supplied = req.headers.get("x-cron-secret") ?? "";
  if (!supplied) return false;

  // Supabase's internal REST hop can occasionally return a transient 401.
  // Retry the secret lookup before rejecting a legitimate pg_cron request.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const { data, error } = await service
      .from("report_scheduler_config")
      .select("secret")
      .eq("id", true)
      .maybeSingle();

    if (!error && data?.secret) {
      return supplied === data.secret;
    }

    if (attempt < 2) {
      await new Promise(resolve => setTimeout(resolve, 120 * (attempt + 1)));
    }
  }

  return false;
}

type NotificationRow = {
  user_id: string;
  kind: "recurring" | "credit_card" | "budget" | "goal" | "cashflow" | "system";
  severity: "info" | "warning" | "critical" | "success";
  title: string;
  message: string;
  target_page: string;
  target_hash: string;
  dedupe_key: string;
};

async function upsertNotifications(rows: NotificationRow[]) {
  if (!rows.length) return;
  const { error } = await service
    .from("notifications")
    .upsert(rows, {
      onConflict: "user_id,dedupe_key",
      ignoreDuplicates: true,
    });
  if (error) throw error;
}

async function buildAlertsForUser(userId: string, pref: any) {
  const today = isoDate();
  const monthStart = currentMonthStart(today);
  const monthEnd = nextMonthStart(today);
  const next30 = addDays(today, 30);

  const [recurringRes, budgetRes, monthTxRes, allTxRes, goalRes, accountRes, categoryRes, creditCardRes, statementRes, transferRes] = await Promise.all([
    service.from("recurring_transactions")
      .select("id,name,type,amount,next_due_date,is_active,reminder_enabled,reminder_days_before")
      .eq("user_id", userId).eq("is_active", true),
    service.from("budgets")
      .select("id,category_id,amount,month_start")
      .eq("user_id", userId).eq("month_start", monthStart),
    service.from("transactions")
      .select("id,category_id,amount,report_amount,cash_amount,type,transaction_date")
      .eq("user_id", userId).is("deleted_at", null)
      .gte("transaction_date", monthStart).lt("transaction_date", monthEnd),
    service.from("transactions")
      .select("id,amount,cash_amount,type")
      .eq("user_id", userId).is("deleted_at", null),
    service.from("savings_goals")
      .select("id,name,target_amount,current_amount,target_date,status,created_at")
      .eq("user_id", userId),
    service.from("accounts")
      .select("id,opening_balance")
      .eq("user_id", userId),
    service.from("categories")
      .select("id,name")
      .eq("user_id", userId),
    service.from("credit_cards")
      .select("id,account_id,card_name,is_active")
      .eq("user_id", userId).eq("is_active", true),
    service.from("credit_card_statements")
      .select("id,credit_card_id,statement_date,due_date,statement_balance,pre_tracking_paid_since_statement,minimum_payment")
      .eq("user_id", userId)
      .order("statement_date", { ascending: false }),
    service.from("account_transfers")
      .select("id,to_account_id,amount,transfer_date,deleted_at")
      .eq("user_id", userId).is("deleted_at", null),
  ]);

  for (const response of [recurringRes, budgetRes, monthTxRes, allTxRes, goalRes, accountRes, categoryRes, creditCardRes, statementRes, transferRes]) {
    if (response.error) throw response.error;
  }

  const recurring = recurringRes.data ?? [];
  const budgets = budgetRes.data ?? [];
  const monthTransactions = (monthTxRes.data ?? []).map((tx: any) => ({ ...tx, amount: Number(tx.report_amount ?? tx.amount) }));
  const allTransactions = allTxRes.data ?? [];
  const goals = goalRes.data ?? [];
  const accounts = accountRes.data ?? [];
  const categories = new Map((categoryRes.data ?? []).map((row: any) => [row.id, row.name]));
  const creditCards = creditCardRes.data ?? [];
  const cardStatements = statementRes.data ?? [];
  const transfers = transferRes.data ?? [];
  const rows: NotificationRow[] = [];

  if (pref.recurring_enabled) {
    for (const item of recurring) {
      if (!item.reminder_enabled) continue;
      const days = diffDays(today, item.next_due_date);
      const reminderDays = Math.max(0, Number(item.reminder_days_before ?? 3));
      let stage = "";
      let severity: NotificationRow["severity"] = "info";
      let title = "";
      let message = "";

      if (days < 0) {
        stage = "overdue";
        severity = "critical";
        title = `${item.name} is overdue`;
        message = `${money(item.amount)} was due ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago.`;
      } else if (days === 0) {
        stage = "today";
        severity = "warning";
        title = `${item.name} is due today`;
        message = `${money(item.amount)} is due today.`;
      } else if (days <= reminderDays) {
        stage = "soon";
        title = `${item.name} is due soon`;
        message = `${money(item.amount)} is due in ${days} day${days === 1 ? "" : "s"}.`;
      }

      if (stage) {
        rows.push({
          user_id: userId,
          kind: "recurring",
          severity,
          title,
          message,
          target_page: "recurring",
          target_hash: "recurring",
          dedupe_key: `recurring:${item.id}:${item.next_due_date}:${stage}`,
        });
      }
    }
  }

  if (pref.credit_card_enabled) {
    for (const card of creditCards) {
      const statement = cardStatements
        .filter((item: any) => item.credit_card_id === card.id)
        .sort((a: any, b: any) => b.statement_date.localeCompare(a.statement_date))[0];

      if (!statement) continue;

      const startingDue = Number(statement.statement_balance ?? 0);
      const paidSinceStatement = transfers
        .filter((transfer: any) =>
          transfer.to_account_id === card.account_id &&
          transfer.transfer_date > statement.statement_date &&
          transfer.transfer_date <= today
        )
        .reduce((sum: number, transfer: any) => sum + Number(transfer.amount || 0), 0);
      const preTrackingPaid = Math.max(0, Number(statement.pre_tracking_paid_since_statement || 0));
      const remainingDue = Math.max(0, startingDue - preTrackingPaid - paidSinceStatement);
      if (remainingDue <= 0.009) continue;

      const days = diffDays(today, statement.due_date);
      let stage = "";
      let severity: NotificationRow["severity"] = "info";
      let title = "";
      let message = "";

      if (days < 0) {
        stage = "overdue";
        severity = "critical";
        title = `${card.card_name} payment is overdue`;
        message = `${money(remainingDue)} remains unpaid from the latest statement.`;
      } else if (days === 0) {
        stage = "today";
        severity = "warning";
        title = `${card.card_name} is due today`;
        message = `${money(remainingDue)} remains due today.`;
      } else if (days <= 3) {
        stage = "soon";
        severity = "warning";
        title = `${card.card_name} payment is due soon`;
        message = `${money(remainingDue)} remains due in ${days} day${days === 1 ? "" : "s"}.`;
      }

      if (stage) {
        rows.push({
          user_id: userId,
          kind: "credit_card",
          severity,
          title,
          message,
          target_page: "credit-cards",
          target_hash: "credit-cards",
          dedupe_key: `credit-card:${card.id}:${statement.statement_date}:${stage}`,
        });
      }
    }
  }

  if (pref.budget_enabled) {
    const expenses = monthTransactions.filter((tx: any) => tx.type === "expense");
    for (const budget of budgets) {
      const spent = expenses
        .filter((tx: any) => tx.category_id === budget.category_id)
        .reduce((sum: number, tx: any) => sum + Number(tx.amount || 0), 0);
      const limit = Number(budget.amount || 0);
      if (limit <= 0) continue;
      const percent = spent / limit * 100;
      let stage = "";
      let severity: NotificationRow["severity"] = "warning";
      let title = "";
      let message = "";
      const categoryName = categories.get(budget.category_id) || "Category";

      if (percent > 100) {
        stage = "over";
        severity = "critical";
        title = `${categoryName} is over budget`;
        message = `${money(spent)} spent of ${money(limit)} (${percent.toFixed(0)}%).`;
      } else if (percent >= 100) {
        stage = "100";
        severity = "critical";
        title = `${categoryName} budget reached`;
        message = `${money(spent)} of ${money(limit)} has been used.`;
      } else if (percent >= 80) {
        stage = "80";
        title = `${categoryName} budget is ${percent.toFixed(0)}% used`;
        message = `${money(Math.max(0, limit - spent))} remains this month.`;
      }

      if (stage) {
        rows.push({
          user_id: userId,
          kind: "budget",
          severity,
          title,
          message,
          target_page: "budgets",
          target_hash: "budgets",
          dedupe_key: `budget:${budget.id}:${monthStart}:${stage}`,
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
          user_id: userId,
          kind: "goal",
          severity: "success",
          title: `${goal.name} reached 100%`,
          message: `You've reached your ${money(target)} target.`,
          target_page: "goals",
          target_hash: "goals",
          dedupe_key: `goal:${goal.id}:completed`,
        });
        continue;
      }

      if (goal.status !== "active" || !goal.target_date) continue;
      const daysLeft = diffDays(today, goal.target_date);
      if (daysLeft >= 0 && daysLeft <= 7) {
        rows.push({
          user_id: userId,
          kind: "goal",
          severity: daysLeft <= 2 ? "warning" : "info",
          title: `${goal.name} target date is near`,
          message: `${daysLeft === 0 ? "Due today" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`} with ${money(Math.max(0, target - current))} remaining.`,
          target_page: "goals",
          target_hash: "goals",
          dedupe_key: `goal:${goal.id}:${goal.target_date}:due-soon`,
        });
      }

      const createdDate = String(goal.created_at || "").slice(0, 10);
      if (createdDate && createdDate < today && goal.target_date > createdDate) {
        const totalDays = Math.max(1, diffDays(createdDate, goal.target_date));
        const elapsedDays = Math.max(0, diffDays(createdDate, today));
        const expected = Math.min(1, elapsedDays / totalDays);
        if (expected >= 0.25 && progress + 0.20 < expected) {
          rows.push({
            user_id: userId,
            kind: "goal",
            severity: "warning",
            title: `${goal.name} is behind plan`,
            message: `Current progress is ${(progress * 100).toFixed(0)}%; around ${(expected * 100).toFixed(0)}% would keep you on pace.`,
            target_page: "goals",
            target_hash: "goals",
            dedupe_key: `goal:${goal.id}:${today.slice(0, 7)}:behind`,
          });
        }
      }
    }
  }

  if (pref.cashflow_enabled) {
    const opening = accounts.reduce((sum: number, account: any) => sum + Number(account.opening_balance || 0), 0);
    const net = allTransactions.reduce((sum: number, tx: any) => {
      const amount = Number(tx.cash_amount ?? tx.amount ?? 0);
      return sum + (tx.type === "income" ? amount : -amount);
    }, 0);
    const balance = opening + net;
    const upcoming = recurring
      .filter((item: any) => item.type === "expense" && item.next_due_date >= today && item.next_due_date <= next30)
      .reduce((sum: number, item: any) => sum + Number(item.amount || 0), 0);
    const projected = balance - upcoming;

    if (upcoming > 0 && projected < 0) {
      rows.push({
        user_id: userId,
        kind: "cashflow",
        severity: "critical",
        title: "Cash-flow warning",
        message: `${money(upcoming)} in upcoming commitments could take your projected balance to ${money(projected)}.`,
        target_page: "insights",
        target_hash: "insights",
        dedupe_key: `cashflow:${today.slice(0, 7)}:negative-projection`,
      });
    }
  }

  await upsertNotifications(rows);
  return rows.length;
}

async function sendPushForUser(userId: string) {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return { pushed: 0, configured: false };
  }

  const [{ data: subscriptions, error: subError }, { data: notifications, error: claimError }] = await Promise.all([
    service.from("push_subscriptions")
      .select("id,endpoint,p256dh,auth,last_seen_at")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("last_seen_at", { ascending: false }),
    service.rpc("claim_notification_pushes", {
      p_user_id: userId,
      p_limit: 10,
    }),
  ]);

  if (subError) throw subError;
  if (claimError) throw claimError;
  if (!notifications?.length) return { pushed: 0, configured: true };

  if (!subscriptions?.length) {
    await service.from("notifications")
      .update({
        push_claimed_at: null,
        push_last_error: "No active push subscription.",
      })
      .in("id", notifications.map((notification: any) => notification.id));
    return { pushed: 0, configured: true };
  }

  let pushed = 0;

  for (const notification of notifications) {
    let delivered = false;
    const errors: string[] = [];
    const payload = JSON.stringify({
      title: notification.title,
      body: notification.message,
      url: `/#${notification.target_hash || notification.target_page || "dashboard"}`,
      tag: `kira-${notification.id}`,
      severity: notification.severity,
    });

    for (const sub of subscriptions) {
      try {
        await webpush.sendNotification({
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        }, payload, { TTL: 3600 });

        delivered = true;
        await service.from("push_subscriptions")
          .update({
            last_success_at: new Date().toISOString(),
            failure_count: 0,
          })
          .eq("id", sub.id);
      } catch (error: any) {
        const status = Number(error?.statusCode || 0);
        const message = String(error?.message || `Push error ${status || "unknown"}`).slice(0, 500);
        errors.push(message);

        const patch: Record<string, unknown> = {
          last_failure_at: new Date().toISOString(),
          failure_count: 1,
        };

        const { data: current } = await service.from("push_subscriptions")
          .select("failure_count")
          .eq("id", sub.id)
          .maybeSingle();

        patch.failure_count = Number(current?.failure_count || 0) + 1;

        if (status === 404 || status === 410) {
          patch.is_active = false;
          patch.updated_at = new Date().toISOString();
        }

        await service.from("push_subscriptions")
          .update(patch)
          .eq("id", sub.id);

        if (status !== 404 && status !== 410) {
          console.error("Push delivery failed", error);
        }
      }
    }

    if (delivered) {
      pushed += 1;
      await service.from("notifications")
        .update({
          push_sent_at: new Date().toISOString(),
          push_claimed_at: null,
          push_last_error: null,
        })
        .eq("id", notification.id);
    } else {
      await service.from("notifications")
        .update({
          push_claimed_at: null,
          push_last_error: (errors.join(" | ") || "No push endpoint accepted the notification.").slice(0, 1000),
        })
        .eq("id", notification.id);
    }
  }

  return { pushed, configured: true };
}

async function processUser(userId: string, pref: any) {
  const generated = await buildAlertsForUser(userId, pref);
  const pushResult = pref.push_enabled
    ? await sendPushForUser(userId)
    : { pushed: 0, configured: Boolean(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) };
  return { user_id: userId, generated, ...pushResult };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, error: "Method not allowed." }, 405);

  let body: any = {};
  try { body = await req.json(); } catch { body = {}; }

  const mode = body?.mode === "cron"
    ? "cron"
    : body?.mode === "push"
      ? "push"
      : body?.mode === "test"
        ? "test"
        : "manual";

  try {
    if (mode === "cron") {
      const allowed = await authenticateCron(req);
      if (!allowed) return json({ ok: false, error: "Unauthorized scheduler request." }, 401);

      const { data: preferences, error } = await service
        .from("notification_preferences")
        .select("*");
      if (error) throw error;

      const results = [];
      for (const pref of preferences ?? []) {
        results.push(await processUser(pref.user_id, pref));
      }

      return json({ ok: true, checked: preferences?.length ?? 0, results });
    }

    if (mode === "push") {
      const allowed = await authenticateCron(req);
      if (!allowed) return json({ ok: false, error: "Unauthorized push request." }, 401);

      const userId = typeof body?.user_id === "string" ? body.user_id : "";
      if (!/^[0-9a-f-]{36}$/i.test(userId)) {
        return json({ ok: false, error: "Invalid user." }, 400);
      }

      const { data: pref, error: prefError } = await service
        .from("notification_preferences")
        .select("push_enabled")
        .eq("user_id", userId)
        .maybeSingle();
      if (prefError) throw prefError;

      if (!pref?.push_enabled) {
        return json({ ok: true, pushed: 0, configured: Boolean(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY), skipped: "push-disabled" });
      }

      return json({ ok: true, ...(await sendPushForUser(userId)) });
    }

    const user = await authenticateManual(req);
    if (!user) return json({ ok: false, error: "Unauthorized." }, 401);

    let { data: pref, error: prefError } = await service
      .from("notification_preferences")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    if (prefError) throw prefError;

    if (!pref) {
      const created = await service
        .from("notification_preferences")
        .insert({ user_id: user.id })
        .select("*")
        .single();
      if (created.error) throw created.error;
      pref = created.data;
    }

    if (mode === "test") {
      await upsertNotifications([{
        user_id: user.id,
        kind: "system",
        severity: "success",
        title: "Kira notifications are working",
        message: "You'll receive reminders and financial alerts based on your preferences.",
        target_page: "dashboard",
        target_hash: "dashboard",
        dedupe_key: `system:test:${Date.now()}`,
      }]);
      const push = pref.push_enabled
        ? await sendPushForUser(user.id)
        : { pushed: 0, configured: Boolean(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) };
      return json({ ok: true, ...push });
    }

    return json({ ok: true, ...(await processUser(user.id, pref)) });
  } catch (error) {
    console.error("notification-dispatch failed", error);
    return json({
      ok: false,
      error: error instanceof Error ? error.message : "Notification processing failed.",
    }, 500);
  }
});
