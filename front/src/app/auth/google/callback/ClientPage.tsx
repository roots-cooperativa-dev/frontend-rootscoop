"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/src/context/authContext";
import { toast } from "sonner";

export default function ClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { saveUserData } = useAuthContext();

  // useEffect(() => {
  //   const token = searchParams.get("token");

  //   if (token) {
  //     console.log(token)
  //     toast.success("Inicio de sesión con Google exitoso");
  //     router.push("/");
  //   } else {
  //     console.log(token)
  //     console.log("Error al iniciar sesión");
  //     toast.error("Error 23 al iniciar sesión con Google");
  //     router.push("/login");
  //   }
  // }, [searchParams, saveUserData, router]);
   useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("http://localhost:3000/auth/google/callback");
        const data = await res.json();
        console.log(data); // 👉 Aquí ves la respuesta
      } catch (error) {
        console.error("Error:", error);
      }
    };

    getData();
  }, []);

  return <p>Conectando...</p>;
}
