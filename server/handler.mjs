import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { configuration, authenticator } from './auth.mjs';
import { schemas, descriptions, reader } from './tools.mjs';
export function handler(config = configuration(), authenticate = authenticator(config)) {
  const metadataUrl = `${new URL(config.resource).origin}/.well-known/oauth-protected-resource`;
  const challenge = `Bearer resource_metadata="${metadataUrl}", scope="openid"`;
  return async (req,res) => {
    res.setHeader('Cache-Control','no-store');
    const path = new URL(req.url,'http://localhost').pathname;
    if (path === '/.well-known/oauth-protected-resource' && req.method === 'GET') {
      res.setHeader('Content-Type','application/json');
      return res.end(JSON.stringify({resource:config.resource,authorization_servers:[config.issuer],scopes_supported:['openid'],bearer_methods_supported:['header']}));
    }
    if (path !== '/mcp' && path !== '/api/mcp') { res.statusCode=404; return res.end(); }
    if (req.headers.origin && req.headers.origin !== new URL(config.resource).origin) {res.statusCode=403; return res.end();}
    let context;
    try {
      const match = /^Bearer ([^\s]+)$/i.exec(req.headers.authorization || '');
      if (!match) throw new Error('Missing bearer');
      context = await authenticate(match[1]);
    } catch {res.statusCode=401;res.setHeader('WWW-Authenticate',challenge);return res.end('Authentication required');}
    if (req.method !== 'POST') {res.statusCode=405;res.setHeader('Allow','POST');return res.end();}
    const server = new McpServer({name:'kira',version:'1.0.0'});
    const read = reader(context.db,context.userId);
    for (const [name,schema] of Object.entries(schemas)) {
      server.registerTool(name,{
        description:descriptions[name],inputSchema:schema,
        annotations:{readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:false},
        _meta:{securitySchemes:[{type:'oauth2',scopes:['openid']}]},
      },async args=>{
        try {const result=await read(name,args);return {content:[{type:'text',text:JSON.stringify(result)}],structuredContent:result};}
        catch {return {isError:true,content:[{type:'text',text:'Unable to read Kira data. Check filters, permissions or dataset size; no partial totals returned.'}]};}
      });
    }
    const transport = new StreamableHTTPServerTransport({sessionIdGenerator:undefined,enableJsonResponse:true});
    res.on('close',()=>{void transport.close();void server.close();});
    try {await server.connect(transport);await transport.handleRequest(req,res,req.body);}
    catch {if (!res.headersSent) {res.statusCode=500;res.end('MCP request failed');}}
  };
}
