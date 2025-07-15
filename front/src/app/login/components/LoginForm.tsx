"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { loginGoogle, postLogin } from "@/src/services/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "../../../routes";
import { useAuthContext } from "@/src/context/authContext";
import { toast } from "sonner"; // o tu librería de notificaciones
import { FcGoogle } from "react-icons/fc";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { saveUserData } = useAuthContext();
  const router = useRouter();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Email inválido").required("Requerido"),
      password: Yup.string().required("Requerido"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await postLogin(values);
        const { user, token } = response.data;
        const { credentials, ...userInfo } = user;

        saveUserData({ token, user: userInfo, isAuth: true });
        toast.success("Sesión iniciada correctamente");

        router.push(routes.home);
      } catch (error: any) {
        toast.error(error.message || "Error al iniciar sesión");
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleGoogleLogin = () => {
    window.location.href = "https://roots-api-te93.onrender.com/auth/google";
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <Input
          type="email"
          name="email"
          placeholder="tu@email.com"
          value={formik.values.email}
          onChange={formik.handleChange}
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500 text-xs">{formik.errors.email}</p>
        )}
      </div>
      <div>
        <Input
          type="password"
          name="password"
          placeholder="********"
          value={formik.values.password}
          onChange={formik.handleChange}
        />
        {formik.touched.password && formik.errors.password && (
          <p className="text-red-500 text-xs">{formik.errors.password}</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Ingresando..." : "Ingresar"}
      </Button>
      <Button
        type="button"
        onClick={handleGoogleLogin}
        disabled={googleLoading}
        className="w-full bg-gray-100 hover:bg-gray-200 text-black border border-gray-300 flex items-center justify-center gap-2"
      >
        <FcGoogle className="w-5 h-5" />
        {googleLoading
          ? "Conectando con Google..."
          : "Iniciar sesión con Google"}
      </Button>
    </form>
  );
}
