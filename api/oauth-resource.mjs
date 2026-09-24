import { configuration } from '../server/auth.mjs';
export default function(req,res) {
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='GET'){res.statusCode=405;return res.end();}
  try {const config=configuration();res.setHeader('Content-Type','application/json');res.end(JSON.stringify({resource:config.resource,authorization_servers:[config.issuer],scopes_supported:['openid'],bearer_methods_supported:['header']}));}
  catch {res.statusCode=503;res.end('MCP configuration unavailable');}
}
