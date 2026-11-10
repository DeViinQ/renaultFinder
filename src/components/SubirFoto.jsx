import React, { useState } from 'react';

export default function SubirFoto({ form, setForm }) {
  // 1. Estado para guardar la foto seleccionada y mostrarla
  const [fotoPrevia, setFotoPrevia] = useState(form?.img || null);

  // 2. Función que se ejecuta cuando el usuario elige un archivo
  const cuandoCambieElArchivo = (evento) => {
    const archivo = evento.target.files[0];

    if (archivo) {
      const lector = new FileReader();

      lector.onload = (e) => {
        const resultado = e.target.result;
        // Guardamos el resultado en el estado para que React actualice la pantalla
        setFotoPrevia(resultado);

        // Si el componente padre pasó setForm, actualizamos también el estado del formulario
        if (setForm) {
          setForm((prev) => ({ ...prev, img: resultado }));
        }
      };

      lector.readAsDataURL(archivo);
    } else {
      setFotoPrevia(null);
      if (setForm) {
        setForm((prev) => ({ ...prev, img: "" }));
      }
    }
  };

  return (
    <div className="upload-box-content">
      <label htmlFor="mi-input" className="upload-box-trigger">
        {fotoPrevia ? "Cambiar foto" : "Haz clic aquí para seleccionar una foto"}
      </label>
      <span>{fotoPrevia ? "Imagen seleccionada" : "JPG o PNG"}</span>

      {/* El input oculto */}
      <input
        id="mi-input"
        type="file"
        accept=".jpg, .jpeg, .png"
        style={{ display: "none" }}
        onChange={cuandoCambieElArchivo}
      />

      {/* La vista previa (solo se muestra si hay una foto seleccionada) */}
      {fotoPrevia && (
        <img src={fotoPrevia} alt="Vista previa" className="upload-preview" />
      )}
    </div>
  );
}