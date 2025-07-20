import { ArrowLeft, Mail, Phone } from "lucide-react";
import ContactoFormulario from "./component/formContacto";
import Link from "next/link";
import Image from "next/image";

const Contacto = () => {
  return (
    <>
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Image
              src="/logos/roots.png"
              alt="Rootscoop Logo"
              width={60}
              height={40}
              className="rounded-full object-cover -ml-20"
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
      <div className="flex flex-col lg:flex-row justify-center items-center h-screen p-10 gap-8 ">
        <div className="flex flex-col w-1/2">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#017d74] font-chewy">
              Contactanos
            </h1>
            <p className="mt-2 text-lg text-[#374151] font-bebas">
              ¿Tienes alguna consulta o estás interesado en nuestros servicios?
              Completa el formulario y nos pondremos en contacto contigo lo
              antes posible. También puedes enviarnos un mensaje directamente
              por <span className="text-[#ff6b35] font-semibold">WhatsApp</span>{" "}
              o escribirnos a nuestro
              {" "}<span className="text-[#2d9cdb] font-semibold">correo electrónico.</span>{" "}
              ¡Estamos aquí para ayudarte!
            </p>
          </div>
          {/* Contacto */}
          <div className="mt-16 text-center bg-white p-6 rounded-xl border border-[#dcf5f3] max-w-xl mx-auto">
            <h3 className="text-xl font-semibold text-[#4ecdc4] mb-4">
              Nuestros canales de comunicacion
            </h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <div className="flex items-center flex-col gap-2 text-gray-800">
                <Phone className="text-[#ff6b35]" />
                <div>
                  <p className="font-medium text-[#09090b]">WhatsApp</p>
                  <p className="text-sm text-[#4b5563]">+54 9 2215 62-6003</p>
                </div>
              </div>
              <div className="flex items-center flex-col gap-2 text-gray-800">
                <Mail className="text-[#2d9cdb]" />
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

        <ContactoFormulario />
      </div>
    </>
  );
};

export default Contacto;
