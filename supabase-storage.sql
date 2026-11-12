-- Ejecutá este SQL en el SQL Editor de tu proyecto Supabase.
-- Crea el bucket donde se guardan las fotos de los avisos.
-- Sin esto la app sigue funcionando (guarda la foto comprimida dentro
-- del aviso), pero las páginas cargan más lento.

-- 1) Bucket público para las fotos
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avisos',
  'avisos',
  true,
  5242880,
  array['image/webp', 'image/jpeg', 'image/png']
)
on conflict (id) do update
set public = true,
    file_size_limit = 5242880,
    allowed_mime_types = array['image/webp', 'image/jpeg', 'image/png'];

-- 2) Cualquiera puede ver las fotos
drop policy if exists "Fotos de avisos visibles" on storage.objects;
create policy "Fotos de avisos visibles"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'avisos');

-- 3) Solo usuarios autenticados suben fotos, y solo en su propia carpeta
drop policy if exists "Subir fotos de avisos" on storage.objects;
create policy "Subir fotos de avisos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avisos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- 4) Cada usuario puede borrar sus propias fotos
drop policy if exists "Borrar fotos propias" on storage.objects;
create policy "Borrar fotos propias"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avisos'
  and (storage.foldername(name))[1] = auth.uid()::text
);
