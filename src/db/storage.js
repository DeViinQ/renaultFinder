import { supabase } from "./supabase";

const BUCKET = "avisos";

/**
 * Guarda la foto del aviso en Supabase Storage y devuelve su URL pública.
 *
 * Si el bucket todavía no está configurado (ver supabase-storage.sql),
 * devuelve la imagen comprimida tal cual para que publicar nunca falle.
 */
export async function guardarImagen(image, userId) {
  if (!image || !image.startsWith("data:")) return image || null;

  try {
    const blob = await (await fetch(image)).blob();
    const extension =
      blob.type === "image/png" ? "png" : blob.type === "image/jpeg" ? "jpg" : "webp";
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const path = `${userId}/${id}.${extension}`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
      contentType: blob.type || "image/webp",
      cacheControl: "31536000",
      upsert: false,
    });

    if (error) throw error;

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  } catch {
    // Respaldo: la imagen comprimida se guarda dentro del aviso.
    return image;
  }
}
