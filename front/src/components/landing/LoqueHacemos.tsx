"user client";

import { Beer, Pizza, ChefHat } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export const LoqueHacemos = () => {
  return (
    <div className="container mx-auto px-4">
      <h2 className="font-chewy text-4xl font-black text-center mb-4 text-[#017d74]">
        Quienes Somos
      </h2>
      <p className="font-popular text-center text-gray-600 mb-12 text-lg max-w-3xl mx-auto">
        Somos mucho más que una cooperativa. Somos un espacio de encuentro,
        creación y resistencia. Cada producto que producimos, cada pizza que
        horneamos, cada empanada que armamos, lleva el amor y la dedicación de
        todos los compañeres trabajando juntxs.
      </p>
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="text-center border-2 border-[#922f4e]/20 hover:border-[#922f4e] hover:shadow-xl transition-all transform hover:-translate-y-2">
          <CardHeader>
            <div className="w-16 h-16 bg-[#922f4e] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Beer className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="font-bebas text-[#922f4e] text-xl font-bold">
              Cerveza Artesanal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-popular text-gray-600 font-medium">
              Fabricamos cerveza con ingredientes locales y procesos
              sustentables. Actualmente contamos con 8 variedades dos de ellas
              ganadoras de la medalla de bronce de la Copa 3 ciudades Ensenada,
              Berisso, La Plata. Cada lote es una celebración del trabajo
              colectivo y la tradición cervecera argentina.
            </p>
          </CardContent>
        </Card>
        <Card className="text-center border-2 border-[#febb07]/20 hover:border-[#febb07] hover:shadow-xl transition-all transform hover:-translate-y-2">
          <CardHeader>
            <div className="w-16 h-16 bg-[#febb07] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Pizza className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="font-bebas text-[#f39d10] text-xl font-bold">
              Pizzas y Empanadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-popular text-gray-600 font-medium">
              La calidad de la materia prima, que seleccionamos cuidadosamente,
              trabajando en red productores de la agricultura familiar
              agroecologica y cooperativas hace que nuestros productos sean
              elegidos por la comunidad platense. Nuestra cocina a la vista, con
              más de 45 variedades, pizzas individuales, 13 variedades de
              empanadas (incluidas opciones veganas y una con masa integral
              casera), transforma cada bocado en una experiencia única.
            </p>
          </CardContent>
        </Card>
        <Card className="text-center border-2 border-[#017d74]/20 hover:border-[#017d74] hover:shadow-xl transition-all transform hover:-translate-y-2">
          <CardHeader>
            <div className="w-16 h-16 bg-[#017d74] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="font-bebas text-[#017d74] text-xl font-bold">
              Pan de masa madre, Ensaladas, Menu sin tacc.
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-popular text-gray-600 font-medium">
              Elaboramos nuestros panes de molde con masa madre de fermentación
              en frío durante 24 horas, utilizando harinas agroecológicas
              seleccionadas. Ademas sumamos ensaladas frescas y nutritivas.
              Contamos con un menú sin TACC disponible, bebidas sin alcohol,
              para que todxs puedan disfrutar de nuestra propuesta.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
