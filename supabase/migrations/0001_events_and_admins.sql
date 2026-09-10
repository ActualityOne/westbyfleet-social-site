-- West Byfleet Social Club: events diary schema
-- Run this once against your Supabase project (SQL Editor, or `supabase db push`).

create extension if not exists pgcrypto;

-- Allow-list of email addresses permitted to manage the diary from /admin/.
-- Sign the admin up normally via Supabase Auth first, then add their email here.
create table if not exists public.admins (
  email text primary key
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null default 'special-night'
    check (category in ('bingo', 'quiz', 'live-music', 'karaoke', 'special-night', 'other')),
  event_date date not null,
  event_time time,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists events_event_date_idx on public.events (event_date);

alter table public.events enable row level security;
alter table public.admins enable row level security;

-- Anyone (including the anonymous public site) can read events.
create policy "Public can read events"
  on public.events for select
  using (true);

-- Only signed-in emails present in the admins allow-list can write.
create policy "Admins can insert events"
  on public.events for insert
  to authenticated
  with check (auth.jwt() ->> 'email' in (select email from public.admins));

create policy "Admins can update events"
  on public.events for update
  to authenticated
  using (auth.jwt() ->> 'email' in (select email from public.admins))
  with check (auth.jwt() ->> 'email' in (select email from public.admins));

create policy "Admins can delete events"
  on public.events for delete
  to authenticated
  using (auth.jwt() ->> 'email' in (select email from public.admins));

-- No public policy on admins: only readable/writable via the Supabase
-- dashboard (service role), so the allow-list itself can't be tampered
-- with from the client.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();
