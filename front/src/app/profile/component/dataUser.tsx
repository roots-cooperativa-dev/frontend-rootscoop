"use client";

import { useAuthContext } from "../../../context/authContext";
import { routes } from "../../../routes";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/src/components/ui/card";


const DataUser = () => {
  const { user, token } = useAuthContext();
  const router = useRouter();
  useEffect(() => {
    if (!user || !token) {
      router.push(routes.login);
      return;
    }
  }, [user, token, router]);

  console.log(user)
  return (
    <div className="flex flex-col w-screen m-6">
      <Card>
        <CardHeader>
          <CardTitle>Datos personales</CardTitle>
          <p>Nombre: {user?.name}</p>
          <p>Email: {user?.email}</p>
          <p>Telefono: {}</p>
          
        </CardHeader>
      </Card>
    </div>
  );
};

export default DataUser;
