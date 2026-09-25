import { handler } from '../server/handler.mjs';
let configured;
export default async function(req,res) {
  try {configured ||= handler();return await configured(req,res);}
  catch {res.statusCode=503;res.end('MCP configuration unavailable');}
}
