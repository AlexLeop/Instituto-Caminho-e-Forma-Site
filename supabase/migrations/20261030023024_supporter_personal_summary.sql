begin;

create or replace function public.supporter_portal(p_environment text,p_session_hash text,p_page integer) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare session public.supporter_sessions; profile jsonb;
begin
  select * into session from public.supporter_sessions where environment=p_environment and session_hash=p_session_hash and revoked_at is null and expires_at>now();
  if not found then raise exception 'INVALID_SUPPORTER_SESSION'; end if;
  -- Every block, including the full-history summary, uses this same session scope.
  with own_records as (
    select * from public.donation_ledger where environment=p_environment and source='cora' and included=true
      and lower(donor_email)=session.donor_email and right(masked_document,4)=session.document_suffix
  ), paid_records as (
    select * from own_records where payment_status='PAID' and paid_cents>=amount_cents
  ), destinations as (
    select destination_id,coalesce(max(destination_title),'Destino não identificado') as title,sum(paid_cents)::bigint as cents,count(*)::integer as donations
      from paid_records group by destination_id
  ), page_rows as (select * from own_records order by created_at desc nulls last,id limit 50 offset ((p_page-1)*50))
  select jsonb_build_object('name',coalesce((select donor_name from own_records order by created_at desc nulls last,id limit 1),'Apoiador'),
    'email',session.donor_email,'documentSuffix',session.document_suffix,'expiresAt',session.expires_at,'authenticationMethod',session.authentication_method,
    'totalCents',coalesce((select sum(paid_cents) from paid_records),0),'donationCount',(select count(*) from paid_records),
    'firstPaidOn',(select min(paid_on) from paid_records),'lastPaidOn',(select max(paid_on) from paid_records),
    'destinations',coalesce((select jsonb_agg(jsonb_build_object('destinationId',destination_id,'title',title,'paidCents',cents,'donationCount',donations) order by title) from destinations),'[]'::jsonb),
    'donations',coalesce((select jsonb_agg(jsonb_build_object('id',id,'createdAt',created_at,'paidOn',paid_on,'status',payment_status,
      'amountCents',amount_cents,'paidCents',paid_cents,'destinationTitle',coalesce(destination_title,'Destino não identificado'),'method',method) order by created_at desc nulls last,id) from page_rows),'[]'::jsonb),
    'nextPage',case when p_page*50<(select count(*) from own_records) then p_page+1 else null end) into profile;
  return profile;
end;
$$;

revoke all on function public.supporter_portal(text,text,integer) from public,anon,authenticated;
grant execute on function public.supporter_portal(text,text,integer) to service_role;
notify pgrst,'reload schema';
commit;
