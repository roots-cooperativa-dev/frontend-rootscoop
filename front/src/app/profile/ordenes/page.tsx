'use client'
import Sidebar from "@/src/components/contenedores/sidebar";
import HeaderProfile from "@/src/components/headers/EncabezadoPerfil";
import { Footer } from "@/src/components/landing/Footer";
import OrdersUser from "../component/orderUser";
import { useState } from "react";

const Ordenes = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <HeaderProfile onToggleSidebar={() => setSidebarOpen(true)} />
      <div className="flex  bg-slate-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}/>
        <OrdersUser/>
      </div>
      <Footer />
    </>
  );
};

export default Ordenes;
