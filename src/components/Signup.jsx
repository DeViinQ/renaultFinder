import { useState } from "react";
import { supabase } from "../db/supabase";

export default function Signupform() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [name, setName] = useState("");
  const [apellido, setApellido] = useState("");
  const [curso, setCurso] = useState("");
  const [loading, setLoading] = useState(false);


// Función para registrarse
  async function registrarse() {
    const displayName = name.trim();
    const lastName = apellido.trim();
    const course = curso.trim();

    // Solo alumnos del ITR
    if (!email.endsWith("@alumnos.itr.edu.ar")) {
      setMsg("Solo alumnos del ITR pueden registrarse.");
      return;
    }
    if (!displayName) {
      setMsg("Ingresá tu nombre para mostrarlo en la app.");
      return;
    }
    if (!course) {
      setMsg("Seleccioná tu curso.");
      return;
    }
    if (password.length < 6) {
      setMsg("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    setMsg("");

    // El nombre visible (display name) y los datos del alumno se guardan
    // en los metadatos del usuario de Supabase (auth.users).
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
          last_name: lastName,
          course,
        },
      },
    });

    if (error) {
      setMsg(error.message);
      setLoading(false);
      return;
    }

    // Si la confirmación por mail está desactivada ya tenemos sesión:
    // guardamos también el perfil en la tabla public.profiles.
    if (data.session && data.user) {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: data.user.id,
        display_name: displayName,
        last_name: lastName || null,
        course: course || null,
        email,
      });

      if (profileError) {
        // No bloqueamos el registro: el nombre ya quedó en auth.users.
        console.error("No se pudo guardar el perfil:", profileError.message);
      }

      window.location.href = "/";
      return;
    }

    setLoading(false);
    setMsg("Revisá tu mail para confirmar.");
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Nombre visible (se muestra en la app)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="my-[5px] w-full rounded-lg border border-[#d9d5cc] bg-white px-3 py-[9px] text-base text-[#333] focus:border-[#6ea991] focus:outline-none dark:border-dk-border-strong dark:bg-[#101a17] dark:text-dk-text dark:focus:border-dk-brand dark:focus:shadow-[0_0_0_3px_#8ed0b029]"
      />
      <br />
      <input
        type="text"
        placeholder="Apellido"
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
        className="my-[5px] w-full rounded-lg border border-[#d9d5cc] bg-white px-3 py-[9px] text-base text-[#333] focus:border-[#6ea991] focus:outline-none dark:border-dk-border-strong dark:bg-[#101a17] dark:text-dk-text dark:focus:border-dk-brand dark:focus:shadow-[0_0_0_3px_#8ed0b029]"
      />
      <br />
      <select
        value={curso}
        onChange={(e) => setCurso(e.target.value)}
        required
        className="my-[5px] w-full rounded-lg border border-[#d9d5cc] bg-white px-3 py-[9px] text-base text-[#333] focus:border-[#6ea991] focus:outline-none dark:border-dk-border-strong dark:bg-[#101a17] dark:text-dk-text dark:focus:border-dk-brand dark:focus:shadow-[0_0_0_3px_#8ed0b029]"
      >
        <option value="" disabled>
          Seleccioná tu curso
        </option>
        <option value="1A">1A</option>
        <option value="1B">1B</option>
        <option value="2A">2A</option>
        <option value="2B">2B</option>
        <option value="3A">3A</option>
        <option value="3B">3B</option>
        <option value="4P">4P</option>
        <option value="4M">4M</option>
        <option value="5P">5P</option>
        <option value="5M">5M</option>
        <option value="6P">6P</option>
        <option value="6M">6M</option>
        <option value="7M">7M</option>
        <option value="7P">7P</option>
      </select>
      <br />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="my-[5px] w-full rounded-lg border border-[#d9d5cc] bg-white px-3 py-[9px] text-base text-[#333] focus:border-[#6ea991] focus:outline-none dark:border-dk-border-strong dark:bg-[#101a17] dark:text-dk-text dark:focus:border-dk-brand dark:focus:shadow-[0_0_0_3px_#8ed0b029]"
      />
      <br />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="my-[5px] w-full rounded-lg border border-[#d9d5cc] bg-white px-3 py-[9px] text-base text-[#333] focus:border-[#6ea991] focus:outline-none dark:border-dk-border-strong dark:bg-[#101a17] dark:text-dk-text dark:focus:border-dk-brand dark:focus:shadow-[0_0_0_3px_#8ed0b029]"
      />
      <br />
      <button
        onClick={registrarse}
        disabled={loading}
        className="my-[5px] w-full cursor-pointer rounded-lg border-0 bg-[#5f9a82] p-[9px] font-semibold text-white hover:bg-[#4f8570] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-dk-brand-strong dark:hover:bg-[#4b8f74]"
      >
        {loading ? "Creando cuenta..." : "Registrarse"}
      </button>
      {msg && <p className="mt-2 text-sm text-[#b42318] dark:text-[#ff9b8f]">{msg}</p>}
    </div>
  );
}