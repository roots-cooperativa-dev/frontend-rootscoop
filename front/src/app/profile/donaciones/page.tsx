import Sidebar from "@/src/components/contenedores/sidebar";
import HeaderProfile from "@/src/components/headers/EncabezadoPerfil";
import { Footer } from "@/src/components/landing/Footer";
import DonateUser from "../component/donateUser";

const Donate = () => {
  return (
    <>
      <HeaderProfile />
      <div className="flex">
        <Sidebar />
        <DonateUser/>
      </div>
      <Footer />
    </>
  );
};

export default Donate;
