begin;

alter table public.donation_fund_movements add column if not exists period_start date;
alter table public.donation_fund_movements add column if not exists period_end date;

-- Each internal movement carries the original receipt and its reporting date.
-- Changing or overlapping the selected period can never spend a receipt twice.
create table if not exists public.donation_fund_movement_lines (
  environment text not null,
  movement_id uuid not null,
  receipt_id text not null,
  amount_cents integer not null check(amount_cents > 0),
  primary key(environment,movement_id,receipt_id),
  foreign key(environment,movement_id) references public.donation_fund_movements(environment,id),
  foreign key(environment,receipt_id) references public.donation_ledger(environment,id)
);
create index if not exists donation_fund_lines_receipt_idx on public.donation_fund_movement_lines(environment,receipt_id);
alter table public.donation_fund_movement_lines enable row level security;
revoke all on public.donation_fund_movement_lines from public,anon,authenticated,service_role;
grant select,insert on public.donation_fund_movement_lines to service_role;

create or replace function public.donation_receipt_balances(p_environment text)
returns table(receipt_id text,destination_id text,paid_on date,undated_external boolean,received_cents bigint,incoming_cents bigint,outgoing_cents bigint,available_cents bigint)
language sql stable security invoker set search_path='' as $$
  with entries as (
    select l.id as receipt_id,l.destination_id,l.paid_cents::bigint as received_cents,0::bigint as incoming_cents,0::bigint as outgoing_cents
      from public.donation_ledger l where l.environment=p_environment and l.included and l.payment_status='PAID' and l.paid_cents>=l.amount_cents and l.destination_id is not null
    union all
    select x.receipt_id,m.destination_id,0,x.amount_cents,0 from public.donation_fund_movement_lines x
      join public.donation_fund_movements m on m.environment=x.environment and m.id=x.movement_id where x.environment=p_environment
    union all
    select x.receipt_id,m.source_id,0,0,x.amount_cents from public.donation_fund_movement_lines x
      join public.donation_fund_movements m on m.environment=x.environment and m.id=x.movement_id where x.environment=p_environment
  )
  select e.receipt_id,e.destination_id,l.paid_on,(l.source='externo' and l.paid_on is null),sum(e.received_cents)::bigint,sum(e.incoming_cents)::bigint,sum(e.outgoing_cents)::bigint,
    (sum(e.received_cents)+sum(e.incoming_cents)-sum(e.outgoing_cents))::bigint
    from entries e join public.donation_ledger l on l.environment=p_environment and l.id=e.receipt_id
    where l.included and l.payment_status='PAID' and l.paid_cents>=l.amount_cents
    group by e.receipt_id,e.destination_id,l.paid_on,l.source;
$$;

-- Preserve existing movements when applying this migration to a populated ledger.
do $$
declare m public.donation_fund_movements; r record; remaining integer; taken integer;
begin
  for m in select * from public.donation_fund_movements order by created_at,id loop
    if exists(select 1 from public.donation_fund_movement_lines where environment=m.environment and movement_id=m.id) then continue; end if;
    remaining:=m.amount_cents;
    for r in select * from public.donation_receipt_balances(m.environment) where destination_id=m.source_id and available_cents>0 order by paid_on nulls last,receipt_id loop
      taken:=least(remaining,r.available_cents);
      insert into public.donation_fund_movement_lines values(m.environment,m.id,r.receipt_id,taken);
      remaining:=remaining-taken; exit when remaining=0;
    end loop;
    if remaining<>0 then raise exception 'EXISTING_MOVEMENTS_REQUIRE_RECONCILIATION'; end if;
  end loop;
end;
$$;

create or replace function public.record_donation_reallocation_in_period(
  p_environment text,p_id uuid,p_source_id text,p_source_title text,p_destination_id text,p_destination_title text,
  p_amount_cents integer,p_responsible text,p_reason text,p_start date,p_end date,p_reversal_of uuid default null
) returns jsonb language plpgsql security invoker set search_path='' as $$
declare previous public.donation_fund_movements; original public.donation_fund_movements; created public.donation_fund_movements;
  available bigint; remaining integer; taken integer; r record;
begin
  if p_start is null or p_end is null or p_start>p_end or p_end-p_start>366 then raise exception 'INVALID_REPORT_PERIOD'; end if;
  perform pg_advisory_xact_lock(hashtextextended('donation-funds:'||p_environment,0));
  select * into previous from public.donation_fund_movements where environment=p_environment and id=p_id;
  if found then
    if previous.source_id=p_source_id and previous.destination_id=p_destination_id and previous.amount_cents=p_amount_cents and previous.responsible=p_responsible
      and previous.reason=p_reason and previous.reversal_of is not distinct from p_reversal_of and previous.period_start=p_start and previous.period_end=p_end then return public.donation_movement_json(previous); end if;
    raise exception 'REALLOCATION_CONFLICT';
  end if;
  if p_source_id=p_destination_id or p_amount_cents is null or p_amount_cents<=0 then raise exception 'INVALID_REALLOCATION'; end if;
  if p_reversal_of is not null then
    select * into original from public.donation_fund_movements where environment=p_environment and id=p_reversal_of;
    if not found or original.reversal_of is not null or original.source_id<>p_destination_id or original.destination_id<>p_source_id or original.amount_cents<>p_amount_cents then raise exception 'INVALID_REVERSAL'; end if;
    if exists(select 1 from public.donation_fund_movements where environment=p_environment and reversal_of=p_reversal_of) then raise exception 'ALREADY_REVERSED'; end if;
    if exists(select 1 from public.donation_fund_movement_lines x
      left join public.donation_receipt_balances(p_environment) b on b.receipt_id=x.receipt_id and b.destination_id=p_source_id
      where x.environment=p_environment and x.movement_id=p_reversal_of and
        (coalesce(b.available_cents,0)<x.amount_cents or not coalesce(b.paid_on between p_start and p_end or b.undated_external,false))) then raise exception 'INSUFFICIENT_ALLOCATION'; end if;
  end if;
  select coalesce(sum(available_cents),0) into available from public.donation_receipt_balances(p_environment)
    where destination_id=p_source_id and (paid_on between p_start and p_end or undated_external);
  if available<p_amount_cents then raise exception 'INSUFFICIENT_ALLOCATION'; end if;
  -- Also enforce the global balance if a previous receipt was subsequently corrected.
  select coalesce(sum((item->>'allocatedCents')::bigint),0) into available from jsonb_array_elements(public.donation_fund_balances(p_environment)) item where item->>'destinationId'=p_source_id;
  if available<p_amount_cents then raise exception 'INSUFFICIENT_ALLOCATION'; end if;
  insert into public.donation_fund_movements(environment,id,source_id,source_title,destination_id,destination_title,amount_cents,responsible,reason,reversal_of,period_start,period_end)
    values(p_environment,p_id,p_source_id,p_source_title,p_destination_id,p_destination_title,p_amount_cents,p_responsible,p_reason,p_reversal_of,p_start,p_end) returning * into created;
  if p_reversal_of is not null then
    insert into public.donation_fund_movement_lines select environment,p_id,receipt_id,amount_cents from public.donation_fund_movement_lines where environment=p_environment and movement_id=p_reversal_of;
  else
    remaining:=p_amount_cents;
    for r in select * from public.donation_receipt_balances(p_environment) where destination_id=p_source_id and available_cents>0 and (paid_on between p_start and p_end or undated_external) order by paid_on nulls last,receipt_id loop
      taken:=least(remaining,r.available_cents);
      insert into public.donation_fund_movement_lines values(p_environment,p_id,r.receipt_id,taken);
      remaining:=remaining-taken; exit when remaining=0;
    end loop;
    if remaining<>0 then raise exception 'INSUFFICIENT_ALLOCATION'; end if;
  end if;
  return public.donation_movement_json(created);
end;
$$;

create or replace function public.donation_movement_json(m public.donation_fund_movements) returns jsonb
language sql stable security invoker set search_path='' as $$
  select jsonb_build_object('id',m.id,'sourceId',m.source_id,'sourceTitle',m.source_title,'destinationId',m.destination_id,'destinationTitle',m.destination_title,
    'amountCents',m.amount_cents,'responsible',m.responsible,'reason',m.reason,'createdAt',m.created_at,'reversalOf',m.reversal_of,'periodStart',m.period_start,'periodEnd',m.period_end);
$$;

create or replace function public.donation_fund_report(p_environment text,p_start date,p_end date,p_page integer) returns jsonb
language sql stable security invoker set search_path='' as $$
  with selected as (
    select * from public.donation_fund_movements where environment=p_environment and (created_at at time zone 'America/Sao_Paulo')::date between p_start and p_end
  ), page_rows as (select * from selected order by created_at desc,id limit 50 offset ((p_page-1)*50)),
  period_funds as (
    select destination_id,sum(available_cents)::bigint as available from public.donation_receipt_balances(p_environment)
      where paid_on between p_start and p_end or undated_external group by destination_id
  )
  select jsonb_build_object('balances',coalesce((select jsonb_agg(b || jsonb_build_object('availableCents',greatest(0,least((b->>'allocatedCents')::bigint,coalesce(f.available,0)))))
    from jsonb_array_elements(public.donation_fund_balances(p_environment)) b left join period_funds f on f.destination_id=b->>'destinationId'),'[]'::jsonb),
    'movements',coalesce((select jsonb_agg(public.donation_movement_json(page_rows::public.donation_fund_movements) order by created_at desc,id) from page_rows),'[]'::jsonb),
    'nextPage',case when p_page*50<(select count(*) from selected) then p_page+1 else null end,'generatedAt',now());
$$;

revoke all on function public.donation_receipt_balances(text),public.record_donation_reallocation_in_period(text,uuid,text,text,text,text,integer,text,text,date,date,uuid) from public,anon,authenticated;
grant execute on function public.donation_receipt_balances(text),public.record_donation_reallocation_in_period(text,uuid,text,text,text,text,integer,text,text,date,date,uuid) to service_role;
-- All writes must supply a validated reporting period; close the legacy bypass.
revoke execute on function public.record_donation_reallocation(text,uuid,text,text,text,text,integer,text,text,uuid) from service_role;
notify pgrst,'reload schema';
commit;
