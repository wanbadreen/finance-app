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
    result.push(
      items.slice(index, index + size),
    );
  }

  return result;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return json(
      {
        ok: false,
        error: "Method not allowed.",
      },
      405,
    );
  }

  try {
    const body = await req.json().catch(() => ({}));

    if (body?.confirmation !== "DELETE") {
      return json(
        {
          ok: false,
          error: "Deletion confirmation is required.",
        },
        400,
      );
    }

    const authHeader =
      req.headers.get("Authorization") ?? "";

    const accessToken =
      authHeader.startsWith("Bearer ")
        ? authHeader.slice(7).trim()
        : "";

    if (!accessToken) {
      return json(
        {
          ok: false,
          error: "Missing authenticated session.",
        },
        401,
      );
    }

    const supabaseUrl =
      Deno.env.get("SUPABASE_URL");

    const serviceRoleKey =
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      return json(
        {
          ok: false,
          error: "Server configuration is incomplete.",
        },
        500,
      );
    }

    const admin =
      createClient(
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
    } =
      await admin.auth.getUser(
        accessToken,
      );

    const user =
      userData?.user;

    if (userError || !user) {
      return json(
        {
          ok: false,
          error: "Invalid or expired session.",
        },
        401,
      );
    }

    const userId =
      user.id;

    // Get transaction IDs and receipt paths before deleting rows.
    const {
      data: transactionRows,
      error: transactionReadError,
    } =
      await admin
        .from("transactions")
        .select("id, receipt_path")
        .eq("user_id", userId);

    if (transactionReadError) {
      throw transactionReadError;
    }

    const transactionIds =
      (transactionRows ?? [])
        .map((row: any) => row.id)
        .filter(Boolean);

    const receiptPaths =
      (transactionRows ?? [])
        .map((row: any) => row.receipt_path)
        .filter(Boolean);

    // Remove receipt files owned by the user.
    for (const paths of chunk(receiptPaths, 100)) {
      if (!paths.length) {
        continue;
      }

      const {
        error,
      } =
        await admin.storage
          .from("receipts")
          .remove(paths);

      if (error) {
        throw error;
      }
    }

    // transaction_tags does not have user_id, so delete by transaction IDs.
    for (const ids of chunk(transactionIds, 100)) {
      if (!ids.length) {
        continue;
      }

      const {
        error,
      } =
        await admin
          .from("transaction_tags")
          .delete()
          .in("transaction_id", ids);

      if (error) {
        throw error;
      }
    }

    const userOwnedTables = [
      "recurring_occurrence_statuses",
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
      const {
        error,
      } =
        await admin
          .from(table)
          .delete()
          .eq("user_id", userId);

      if (error) {
        throw error;
      }
    }

    const {
      error: deleteUserError,
    } =
      await admin.auth.admin.deleteUser(
        userId,
      );

    if (deleteUserError) {
      throw deleteUserError;
    }

    return json({
      ok: true,
    });
  } catch (error) {
    console.error(
      "delete-my-account failed",
      error,
    );

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
