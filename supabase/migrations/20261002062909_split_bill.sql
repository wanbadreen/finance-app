-- Additive Split Bill schema. Normal transactions retain their current behavior.
create table public.split_bills (
  id uuid primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  revision integer not null default 1 check (revision > 0),
  document jsonb not null check (jsonb_typeof(document) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id,user_id)
);
create index split_bills_user_created_idx on public.split_bills(user_id,created_at desc);
alter table public.split_bills enable row level security;
revoke all on public.split_bills from public,anon,authenticated;
grant select on public.split_bills to authenticated;
grant all on public.split_bills to service_role;
create policy split_bills_read_own on public.split_bills for select to authenticated using ((select auth.uid()) = user_id);

alter table public.transactions
  add column split_bill_id uuid,
  add column report_amount numeric check (report_amount >= 0),
  add column cash_amount numeric check (cash_amount >= 0),
  add constraint transactions_split_bill_owner_fk foreign key (split_bill_id,user_id) references public.split_bills(id,user_id) on delete restrict,
  add constraint transactions_split_amounts_check check (
    (split_bill_id is null and report_amount is null and cash_amount is null)
    or (split_bill_id is not null and report_amount is not null and cash_amount is not null)
  );
create index transactions_split_bill_owner_idx on public.transactions(split_bill_id,user_id) where split_bill_id is not null;

-- Financial projections are written only by the trusted, authenticated Split API.
create function public.guard_split_transaction() returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  if coalesce(auth.role(),'') <> 'service_role' and current_user not in ('postgres','supabase_admin') then
    if tg_op = 'DELETE' then
      if old.split_bill_id is not null then raise exception 'Manage this transaction from Split Bill'; end if;
      return old;
    end if;
    if new.split_bill_id is not null or new.report_amount is not null or new.cash_amount is not null then
      raise exception 'Manage this transaction from Split Bill';
    end if;
    if tg_op = 'UPDATE' and old.split_bill_id is not null then raise exception 'Manage this transaction from Split Bill'; end if;
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;
revoke all on function public.guard_split_transaction() from public,anon,authenticated;
create trigger guard_split_transaction before insert or update or delete on public.transactions for each row execute function public.guard_split_transaction();

-- SECURITY INVOKER, service_role only; optimistic revision lock and cash/spending
-- projections commit atomically, including conversion of an existing expense.
create function public.save_split_bill(p_id uuid,p_owner uuid,p_expected integer,p_document jsonb,p_rows jsonb,p_link uuid default null,p_link_report numeric default null)
returns integer language plpgsql security invoker set search_path = '' as $$
declare
  v_revision integer;
  v_row jsonb;
  v_link public.transactions%rowtype;
begin
  if coalesce(auth.role(),'') <> 'service_role' and current_user not in ('postgres','supabase_admin') then raise exception 'Unauthorized'; end if;
  if p_expected = 0 then
    insert into public.split_bills(id,user_id,document) values(p_id,p_owner,p_document) returning revision into v_revision;
  else
    update public.split_bills set document=p_document,revision=revision+1,updated_at=now()
    where id=p_id and user_id=p_owner and revision=p_expected returning revision into v_revision;
    if not found then raise exception 'Bill changed in another window'; end if;
  end if;
  if p_link is not null then
    if p_expected <> 0 then raise exception 'Expense can only be linked when creating a bill'; end if;
    select * into v_link from public.transactions where id=p_link and user_id=p_owner for update;
    if not found or v_link.deleted_at is not null or v_link.type <> 'expense' or v_link.split_bill_id is not null or v_link.recurring_id is not null or v_link.linked_transfer_id is not null then raise exception 'Expense is no longer available for splitting'; end if;
    if v_link.transaction_date <> (p_document->>'date')::date or v_link.amount*100 <> (
      select coalesce(sum((x->>'cents')::numeric),0) from jsonb_array_elements(p_document->'paid') x
      where x->>'participantId' = (select y->>'id' from jsonb_array_elements(p_document->'participants') y where (y->>'isSelf')::boolean)
    ) then raise exception 'Expense changed before the split was saved'; end if;
    update public.transactions set split_bill_id=p_id,report_amount=p_link_report,cash_amount=amount where id=p_link and user_id=p_owner;
  end if;
  for v_row in select value from jsonb_array_elements(p_rows) loop
    insert into public.transactions(id,user_id,account_id,category_id,description,notes,amount,type,transaction_date,split_bill_id,report_amount,cash_amount)
    values((v_row->>'id')::uuid,p_owner,(v_row->>'account_id')::uuid,(v_row->>'category_id')::uuid,v_row->>'description',v_row->>'notes',(v_row->>'amount')::numeric,v_row->>'type',(v_row->>'transaction_date')::date,p_id,(v_row->>'report_amount')::numeric,(v_row->>'cash_amount')::numeric);
  end loop;
  return v_revision;
end;
$$;
revoke all on function public.save_split_bill(uuid,uuid,integer,jsonb,jsonb,uuid,numeric) from public,anon,authenticated;
grant execute on function public.save_split_bill(uuid,uuid,integer,jsonb,jsonb,uuid,numeric) to service_role;
