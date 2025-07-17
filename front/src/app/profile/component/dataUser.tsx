"use client";

import { useAuthContext } from "../../../context/authContext";
import { routes } from "../../../routes";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/src/components/ui/card";

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
    <div className="flex flex-col w-screen m-6">
      <Card>
        <CardHeader>
          <CardTitle>Datos personales</CardTitle>
          <p>Nombre: {user.name}</p>
          <p>Email: {user.email}</p>
        </CardHeader>
      </Card>
    </div>
  );
};

export default DataUser;
