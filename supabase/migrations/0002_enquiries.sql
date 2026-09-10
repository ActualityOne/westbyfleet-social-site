-- Contact form enquiries. Public can submit; only allow-listed admins can read/manage.

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  reason text not null,
  event_date date,
  guests int,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.enquiries enable row level security;

create policy "Public can submit enquiries"
  on public.enquiries for insert
  to anon, authenticated
  with check (true);

create policy "Admins can read enquiries"
  on public.enquiries for select
  to authenticated
  using (auth.jwt() ->> 'email' in (select email from public.admins));

create policy "Admins can update enquiries"
  on public.enquiries for update
  to authenticated
  using (auth.jwt() ->> 'email' in (select email from public.admins))
  with check (auth.jwt() ->> 'email' in (select email from public.admins));

create policy "Admins can delete enquiries"
  on public.enquiries for delete
  to authenticated
  using (auth.jwt() ->> 'email' in (select email from public.admins));
