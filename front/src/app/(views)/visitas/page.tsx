import { ArrowLeft } from "lucide-react";
import InfoBox from "./components/InfoBox";
import Link from "next/link";
import ReservaFormulario from "./components/Reservaform";
import { TestimoniosBox } from "./components/TestimoniosBox";
import Image from "next/image";

const VistaPage = () => {
  return (
    <>
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Image
              src="/logos/roots.png"
              alt="Rootscoop Logo"
              width={350}
              height={40}
              className="rounded-full object-contain -ml-20"
              priority
            />
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-[#017d74] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-chewy">Volver al inicio</span>
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-12 space-y-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#017d74] font-chewy">
            Visita ROOTS
          </h1>
          <p className="mt-2 text-lg text-[#374151] font-bebas">
            Conocé nuestra planta de investigación, el proceso de fabricación de
            cerveza artesanal y la cocina donde nacen nuestras{" "}
            <span className="text-[#ff6b35] font-semibold">pizzas</span> y{" "}
            <span className="text-[#f72585] font-semibold">empanadas</span> más
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
