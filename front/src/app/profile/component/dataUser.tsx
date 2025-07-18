"use client";

import { useAuthContext } from "../../../context/authContext";
import { routes } from "../../../routes";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/src/components/ui/card";
import { getUserById } from "@/src/services/auth"; // ajustá el path según tu estructura

const DataUser = () => {
  const { user, token } = useAuthContext();
  const router = useRouter();

  const [extraData, setExtraData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !token) {
      router.push(routes.login);
      return;
    }

    const fetchUserData = async () => {
      try {
        const data = await getUserById(user.id, token);
        setExtraData(data);
        console.log(data);
      } catch (error) {
        console.error("Error al obtener datos adicionales del usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, token, router]);

  if (!user || loading) return null;

  return (
    <div className="flex flex-col w-screen m-6">
      <Card>
        <CardHeader>
          <CardTitle>Datos personales</CardTitle>
          <p>Nombre de usuario: {extraData.username}</p>
          <p>Teléfono: {extraData.phone}</p>
          <p>Nombre: {user.name}</p>
          <p>Email: {user.email}</p>
        </CardHeader>
      </Card>
    </div>
  );
};

export default DataUser;
