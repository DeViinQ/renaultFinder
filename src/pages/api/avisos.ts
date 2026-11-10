import type { APIRoute } from "astro";
import { supabase } from "../../db/supabase";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    const aviso = {
      title: body.name ?? "",
      details: body.details ?? "",
      place: body.place ?? "",
      type: body.type ?? "Perdido",
      category: body.category ?? "",
      date: body.date ?? null,
      imageurl: body.imageurl ?? null,
    };

    if (!aviso.title || !aviso.details || !aviso.place) {
      return new Response(
        JSON.stringify({ error: "Faltan campos obligatorios." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data, error } = await supabase.from("avisos").insert([aviso]).select();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Error al procesar el aviso." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
