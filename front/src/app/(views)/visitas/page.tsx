import { ShoppingBag, ArrowLeft } from "lucide-react";
import InfoBox from "./components/InfoBox";
import Link from "next/link";
import ReservaFormulario from "./components/Reservaform";
import { TestimoniosBox } from "./components/TestimoniosBox";

const VistaPage = () => {
  return (
    <>
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#017d74] rounded-full flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-[#017d74]">ROOTS</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-[#017d74] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-800">Visitá ROOTS</h1>
          <p className="mt-2 text-lg text-gray-700">
            Conocé nuestra planta de investigación, el proceso de fabricación de
            cerveza artesanal y la cocina donde nacen nuestras{" "}
            <span className="text-pink-600 font-semibold">pizzas</span> y{" "}
            <span className="text-pink-600 font-semibold">empanadas</span> más
            famosas.
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
