import { supabase } from './supabase.js';

export async function paymentRequest(input) {
  const { data, error } = await supabase.functions.invoke('payment-request', { body: input });
  if (error) {
    let message = error.message;
    try {
      const body = await error.context?.json();
      message = body?.error || message;
    } catch {}
    throw new Error(message || 'Unable to use Request Money.');
  }
  if (data?.error) throw new Error(data.error);
  return data;
}
