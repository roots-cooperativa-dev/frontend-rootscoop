import { Mail, Phone } from "lucide-react";

export function TestimoniosBox() {
  const testimonios = [
    {
      texto:
        "La visita a ROOTS fue increíble. Ver todo el proceso de la cerveza y conocer la historia de la cooperativa me emocionó mucho. ¡Y la degustación estuvo buenísima!",
      autor: "Lucía, visitante",
      colorBg: "bg-[#2d9cdb]",
      colorText: "text-[#ff6b35]",
      colorBorder: "border-[#d5ebf8]",
    },
    {
      texto:
        "Fuimos con mi curso de la facultad y todos quedamos fascinados. La charla sobre cooperativismo nos abrió la cabeza. Definitivamente volvemos.",
      autor: "Martín, estudiante",
      colorBg: "bg-[#f72585]",
      colorText: "text-[#6a4c93]",
      colorBorder: "border-[#fdd3e7]",
    },
    {
      texto:
        "Como cooperativista de otra provincia, conocer ROOTS fue inspirador. Ver cómo funcionan y crecen nos dio muchas ideas para nuestro proyecto.",
      autor: "Carmen, cooperativista",
      colorBg: "bg-[#ff6b35]",
      colorText: "text-[#298ec7]",
      colorBorder: "border-[#ffe1d7]",
    },
  ];

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-[#017d74] mb-10 font-chewy">
        Experiencias de nuestros visitantes
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {testimonios.map((t, i) => (
          <div
            key={i}
            className={`rounded-xl  p-6 shadow-md bg-white hover:shadow-lg transition border-2 ${t.colorBorder}`}
          >
            <p className="text-gray-700 mb-4 italic">“{t.texto}”</p>
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${t.colorBg}`} />
              <span className={`font-semibold ${t.colorText}`}>{t.autor}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Contacto */}
      <div className="mt-16 text-center bg-white p-6 rounded-xl border border-[#dcf5f3] max-w-xl mx-auto">
        <h3 className="text-xl font-semibold text-[#4ecdc4] mb-4">
          ¿Tenés dudas?
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
        <p className="mt-4 text-sm text-[#626b77]">
          Respondemos en menos de 24 horas. ¡Esperamos conocerte pronto!
        </p>
      </div>
    </section>
  );
}
