import { useState } from "react";
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
      const res = await fetch("/api/avisos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          details: form.details,
          place: form.place,
          date: form.date,
          type: "Encontrado",
          imageurl: form.img || null,
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
    <form className="form-fields">
      <label className="form-field">
        Nombre del objeto
        <input
          type="text"
          placeholder="Ej. Llaves con llavero"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </label>

      <label className="form-field">
        Categoría
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
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

      <label className="form-field full">
        Descripción
        <textarea
          placeholder="Color, marca, detalles particulares..."
          value={form.details}
          onChange={(e) => setForm({ ...form, details: e.target.value })}
          required
        />
      </label>

      <label className="form-field">
        ¿Dónde lo encontraste?
        <input
          type="text"
          placeholder="Ej. Biblioteca"
          value={form.place}
          onChange={(e) => setForm({ ...form, place: e.target.value })}
          required
        />
      </label>

      <label className="form-field">
        Fecha aproximada
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
      </label>

      <div className="form-field full">
        Imagen del objeto
        <div className="upload-box">
          <SubirFoto form={form} setForm={setForm} />
        </div>
      </div>

      {error && (
        <p className="form-field full" style={{ color: "#b42318", margin: 0 }}>
          {error}
        </p>
      )}

      <div className="report-dialog-actions">
        <button className="page-button secondary" type="button" onClick={closeDialog}>
          Cancelar
        </button>
        <button className="page-button" type="button" onClick={handleSubmit} disabled={loading}>
          {loading ? "Publicando..." : "Enviar"} <span aria-hidden="true">→</span>
        </button>
      </div>
    </form>
  );
}
