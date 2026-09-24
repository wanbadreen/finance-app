import { supabase } from './supabase.js';
const status = document.querySelector('#status');
const authorizationId = new URL(location.href).searchParams.get('authorization_id');
const allowed = (import.meta.env.VITE_MCP_CLIENT_IDS || '7bc4b0df-7ece-4168-a44a-5fb7c625593c').split(',').map(x=>x.trim());
const approve = document.querySelector('#approve');
const deny = document.querySelector('#deny');
async function load() {
  approve.disabled = deny.disabled = true;
  if (!authorizationId) {status.textContent='Missing authorization request.';return;}
  const {data:{user}} = await supabase.auth.getUser();
  if (!user) {status.textContent='Sign in to Kira, then return here and check sign-in.';return;}
  const {data,error} = await supabase.auth.oauth.getAuthorizationDetails(authorizationId);
  if (error || !data || !('authorization_id' in data)) {status.textContent='Request unavailable or already approved. Restart the connection in ChatGPT.';return;}
  document.querySelector('#details').textContent = `Client: ${data.client.name}\nRedirect: ${data.redirect_uri}\nScopes: ${data.scope || ''}`;
  deny.disabled=false;
  if (!allowed.includes(data.client.id) || data.scope.split(' ').some(x=>x && x!=='openid')) {status.textContent='This client or its permissions are not configured for Kira MCP.';return;}
  status.textContent=`Signed in as ${user.email}. Review and approve this connection.`;
  approve.disabled=false;
}
async function decide(allow) {
  approve.disabled=deny.disabled=true;
  const method = allow?'approveAuthorization':'denyAuthorization';
  const {data,error}=await supabase.auth.oauth[method](authorizationId,{skipBrowserRedirect:true});
  if (error || !data?.redirect_url) {status.textContent='Unable to complete authorization. Restart the connection.';return;}
  location.assign(data.redirect_url);
}
document.querySelector('#reload').onclick=()=>load().catch(()=>{status.textContent='Unable to check authorization.';});
approve.onclick=()=>decide(true).catch(()=>{status.textContent='Authorization failed.';});
deny.onclick=()=>decide(false).catch(()=>{status.textContent='Authorization failed.';});
void load().catch(()=>{status.textContent='Unable to check authorization.';});
