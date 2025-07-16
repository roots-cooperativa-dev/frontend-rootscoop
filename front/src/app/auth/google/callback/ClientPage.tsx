"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/src/context/authContext";
import { toast } from "sonner";

export default function ClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { saveUserData } = useAuthContext();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      console.log(token)
      toast.success("Inicio de sesión con Google exitoso");
      router.push("/");
    } else {
      console.log(token)
      console.log("Error al iniciar sesión");
      toast.error("Error al iniciar sesión con Google");
      router.push("/login");
    }
  }, [searchParams, saveUserData, router]);

  return <p>Conectando...</p>;
}
