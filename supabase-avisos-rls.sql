-- Ejecutá este SQL en el SQL Editor de tu proyecto Supabase
-- para permitir que la app pueda insertar y leer avisos.

-- 1) Asegurar que RLS esté habilitado (si ya lo está, no pasa nada)
alter table public.avisos enable row level security;

-- 2) Permitir leer avisos (necesario para mostrar las cards)
drop policy if exists "Permitir leer avisos" on public.avisos;
create policy "Permitir leer avisos"
on public.avisos
for select
to anon, authenticated
using (true);

-- 3) Permitir insertar avisos solo a usuarios autenticados
--    y siempre a su propio nombre (auth.uid() = user_id).
drop policy if exists "Permitir insertar avisos" on public.avisos;
drop policy if exists "Insertar avisos propios" on public.avisos;
create policy "Insertar avisos propios"
on public.avisos
for insert
to authenticated
with check (auth.uid() = user_id);

-- 4) Cada usuario puede eliminar solo sus propios avisos
drop policy if exists "Eliminar avisos propios" on public.avisos;
create policy "Eliminar avisos propios"
on public.avisos
for delete
to authenticated
using (auth.uid() = user_id);

-- Nota: cualquiera puede leer los avisos, pero solo los usuarios
-- autenticados pueden publicar y siempre quedan asociados a su cuenta.
-- Las columnas user_id y author_name se crean en supabase-avisos-autor.sql.
