// Componente básico de login/registro
import { useState } from "react";
import { supabase } from "../db/supabase";
import Signupform from "./Signup";

export default function AuthForm() {
  // Estados para guardar lo que escribe el usuario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  // Función para iniciar sesión
  async function entrar() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMensaje(error.message);
    else window.location.href = "/";
  }

  

  return (
    <div>
      {isSignup ? (
        <Signupform />
      ) : (
        <>
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
          <button onClick={entrar}>Iniciar sesión</button>
        </>
      )}
      <br />
      <button onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? "Ya tengo cuenta" : "Registrarse"}
      </button>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}
