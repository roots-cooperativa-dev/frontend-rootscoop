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
                <span>Volver</span>
              </Link>
            </div>
          </div>
        </div>
      </header>
      <div className="py-12 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-orange-500 via-rose-500 to-indigo-600 bg-clip-text text-transparent">
              Apoyá a ROOTS
            </span>
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Tu donación fortalece nuestro trabajo cooperativo y nos ayuda a
            seguir construyendo alternativas de
            <span className="text-orange-500 font-semibold">
              {" "}
              economía social{" "}
            </span>
            y
            <span className="text-pink-600 font-semibold">
              {" "}
              soberanía alimentaria
            </span>
            .
          </p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoBox />
          <DonacionBox />
        </section>

        <section className="mt-16">
          <TestimoniosBox />
        </section>
      </div>
    </>
  );
}
