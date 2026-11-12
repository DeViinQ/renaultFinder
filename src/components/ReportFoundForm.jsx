import { useState } from "react";
import { supabase } from "../db/supabase";
import { guardarImagen } from "../db/storage";
import SubirFoto from "./SubirFoto";

export default function ReportFoundForm() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    details: "",
    place: "",
    date: "",
    img: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const closeDialog = () => {
    const dialog = document.getElementById("report-found-dialog");
    if (dialog && typeof dialog.close === "function") dialog.close();
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.name || !form.category || !form.details || !form.place || !form.date) {
      setError("Completá todos los campos.");
      return;
    }

    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Iniciá sesión para publicar un aviso.");

      // La foto va a Storage; si no está configurado, se usa el respaldo.
      const imageurl = await guardarImagen(form.img, session.user.id);

      const res = await fetch("/api/avisos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          details: form.details,
          place: form.place,
          date: form.date,
          type: "Encontrado",
          imageurl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo publicar el aviso.");

      closeDialog();
      window.location.reload();
    } catch (err) {
      setError(err.message || "Ocurrió un error al publicar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="grid grid-cols-2 gap-[15px] max-[520px]:grid-cols-1">
      <label className="grid gap-[7px] text-xs font-extrabold text-[#5d716b] dark:text-[#a9bdb6]">
        Nombre del objeto
        <input
          type="text"
          placeholder="Ej. Llaves con llavero"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="min-h-[43px] w-full rounded-[10px] border border-[#e5eeea] bg-[#fcfefd] px-3 py-2.5 text-[13px] font-medium text-[#526461] outline-none placeholder:text-[#a4b0ae] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#80c4a0] dark:border-dk-border-strong dark:bg-[#101a17] dark:text-dk-text dark:placeholder:text-[#6f857e]"
        />
      </label>

      <label className="grid gap-[7px] text-xs font-extrabold text-[#5d716b] dark:text-[#a9bdb6]">
        Categoría
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
          className="min-h-[43px] w-full rounded-[10px] border border-[#e5eeea] bg-[#fcfefd] px-3 py-2.5 text-[13px] font-medium text-[#526461] outline-none focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#80c4a0] dark:border-dk-border-strong dark:bg-[#101a17] dark:text-dk-text"
        >
          <option value="" disabled>
            Selecciona una categoría
          </option>
          <option value="Mochilas y bolsos">Mochilas y bolsos</option>
          <option value="Tecnología">Tecnología</option>
          <option value="Útiles">Útiles</option>
          <option value="Ropa">Ropa</option>
          <option value="Documentos">Documentos</option>
          <option value="Otros">Otros</option>
        </select>
      </label>

      <label className="col-span-full grid gap-[7px] text-xs font-extrabold text-[#5d716b] max-[520px]:col-span-1 dark:text-[#a9bdb6]">
        Descripción
        <textarea
          placeholder="Color, marca, detalles particulares..."
          value={form.details}
          onChange={(e) => setForm({ ...form, details: e.target.value })}
          required
          className="min-h-[94px] w-full resize-y rounded-[10px] border border-[#e5eeea] bg-[#fcfefd] px-3 py-2.5 text-[13px] font-medium text-[#526461] outline-none placeholder:text-[#a4b0ae] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#80c4a0] dark:border-dk-border-strong dark:bg-[#101a17] dark:text-dk-text dark:placeholder:text-[#6f857e]"
        />
      </label>

      <label className="grid gap-[7px] text-xs font-extrabold text-[#5d716b] dark:text-[#a9bdb6]">
        ¿Dónde lo encontraste?
        <input
          type="text"
          placeholder="Ej. Biblioteca"
          value={form.place}
          onChange={(e) => setForm({ ...form, place: e.target.value })}
          required
          className="min-h-[43px] w-full rounded-[10px] border border-[#e5eeea] bg-[#fcfefd] px-3 py-2.5 text-[13px] font-medium text-[#526461] outline-none placeholder:text-[#a4b0ae] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#80c4a0] dark:border-dk-border-strong dark:bg-[#101a17] dark:text-dk-text dark:placeholder:text-[#6f857e]"
        />
      </label>

      <label className="grid gap-[7px] text-xs font-extrabold text-[#5d716b] dark:text-[#a9bdb6]">
        Fecha aproximada
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
          className="min-h-[43px] w-full rounded-[10px] border border-[#e5eeea] bg-[#fcfefd] px-3 py-2.5 text-[13px] font-medium text-[#526461] outline-none focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#80c4a0] dark:border-dk-border-strong dark:bg-[#101a17] dark:text-dk-text"
        />
      </label>

      <div className="col-span-full grid gap-[7px] text-xs font-extrabold text-[#5d716b] max-[520px]:col-span-1 dark:text-[#a9bdb6]">
        Imagen del objeto
        <div className="grid min-h-[95px] place-content-center gap-[5px] rounded-xl border border-dashed border-[#cfe2d7] bg-[#f8fcf9] p-4 text-center text-xs font-bold text-[#71998a] dark:border-[#2f4a3f] dark:bg-dk-bg-soft dark:text-[#9ed3b8]">
          <SubirFoto form={form} setForm={setForm} />
        </div>
      </div>

      {error && (
        <p className="col-span-full grid gap-[7px] text-xs font-extrabold text-[#b42318] max-[520px]:col-span-1 dark:text-[#ff9b8f]">
          {error}
        </p>
      )}

      <div className="col-span-full flex justify-end gap-2.5 pt-[3px] max-[520px]:col-span-1 max-[520px]:flex-wrap">
        <button className="inline-flex min-h-[42px] cursor-pointer items-center justify-center gap-[9px] rounded-[13px] border border-[#e4ece8] bg-white px-[17px] text-[13px] font-extrabold text-[#5d8f7a] no-underline shadow-none transition duration-150 hover:-translate-y-0.5 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#80c4a0] max-[520px]:flex-1 dark:border-dk-border-strong dark:bg-dk-surface dark:text-dk-brand" type="button" onClick={closeDialog}>
          Cancelar
        </button>
        <button className="inline-flex min-h-[42px] cursor-pointer items-center justify-center gap-[9px] rounded-[13px] border border-transparent bg-[#65a98b] px-[17px] text-[13px] font-extrabold text-white no-underline shadow-[0_7px_16px_#65a98b30] transition duration-150 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_#65a98b38] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#80c4a0] max-[520px]:flex-1 dark:bg-dk-brand-strong dark:shadow-[0_7px_16px_#00000045] dark:hover:shadow-[0_10px_20px_#00000052]" type="button" onClick={handleSubmit} disabled={loading}>
          {loading ? "Publicando..." : "Enviar"} <span aria-hidden="true">→</span>
        </button>
      </div>
    </form>
  );
}
