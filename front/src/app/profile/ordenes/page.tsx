import Sidebar from "@/src/components/contenedores/sidebar";
import HeaderProfile from "@/src/components/headers/EncabezadoPerfil";
import { Footer } from "@/src/components/landing/Footer";
import OrdersUser from "../component/orderUser";

const Ordenes = () => {
  return (
    <>
      <HeaderProfile />
      <div className="flex  bg-slate-50">
        <Sidebar />
        <OrdersUser/>
      </div>
      <Footer />
    </>
  );
};

export default Ordenes;
