-- Reviews: public can submit (moderation queue), public can only read
-- approved ones, admins can read/moderate everything.

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rating int not null check (rating between 1 and 5),
  comment text not null,
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

create policy "Public can submit reviews"
  on public.reviews for insert
  to anon, authenticated
  with check (true);

create policy "Public can read approved reviews"
  on public.reviews for select
  to anon, authenticated
  using (is_approved = true);

create policy "Admins can read all reviews"
  on public.reviews for select
  to authenticated
  using (auth.jwt() ->> 'email' in (select email from public.admins));

create policy "Admins can update reviews"
  on public.reviews for update
  to authenticated
  using (auth.jwt() ->> 'email' in (select email from public.admins))
  with check (auth.jwt() ->> 'email' in (select email from public.admins));

create policy "Admins can delete reviews"
  on public.reviews for delete
  to authenticated
  using (auth.jwt() ->> 'email' in (select email from public.admins));
