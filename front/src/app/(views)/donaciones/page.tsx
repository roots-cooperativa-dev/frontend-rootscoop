import Link from "next/link";
import DonacionBox from "./components/form";
import InfoBox from "./components/InfoBox";
import TestimoniosBox from "./components/TestimoniosBox";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function DonacionPage() {
  return (
    <>
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Image
              src="/logos/roots.png"
              alt="Rootscoop Logo"
              width={100}
              height={100}
              className="rounded-full object-contain -ml-20"
              priority
            />
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-[#017d74] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-chewy">Volver</span>
              </Link>
            </div>
          </div>
        </div>
      </header>
      <div className="py-12 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">
            <span className="font-chewy bg-[#017d74] bg-clip-text text-transparent">
              Apoya a ROOTS
            </span>
          </h1>
          <p className="font-bebas mt-3 text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Tu donación fortalece nuestro trabajo cooperativo y nos ayuda a
            seguir construyendo alternativas de
            <span className="text-[#922f4e] font-semibold ">
              {" "}
              economia social{" "}
            </span>
            y
            <span className="text-[#febb07] font-semibold">
              {" "}
              soberanía alimentaria
            </span>
            .
          </p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2 flex flex-col gap-4">
            <InfoBox />
          </div>
          <div className="w-full flex justify-center">
            <div className="w-full max-w-sm">
              <DonacionBox />
            </div>
          </div>
        </section>

        <section className="mt-16">
          <TestimoniosBox />
        </section>
      </div>
    </>
  );
}
