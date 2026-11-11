import { useState } from "react";
import { supabase } from "../db/supabase";

export default function Signupform() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [name, setName] = useState("");
  const [apellido, setApellido] = useState("");
  const [curso, setCurso] = useState("");


// Función para registrarse
  async function registrarse() {
    // Solo alumnos del ITR
    if (!email.endsWith("@alumnos.itr.edu.ar")) {
      setMsg("Solo alumnos del ITR pueden registrarse.");
      return;
    }
    if (password.length < 6) {
      setMsg("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) setMsg(error.message);
    else if (data.session) window.location.href = "/";
    else setMsg("Revisá tu mail para confirmar.");
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Apellido"
        value={apellido}
        onChange={(e) => setApellido(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Curso"
        value={curso}
        onChange={(e) => setCurso(e.target.value)}
      />
      <br />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={registrarse}>Registrarse</button>
      {msg && <p>{msg}</p>}
    </div>
  );
}