import { createServer } from 'node:http';
import { handler } from './handler.mjs';
const port = Number(process.env.MCP_PORT || 8787);
createServer(handler()).listen(port,'127.0.0.1',()=>console.log(`Kira MCP listening on http://127.0.0.1:${port}/mcp`));
