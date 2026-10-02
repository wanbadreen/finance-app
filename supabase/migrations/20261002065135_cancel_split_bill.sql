create function public.cancel_split_bill(p_id uuid,p_owner uuid,p_expected integer)
returns void language plpgsql security invoker set search_path = '' as $$
declare v_bill public.split_bills%rowtype; v_link uuid;
begin
  if coalesce(auth.role(),'') <> 'service_role' and current_user not in ('postgres','supabase_admin') then raise exception 'Unauthorized'; end if;
  select * into v_bill from public.split_bills where id=p_id and user_id=p_owner for update;
  if not found or v_bill.revision<>p_expected then raise exception 'Bill changed in another window'; end if;
  if coalesce((v_bill.document->>'cancelled')::boolean,false) then raise exception 'Bill already cancelled'; end if;
  if exists(select 1 from jsonb_array_elements(v_bill.document->'payments') p where p->>'status' <> 'rejected') then raise exception 'Cannot cancel a bill with reported or confirmed repayments'; end if;
  v_link := (v_bill.document->>'linkedTransactionId')::uuid;
  if v_link is not null then
    update public.transactions set split_bill_id=null,report_amount=null,cash_amount=null where id=v_link and user_id=p_owner and split_bill_id=p_id;
  end if;
  delete from public.transactions where split_bill_id=p_id and user_id=p_owner;
  update public.split_bills set document=document || jsonb_build_object('cancelled',true,'cancelledAt',now()),revision=revision+1,updated_at=now() where id=p_id and user_id=p_owner;
end;
$$;
revoke all on function public.cancel_split_bill(uuid,uuid,integer) from public,anon,authenticated;
grant execute on function public.cancel_split_bill(uuid,uuid,integer) to service_role;
