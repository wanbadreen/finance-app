import { createClient } from '@supabase/supabase-js';
import { createRemoteJWKSet, jwtVerify } from 'jose';

export function configuration(env = process.env) {
  const url = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const key = env.SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const resource = env.MCP_RESOURCE_URL || (env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}/mcp` : undefined);
  const clients = (env.MCP_CLIENT_IDS || '').split(',').map(x => x.trim()).filter(Boolean);
  if (!url || !key?.startsWith('sb_publishable_') || !resource) {
    throw new Error('Set SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, MCP_RESOURCE_URL. Configure MCP_CLIENT_IDS to enable client access.');
  }
  const u = new URL(resource);
  if (u.protocol !== 'https:' && !(u.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(u.hostname))) throw new Error('HTTPS required');
  if (u.pathname !== '/mcp' || u.search || u.hash) throw new Error('Resource must end in /mcp');
  return { url: new URL(url).origin, key, resource, clients, issuer: `${new URL(url).origin}/auth/v1` };
}

export function validateClaims(claims, config) {
  if (claims.role !== 'authenticated' || claims.is_anonymous || !claims.sub || !config.clients.includes(claims.client_id)) throw new Error('Invalid user/client');
  if (!(claims.scope || '').split(' ').includes('openid')) throw new Error('Missing scope');
  return claims;
}

export async function verifyAccessToken(token, config, key) {
  const { payload } = await jwtVerify(token, key, {
    issuer: config.issuer, audience: config.resource, algorithms: ['ES256', 'RS256'], requiredClaims: ['exp', 'sub', 'iat'],
  });
  return validateClaims(payload, config);
}

export function authenticator(config) {
  const jwks = createRemoteJWKSet(new URL(`${config.issuer}/.well-known/jwks.json`));
  return async token => {
    const payload = await verifyAccessToken(token, config, jwks);
    const db = createClient(config.url, config.key, {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
    const { data, error } = await db.auth.getUser(token);
    if (error || data.user?.id !== payload.sub) throw new Error('Invalid user');
    return { db, userId: payload.sub };
  };
}
