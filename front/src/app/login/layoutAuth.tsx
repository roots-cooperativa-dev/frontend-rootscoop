import Image from "next/image";
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Lado izquierdo (desktop) */}
      <div className="hidden md:block w-1/2 relative">
        <Image
          src="/img/LoginNew.jpg"
          alt="Roots"
          fill
          className="object-cover object-center"
        />
      </div>

      {/* Contenido + fondo (mobile) */}
      <div className="
        relative flex justify-center items-center
        w-full md:w-1/2 p-4 md:p-8
        bg-[url('/img/LoginNew.jpg')] bg-cover bg-center
        md:bg-none
      ">
        {/* Contenedor del formulario con blur en mobile */}
        <div className="
          relative z-10 w-full max-w-md
          bg-white/30 backdrop-blur-[5px]
          rounded-xl p-6
        ">
          {children}
        </div>
      </div>
    </div>
  );
}
