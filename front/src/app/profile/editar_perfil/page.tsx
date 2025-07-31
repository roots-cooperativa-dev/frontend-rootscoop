"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/src/components/contenedores/sidebar";
import HeaderProfile from "@/src/components/headers/EncabezadoPerfil";
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
