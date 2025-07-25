"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { getUserById, postLogin } from "@/src/services/auth";
import { useRouter } from "next/navigation";
import { routes } from "../../../routes";
import { useAuthContext } from "@/src/context/authContext";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi"; // 👈 Importa los iconos
import { getCart } from "@/src/services/cart";
import { useCartContext } from "@/src/context/cartContext";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👀 Estado para mostrar/ocultar contraseña
  const { saveUserData } = useAuthContext();
  const { cart, setCartFromServer } = useCartContext();
  const router = useRouter();
   const [isLoadingCart, setIsLoadingCart] = useState(true);

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
        const userId = response.data.user.id;
        const Token = response.data.accessToken;
        const dataUser = await getUserById(userId, Token);
        console.log(dataUser);
        saveUserData({
          accessToken: Token,
          user: {
            id: userId,
            name: dataUser.name,
            username: dataUser.username,
            birthdate: dataUser.birthdate,
            phone: dataUser.phone,
            email: dataUser.email,
            isAdmin: dataUser.isAdmin,
            isDonator: dataUser.isDonator,
          },
          isAuth: true,
        });
        const fetchCart = async () => {
          try {

            const data = await getCart(Token);
            console.log(data.items);
            setCartFromServer(data.items, data.total); // ✅ actualiza el context
            console.log(cart);
            router.push("/");
          } catch (error) {
            console.error("Error al obtener el carrito:", error);
          } finally {
            setIsLoadingCart(false);
          }
        };
        fetchCart();

        toast.success("Sesión iniciada correctamente");

        router.push(routes.home);
      } catch (error: any) {
        toast.error(error?.response.data.message || "Error al iniciar sesión");
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    window.location.href = `${BACKEND_URL}/auth/google`;
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

      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="********"
          value={formik.values.password}
          onChange={formik.handleChange}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
        >
          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
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
