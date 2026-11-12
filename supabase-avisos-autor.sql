-- Ejecutá este SQL en el SQL Editor de tu proyecto Supabase.
-- Guarda quién publicó cada aviso para mostrarlo en las tarjetas
-- y para que "Mis avisos" encuentre los avisos de cada usuario.

-- 1) Columnas necesarias (si ya existen, no pasa nada)
alter table public.avisos add column if not exists user_id uuid;
alter table public.avisos add column if not exists author_name text;

-- 2) Índice para buscar rápido los avisos de un usuario
create index if not exists avisos_user_id_idx on public.avisos (user_id);

-- 3) Vincular user_id con los usuarios de Supabase (opcional pero recomendado)
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'avisos_user_id_fkey'
      and conrelid = 'public.avisos'::regclass
  ) then
    alter table public.avisos
      add constraint avisos_user_id_fkey
      foreign key (user_id) references auth.users (id) on delete set null;
  end if;
end $$;

-- 4) Solo usuarios autenticados pueden insertar, y siempre a su propio nombre
drop policy if exists "Permitir insertar avisos" on public.avisos;
drop policy if exists "Insertar avisos propios" on public.avisos;
create policy "Insertar avisos propios"
on public.avisos
for insert
to authenticated
with check (auth.uid() = user_id);

-- 5) Cada usuario puede eliminar solo sus propios avisos
drop policy if exists "Eliminar avisos propios" on public.avisos;
create policy "Eliminar avisos propios"
on public.avisos
for delete
to authenticated
using (auth.uid() = user_id);

-- Nota: los avisos viejos tienen user_id en null porque se publicaron
-- antes de este cambio. No se pueden asignar automáticamente a un usuario.
-- Si querés reclamar los tuyos, podés hacerlo a mano:
--
-- update public.avisos
-- set user_id = 'TU-UUID-DE-AUTH'
-- where user_id is null;
