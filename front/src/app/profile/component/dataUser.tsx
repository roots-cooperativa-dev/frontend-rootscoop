"use client";

import { useAuthContext } from "../../../context/authContext";
import { routes } from "../../../routes";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/src/components/ui/card";

const DataUser = () => {
  const { user, token, loading } = useAuthContext();
  const router = useRouter();
  useEffect(() => {
    if (!loading && (!user || !token)) {
      router.push(routes.login);
      return;
    }
  }, [user, token, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-screen min-h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#017d74] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-700 text-sm">Cargando datos de usuario</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col w-screen m-6">
      <Card>
        <CardHeader>
          <CardTitle>Datos personales</CardTitle>
          <p>Nombre: {user?.name}</p>
          <p>Nombre de usuario: {user?.username}</p>
          <p>Email: {user?.email}</p>
          {(user?.phone) && <p>Telefono: {user?.phone}</p>}
          {(user?.birthdate) && <p>Fecha de nacimiento: {user?.birthdate}</p>}
        </CardHeader>
      </Card>
    </div>
  );
};

export default DataUser;
