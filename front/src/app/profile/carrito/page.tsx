'use client'
import Sidebar from "@/src/components/contenedores/sidebar";
import HeaderProfile from "@/src/components/headers/EncabezadoPerfil";
import { Footer } from "@/src/components/landing/Footer";
import CartPage from "../component/cartUser";
import { useState } from "react";

const Cart = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <HeaderProfile onToggleSidebar={() => setSidebarOpen(true)} />
      <div className="flex bg-slate-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}/>
        <CartPage/>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
