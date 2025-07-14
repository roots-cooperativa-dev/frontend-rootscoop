"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/src/context/authContext";
import {Irole} from "../../../types"; // ajustá la ruta a donde tengas tu enum Irole
import { number } from "yup";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const { saveUserData } = useAuthContext();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const id = params.get("id");
    const name = params.get("name");
    const email = params.get("email");

    if (token && id && name && email) {
      saveUserData({
        token,
        user: {
          name,
          email,
          birthdate: "",     // vacíos temporalmente
          phone: 0,
          username:"",
          password: "",
          confirmPassword: ""
        },
        isAuth: true,
      });

      router.push("/");
    } else {
      console.error("Faltan datos en la URL de callback");
      router.push("/login");
    }
  }, [router, saveUserData]);

  return <p>Conectando con Google...</p>;
}
