create or replace function public.save_split_bill(p_id uuid,p_owner uuid,p_expected integer,p_document jsonb,p_rows jsonb,p_link uuid default null,p_link_report numeric default null)
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
    if v_link.category_id is distinct from (p_document->>'categoryId')::uuid or v_link.account_id is distinct from (
      select coalesce(nullif(x->>'accountId',''),p_document->>'accountId')::uuid from jsonb_array_elements(p_document->'paid') x
      where x->>'participantId' = (select y->>'id' from jsonb_array_elements(p_document->'participants') y where (y->>'isSelf')::boolean)
      limit 1
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
