begin;

create table if not exists public.donation_fund_movements (
  environment text not null check (environment in ('production','stage')),
  id uuid not null,
  source_id text not null,
  source_title text not null,
  destination_id text not null,
  destination_title text not null,
  amount_cents integer not null check (amount_cents > 0),
  responsible text not null check (length(responsible) between 3 and 120),
  reason text not null check (length(reason) between 10 and 1000),
  created_at timestamptz not null default now(),
  reversal_of uuid,
  primary key (environment, id),
  check (source_id <> destination_id),
  foreign key (environment, reversal_of) references public.donation_fund_movements(environment,id)
);
create unique index if not exists donation_fund_movements_reversal_idx on public.donation_fund_movements(environment,reversal_of) where reversal_of is not null;
create index if not exists donation_fund_movements_period_idx on public.donation_fund_movements(environment,created_at desc,id);
alter table public.donation_fund_movements enable row level security;
revoke all on public.donation_fund_movements from public,anon,authenticated,service_role;
grant select,insert on public.donation_fund_movements to service_role;

create or replace function public.donation_fund_balances(p_environment text) returns jsonb
language sql stable security invoker set search_path='' as $$
  with receipts as (
    select destination_id as id,sum(paid_cents)::bigint as cents
    from public.donation_ledger where environment=p_environment and included=true and payment_status='PAID' and paid_cents>=amount_cents and destination_id is not null
    group by destination_id
  ), incoming as (
    select destination_id as id,sum(amount_cents)::bigint as cents from public.donation_fund_movements where environment=p_environment group by destination_id
  ), outgoing as (
    select source_id as id,sum(amount_cents)::bigint as cents from public.donation_fund_movements where environment=p_environment group by source_id
  ), ids as (select id from receipts union select id from incoming union select id from outgoing)
  select coalesce(jsonb_agg(jsonb_build_object(
    'destinationId',ids.id,'receivedCents',coalesce(r.cents,0),'incomingCents',coalesce(i.cents,0),'outgoingCents',coalesce(o.cents,0),
    'allocatedCents',coalesce(r.cents,0)+coalesce(i.cents,0)-coalesce(o.cents,0)
  ) order by ids.id),'[]'::jsonb) from ids left join receipts r using(id) left join incoming i using(id) left join outgoing o using(id);
$$;

create or replace function public.donation_movement_json(m public.donation_fund_movements) returns jsonb
language sql stable security invoker set search_path='' as $$
  select jsonb_build_object('id',m.id,'sourceId',m.source_id,'sourceTitle',m.source_title,'destinationId',m.destination_id,'destinationTitle',m.destination_title,
    'amountCents',m.amount_cents,'responsible',m.responsible,'reason',m.reason,'createdAt',m.created_at,'reversalOf',m.reversal_of);
$$;

create or replace function public.record_donation_reallocation(
  p_environment text,p_id uuid,p_source_id text,p_source_title text,p_destination_id text,p_destination_title text,
  p_amount_cents integer,p_responsible text,p_reason text,p_reversal_of uuid default null
) returns jsonb language plpgsql security invoker set search_path='' as $$
declare previous public.donation_fund_movements; original public.donation_fund_movements; created public.donation_fund_movements; available bigint;
begin
  perform pg_advisory_xact_lock(hashtextextended('donation-funds:'||p_environment,0));
  select * into previous from public.donation_fund_movements where environment=p_environment and id=p_id;
  if found then
    if previous.source_id=p_source_id and previous.destination_id=p_destination_id and previous.amount_cents=p_amount_cents and previous.responsible=p_responsible
      and previous.reason=p_reason and previous.reversal_of is not distinct from p_reversal_of then return public.donation_movement_json(previous); end if;
    raise exception 'REALLOCATION_CONFLICT';
  end if;
  if p_source_id=p_destination_id or p_amount_cents<=0 then raise exception 'INVALID_REALLOCATION'; end if;
  if p_reversal_of is not null then
    select * into original from public.donation_fund_movements where environment=p_environment and id=p_reversal_of;
    if not found or original.reversal_of is not null or original.source_id<>p_destination_id or original.destination_id<>p_source_id or original.amount_cents<>p_amount_cents then raise exception 'INVALID_REVERSAL'; end if;
    if exists(select 1 from public.donation_fund_movements where environment=p_environment and reversal_of=p_reversal_of) then raise exception 'ALREADY_REVERSED'; end if;
  end if;
  select coalesce(sum(paid_cents),0) into available from public.donation_ledger
    where environment=p_environment and destination_id=p_source_id and included=true and payment_status='PAID' and paid_cents>=amount_cents;
  select available+coalesce(sum(case when destination_id=p_source_id then amount_cents else 0 end),0)-coalesce(sum(case when source_id=p_source_id then amount_cents else 0 end),0)
    into available from public.donation_fund_movements where environment=p_environment;
  if available<p_amount_cents then raise exception 'INSUFFICIENT_ALLOCATION'; end if;
  insert into public.donation_fund_movements(environment,id,source_id,source_title,destination_id,destination_title,amount_cents,responsible,reason,reversal_of)
    values(p_environment,p_id,p_source_id,p_source_title,p_destination_id,p_destination_title,p_amount_cents,p_responsible,p_reason,p_reversal_of) returning * into created;
  return public.donation_movement_json(created);
end;
$$;

create or replace function public.donation_fund_report(p_environment text,p_start date,p_end date,p_page integer) returns jsonb
language sql stable security invoker set search_path='' as $$
  with selected as (
    select * from public.donation_fund_movements where environment=p_environment and (created_at at time zone 'America/Sao_Paulo')::date between p_start and p_end
  ), page_rows as (select * from selected order by created_at desc,id limit 50 offset ((p_page-1)*50))
  select jsonb_build_object('balances',public.donation_fund_balances(p_environment),
    'movements',coalesce((select jsonb_agg(public.donation_movement_json(page_rows::public.donation_fund_movements) order by created_at desc,id) from page_rows),'[]'::jsonb),
    'nextPage',case when p_page*50<(select count(*) from selected) then p_page+1 else null end,'generatedAt',now());
$$;

revoke all on function public.donation_fund_balances(text),public.donation_movement_json(public.donation_fund_movements),
  public.record_donation_reallocation(text,uuid,text,text,text,text,integer,text,text,uuid),public.donation_fund_report(text,date,date,integer) from public,anon,authenticated;
grant execute on function public.donation_fund_balances(text),public.donation_movement_json(public.donation_fund_movements),
  public.record_donation_reallocation(text,uuid,text,text,text,text,integer,text,text,uuid),public.donation_fund_report(text,date,date,integer) to service_role;

create table if not exists public.supporter_login_challenges (
  environment text not null check(environment in ('production','stage')),
  id uuid not null default gen_random_uuid(),
  donor_email text not null,
  document_suffix text not null check(document_suffix ~ '^[0-9]{4}$'),
  email_hash text not null,
  ip_hash text not null,
  eligible boolean not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now()+interval '10 minutes'),
  attempts integer not null default 0,
  consumed_at timestamptz,
  primary key(environment,id)
);
create index if not exists supporter_challenge_email_idx on public.supporter_login_challenges(environment,email_hash,created_at desc);
create index if not exists supporter_challenge_ip_idx on public.supporter_login_challenges(environment,ip_hash,created_at desc);

create table if not exists public.supporter_sessions (
  environment text not null check(environment in ('production','stage')),
  session_hash text not null check(session_hash ~ '^[0-9a-f]{64}$'),
  user_id uuid not null references auth.users(id) on delete cascade,
  donor_email text not null,
  document_suffix text not null check(document_suffix ~ '^[0-9]{4}$'),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now()+interval '30 minutes'),
  revoked_at timestamptz,
  primary key(environment,session_hash)
);
alter table public.supporter_login_challenges enable row level security;
alter table public.supporter_sessions enable row level security;
revoke all on public.supporter_login_challenges,public.supporter_sessions from public,anon,authenticated,service_role;
grant select,insert,update,delete on public.supporter_login_challenges,public.supporter_sessions to service_role;

create or replace function public.begin_supporter_login(p_environment text,p_email text,p_suffix text,p_email_hash text,p_ip_hash text) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare challenge public.supporter_login_challenges; matches boolean;
begin
  perform pg_advisory_xact_lock(hashtextextended('supporter-login:'||p_environment,0));
  delete from public.supporter_login_challenges where expires_at<now()-interval '1 day';
  delete from public.supporter_sessions where expires_at<now()-interval '1 day';
  if (select count(*) from public.supporter_login_challenges where environment=p_environment and email_hash=p_email_hash and created_at>now()-interval '15 minutes')>=5
    or (select count(*) from public.supporter_login_challenges where environment=p_environment and ip_hash=p_ip_hash and created_at>now()-interval '15 minutes')>=20 then
    raise exception 'SUPPORTER_RATE_LIMIT';
  end if;
  select exists(select 1 from public.donation_ledger where environment=p_environment and source='cora' and included=true and payment_status='PAID' and paid_cents>=amount_cents
    and lower(donor_email)=lower(p_email) and right(masked_document,4)=p_suffix) into matches;
  insert into public.supporter_login_challenges(environment,donor_email,document_suffix,email_hash,ip_hash,eligible)
    values(p_environment,lower(p_email),p_suffix,p_email_hash,p_ip_hash,matches) returning * into challenge;
  return jsonb_build_object('id',challenge.id,'email',challenge.donor_email,'eligible',challenge.eligible);
end;
$$;

create or replace function public.attempt_supporter_challenge(p_environment text,p_id uuid) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare challenge public.supporter_login_challenges;
begin
  update public.supporter_login_challenges set attempts=attempts+1
    where environment=p_environment and id=p_id and expires_at>now() and consumed_at is null and attempts<5 returning * into challenge;
  if not found then raise exception 'INVALID_SUPPORTER_CHALLENGE'; end if;
  return jsonb_build_object('id',challenge.id,'email',challenge.donor_email,'eligible',challenge.eligible);
end;
$$;

create or replace function public.complete_supporter_login(p_environment text,p_challenge_id uuid,p_user_id uuid,p_verified_email text,p_session_hash text) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare challenge public.supporter_login_challenges; session public.supporter_sessions;
begin
  select * into challenge from public.supporter_login_challenges where environment=p_environment and id=p_challenge_id for update;
  if not found or not challenge.eligible or challenge.attempts<1 or challenge.attempts>5 or challenge.expires_at<=now() or challenge.consumed_at is not null
    or lower(p_verified_email) is distinct from challenge.donor_email then raise exception 'INVALID_SUPPORTER_CHALLENGE'; end if;
  update public.supporter_login_challenges set consumed_at=now() where environment=p_environment and id=p_challenge_id;
  insert into public.supporter_sessions(environment,session_hash,user_id,donor_email,document_suffix)
    values(p_environment,p_session_hash,p_user_id,challenge.donor_email,challenge.document_suffix) returning * into session;
  return jsonb_build_object('expiresAt',session.expires_at);
end;
$$;

create or replace function public.end_supporter_session(p_environment text,p_session_hash text) returns void
language sql security invoker set search_path='' as $$
  update public.supporter_sessions set revoked_at=now() where environment=p_environment and session_hash=p_session_hash;
$$;

create or replace function public.supporter_portal(p_environment text,p_session_hash text,p_page integer) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare session public.supporter_sessions; profile jsonb;
begin
  select * into session from public.supporter_sessions where environment=p_environment and session_hash=p_session_hash and revoked_at is null and expires_at>now();
  if not found then raise exception 'INVALID_SUPPORTER_SESSION'; end if;
  with own_records as (
    select * from public.donation_ledger where environment=p_environment and source='cora' and included=true
      and lower(donor_email)=session.donor_email and right(masked_document,4)=session.document_suffix
  ), page_rows as (select * from own_records order by created_at desc nulls last,id limit 50 offset ((p_page-1)*50))
  select jsonb_build_object('name',coalesce((select donor_name from own_records order by created_at desc nulls last,id limit 1),'Apoiador'),
    'email',session.donor_email,'documentSuffix',session.document_suffix,'expiresAt',session.expires_at,
    'totalCents',coalesce((select sum(paid_cents) from own_records where payment_status='PAID' and paid_cents>=amount_cents),0),
    'donationCount',(select count(*) from own_records where payment_status='PAID' and paid_cents>=amount_cents),
    'donations',coalesce((select jsonb_agg(jsonb_build_object('id',id,'createdAt',created_at,'paidOn',paid_on,'status',payment_status,
      'amountCents',amount_cents,'paidCents',paid_cents,'destinationTitle',destination_title,'method',method) order by created_at desc nulls last,id) from page_rows),'[]'::jsonb),
    'nextPage',case when p_page*50<(select count(*) from own_records) then p_page+1 else null end) into profile;
  return profile;
end;
$$;

revoke all on function public.begin_supporter_login(text,text,text,text,text),public.attempt_supporter_challenge(text,uuid),
  public.complete_supporter_login(text,uuid,uuid,text,text),public.end_supporter_session(text,text),public.supporter_portal(text,text,integer) from public,anon,authenticated;
grant execute on function public.begin_supporter_login(text,text,text,text,text),public.attempt_supporter_challenge(text,uuid),
  public.complete_supporter_login(text,uuid,uuid,text,text),public.end_supporter_session(text,text),public.supporter_portal(text,text,integer) to service_role;

notify pgrst,'reload schema';
commit;
