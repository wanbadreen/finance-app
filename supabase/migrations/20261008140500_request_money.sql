-- Request Money: simple one-person payment request links.
create table if not exists public.payment_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  requester_name text not null,
  recipient_name text,
  amount numeric(12,2) not null check (amount > 0 and amount <= 9999999.99),
  note text,
  status text not null default 'pending' check (status in ('pending','reported','paid','cancelled')),
  public_token_hash text not null unique,
  expires_at timestamptz not null default (now() + interval '7 days'),
  report jsonb,
  transaction_id uuid references public.transactions(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.payment_requests enable row level security;

create index if not exists payment_requests_owner_created_idx
  on public.payment_requests(user_id, created_at desc);

create index if not exists payment_requests_status_idx
  on public.payment_requests(user_id, status, created_at desc);

alter table public.transactions
  add column if not exists payment_request_id uuid references public.payment_requests(id) on delete set null;

create unique index if not exists transactions_payment_request_unique_idx
  on public.transactions(payment_request_id)
  where payment_request_id is not null;

create or replace function public.confirm_payment_request(
  p_id uuid,
  p_owner uuid,
  p_account uuid,
  p_date date
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_request public.payment_requests%rowtype;
  v_account public.accounts%rowtype;
  v_transaction_id uuid;
begin
  if coalesce(auth.role(),'') <> 'service_role'
     and current_user not in ('postgres','supabase_admin') then
    raise exception 'Unauthorized';
  end if;

  select * into v_request
  from public.payment_requests
  where id = p_id and user_id = p_owner
  for update;

  if not found then
    raise exception 'Payment request not found';
  end if;

  if v_request.status = 'paid' then
    return v_request.transaction_id;
  end if;

  if v_request.status = 'cancelled' then
    raise exception 'Payment request is cancelled';
  end if;

  if v_request.expires_at < now() then
    raise exception 'Payment request has expired';
  end if;

  select * into v_account
  from public.accounts
  where id = p_account and user_id = p_owner and is_active = true;

  if not found then
    raise exception 'Choose an active account';
  end if;

  v_transaction_id := gen_random_uuid();

  insert into public.transactions(
    id,user_id,account_id,category_id,income_source_id,
    description,notes,amount,type,transaction_date,
    payment_request_id,report_amount,cash_amount
  )
  values(
    v_transaction_id,
    p_owner,
    p_account,
    null,
    null,
    case
      when nullif(trim(v_request.note),'') is not null
        then 'Payment request: ' || trim(v_request.note)
      when nullif(trim(v_request.recipient_name),'') is not null
        then 'Payment request from ' || trim(v_request.recipient_name)
      else 'Payment request repayment'
    end,
    'Managed by Request Money. Repayment is excluded from income reporting.',
    v_request.amount,
    'income',
    coalesce(p_date, current_date),
    v_request.id,
    0,
    v_request.amount
  );

  update public.payment_requests
  set status = 'paid',
      transaction_id = v_transaction_id,
      updated_at = now()
  where id = v_request.id;

  return v_transaction_id;
end;
$$;

revoke all on function public.confirm_payment_request(uuid,uuid,uuid,date) from public, anon, authenticated;
grant execute on function public.confirm_payment_request(uuid,uuid,uuid,date) to service_role;
