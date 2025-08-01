import InfoBox from "./components/InfoBox";
import ReservaFormulario from "./components/Reservaform";
import { TestimoniosBox } from "./components/TestimoniosBox";
import HeaderBasic from "@/src/components/headers/EncabezadoSencillo";

const VistaPage = () => {
  return (
    <>
      <HeaderBasic />
      <main className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#017d74] font-chewy">
            Visita ROOTS
          </h1>
          <p className="mt-2 text-lg text-[#374151] font-bebas">
            Conocé nuestra planta de investigación, el proceso de fabricación de
            cerveza artesanal y la cocina donde nacen nuestras{" "}
            <span className="text-[#febb07] font-semibold">pizzas</span> y{" "}
            <span className="text-[#922f4e] font-semibold">empanadas</span> más
            famosas de la Plata.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <InfoBox />
          </div>
          <div className="lg:col-span-2">
            <ReservaFormulario />
          </div>
        </div>

        {/* Testimonios */}
        <TestimoniosBox />
      </main>
    </>
  );
};

export default VistaPage;
