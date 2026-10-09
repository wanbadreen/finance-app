alter table public.payment_requests
  add column if not exists settlement_type text
  check (settlement_type is null or settlement_type in ('income','repayment'));

create or replace function public.confirm_payment_request(
  p_id uuid,
  p_owner uuid,
  p_account uuid,
  p_date date,
  p_settlement_type text
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
  v_settlement_type text := lower(coalesce(p_settlement_type,''));
begin
  if coalesce(auth.role(),'') <> 'service_role'
     and current_user not in ('postgres','supabase_admin') then
    raise exception 'Unauthorized';
  end if;

  if v_settlement_type not in ('income','repayment') then
    raise exception 'Choose Income or Repayment';
  end if;

  select * into v_request
  from public.payment_requests
  where id = p_id and user_id = p_owner
  for update;

  if not found then raise exception 'Payment request not found'; end if;
  if v_request.status = 'paid' then return v_request.transaction_id; end if;
  if v_request.status = 'cancelled' then raise exception 'Payment request is cancelled'; end if;
  if v_request.expires_at < now() then raise exception 'Payment request has expired'; end if;

  select * into v_account
  from public.accounts
  where id = p_account and user_id = p_owner and is_active = true;

  if not found then raise exception 'Choose an active account'; end if;

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
      when nullif(trim(v_request.note),'') is not null then 'Payment request: ' || trim(v_request.note)
      when nullif(trim(v_request.recipient_name),'') is not null then 'Payment request from ' || trim(v_request.recipient_name)
      else 'Payment request received'
    end,
    case
      when v_settlement_type = 'income'
        then 'Managed by Request Money. Included in income reporting.'
      else 'Managed by Request Money. Repayment is excluded from income reporting.'
    end,
    v_request.amount,
    'income',
    coalesce(p_date, current_date),
    v_request.id,
    case when v_settlement_type = 'income' then v_request.amount else 0 end,
    v_request.amount
  );

  update public.payment_requests
  set status = 'paid',
      settlement_type = v_settlement_type,
      transaction_id = v_transaction_id,
      updated_at = now()
  where id = v_request.id;

  return v_transaction_id;
end;
$$;

revoke all on function public.confirm_payment_request(uuid,uuid,uuid,date,text) from public, anon, authenticated;
grant execute on function public.confirm_payment_request(uuid,uuid,uuid,date,text) to service_role;

create or replace function public.confirm_payment_request(
  p_id uuid,
  p_owner uuid,
  p_account uuid,
  p_date date
)
returns uuid
language sql
security definer
set search_path = ''
as $$
  select public.confirm_payment_request(p_id,p_owner,p_account,p_date,'repayment');
$$;

revoke all on function public.confirm_payment_request(uuid,uuid,uuid,date) from public, anon, authenticated;
grant execute on function public.confirm_payment_request(uuid,uuid,uuid,date) to service_role;
