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
  const { data, error } = await service
    .from("report_scheduler_config")
    .select("secret")
    .eq("id", true)
    .maybeSingle();
  if (error || !data?.secret) return false;
  return supplied === data.secret;
}

type NotificationRow = {
  user_id: string;
  kind: "recurring" | "budget" | "goal" | "cashflow" | "system";
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

  const [recurringRes, budgetRes, monthTxRes, allTxRes, goalRes, accountRes, categoryRes] = await Promise.all([
    service.from("recurring_transactions")
      .select("id,name,type,amount,next_due_date,is_active,reminder_enabled,reminder_days_before")
      .eq("user_id", userId).eq("is_active", true),
    service.from("budgets")
      .select("id,category_id,amount,month_start")
      .eq("user_id", userId).eq("month_start", monthStart),
    service.from("transactions")
      .select("id,category_id,amount,type,transaction_date")
      .eq("user_id", userId).is("deleted_at", null)
      .gte("transaction_date", monthStart).lt("transaction_date", monthEnd),
    service.from("transactions")
      .select("id,amount,type")
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
  ]);

  for (const response of [recurringRes, budgetRes, monthTxRes, allTxRes, goalRes, accountRes, categoryRes]) {
    if (response.error) throw response.error;
  }

  const recurring = recurringRes.data ?? [];
  const budgets = budgetRes.data ?? [];
  const monthTransactions = monthTxRes.data ?? [];
  const allTransactions = allTxRes.data ?? [];
  const goals = goalRes.data ?? [];
  const accounts = accountRes.data ?? [];
  const categories = new Map((categoryRes.data ?? []).map((row: any) => [row.id, row.name]));
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
      const amount = Number(tx.amount || 0);
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

  const [{ data: subscriptions, error: subError }, { data: notifications, error: notificationError }] = await Promise.all([
    service.from("push_subscriptions")
      .select("id,endpoint,p256dh,auth")
      .eq("user_id", userId).eq("is_active", true),
    service.from("notifications")
      .select("id,title,message,target_hash,target_page,severity,created_at")
      .eq("user_id", userId)
      .is("dismissed_at", null)
      .is("push_sent_at", null)
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: true })
      .limit(10),
  ]);

  if (subError) throw subError;
  if (notificationError) throw notificationError;
  if (!subscriptions?.length || !notifications?.length) return { pushed: 0, configured: true };

  let pushed = 0;
  for (const notification of notifications) {
    let delivered = false;
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
      } catch (error: any) {
        const status = Number(error?.statusCode || 0);
        if (status === 404 || status === 410) {
          await service.from("push_subscriptions")
            .update({ is_active: false, updated_at: new Date().toISOString() })
            .eq("id", sub.id);
        } else {
          console.error("Push delivery failed", error);
        }
      }
    }

    if (delivered) {
      pushed += 1;
      await service.from("notifications")
        .update({ push_sent_at: new Date().toISOString() })
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

  const mode = body?.mode === "cron" ? "cron" : body?.mode === "test" ? "test" : "manual";

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
