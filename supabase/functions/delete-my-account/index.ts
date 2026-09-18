import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    },
  );
}

function chunk<T>(items: T[], size = 100) {
  const result: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }

  return result;
}

async function listAllReceiptPaths(
  admin: ReturnType<typeof createClient>,
  userId: string,
) {
  const paths: string[] = [];
  const folders = [userId];

  while (folders.length) {
    const folder = folders.shift();
    if (!folder) continue;

    let offset = 0;

    while (true) {
      const { data, error } = await admin.storage
        .from("receipts")
        .list(folder, {
          limit: 100,
          offset,
          sortBy: {
            column: "name",
            order: "asc",
          },
        });

      if (error) throw error;

      const entries = data ?? [];

      for (const entry of entries) {
        const fullPath = `${folder}/${entry.name}`;

        // Storage folders are virtual list entries without an object id.
        // Real files have an id and must be explicitly removed.
        if (entry.id) {
          paths.push(fullPath);
        } else {
          folders.push(fullPath);
        }
      }

      if (entries.length < 100) {
        break;
      }

      offset += entries.length;
    }
  }

  return paths;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ ok: false, error: "Method not allowed." }, 405);
  }

  try {
    const body = await req.json().catch(() => ({}));

    if (body?.confirmation !== "DELETE") {
      return json({ ok: false, error: "Deletion confirmation is required." }, 400);
    }

    const authHeader = req.headers.get("Authorization") ?? "";
    const accessToken = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : "";

    if (!accessToken) {
      return json({ ok: false, error: "Missing authenticated session." }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return json({ ok: false, error: "Server configuration is incomplete." }, 500);
    }

    const admin = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    const {
      data: userData,
      error: userError,
    } = await admin.auth.getUser(accessToken);

    const user = userData?.user;

    if (userError || !user) {
      return json({ ok: false, error: "Invalid or expired session." }, 401);
    }

    const userId = user.id;

    // Preflight the destructive work before revoking sessions so a read/list
    // failure does not unexpectedly sign the user out.
    const [receiptPaths, transactionResult] = await Promise.all([
      listAllReceiptPaths(admin, userId),
      admin
        .from("transactions")
        .select("id")
        .eq("user_id", userId),
    ]);

    if (transactionResult.error) {
      throw transactionResult.error;
    }

    const transactionIds = (transactionResult.data ?? [])
      .map((row: any) => row.id)
      .filter(Boolean);

    // Revoke refresh tokens for every active session before deleting the
    // account. Supabase access-token JWTs remain valid until their normal
    // expiry, so the client also clears its local session after success.
    const { error: signOutError } = await admin.auth.admin.signOut(
      accessToken,
      "global",
    );

    if (signOutError) {
      throw signOutError;
    }

    // Remove every object under the user's receipt folder, not only receipt
    // paths currently referenced by transaction rows. This also clears any
    // orphan created by an interrupted historical save.
    for (const paths of chunk(receiptPaths, 100)) {
      if (!paths.length) continue;

      const { error } = await admin.storage
        .from("receipts")
        .remove(paths);

      if (error) throw error;
    }

    for (const ids of chunk(transactionIds, 100)) {
      if (!ids.length) continue;

      const { error } = await admin
        .from("transaction_tags")
        .delete()
        .in("transaction_id", ids);

      if (error) throw error;
    }

    const userOwnedTables = [
      "recurring_occurrence_statuses",
      "notifications",
      "push_subscriptions",
      "notification_preferences",
      "user_onboarding",
      "transactions",
      "budgets",
      "savings_goals",
      "recurring_transactions",
      "report_email_preferences",
      "tags",
      "income_sources",
      "categories",
      "accounts",
    ];

    for (const table of userOwnedTables) {
      const { error } = await admin
        .from(table)
        .delete()
        .eq("user_id", userId);

      if (error) throw error;
    }

    const {
      error: deleteUserError,
    } = await admin.auth.admin.deleteUser(userId);

    if (deleteUserError) {
      throw deleteUserError;
    }

    return json({
      ok: true,
      deleted_receipts: receiptPaths.length,
    });
  } catch (error) {
    console.error("delete-my-account failed", error);

    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Account deletion failed.",
      },
      500,
    );
  }
});
