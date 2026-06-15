create extension if not exists "pgcrypto";

create table if not exists public.musico_users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  queue jsonb not null default '[]'::jsonb,
  original_queue jsonb not null default '[]'::jsonb,
  current_song integer not null default 0,
  is_shuffle boolean not null default false,
  refresh_token text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.musico_playlists (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author uuid not null references public.musico_users(id) on delete cascade,
  songs jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists musico_playlists_author_idx
  on public.musico_playlists(author);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_musico_users_updated_at on public.musico_users;
create trigger set_musico_users_updated_at
before update on public.musico_users
for each row execute function public.set_updated_at();

drop trigger if exists set_musico_playlists_updated_at on public.musico_playlists;
create trigger set_musico_playlists_updated_at
before update on public.musico_playlists
for each row execute function public.set_updated_at();

alter table public.musico_users enable row level security;
alter table public.musico_playlists enable row level security;

drop policy if exists "Service role manages musico users" on public.musico_users;
create policy "Service role manages musico users"
on public.musico_users
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "Service role manages musico playlists" on public.musico_playlists;
create policy "Service role manages musico playlists"
on public.musico_playlists
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
