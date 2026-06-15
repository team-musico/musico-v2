alter table public.musico_users
  add column if not exists role text not null default 'user';

alter table public.musico_users
  drop constraint if exists musico_users_role_check;

alter table public.musico_users
  add constraint musico_users_role_check check (role in ('user', 'admin'));
