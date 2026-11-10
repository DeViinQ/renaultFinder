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

-- 3) Permitir insertar avisos (necesario para publicar desde el formulario)
drop policy if exists "Permitir insertar avisos" on public.avisos;
create policy "Permitir insertar avisos"
on public.avisos
for insert
to anon, authenticated
with check (true);

-- Nota: estas policies son abiertas (permiten a cualquiera leer/insertar).
-- Sirven para desarrollo/aprendizaje. En producción conviene restringirlas.
