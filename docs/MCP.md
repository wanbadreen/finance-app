# Kira MCP v1.1 — implementation and setup

## Status

Implemented against Kira v1.3.2, source commit 4e239400aa81e91c092d07a03dcbbc3312569c4d. The original checkout and production database were not changed. This deliverable is a patch for the existing repository, not a separate finance application.

Local MCP tests: 14 passing. Vite production build: passing. Existing tests: 26/29 passing; the same three failures reproduce on the original checkout. They concern source-slicing assertions in tests/credit-cards.test.cjs (lines 120, 131, 158), which begin at variable declarations rather than event handlers. No existing app logic was changed.

Not yet verified: live Supabase OAuth, the deployed Vercel routes, ChatGPT linking, or two-user production RLS. No authenticated test-user tokens or OAuth client configuration were supplied. There is no live endpoint URL yet.


## v1.1 transaction creation

The MCP now exposes `get_transaction_options` and `create_transaction`. The options tool returns only the authenticated user's active accounts, categories, income sources and payment methods. The create tool requires `confirmed: true`, validates every referenced row belongs to that same user, enforces category/type matching, requires an income source for income transactions, and inserts through the user's OAuth bearer token so existing RLS still applies. It does not support transfers, edits, deletes, receipt upload or recurring schedule changes.

## Audit and design

The app is plain JavaScript + Vite, with Capacitor Android and Supabase JS 2.116.0. Existing web authentication and supabase.js remain unchanged. Server modules use Node ESM, MCP SDK Streamable HTTP, jose JWT verification, and a fresh user-scoped Supabase client per request. There is no service_role client, arbitrary SQL tool, storage download or RPC call. Seven tools are read-only. create_transaction is the only write tool; it creates one confirmed income/expense transaction and cannot edit, delete or transfer money.

All queries use a fixed table/column allowlist, the verified JWT subject as user_id, and the same bearer token for Supabase RLS. Missing/bad tokens return 401 and OAuth discovery metadata. JWT signatures, expiry, issuer, exact MCP resource audience, authenticated role, non-anonymous identity, client allowlist and openid scope are checked; getUser confirms identity server-side. ID tokens lacking the authenticated role are rejected.

Accounts use opening balance + income - expense + transfers. Deleted transactions/transfers are excluded. Monthly reports use recorded transaction dates, and exclude transfers. Aggregations page to 100,000 rows and fail rather than return known partial totals. Separate read queries are not a transactionally consistent snapshot; avoid concurrent edits when reconciling exact balances. Currency follows existing Kira numeric values; no FX conversion is added.

get_credit_cards includes recorded statements, explicitly not calculated remaining statement due. get_debts covers tracked credit-card liabilities only: the repository has no general-debt table. A zero result does not mean the user has no other debts.

No database migration or grant/policy changes are included. Existing public-table RLS and grants remain required. Any future public user-owned table must explicitly GRANT authenticated, enable RLS, and enforce auth.uid() = user_id. The MCP write boundary is the tool implementation plus existing Supabase RLS. create_transaction validates that account, category, income source and payment method are active and belong to the authenticated user before insert. Existing OAuth token permissions are not reduced by the openid scope, so any future write tool must repeat the same ownership validation and stay behind user-scoped RLS.

## Changed files

- server/auth.mjs: configuration and token validation.
- server/tools.mjs: eight tools: seven read tools plus confirmed create_transaction, with schemas, aggregation, ownership validation and user filters.
- server/handler.mjs, server/local.mjs: MCP HTTP transport and local launcher.
- server/oauth-claims.mjs: pure audience transform to integrate into an existing trusted Auth hook; not a deployed hook.
- api/mcp.mjs, api/oauth-resource.mjs: Vercel entry points.
- oauth-consent.html, oauth-consent.js: explicit consent using existing Kira sign-in, restricted OAuth clients/scopes, and disclosure that Kira can create a confirmed income/expense transaction.
- vite.config.mjs: builds both existing app and new consent page.
- vercel.json: adds two endpoint rewrites; retains existing headers.
- package.json, package-lock.json: pinned new dependencies and MCP commands; Supabase pinned at existing version.
- .env.example: placeholder configuration only.
- tests/mcp.test.mjs: local behavior, isolation, transaction-write safeguards and signed JWT tests.
- scripts/test-mcp-live.mjs: read-only two-user live RLS check.
- docs/MCP.md: this guide.

## Apply and run

From a clean checkout at the source commit (or review conflicts on a newer branch):

```powershell
git switch -c feature/kira-mcp-readonly
git apply --check <path-to-kira-mcp.patch>
git apply <path-to-kira-mcp.patch>
npm ci
npm run test:mcp
npm run build
```

Keep existing VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY for web builds. Set VITE_MCP_CLIENT_IDS to the registered client UUID (comma separated if needed). This is a public identifier, not a secret.

Create ignored .env.mcp for Node:

```dotenv
SUPABASE_URL=https://zuueyhjzlcmegpklpdcb.supabase.co
SUPABASE_PUBLISHABLE_KEY=<publishable key, never service_role or sb_secret>
MCP_RESOURCE_URL=http://127.0.0.1:8787/mcp
MCP_CLIENT_IDS=<registered OAuth client UUID>
MCP_PORT=8787
```

Run npm run mcp:dev. Local endpoint: http://127.0.0.1:8787/mcp. It intentionally refuses to start when configuration is missing. Run npm run dev separately for the web/consent page. A plain browser GET to /mcp is not a tool test: unauthenticated requests return 401; authenticated GET returns 405 because the server is stateless POST-only.

## Required Supabase OAuth setup

1. In Authentication > OAuth Server, enable OAuth 2.1. Use asymmetric ES256 or RS256 signing. Keep existing app authentication working while configuring this.
2. Set Authorization Path to /oauth-consent.html on the existing Site URL. Publish the consent page to that origin. For local consent testing, use a dedicated development Supabase project rather than changing the production Site URL.
3. Register a dedicated OAuth client for ChatGPT. Copy the exact redirect URI from the ChatGPT MCP app form/settings into Supabase. Require authorization-code PKCE S256. Use the supported token endpoint authentication method shown in discovery; enter the issued client ID/secret in ChatGPT if required. Never put that client secret in VITE_* variables or the repository. Pre-registration is preferred here because both server and consent page require a client allowlist; unrestricted DCR is not configured.
4. Add the registered client UUID to both MCP_CLIENT_IDS and VITE_MCP_CLIENT_IDS, then rebuild the frontend.
5. Configure the trusted Custom Access Token Hook so that only this OAuth client receives the MCP_RESOURCE_URL in its aud claim. Preserve authenticated as an additional audience for Supabase APIs. server/oauth-claims.mjs provides the pure transform; merge it into an existing hook rather than replacing unrelated hook logic. An HTTP hook must verify Supabase webhook signatures before invoking this transform. It is not an HTTP hook endpoint by itself. Do not apply this audience change globally or weaken the MCP verifier to accept audience authenticated alone. Verify your project's hook payload and multi-audience support in staging before enabling it. The implementation deliberately rejects tokens until this is correctly configured.
6. Request openid. Verify the issued access token has sub, authenticated role, client_id, scope containing openid, expected issuer, expiry and the configured resource audience. Never paste full tokens into chat/logs.

The hook integration is outstanding deployment configuration, not an automatically applied migration. No changes to the production Auth settings were made by this task.

## Vercel deployment

Deploy this branch as a Vercel preview using the existing linked project. Set Node 22+ and preserve the existing Vite build settings. Configure the server variables above in Preview plus VITE_MCP_CLIENT_IDS. Set MCP_RESOURCE_URL to the actual stable HTTPS origin plus /mcp; use that identical resource in the token hook. Confirm the consent page exists at Supabase's configured Site URL. Preview deployment protection must allow the MCP client to reach discovery and /mcp.

Routes:
- POST https://<actual-domain>/mcp -> api/mcp.mjs
- GET https://<actual-domain>/.well-known/oauth-protected-resource -> api/oauth-resource.mjs
- https://<actual-domain>/oauth-consent.html -> built consent UI

Use the preview for validation before promoting via the existing deployment workflow. These routes have been tested locally at the handler level, not on Vercel. Rollback consists of reverting this patch/redeploying the previous version and revoking the dedicated OAuth client; ordinary Kira sign-in is untouched by the patch.

A temporary HTTPS tunnel may forward to 127.0.0.1:8787. Set MCP_RESOURCE_URL and the OAuth audience to the tunnel's actual HTTPS /mcp URL before testing. Keep the existing hosted consent page. Restart/reconfigure if the tunnel hostname changes. No tunnel was started and no public hostname is claimed in this deliverable.

## ChatGPT Create MCP App values

Name: Kira
Description: Read-only access to your Kira accounts, transactions, monthly summaries, category spending and tracked credit-card debt.
Connection: Server URL
Server URL: https://<actual-deployed-domain>/mcp
Authentication: OAuth
Client ID: dedicated Supabase OAuth client UUID
Client secret: only if issued/required by the selected client authentication method; enter directly in ChatGPT.
Scopes: openid (if the form asks)

The protected resource advertises https://zuueyhjzlcmegpklpdcb.supabase.co/auth/v1 as issuer. Supabase discovery is at https://zuueyhjzlcmegpklpdcb.supabase.co/.well-known/oauth-authorization-server/auth/v1. Use discovered OAuth endpoints instead of guessing them.

## Live verification before daily use

With two separate populated test users and their OAuth access tokens in an ignored .env.mcp-test containing the server config plus MCP_TEST_TOKEN_A and MCP_TEST_TOKEN_B:

```powershell
node --env-file=.env.mcp-test scripts/test-mcp-live.mjs
```

This reads only; it checks each user's own rows and verifies that cross-user reads return zero rows for all six accessed tables. It requires an account fixture for each user. It does not create fixtures or prove write restrictions. Then connect ChatGPT, verify all six tools appear, compare September totals/account balances against Kira, and confirm anonymous/expired tokens and unknown write tools are rejected. Check ordinary web login, add/edit flow and Android build separately before production promotion.

Local tests use a mock database and real locally signed JWTs. They cannot establish the deployed database's RLS state. Dependency audit found seven issues in the existing Capacitor/assets toolchain (including one critical transitive tar issue); no reported issues in the added MCP/jose/zod runtime dependencies. Broad dependency upgrades were kept outside this change.

## References

- https://developers.openai.com/plugins/build/auth
- https://supabase.com/docs/guides/auth/oauth-server/getting-started
- https://supabase.com/docs/guides/auth/oauth-server/mcp-authentication
- https://supabase.com/docs/guides/auth/oauth-server/token-security
