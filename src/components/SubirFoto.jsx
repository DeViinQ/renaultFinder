import { useId, useState } from "react";

// Achicamos las fotos antes de guardarlas: una foto de celular de 4 MB
// puede quedar en unos pocos cientos de KB y la página carga mucho más rápido.
const MAX_SIDE = 1200;
const QUALITY = 0.82;

function comprimirImagen(archivo) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(archivo);
    const imagen = new Image();

    imagen.onload = () => {
      URL.revokeObjectURL(url);

      try {
        const escala = Math.min(1, MAX_SIDE / Math.max(imagen.width, imagen.height));
        const ancho = Math.max(1, Math.round(imagen.width * escala));
        const alto = Math.max(1, Math.round(imagen.height * escala));

        const canvas = document.createElement("canvas");
        canvas.width = ancho;
        canvas.height = alto;

        const contexto = canvas.getContext("2d");
        if (!contexto) throw new Error("No se pudo procesar la imagen.");

        contexto.drawImage(imagen, 0, 0, ancho, alto);

        // WebP pesa bastante menos que JPG/PNG y mantiene la transparencia.
        resolve(canvas.toDataURL("image/webp", QUALITY));
      } catch (error) {
        reject(error);
      }
    };

    imagen.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo leer la imagen."));
    };

    imagen.src = url;
  });
}

export default function SubirFoto({ form, setForm }) {
  const inputId = useId();
  // 1. Estado para guardar la foto seleccionada y mostrarla
  const [fotoPrevia, setFotoPrevia] = useState(form?.img || null);

  // 2. Función que se ejecuta cuando el usuario elige un archivo
  const cuandoCambieElArchivo = async (evento) => {
    const archivo = evento.target.files?.[0];

    if (!archivo) {
      setFotoPrevia(null);
      if (setForm) {
        setForm((prev) => ({ ...prev, img: "" }));
      }
      return;
    }

    try {
      const resultado = await comprimirImagen(archivo);
      setFotoPrevia(resultado);

      if (setForm) {
        setForm((prev) => ({ ...prev, img: resultado }));
      }
    } catch {
      // Si algo falla, usamos el archivo original como respaldo.
      const lector = new FileReader();

      lector.onload = (e) => {
        const resultado = e.target.result;
        setFotoPrevia(resultado);

        if (setForm) {
          setForm((prev) => ({ ...prev, img: resultado }));
        }
      };

      lector.readAsDataURL(archivo);
    }
  };

  return (
    <div className="grid place-items-center gap-2">
      <label htmlFor={inputId} className="cursor-pointer text-[#5b9981] underline decoration-[#b9d8c8] underline-offset-2 transition-colors hover:text-[#4a826d] dark:text-dk-brand dark:decoration-[#3f6b57] dark:hover:text-[#a9e0c5]">
        {fotoPrevia ? "Cambiar foto" : "Haz clic aquí para seleccionar una foto"}
      </label>
      <span className="text-[11px] font-medium text-[#9aa8a2] dark:text-dk-faint">{fotoPrevia ? "Imagen seleccionada" : "JPG o PNG"}</span>

      {/* El input oculto */}
      <input
        id={inputId}
        type="file"
        accept=".jpg, .jpeg, .png, .webp"
        className="hidden"
        onChange={cuandoCambieElArchivo}
      />

      {/* La vista previa (solo se muestra si hay una foto seleccionada) */}
      {fotoPrevia && (
        <img
          src={fotoPrevia}
          alt="Vista previa"
          className="mt-1 max-h-[140px] w-auto max-w-full rounded-[10px] border border-[#e5eeea] object-cover shadow-sm dark:border-dk-border-strong"
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
}
