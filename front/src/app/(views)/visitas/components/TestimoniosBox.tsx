import { Mail, Phone } from "lucide-react";

export function TestimoniosBox() {
  const testimonios = [
    {
      texto:
        "La visita a ROOTS fue increíble. Ver todo el proceso de la cerveza y conocer la historia de la cooperativa me emocionó mucho. ¡Y la degustación estuvo buenísima!",
      autor: "Lucia, visitante",
      colorBg: "bg-[#febb07]",
      colorText: "text-[#febb07]",
      colorBorder: "border-[#febb07]",
    },
    {
      texto:
        "Fuimos con mi curso de la facultad y todos quedamos fascinados. La charla sobre cooperativismo nos abrió la cabeza. Definitivamente volvemos.",
      autor: "Martin, estudiante",
      colorBg: "bg-[#922f4e]",
      colorText: "text-[#922f4e]",
      colorBorder: "border-[#922f4e]",
    },
    {
      texto:
        "Como cooperativista de otra provincia, conocer ROOTS fue inspirador. Ver cómo funcionan y crecen nos dio muchas ideas para nuestro proyecto.",
      autor: "Carmen, cooperativista",
      colorBg: "bg-[#017d74]",
      colorText: "text-[#017d74]",
      colorBorder: "border-[#017d74]",
    },
  ];

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-semibold text-center text-[#922f4e] mb-10 font-chewy">
        Experiencias de nuestros visitantes
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {testimonios.map((t, i) => (
          <div
            key={i}
            className={`rounded-xl   p-6 shadow-md bg-white hover:shadow-lg transition border-2 ${t.colorBorder}`}
          >
            <p className="text-gray-700 mb-4 font-popular text-m">
              “{t.texto}”
            </p>
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${t.colorBg}`} />
              <span
                className={`font-semibold font-bebas text-xl ${t.colorText}`}
              >
                {t.autor}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Contacto */}
      <div className="mt-16 text-center bg-white p-6 rounded-xl border border-[#dcf5f3] max-w-xl mx-auto">
        <h3 className="text-xl font-semibold text-[#febb07] mb-4">
          ¿Tenés dudas?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-2">
          <div className="flex flex-col items-center">
            <Phone className="text-[#922f4e] w-6 h-6 mb-1" />
            <p className="text-lg text-[#09090b] font-bebas uppercase">
              WhatsApp
            </p>
            <p className="text-sm text-[#4b5563] font-popular">
              +54 9 2215 62-6003
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Mail className="text-[#017d74] w-6 h-6 mb-1" />
            <p className="text-lg text-[#09090b] font-bebas uppercase">Email</p>
            <p className="text-sm text-[#4b5563] font-popular">
              rootscooperativadev@gmail.com
            </p>
          </div>
        </div>

        <p className="mt-4 text-sm text-[#626b77]">
          Respondemos en menos de 24 horas. ¡Esperamos conocerte pronto!
        </p>
      </div>
    </section>
  );
}
