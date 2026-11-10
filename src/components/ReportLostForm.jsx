import { useState } from "react";
import SubirFoto from "./SubirFoto";

export default function ReportLostForm() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    details: "",
    place: "",
    date: "",
    img: "",
    type: "lost", // Agregamos el campo "type" con valor "lost"
  });
  const [avisos, setAvisos] = useState([]);

  const handleChange = () => {
    setAvisos([...avisos, form]);
  };

  const closeDialog = () => {
    const dialog = document.getElementById("report-lost-dialog");
    if (dialog && typeof dialog.close === "function") dialog.close();
  };

  return (
    <form className="form-fields">
      <label className="form-field">
        Nombre del objeto
        <input
          type="text"
          placeholder="Ej. Mochila verde"
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
          <option value= "-" disabled>
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
        ¿Dónde lo viste por última vez?
        <input
          type="text"
          placeholder="Ej. Patio central"
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

      <div className="report-dialog-actions">

        <button className="page-button" type="button" onClick={handleChange}>
          Enviar <span aria-hidden="true">→</span>
        </button>
      </div>
    </form>
  );
}
