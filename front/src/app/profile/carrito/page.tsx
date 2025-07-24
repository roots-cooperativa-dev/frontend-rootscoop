import Sidebar from "@/src/components/contenedores/sidebar";
import HeaderProfile from "@/src/components/headers/EncabezadoPerfil";
import { Footer } from "@/src/components/landing/Footer";
import CartPage from "../component/cartUser";

const Cart = () => {
  return (
    <>
      <HeaderProfile />
      <div className="flex bg-slate-50">
        <Sidebar />
        <CartPage/>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
