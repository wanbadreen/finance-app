import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MAX_DATA_URL_LENGTH = 4_500_000;

function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
) {
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

function extractOutputText(
  response: Record<string, unknown>,
): string | null {
  if (
    typeof response.output_text ===
    "string"
  ) {
    return response.output_text;
  }

  const output =
    Array.isArray(response.output)
      ? response.output
      : [];

  for (const item of output) {
    if (
      !item ||
      typeof item !== "object"
    ) {
      continue;
    }

    const content =
      Array.isArray(
        (item as Record<string, unknown>)
          .content,
      )
        ? (
          item as Record<string, unknown>
        ).content as unknown[]
        : [];

    for (const part of content) {
      if (
        !part ||
        typeof part !== "object"
      ) {
        continue;
      }

      const text =
        (part as Record<string, unknown>)
          .text;

      if (typeof text === "string") {
        return text;
      }
    }
  }

  return null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(
      "ok",
      {
        headers: corsHeaders,
      },
    );
  }

  if (req.method !== "POST") {
    return jsonResponse(
      {
        error:
          "Method not allowed.",
      },
      405,
    );
  }

  const apiKey =
    Deno.env.get(
      "OPENAI_API_KEY",
    );

  if (!apiKey) {
    return jsonResponse(
      {
        error:
          "AI fallback is not configured yet. Add OPENAI_API_KEY to Supabase Edge Function secrets.",
        code:
          "AI_NOT_CONFIGURED",
      },
      503,
    );
  }

  try {
    const body =
      await req.json();

    const imageDataUrl =
      typeof body?.image_data_url ===
      "string"
        ? body.image_data_url
        : "";

    if (
      !/^data:image\/(?:jpeg|png|webp);base64,/i
        .test(imageDataUrl)
    ) {
      return jsonResponse(
        {
          error:
            "A JPG, PNG or WebP receipt image is required.",
        },
        400,
      );
    }

    if (
      imageDataUrl.length >
      MAX_DATA_URL_LENGTH
    ) {
      return jsonResponse(
        {
          error:
            "Receipt image is too large for AI review.",
        },
        413,
      );
    }

    const localResult =
      body?.local_result &&
      typeof body.local_result ===
        "object"
        ? body.local_result
        : {};

    const prompt =
      [
        "Extract the purchase information from this Malaysian receipt.",
        "Return the merchant/store name, final amount actually charged/paid, and transaction date.",
        "For amount, prefer Grand Total, Nett Total, Total Sales, Total, or the final card/payment amount.",
        "Do not use an individual item price, subtotal if a stronger final total exists, change, rounding, tax, loyalty balance, card number, or invoice number.",
        "For date, use the purchase/transaction/invoice date, never a card expiry date.",
        "Return date as YYYY-MM-DD.",
        "If a value genuinely cannot be determined, return null for that field.",
        "Confidence is your confidence in the extracted three fields overall, from 0 to 100.",
        "The app's local OCR produced these tentative hints; use them only as clues and correct them if the image disagrees:",
        JSON.stringify(localResult),
      ].join("\n");

    const openAiResponse =
      await fetch(
        "https://api.openai.com/v1/responses",
        {
          method:
            "POST",
          headers: {
            "Authorization":
              `Bearer ${apiKey}`,
            "Content-Type":
              "application/json",
          },
          body:
            JSON.stringify({
              model:
                "gpt-5.6-luna",
              store:
                false,
              input: [
                {
                  role:
                    "user",
                  content: [
                    {
                      type:
                        "input_text",
                      text:
                        prompt,
                    },
                    {
                      type:
                        "input_image",
                      image_url:
                        imageDataUrl,
                      detail:
                        "high",
                    },
                  ],
                },
              ],
              text: {
                format: {
                  type:
                    "json_schema",
                  name:
                    "receipt_extraction",
                  strict:
                    true,
                  schema: {
                    type:
                      "object",
                    properties: {
                      merchant: {
                        type: [
                          "string",
                          "null",
                        ],
                      },
                      amount: {
                        type: [
                          "number",
                          "null",
                        ],
                      },
                      date: {
                        type: [
                          "string",
                          "null",
                        ],
                      },
                      confidence: {
                        type:
                          "number",
                        minimum:
                          0,
                        maximum:
                          100,
                      },
                    },
                    required: [
                      "merchant",
                      "amount",
                      "date",
                      "confidence",
                    ],
                    additionalProperties:
                      false,
                  },
                },
                verbosity:
                  "low",
              },
            }),
        },
      );

    const responseJson =
      await openAiResponse
        .json();

    if (!openAiResponse.ok) {
      const message =
        responseJson?.error
          ?.message ||
        "OpenAI API request failed.";

      return jsonResponse(
        {
          error:
            message,
          code:
            "OPENAI_ERROR",
        },
        openAiResponse.status,
      );
    }

    const outputText =
      extractOutputText(
        responseJson,
      );

    if (!outputText) {
      return jsonResponse(
        {
          error:
            "AI returned no structured receipt result.",
        },
        502,
      );
    }

    let result;

    try {
      result =
        JSON.parse(
          outputText,
        );
    } catch {
      return jsonResponse(
        {
          error:
            "AI returned an unreadable receipt result.",
        },
        502,
      );
    }

    return jsonResponse(
      {
        result,
      },
    );
  } catch (error) {
    console.error(
      "receipt-ai-scan error:",
      error,
    );

    return jsonResponse(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected receipt AI error.",
      },
      500,
    );
  }
});
