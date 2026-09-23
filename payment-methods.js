import { supabase } from "./supabase.js";

export const DEFAULT_PAYMENT_METHODS = [
    { name: "Cash", method_type: "cash", system_key: "cash", sort_order: 10 },
    { name: "Debit Card", method_type: "debit_card", system_key: "debit_card", sort_order: 20 },
    { name: "Credit Card", method_type: "credit_card", system_key: "credit_card", sort_order: 30 },
    { name: "Bank Transfer", method_type: "bank_transfer", system_key: "bank_transfer", sort_order: 40 },
    { name: "E-Wallet", method_type: "e_wallet", system_key: "e_wallet", sort_order: 50 },
    { name: "Online Banking", method_type: "online_banking", system_key: "online_banking", sort_order: 60 },
    { name: "Other", method_type: "other", system_key: "other", sort_order: 70 }
];

export async function ensureDefaultPaymentMethods(userId) {
    if (!userId) return;

    const { data, error } = await supabase
        .from("payment_methods")
        .select("system_key")
        .eq("user_id", userId)
        .not("system_key", "is", null);

    if (error) throw error;

    const existingKeys = new Set(
        (data || []).map(item => item.system_key).filter(Boolean)
    );

    const missing = DEFAULT_PAYMENT_METHODS
        .filter(item => !existingKeys.has(item.system_key))
        .map(item => ({ user_id: userId, ...item }));

    if (!missing.length) return;

    const { error: insertError } = await supabase
        .from("payment_methods")
        .insert(missing);

    if (insertError) throw insertError;
}

export async function fetchPaymentMethods(userId) {
    if (!userId) return [];

    const { data, error } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("user_id", userId)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true });

    if (error) throw error;
    return data || [];
}

export function findPaymentMethod(paymentMethods, paymentMethodId) {
    if (!paymentMethodId) return null;
    return (Array.isArray(paymentMethods) ? paymentMethods : [])
        .find(item => item.id === paymentMethodId) || null;
}
