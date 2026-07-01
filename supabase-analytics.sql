create table if not exists public.quiz_analytics_events (
  id uuid primary key default gen_random_uuid(),
  event text not null,
  step text not null,
  timestamp bigint not null,
  session_id text not null,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.quiz_analytics_events enable row level security;

drop policy if exists "Allow public quiz analytics inserts" on public.quiz_analytics_events;
create policy "Allow public quiz analytics inserts"
on public.quiz_analytics_events
for insert
to anon
with check (true);

drop policy if exists "Allow public quiz analytics reads" on public.quiz_analytics_events;
create policy "Allow public quiz analytics reads"
on public.quiz_analytics_events
for select
to anon
using (true);

drop policy if exists "Allow public quiz analytics deletes" on public.quiz_analytics_events;
create policy "Allow public quiz analytics deletes"
on public.quiz_analytics_events
for delete
to anon
using (true);

create index if not exists quiz_analytics_events_timestamp_idx
on public.quiz_analytics_events (timestamp desc);

create index if not exists quiz_analytics_events_step_idx
on public.quiz_analytics_events (step);

create index if not exists quiz_analytics_events_session_idx
on public.quiz_analytics_events (session_id);
