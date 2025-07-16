"use client";

import { useAuthContext } from "../../../context/authContext";
import { routes } from "../../../routes";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const DataUser = () => {
  const { user, token } = useAuthContext();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.push(routes.login);
    }
  }, [user, router, mounted]);

  if (!mounted) return null; // ⚠️ no renderiza nada hasta que montó en cliente

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 h-[80vh]">
      <h1 className="text-3xl font-bold mb-4">Datos personales</h1>
      <p>Nombre: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default DataUser;
