import { ArrowLeft, Mail, Phone } from "lucide-react";
import ContactoFormulario from "./component/formContacto";
import Link from "next/link";
import Image from "next/image";
import HeaderBasic from "@/src/components/headers/EncabezadoSencillo";

const Contacto = () => {
  return (
    <>
      <HeaderBasic />
      <div className="flex flex-col lg:flex-row justify-center items-center min-h-screen p-6 sm:p-10 gap-8">
        {/* Contenedor izquierdo con texto y canales */}
        <div className="flex flex-col w-full lg:w-1/2 max-w-xl mx-auto">
          <div className="text-center px-4 lg:px-0">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#017d74] font-chewy">
              Contactanos
            </h1>
            <p className="mt-2 text-base sm:text-lg text-[#374151] font-popular leading-relaxed">
              ¿Tienes alguna consulta o estás interesado en nuestros servicios?
              Completa el formulario y nos pondremos en contacto contigo lo
              antes posible. También puedes enviarnos un mensaje directamente
              por <span className="text-[#ff6b35] font-semibold">WhatsApp</span>{" "}
              o escribirnos a nuestro{" "}
              <span className="text-[#2d9cdb] font-semibold">
                correo electrónico.
              </span>{" "}
              ¡Estamos aquí para ayudarte!
            </p>
          </div>

          {/* Canales de contacto */}
          <div className="mt-10 sm:mt-16 text-center bg-white p-6 rounded-xl border border-[#dcf5f3]">
            <h3 className="text-lg sm:text-xl font-semibold text-[#4ecdc4] mb-6">
              Nuestros canales de comunicacion
            </h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <div className="flex flex-col items-center gap-2 text-gray-800">
                <Phone className="text-[#ff6b35] text-3xl sm:text-4xl" />
                <div>
                  <p className="font-medium text-[#09090b]">WhatsApp</p>
                  <p className="text-sm text-[#4b5563]">+54 9 2215 62-6003</p>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 text-gray-800">
                <Mail className="text-[#2d9cdb] text-3xl sm:text-4xl" />
                <div>
                  <p className="font-medium text-[#09090b]">Email</p>
                  <p className="text-sm text-[#4b5563]">
                    rootscooperativadev@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="w-full lg:w-1/2 max-w-xl mx-auto px-4 lg:px-0">
          <ContactoFormulario />
        </div>
      </div>
    </>
  );
};

export default Contacto;
