
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as XLSX from "npm:xlsx@0.18.5";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY") ?? "";
const BREVO_FROM_EMAIL = Deno.env.get("BREVO_FROM_EMAIL") ?? "";
const BREVO_FROM_NAME = Deno.env.get("BREVO_FROM_NAME") ?? "Kira";

const service = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function money(value: number) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toBase64Bytes(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function isoDate(date: Date) {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

function addDays(dateText: string, days: number) {
  const date = new Date(dateText + "T00:00:00Z");
  date.setUTCDate(date.getUTCDate() + days);
  return isoDate(date);
}

function addMonths(monthStart: string, offset: number) {
  const date = new Date(monthStart + "T00:00:00Z");
  date.setUTCMonth(date.getUTCMonth() + offset);
  date.setUTCDate(1);
  return isoDate(date);
}

function localParts(timeZone: string, date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const map: Record<string, string> = {};
  for (const part of parts) map[part.type] = part.value;

  const weekdayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };

  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    weekday: weekdayMap[map.weekday],
    hour: Number(map.hour),
    minute: Number(map.minute),
    localDate: map.year + "-" + map.month + "-" + map.day,
  };
}

function localDateOf(timestamp: string | null, timeZone: string) {
  if (!timestamp) return null;
  return localParts(timeZone, new Date(timestamp)).localDate;
}

function preferenceDue(pref: any) {
  const now = localParts(pref.timezone || "Asia/Kuala_Lumpur");
  const [targetHour, targetMinute] = String(pref.send_time || "08:00")
    .split(":")
    .map(Number);

  const nowMinutes = now.hour * 60 + now.minute;
  const targetMinutes = targetHour * 60 + targetMinute;

  if (nowMinutes < targetMinutes || nowMinutes >= targetMinutes + 5) return false;

  if (localDateOf(pref.last_sent_at, pref.timezone) === now.localDate) return false;

  if (pref.frequency === "weekly") {
    return Number(pref.day_of_week) === now.weekday;
  }

  return Number(pref.day_of_month) === now.day;
}

function periodFor(pref: any, manualMonthStart?: string | null) {
  if (manualMonthStart && /^\d{4}-\d{2}-01$/.test(manualMonthStart)) {
    return {
      start: manualMonthStart,
      end: addMonths(manualMonthStart, 1),
      label: new Intl.DateTimeFormat("en-MY", { month: "long", year: "numeric", timeZone: "UTC" })
        .format(new Date(manualMonthStart + "T00:00:00Z")),
    };
  }

  const parts = localParts(pref.timezone || "Asia/Kuala_Lumpur");

  if (pref.frequency === "weekly") {
    const today = `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
    const start = addDays(today, -7);
    return {
      start,
      end: today,
      label: `${start} to ${addDays(today, -1)}`,
    };
  }

  const currentMonth = `${parts.year}-${String(parts.month).padStart(2, "0")}-01`;
  const start = addMonths(currentMonth, -1);
  return {
    start,
    end: currentMonth,
    label: new Intl.DateTimeFormat("en-MY", { month: "long", year: "numeric", timeZone: "UTC" })
      .format(new Date(start + "T00:00:00Z")),
  };
}

async function authenticateManual(req: Request) {
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) return null;

  const client = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false },
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


function buildInsight(income: number, expenses: number, net: number) {
  if (income === 0 && expenses === 0) return "No financial activity was recorded for this period.";
  if (net > 0) return `You finished this period with a positive cash flow of ${money(net)}.`;
  if (net < 0) return `You spent ${money(Math.abs(net))} more than you earned during this period.`;
  return "Your income and expenses were balanced for this period.";
}

function buildExcelWorkbook(data: any) {
  const wb = XLSX.utils.book_new();

  const summarySheet = XLSX.utils.aoa_to_sheet([
    ["Kira Report", data.period.label],
    [],
    ["Metric", "Amount"],
    ["Total Income", data.income],
    ["Total Expenses", data.expenses],
    ["Net Cash Flow", data.net],
    ["Transactions", data.transactions.length],
  ]);
  summarySheet["!cols"] = [{ wch: 24 }, { wch: 18 }];
  XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");

  const transactionSheet = XLSX.utils.json_to_sheet(
    data.transactions.map((tx: any) => ({
      Date: tx.transaction_date,
      Type: tx.type,
      Description: tx.description,
      Account: data.accounts.get(tx.account_id) || "",
      "Payment Method": data.paymentMethods.get(tx.payment_method_id) || "",
      "Category / Income Source":
        tx.type === "expense"
          ? data.categories.get(tx.category_id) || ""
          : data.sources.get(tx.income_source_id) || "",
      Amount: Number(tx.amount || 0),
      Notes: tx.notes || "",
      Recurring: tx.recurring_id ? "Yes" : "No",
    })),
  );
  transactionSheet["!cols"] = [
    { wch: 14 }, { wch: 10 }, { wch: 28 }, { wch: 18 },
    { wch: 20 }, { wch: 24 }, { wch: 14 }, { wch: 30 }, { wch: 10 },
  ];
  XLSX.utils.book_append_sheet(wb, transactionSheet, "Transactions");

  const categorySheet = XLSX.utils.json_to_sheet(
    data.topCategories.map(([name, amount]: [string, number]) => ({
      Category: name,
      Amount: amount,
      "Share %":
        data.expenses > 0
          ? Number(((amount / data.expenses) * 100).toFixed(1))
          : 0,
    })),
  );
  categorySheet["!cols"] = [{ wch: 24 }, { wch: 14 }, { wch: 12 }];
  XLSX.utils.book_append_sheet(wb, categorySheet, "Category Breakdown");

  const budgetSheet = XLSX.utils.json_to_sheet(
    data.budgetRows.map((row: any) => ({
      Category: row.category,
      Budget: row.limit,
      Spent: row.spent,
      Remaining: row.limit - row.spent,
      "Used %":
        row.limit > 0
          ? Number(((row.spent / row.limit) * 100).toFixed(1))
          : 0,
    })),
  );
  budgetSheet["!cols"] = [
    { wch: 24 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 12 },
  ];
  XLSX.utils.book_append_sheet(wb, budgetSheet, "Budget Performance");

  const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" }) as ArrayBuffer;
  return new Uint8Array(buffer);
}

async function buildReport(userId: string, pref: any, manualMonthStart?: string | null) {
  const period = periodFor(pref, manualMonthStart);

  const [txRes, accountsRes, categoriesRes, sourcesRes, paymentMethodsRes, budgetsRes] = await Promise.all([
    service
      .from("transactions")
      .select("id,account_id,payment_method_id,category_id,income_source_id,description,notes,amount,type,transaction_date,recurring_id")
      .eq("user_id", userId)
      .is("deleted_at", null)
      .gte("transaction_date", period.start)
      .lt("transaction_date", period.end)
      .order("transaction_date", { ascending: true }),
    service.from("accounts").select("id,name").eq("user_id", userId),
    service.from("categories").select("id,name").eq("user_id", userId),
    service.from("income_sources").select("id,name").eq("user_id", userId),
    service.from("payment_methods").select("id,name").eq("user_id", userId),
    service.from("budgets").select("category_id,amount,month_start").eq("user_id", userId)
      .gte("month_start", period.start).lt("month_start", period.end),
  ]);

  for (const response of [txRes, accountsRes, categoriesRes, sourcesRes, paymentMethodsRes, budgetsRes]) {
    if (response.error) throw response.error;
  }

  const transactions = txRes.data ?? [];
  const accounts = new Map((accountsRes.data ?? []).map((x: any) => [x.id, x.name]));
  const categories = new Map((categoriesRes.data ?? []).map((x: any) => [x.id, x.name]));
  const sources = new Map((sourcesRes.data ?? []).map((x: any) => [x.id, x.name]));
  const paymentMethods = new Map((paymentMethodsRes.data ?? []).map((x: any) => [x.id, x.name]));

  let income = 0;
  let expenses = 0;
  const categoryTotals = new Map<string, number>();

  for (const tx of transactions) {
    const amount = Number(tx.amount || 0);
    if (tx.type === "income") {
      income += amount;
    } else {
      expenses += amount;
      const category = categories.get(tx.category_id) || "Uncategorized";
      categoryTotals.set(category, (categoryTotals.get(category) || 0) + amount);
    }
  }

  const net = income - expenses;
  const topCategories = [...categoryTotals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5) as [string, number][];

  const budgetRows = (budgetsRes.data ?? []).map((budget: any) => {
    const category = categories.get(budget.category_id) || "Unknown Category";
    const spent = categoryTotals.get(category) || 0;
    return { category, limit: Number(budget.amount || 0), spent };
  }).sort((a: any, b: any) =>
    (b.limit ? b.spent / b.limit : 0) - (a.limit ? a.spent / a.limit : 0)
  );

  const insight = buildInsight(income, expenses, net);

  const categoryRowsHtml = topCategories.length
    ? topCategories.map(([name, amount], index) => {
        const share = expenses > 0 ? ((amount / expenses) * 100).toFixed(1) : "0.0";
        return `<tr><td style="padding:12px 0;border-bottom:1px solid #eef2f7;color:#111827;font-size:14px;font-weight:600;">${index + 1}. ${escapeHtml(name)}</td><td style="padding:12px 0;border-bottom:1px solid #eef2f7;color:#64748b;font-size:12px;text-align:right;">${share}%</td><td style="padding:12px 0 12px 16px;border-bottom:1px solid #eef2f7;color:#111827;font-size:14px;font-weight:700;text-align:right;white-space:nowrap;">${escapeHtml(money(amount))}</td></tr>`;
      }).join("")
    : '<tr><td colspan="3" style="padding:16px 0;color:#94a3b8;font-size:13px;">No expense categories were recorded for this period.</td></tr>';

  const budgetRowsHtml = budgetRows.length
    ? budgetRows.slice(0, 5).map((row: any) => {
        const pct = row.limit > 0 ? (row.spent / row.limit) * 100 : 0;
        return `<tr><td style="padding:12px 0;border-bottom:1px solid #eef2f7;color:#111827;font-size:14px;font-weight:600;">${escapeHtml(row.category)}</td><td style="padding:12px 0;border-bottom:1px solid #eef2f7;color:#64748b;font-size:12px;text-align:right;">${pct.toFixed(1)}%</td><td style="padding:12px 0 12px 16px;border-bottom:1px solid #eef2f7;color:#111827;font-size:14px;font-weight:700;text-align:right;white-space:nowrap;">${escapeHtml(money(row.spent))} / ${escapeHtml(money(row.limit))}</td></tr>`;
      }).join("")
    : '<tr><td colspan="3" style="padding:16px 0;color:#94a3b8;font-size:13px;">No category budgets were set for this period.</td></tr>';

  const transactionRowsHtml = transactions.slice(-12).reverse().map((tx: any) => {
    const account = accounts.get(tx.account_id) || "Unknown Account";
    const label = tx.type === "expense"
      ? categories.get(tx.category_id) || "Uncategorized"
      : sources.get(tx.income_source_id) || "Other Income";
    const paymentMethod = paymentMethods.get(tx.payment_method_id) || "";
    const signed = tx.type === "income" ? "+" : "-";
    const color = tx.type === "income" ? "#15803d" : "#b42318";
    const meta = [tx.transaction_date, account, label, paymentMethod].filter(Boolean).join(" · ");
    return `<tr><td style="padding:12px 0;border-bottom:1px solid #eef2f7;vertical-align:top;"><div style="color:#111827;font-size:14px;font-weight:600;line-height:1.4;">${escapeHtml(tx.description)}</div><div style="margin-top:3px;color:#94a3b8;font-size:11px;line-height:1.4;">${escapeHtml(meta)}</div></td><td style="padding:12px 0 12px 16px;border-bottom:1px solid #eef2f7;color:${color};font-size:14px;font-weight:700;text-align:right;vertical-align:top;white-space:nowrap;">${signed}${escapeHtml(money(Number(tx.amount)))}</td></tr>`;
  }).join("");

  const html = `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light"></head><body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#111827;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f4f6f8;"><tr><td align="center" style="padding:28px 14px;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;background:#ffffff;border:1px solid #e5e7eb;border-radius:18px;overflow:hidden;">
  <tr><td style="padding:26px 28px 24px;background:#111827;color:#ffffff;"><div style="font-size:11px;font-weight:700;letter-spacing:1.4px;color:#cbd5e1;">KIRA</div><div style="margin-top:10px;font-size:26px;font-weight:800;line-height:1.2;">${escapeHtml(pref.frequency === "weekly" ? "Weekly Finance Report" : "Monthly Finance Report")}</div><div style="margin-top:7px;font-size:14px;color:#cbd5e1;">${escapeHtml(period.label)}</div></td></tr>
  <tr><td style="padding:26px 28px 8px;"><div style="font-size:15px;line-height:1.7;color:#334155;">Hi,</div><div style="margin-top:8px;font-size:15px;line-height:1.7;color:#334155;">Here’s your Kira finance summary for <strong>${escapeHtml(period.label)}</strong>. It highlights your income, spending, cash flow, budget performance and recent transactions.</div></td></tr>
  <tr><td style="padding:16px 28px 0;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
    <td width="33.33%" style="padding:0 5px 0 0;vertical-align:top;"><div style="border:1px solid #e5e7eb;border-radius:14px;padding:15px;"><div style="font-size:11px;color:#64748b;">Income</div><div style="margin-top:6px;font-size:19px;font-weight:800;color:#15803d;">${escapeHtml(money(income))}</div></div></td>
    <td width="33.33%" style="padding:0 3px;vertical-align:top;"><div style="border:1px solid #e5e7eb;border-radius:14px;padding:15px;"><div style="font-size:11px;color:#64748b;">Expenses</div><div style="margin-top:6px;font-size:19px;font-weight:800;color:#b42318;">${escapeHtml(money(expenses))}</div></div></td>
    <td width="33.33%" style="padding:0 0 0 5px;vertical-align:top;"><div style="border:1px solid #e5e7eb;border-radius:14px;padding:15px;"><div style="font-size:11px;color:#64748b;">Net</div><div style="margin-top:6px;font-size:19px;font-weight:800;color:${net >= 0 ? "#15803d" : "#b42318"};">${escapeHtml(money(net))}</div></div></td>
  </tr></table></td></tr>
  <tr><td style="padding:14px 28px 0;"><div style="border-radius:14px;background:#f8fafc;padding:16px 18px;"><div style="font-size:11px;font-weight:700;letter-spacing:.5px;color:#64748b;">THIS PERIOD</div><div style="margin-top:6px;font-size:15px;line-height:1.6;color:#111827;">${escapeHtml(insight)}</div><div style="margin-top:5px;font-size:12px;color:#94a3b8;">${transactions.length} transaction${transactions.length === 1 ? "" : "s"} recorded</div></div></td></tr>
  <tr><td style="padding:24px 28px 0;"><div style="font-size:16px;font-weight:800;color:#111827;">Top Expense Categories</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:8px;">${categoryRowsHtml}</table></td></tr>
  <tr><td style="padding:24px 28px 0;"><div style="font-size:16px;font-weight:800;color:#111827;">Budget Performance</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:8px;">${budgetRowsHtml}</table></td></tr>
  <tr><td style="padding:24px 28px 0;"><div style="font-size:16px;font-weight:800;color:#111827;">Recent Transactions</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:8px;">${transactionRowsHtml || '<tr><td style="padding:16px 0;color:#94a3b8;font-size:13px;">No transactions were recorded for this period.</td></tr>'}</table></td></tr>
  <tr><td style="padding:28px 28px 8px;"><div style="font-size:14px;line-height:1.7;color:#334155;">That’s your Kira finance summary for this period. Keep your transactions and budgets updated so your next report stays accurate.</div><div style="margin-top:18px;font-size:14px;line-height:1.6;color:#111827;">Regards,<br><strong>Kira</strong><br><span style="color:#94a3b8;">Your personal finance companion</span></div></td></tr>
  <tr><td style="padding:20px 28px 26px;"><div style="border-top:1px solid #eef2f7;padding-top:16px;font-size:11px;line-height:1.6;color:#94a3b8;text-align:center;">This Kira report was generated automatically from your recorded finance data.</div></td></tr>
  </table></td></tr></table></body></html>`;

  const workbookBytes = buildExcelWorkbook({
    period, transactions, accounts, categories, sources, paymentMethods,
    income, expenses, net, topCategories, budgetRows,
  });

  return {
    period,
    subject: `Kira — ${period.label} Finance Report`,
    html,
    workbookBytes,
    summary: { income, expenses, net, count: transactions.length },
  };
}

async function sendEmail(pref: any, report: any) {
  if (!BREVO_API_KEY || !BREVO_FROM_EMAIL) {
    throw new Error(
      "Brevo is not fully configured. Add BREVO_API_KEY and BREVO_FROM_EMAIL in Supabase Edge Function secrets."
    );
  }

  const payload: Record<string, unknown> = {
    sender: {
      name: BREVO_FROM_NAME,
      email: BREVO_FROM_EMAIL,
    },
    to: [{
      email: pref.recipient_email,
    }],
    subject: report.subject,
    htmlContent: report.html,
  };

  if (pref.include_excel) {
    payload.attachment = [{
      name: `my-finance-${report.period.start}.xlsx`,
      content: toBase64Bytes(report.workbookBytes),
    }];
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": BREVO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      body?.message ||
      body?.code ||
      `Brevo returned ${response.status}`
    );
  }

  return {
    id: body?.messageId ?? null,
    provider: "brevo",
  };
}


async function processPreference(pref: any, manualMonthStart?: string | null) {
  try {
    const report = await buildReport(pref.user_id, pref, manualMonthStart);
    const provider = await sendEmail(pref, report);

    await service
      .from("report_email_preferences")
      .update({
        last_sent_at: new Date().toISOString(),
        last_error: null,
      })
      .eq("id", pref.id);

    return {
      ok: true,
      recipient: pref.recipient_email,
      provider_id: provider?.id ?? null,
      summary: report.summary,
      period: report.period,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    await service
      .from("report_email_preferences")
      .update({
        last_error: message,
      })
      .eq("id", pref.id);

    return {
      ok: false,
      recipient: pref.recipient_email,
      error: message,
    };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const mode = body?.mode === "cron" ? "cron" : "manual";

  if (mode === "cron") {
    const cronAllowed = await authenticateCron(req);
    if (!cronAllowed) return json({ error: "Unauthorized scheduler request" }, 401);

    const { data: preferences, error } = await service
      .from("report_email_preferences")
      .select("*")
      .eq("enabled", true);

    if (error) return json({ error: error.message }, 500);

    const due = (preferences ?? []).filter(preferenceDue);
    const results = [];

    for (const pref of due) {
      results.push(await processPreference(pref));
    }

    return json({
      ok: true,
      checked: preferences?.length ?? 0,
      due: due.length,
      results,
    });
  }

  const user = await authenticateManual(req);
  if (!user) return json({ error: "Unauthorized" }, 401);

  const { data: pref, error } = await service
    .from("report_email_preferences")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) return json({ error: error.message }, 500);
  if (!pref) return json({ error: "Save your email report settings first." }, 400);

  const manualMonthStart =
    typeof body?.month_start === "string" ? body.month_start : null;

  const result = await processPreference(pref, manualMonthStart);

  if (!result.ok) return json(result, 503);
  return json(result);
});
