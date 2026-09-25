// Merge this pure transform into the project's EXISTING trusted Custom Access Token Hook.
// It does not deploy a hook or verify incoming HTTP hook signatures by itself.
export function mcpClaims(event, { clientIds, resource }) {
  const claims = { ...event.claims };
  const clientId = event.client_id || claims.client_id;
  if (!clientIds.includes(clientId)) return { ...event, claims };
  // Preserve the standard Supabase audience for Auth/Data API, add only this fixed resource.
  // Never derive an audience from request headers, user metadata, or an arbitrary redirect.
  const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  claims.aud = [...new Set([...audiences.filter(Boolean), 'authenticated', resource])];
  return { ...event, claims };
}
