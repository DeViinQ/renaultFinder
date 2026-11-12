-- Ejecutá este SQL en el SQL Editor de tu proyecto Supabase
-- para guardar el nombre visible (display name), apellido y curso de cada alumno.

-- 1) Tabla de perfiles
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  last_name text,
  course text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) RLS: cada usuario puede leer todos los perfiles, pero solo crear/editar el suyo
alter table public.profiles enable row level security;

drop policy if exists "Perfiles visibles para usuarios autenticados" on public.profiles;
create policy "Perfiles visibles para usuarios autenticados"
on public.profiles
for select
to authenticated
using (true);

drop policy if exists "Crear el propio perfil" on public.profiles;
create policy "Crear el propio perfil"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "Editar el propio perfil" on public.profiles;
create policy "Editar el propio perfil"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- 3) Crear el perfil automáticamente cuando se registra un usuario.
-- Toma el nombre visible y los datos enviados desde Signup.jsx.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, last_name, course, email)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'display_name', ''),
      split_part(coalesce(new.email, ''), '@', 1)
    ),
    nullif(new.raw_user_meta_data ->> 'last_name', ''),
    nullif(new.raw_user_meta_data ->> 'course', ''),
    new.email
  )
  on conflict (id) do update set
    display_name = excluded.display_name,
    last_name = coalesce(excluded.last_name, public.profiles.last_name),
    course = coalesce(excluded.course, public.profiles.course),
    email = excluded.email,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- 4) Completar los perfiles de usuarios que ya se registraron antes.
insert into public.profiles (id, display_name, last_name, course, email)
select
  u.id,
  coalesce(
    nullif(u.raw_user_meta_data ->> 'display_name', ''),
    split_part(coalesce(u.email, ''), '@', 1)
  ),
  nullif(u.raw_user_meta_data ->> 'last_name', ''),
  nullif(u.raw_user_meta_data ->> 'course', ''),
  u.email
from auth.users u
on conflict (id) do nothing;
