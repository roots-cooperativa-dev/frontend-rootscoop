import Link from "next/link";
import DonacionBox from "./components/form";
import InfoBox from "./components/InfoBox";
import TestimoniosBox from "./components/TestimoniosBox";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import AuthNav from "@/src/components/authNav/authNav";
import HeaderBasic from "@/src/components/headers/EncabezadoSencillo";

export default function DonacionPage() {
  return (
    <>
      <HeaderBasic />
      <div className="py-12 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">
            <span className="font-chewy bg-gradient-to-r from-orange-500 via-rose-500 to-indigo-600 bg-clip-text text-transparent">
              Apoya a ROOTS
            </span>
          </h1>
          <p className="font-bebas mt-3 text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
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
