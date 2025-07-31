"use client";

import DataUser from "./component/dataUser";
import { Footer } from "@/src/components/landing/Footer";
import Sidebar from "@/src/components/contenedores/sidebar";
import HeaderProfile from "@/src/components/headers/EncabezadoPerfil";
import { useState } from "react";

const Profile = () => {
   const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <HeaderProfile onToggleSidebar={() => setSidebarOpen(true)} />
      <main className="flex bg-slate-50">
        <Sidebar  isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}/>
        <DataUser />
      </main>
      <Footer/>
    </>
  );
};

export default Profile;
