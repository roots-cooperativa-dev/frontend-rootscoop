// components/AuthLayout.tsx
import React from "react";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <div className="w-1/2 relative hidden md:block">
        <Image
          src="/img/roots frente.jpg" // Reemplaza por tu imagen
          alt="Roots"
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8">
        {children}
      </div>
    </div>
  );
}
