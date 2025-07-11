import { MessageCircle, Mail } from "lucide-react";

export function TestimoniosBox() {
  const testimonios = [
    {
      texto:
        "La visita a ROOTS fue increíble. Ver todo el proceso de la cerveza y conocer la historia de la cooperativa me emocionó mucho. ¡Y la degustación estuvo buenísima!",
      autor: "Lucía, visitante",
      color: "text-pink-600",
    },
    {
      texto:
        "Fuimos con mi curso de la facultad y todos quedamos fascinados. La charla sobre cooperativismo nos abrió la cabeza. Definitivamente volvemos.",
      autor: "Martín, estudiante",
      color: "text-purple-600",
    },
    {
      texto:
        "Como cooperativista de otra provincia, conocer ROOTS fue inspirador. Ver cómo funcionan y crecen nos dio muchas ideas para nuestro proyecto.",
      autor: "Carmen, cooperativista",
      color: "text-sky-600",
    },
  ];

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-teal-700 mb-10">
        Experiencias de nuestros visitantes
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        {testimonios.map((t, i) => (
          <div
            key={i}
            className="rounded-xl border p-6 shadow-md bg-white hover:shadow-lg transition"
          >
            <p className="text-gray-700 mb-4 italic">“{t.texto}”</p>
            <span className={`font-semibold ${t.color}`}>{t.autor}</span>
          </div>
        ))}
      </div>

      {/* Contacto */}
      <div className="mt-16 text-center bg-white-50 p-6 rounded-xl border max-w-xl mx-auto">
        <h3 className="text-xl font-semibold text-teal-700 mb-4">
          ¿Tenés dudas?
        </h3>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <div className="flex items-center gap-2 text-gray-800">
            <MessageCircle className="text-teal-600" />
            <div>
              <p className="font-medium">WhatsApp</p>
              <p className="text-sm">+54 9 2215 62-6003</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-800">
            <Mail className="text-orange-600" />
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm">rootscooperativadev@gmail.com</p>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          Respondemos en menos de 24 horas. ¡Esperamos conocerte pronto!
        </p>
      </div>
    </section>
  );
}
