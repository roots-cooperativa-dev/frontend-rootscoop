"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import RegisterForm from "./registro/page";
import LoginForm from "./login/page";

export default function AuthLayout() {
  const pathname = usePathname();
  const isLogin = pathname === "/login";
  const isRegister = pathname === "/registro";

  return (
    <div className="flex min-h-screen">
      {/* Lado izquierdo */}
      <div className="hidden md:block w-1/2 relative">
        <Image
          src="/img/LoginOptimo.webp"
          alt="Roots"
          fill
          className="object-cover object-center"
        />
      </div>

      {/* Lado derecho */}
      <div
        className="
          relative flex justify-center items-center
          w-full md:w-1/2 p-4 md:p-8
          bg-[url('/img/LoginOptimo.webp')] bg-cover bg-center
          md:bg-none
        "
      >
        <div
          className="
            relative z-10 w-full max-w-md
            bg-white/30 backdrop-blur-[5px]
            rounded-xl p-6
          "
        >
          {/* Logo */}
          <Link href="/">
            <Image
              src="/logos/sol-negro-sin-fondo.png"
              alt="Logo mobile"
              width={100}
              height={100}
              className="mb-4 mx-auto md:hidden"
            />
          </Link>
          <Link href="/">
            <Image
              src="/logos/roots.png"
              alt="Logo desktop"
              width={300}
              height={300}
              className="mb-4 mx-auto hidden md:block"
            />
          </Link>

          <h1 className="text-2xl font-semibold mb-2 text-center font-chewy text-[#017d74]">
            ¡Bienvenido/a!
          </h1>

          <p className="mb-6 text-center text-black md:text-gray-500">
            Ingresá a tu cuenta o registrate para ser parte
          </p>

          {/* Estilo de tabs similar a la imagen */}
          <div className="flex mb-4 bg-gray-100 rounded-md overflow-hidden">
            <Link
              href="/login"
              className={`flex-1 text-center py-2 text-sm font-medium ${
                isLogin ? "bg-white text-black shadow-sm" : "text-gray-500"
              }`}
            >
              Ingresar
            </Link>
            <Link
              href="/registro"
              className={`flex-1 text-center py-2 text-sm font-medium ${
                isRegister ? "bg-white text-black shadow-sm" : "text-gray-500"
              }`}
            >
              Registrarse
            </Link>
          </div>

          {/* Mostrar form según ruta */}
          {isLogin && <LoginForm />}
          {isRegister && <RegisterForm />}

          <Link
            href="/"
            className="mt-4 text-sm text-black md:text-gray-500 hover:underline block text-center"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
