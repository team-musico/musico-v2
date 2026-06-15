create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

alter table if exists public.musico_users
  add column if not exists role text not null default 'user';

alter table if exists public.musico_users
  drop constraint if exists musico_users_role_check;

alter table if exists public.musico_users
  add constraint musico_users_role_check check (role in ('user', 'admin'));

create table if not exists public.musico_admin_playlists (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  songs jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists musico_admin_playlists_created_at_idx
  on public.musico_admin_playlists(created_at desc);

drop trigger if exists set_musico_admin_playlists_updated_at on public.musico_admin_playlists;
create trigger set_musico_admin_playlists_updated_at
before update on public.musico_admin_playlists
for each row execute function public.set_updated_at();

alter table public.musico_admin_playlists enable row level security;

drop policy if exists "Service role manages musico admin playlists" on public.musico_admin_playlists;
create policy "Service role manages musico admin playlists"
on public.musico_admin_playlists
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

notify pgrst, 'reload schema';
