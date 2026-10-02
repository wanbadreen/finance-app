import { createClient } from '@supabase/supabase-js';
import { createRemoteJWKSet, decodeJwt, jwtVerify } from 'jose';

export function configuration(env = process.env) {
  const url = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const key = env.SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const resource = env.MCP_RESOURCE_URL || (env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}/mcp` : undefined);
  const configuredClients = String(env.MCP_CLIENT_IDS || '').split(',').map(x => x.trim()).filter(Boolean);
  const clients = configuredClients.length ? configuredClients : ['7bc4b0df-7ece-4168-a44a-5fb7c625593c'];
  if (!url || !key?.startsWith('sb_publishable_') || !resource) {
    throw new Error('Set SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY and MCP_RESOURCE_URL.');
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
  try {
    const { payload } = await jwtVerify(token, key, {
      issuer: config.issuer, audience: config.resource, algorithms: ['ES256', 'RS256'], requiredClaims: ['exp', 'sub', 'iat'],
    });
    return validateClaims(payload, config);
  } catch (error) {
    let claims = {};
    try {
      const decoded = decodeJwt(token);
      claims = {
        iss: decoded.iss || null,
        aud: decoded.aud || null,
        client_id: decoded.client_id || null,
        scope: decoded.scope || null,
        role: decoded.role || null,
        is_anonymous: decoded.is_anonymous ?? null,
      };
    } catch {}
    console.warn('Kira MCP access token rejected', {
      code: error?.code || null,
      message: error?.message || 'Unknown token validation failure',
      expected_issuer: config.issuer,
      expected_audience: config.resource,
      allowed_client_ids: config.clients,
      claims,
    });
    throw error;
  }
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
