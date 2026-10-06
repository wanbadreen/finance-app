alter table public.split_payment_profiles
  add column if not exists qr_payload text null
  check (qr_payload is null or length(qr_payload) between 20 and 1024);

comment on column public.split_payment_profiles.qr_payload is
  'Optional EMV/DuitNow QR payload used to generate amount-specific repayment QR codes. Kept private and exposed only through the trusted split-bill Edge Function to scoped participants who owe the profile owner.';
