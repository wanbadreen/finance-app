-- Reusable private payment QR profile for Split Bill repayments.
-- QR image bytes are stored in the existing private receipts bucket; this table stores only the object path.
create table public.split_payment_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  qr_path text not null check (length(qr_path) between 1 and 500),
  updated_at timestamptz not null default now()
);

alter table public.split_payment_profiles enable row level security;
revoke all on public.split_payment_profiles from public, anon, authenticated;
grant all on public.split_payment_profiles to service_role;

comment on table public.split_payment_profiles is
  'Private Split Bill repayment profile. Accessed only through the trusted split-bill Edge Function.';
