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
            onClick={entrar}
            className="my-[5px] w-full cursor-pointer rounded-lg border-0 bg-[#5f9a82] p-[9px] font-semibold text-white hover:bg-[#4f8570] dark:bg-dk-brand-strong dark:hover:bg-[#4b8f74]"
          >
            Iniciar sesión
          </button>
        </>
      )}
      <br />
      <button
        onClick={() => setIsSignup(!isSignup)}
        className="my-[5px] w-full cursor-pointer rounded-lg border border-[#5f9a82] bg-transparent p-[9px] font-semibold text-[#5f9a82] hover:bg-[#eaf3ef] dark:border-dk-brand dark:bg-transparent dark:text-dk-brand dark:hover:bg-[#1c2f27]"
      >
        {isSignup ? "Ya tengo cuenta" : "Registrarse"}
      </button>
      {mensaje && <p className="mt-2 text-sm text-[#b42318] dark:text-[#ff9b8f]">{mensaje}</p>}
    </div>
  );
}
