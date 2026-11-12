import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "../../db/supabase";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  try {
    // El usuario se toma del token de la sesión, nunca del body.
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.toLowerCase().startsWith("bearer ")
      ? authHeader.slice(7).trim()
      : "";

    if (!token) {
      return json({ error: "Iniciá sesión para publicar un aviso." }, 401);
    }

    const { data: authData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authData?.user) {
      return json({ error: "Tu sesión venció. Volvé a iniciar sesión." }, 401);
    }

    const user = authData.user;
    const body = await request.json();

    const metadata = user.user_metadata || {};
    const authorName =
      (typeof metadata.display_name === "string" && metadata.display_name.trim()) ||
      (typeof metadata.name === "string" && metadata.name.trim()) ||
      (user.email ? user.email.split("@")[0] : "") ||
      "Miembro de la comunidad";

    const aviso = {
      title: body.name ?? "",
      details: body.details ?? "",
      place: body.place ?? "",
      type: body.type ?? "Perdido",
      category: body.category ?? "",
      date: body.date ?? null,
      imageurl: body.imageurl ?? null,
      user_id: user.id,
      author_name: authorName,
    };

    if (!aviso.title || !aviso.details || !aviso.place) {
      return json({ error: "Faltan campos obligatorios." }, 400);
    }

    // Cliente autenticado con el token del usuario: así RLS sabe quién inserta.
    const userClient = createClient(
      import.meta.env.PUBLIC_SUPABASE_URL,
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: { persistSession: false, autoRefreshToken: false },
        global: { headers: { Authorization: `Bearer ${token}` } },
      }
    );

    let { data, error } = await userClient.from("avisos").insert([aviso]).select();

    // Si todavía no se agregó la columna author_name, publicamos igual.
    if (error && /author_name/i.test(error.message)) {
      const avisoSinAutor: Record<string, unknown> = { ...aviso };
      delete avisoSinAutor.author_name;
      ({ data, error } = await userClient.from("avisos").insert([avisoSinAutor]).select());
    }

    if (error) {
      return json({ error: error.message }, 500);
    }

    return json({ ok: true, data });
  } catch (e) {
    return json({ error: "Error al procesar el aviso." }, 500);
  }
};
