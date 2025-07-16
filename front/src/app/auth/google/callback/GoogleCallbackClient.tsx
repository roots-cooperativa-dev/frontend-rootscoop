"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/src/context/authContext";
import { toast } from "sonner";

export default function GoogleCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { saveUserData } = useAuthContext();

  useEffect(() => {
    const token = searchParams.get("token");
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const email = searchParams.get("email");

    if (token && name && email && id) {
      const user = { name, email, id };
      saveUserData({ token, user, isAuth: true });
      toast.success("Inicio de sesión con Google exitoso");
      router.push("/"); // Redirige al home
    } else {
      console.log("Error al iniciar sesión");
      toast.error("Error al iniciar sesión con Google");
      router.push("/login");
    }
  }, [searchParams, saveUserData, router]);

  return <p>Conectando...</p>;
}
