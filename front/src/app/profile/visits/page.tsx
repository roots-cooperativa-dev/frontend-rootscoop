import Sidebar from "@/src/components/contenedores/sidebar";
import HeaderProfile from "@/src/components/headers/EncabezadoPerfil";
import { Footer } from "@/src/components/landing/Footer";
import VisitasAgendadas from "../component/visitUser";

const Visitanos = () => {
  return (
    <>
      <HeaderProfile />
      <div className="flex">
        <Sidebar />
        <VisitasAgendadas/>
      </div>
      <Footer />
    </>
  );
};

export default Visitanos;
