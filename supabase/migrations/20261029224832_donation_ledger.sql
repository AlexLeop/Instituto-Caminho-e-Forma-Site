begin;

create table if not exists public.donation_ledger (
  environment text not null check (environment in ('production', 'stage')),
  id text not null,
  source text not null check (source in ('cora', 'externo')),
  payment_status text not null check (payment_status in ('DRAFT', 'OPEN', 'IN_PAYMENT', 'PAID', 'LATE', 'CANCELLED')),
  invoice_code text,
  created_at timestamptz,
  paid_on date,
  donor_name text not null,
  donor_email text not null default '',
  masked_document text not null default '',
  amount_cents integer not null check (amount_cents >= 500),
  paid_cents integer not null check (paid_cents >= 0),
  method text not null,
  destination_id text,
  destination_title text not null,
  original_description text not null default '',
  reconciliation_note text not null,
  included boolean not null,
  bank_observed_at timestamptz not null default now(),
  primary key (environment, id)
);

create table if not exists public.donation_ledger_events (
  event_id bigint generated always as identity primary key,
  environment text not null,
  donation_id text not null,
  recorded_at timestamptz not null default now(),
  operation text not null check (operation in ('INSERT', 'UPDATE')),
  previous_snapshot jsonb,
  snapshot jsonb not null,
  foreign key (environment, donation_id) references public.donation_ledger(environment, id)
);

alter table public.donation_ledger enable row level security;
alter table public.donation_ledger_events enable row level security;
revoke all on public.donation_ledger, public.donation_ledger_events from public, anon, authenticated, service_role;
grant select, insert, update on public.donation_ledger to service_role;
grant select, insert on public.donation_ledger_events to service_role;
revoke all on sequence public.donation_ledger_events_event_id_seq from public, anon, authenticated, service_role;
grant usage, select on sequence public.donation_ledger_events_event_id_seq to service_role;

create index if not exists donation_ledger_payment_period_idx on public.donation_ledger (environment, paid_on desc, id) where payment_status = 'PAID';
create index if not exists donation_ledger_events_donation_idx on public.donation_ledger_events (environment, donation_id, recorded_at);

create or replace function public.guard_donation_observation() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  new.invoice_code := coalesce(new.invoice_code, old.invoice_code);
  -- A delayed status read must not turn a confirmed payment back into pending.
  if new.bank_observed_at < old.bank_observed_at or
     (old.payment_status = 'PAID' and new.payment_status in ('DRAFT', 'OPEN', 'IN_PAYMENT', 'LATE')) then
    return null;
  end if;
  return new;
end;
$$;

create or replace function public.audit_donation_observation() returns trigger
language plpgsql security invoker set search_path = '' as $$
declare previous jsonb;
begin
  if tg_op = 'UPDATE' then previous := to_jsonb(old) - 'bank_observed_at'; end if;
  if tg_op = 'INSERT' or previous is distinct from (to_jsonb(new) - 'bank_observed_at') then
    insert into public.donation_ledger_events (environment, donation_id, operation, previous_snapshot, snapshot)
    values (new.environment, new.id, tg_op, previous, to_jsonb(new) - 'bank_observed_at');
  end if;
  return new;
end;
$$;

create or replace trigger donation_observation_guard before update on public.donation_ledger for each row execute function public.guard_donation_observation();
create or replace trigger donation_observation_audit after insert or update on public.donation_ledger for each row execute function public.audit_donation_observation();

create or replace function public.donation_public_totals(p_environment text) returns jsonb
language sql stable security invoker set search_path = '' as $$
  with totals as (
    select coalesce(destination_id, 'nao-identificado') as destination, sum(paid_cents)::bigint as cents
    from public.donation_ledger
    where environment = p_environment and included = true and payment_status = 'PAID' and paid_cents >= amount_cents
    group by destination_id
  )
  select jsonb_build_object(
    'generalFundCents', coalesce((select cents from totals where destination = 'geral'), 0),
    'eadCoursesCents', coalesce((select cents from totals where destination = 'cursos-ead'), 0),
    'unassignedCents', coalesce((select cents from totals where destination = 'nao-identificado'), 0),
    'projectsCents', coalesce((select sum(cents) from totals where destination not in ('geral', 'cursos-ead', 'nao-identificado')), 0),
    'totalCents', coalesce((select sum(cents) from totals), 0),
    'byDestination', coalesce((select jsonb_object_agg(destination, cents) from totals), '{}'::jsonb),
    'updatedAt', (select max(bank_observed_at) from public.donation_ledger where environment = p_environment)
  );
$$;

revoke all on function public.guard_donation_observation(), public.audit_donation_observation(), public.donation_public_totals(text) from public, anon, authenticated;
grant execute on function public.guard_donation_observation(), public.audit_donation_observation(), public.donation_public_totals(text) to service_role;
notify pgrst, 'reload schema';
commit;
