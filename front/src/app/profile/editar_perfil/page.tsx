"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/src/components/contenedores/sidebar";
import HeaderProfile from "@/src/components/headers/EncabezadoPerfil";
import { Card, CardHeader, CardTitle } from "@/src/components/ui/card";
import { useAuthContext } from "@/src/context/authContext";
import { updateUser, getUserById } from "@/src/services/auth"; // ajusta ruta
import Loading from "@/src/components/loading/pantallaCargando";
import EditUser from "../component/editUser";
//import { UserGoogle } from "@/src/interfaces/userGoogle"; // ajusta ruta

const ProfileEdit = () => {
   const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <HeaderProfile onToggleSidebar={() => setSidebarOpen(true)} />
      <div className="flex bg-slate-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}/>
        <EditUser/>
      </div>
    </>
  );
};

export default ProfileEdit;
