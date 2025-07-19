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
    console.log(user)
  }, [user, token, router]);


  return (
    <div className="flex flex-col w-screen m-6">
      <Card>
        <CardHeader>
          <CardTitle>Datos personales</CardTitle>
          <p>Nombre: {user?.name}</p>
          <p>Email: {user?.email}</p>
        </CardHeader>
      </Card>
    </div>
  );
};

export default DataUser;
