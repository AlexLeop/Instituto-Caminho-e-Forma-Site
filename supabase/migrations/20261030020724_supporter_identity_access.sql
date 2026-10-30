begin;

-- Do not create an Auth user or mark an email as verified for identity-only access.
alter table public.supporter_sessions alter column user_id drop not null;
alter table public.supporter_sessions add column if not exists authentication_method text not null default 'email_code'
  check(authentication_method in ('email_code','email_document'));
do $$ begin
  if not exists(select 1 from pg_constraint where conrelid='public.supporter_sessions'::regclass and conname='supporter_sessions_verified_user_check') then
    alter table public.supporter_sessions add constraint supporter_sessions_verified_user_check
      check(authentication_method='email_document' or user_id is not null);
  end if;
end; $$;

create or replace function public.complete_supporter_identity_login(p_environment text,p_challenge_id uuid,p_session_hash text) returns jsonb
language plpgsql security invoker set search_path='' as $$
declare challenge public.supporter_login_challenges; session public.supporter_sessions;
begin
  select * into challenge from public.supporter_login_challenges where environment=p_environment and id=p_challenge_id for update;
  if not found or not challenge.eligible or challenge.attempts<>0 or challenge.expires_at<=now() or challenge.consumed_at is not null then
    raise exception 'INVALID_SUPPORTER_CHALLENGE';
  end if;
  -- Recheck eligibility at session creation, including exclusion of tests.
  if not exists(select 1 from public.donation_ledger where environment=p_environment and source='cora' and included and payment_status='PAID' and paid_cents>=amount_cents
    and lower(donor_email)=challenge.donor_email and right(masked_document,4)=challenge.document_suffix) then raise exception 'INVALID_SUPPORTER_CHALLENGE'; end if;
  update public.supporter_login_challenges set consumed_at=now(),attempts=1 where environment=p_environment and id=p_challenge_id;
  insert into public.supporter_sessions(environment,session_hash,user_id,donor_email,document_suffix,authentication_method)
    values(p_environment,p_session_hash,null,challenge.donor_email,challenge.document_suffix,'email_document') returning * into session;
  return jsonb_build_object('expiresAt',session.expires_at);
end;
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
    'email',session.donor_email,'documentSuffix',session.document_suffix,'expiresAt',session.expires_at,'authenticationMethod',session.authentication_method,
    'totalCents',coalesce((select sum(paid_cents) from own_records where payment_status='PAID' and paid_cents>=amount_cents),0),
    'donationCount',(select count(*) from own_records where payment_status='PAID' and paid_cents>=amount_cents),
    'donations',coalesce((select jsonb_agg(jsonb_build_object('id',id,'createdAt',created_at,'paidOn',paid_on,'status',payment_status,
      'amountCents',amount_cents,'paidCents',paid_cents,'destinationTitle',destination_title,'method',method) order by created_at desc nulls last,id) from page_rows),'[]'::jsonb),
    'nextPage',case when p_page*50<(select count(*) from own_records) then p_page+1 else null end) into profile;
  return profile;
end;
$$;

revoke all on function public.complete_supporter_identity_login(text,uuid,text) from public,anon,authenticated;
grant execute on function public.complete_supporter_identity_login(text,uuid,text) to service_role;
notify pgrst,'reload schema';
commit;
