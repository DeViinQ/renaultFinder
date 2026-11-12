import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "../../../db/supabase";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const DELETE: APIRoute = async ({ params, request }) => {
  try {
    // El usuario se toma del token de la sesión, nunca del body.
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.toLowerCase().startsWith("bearer ")
      ? authHeader.slice(7).trim()
      : "";

    if (!token) {
      return json({ error: "Iniciá sesión para eliminar un aviso." }, 401);
    }

    const { data: authData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authData?.user) {
      return json({ error: "Tu sesión venció. Volvé a iniciar sesión." }, 401);
    }

    const id = params.id;
    // Los avisos pueden tener id numérico (5, 6...) o UUID.
    const isValidId =
      typeof id === "string" &&
      (/^\d+$/.test(id) || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id));

    if (!isValidId) {
      return json({ error: "Aviso inválido." }, 400);
    }

    // Cliente autenticado con el token del usuario: RLS decide qué puede borrar.
    const userClient = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: { persistSession: false, autoRefreshToken: false },
        global: { headers: { Authorization: `Bearer ${token}` } },
      }
    );

    // Primero verificamos que el aviso exista y sea del usuario.
    const { data: aviso, error: fetchError } = await userClient
      .from("avisos")
      .select("id,user_id,imageurl")
      .eq("id", id)
      .maybeSingle();

    if (fetchError) {
      return json({ error: fetchError.message }, 500);
    }

    if (!aviso) {
      return json({ error: "El aviso no existe o no tenés permiso para verlo." }, 404);
    }

    if (aviso.user_id !== authData.user.id) {
      return json({ error: "No podés eliminar un aviso de otra persona." }, 403);
    }

    const { data: deleted, error: deleteError } = await userClient
      .from("avisos")
      .delete()
      .eq("id", id)
      .eq("user_id", authData.user.id)
      .select("id");

    if (deleteError) {
      return json({ error: deleteError.message }, 500);
    }

    // Si RLS no tiene la policy de borrado, la fila no se elimina.
    if (!deleted || deleted.length === 0) {
      return json(
        {
          error:
            "No se pudo eliminar el aviso. Ejecutá supabase-avisos-autor.sql en Supabase para habilitar el borrado.",
        },
        403
      );
    }

    // Si la foto está en Supabase Storage, la borramos también.
    const imageUrl = typeof aviso.imageurl === "string" ? aviso.imageurl : "";
    const marker = "/storage/v1/object/public/avisos/";

    if (imageUrl) {
      try {
        const parsed = new URL(imageUrl);
        const projectUrl = new URL(import.meta.env.PUBLIC_SUPABASE_URL);

        if (parsed.origin === projectUrl.origin && parsed.pathname.startsWith(marker)) {
          const path = decodeURIComponent(parsed.pathname.slice(marker.length));
          await userClient.storage.from("avisos").remove([path]);
        }
      } catch {
        // La foto no se pudo borrar, pero el aviso ya no existe.
      }
    }

    return json({ ok: true });
  } catch {
    return json({ error: "Error al eliminar el aviso." }, 500);
  }
};
