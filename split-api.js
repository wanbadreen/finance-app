import { supabase } from './supabase.js';
export async function splitRequest(input) {
  const {data,error}=await supabase.functions.invoke('split-bill',{body:input});
  if(error) {
    let message=error.message;
    try { const body=await error.context?.json(); message=body?.error || message; } catch {}
    throw new Error(message || 'Unable to load Split Bill.');
  }
  if(data?.error) throw new Error(data.error);
  return data;
}
