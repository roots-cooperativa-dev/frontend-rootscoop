"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/src/context/authContext";
import { toast } from "sonner";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { saveUserData } = useAuthContext();

  useEffect(() => {
    const token = searchParams.get("token");
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const email = searchParams.get("email");
    console.log(name)
    if (token && name && email && id) {
      const user = { name, email, id };

      // Guardar en el contexto
      saveUserData({ token, user, isAuth: true });

      toast.success("Inicio de sesión con Google exitoso");

      router.push("/"); // Redirige al home
    } else {
      console.log("error al iniciar sesion");
      toast.error("Error al iniciar sesión con Google");
      router.push("/login");
    }
  }, [searchParams, saveUserData, router]);

  return <p>Conectando...</p>;
}
