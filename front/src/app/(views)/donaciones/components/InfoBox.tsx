import { Card, CardContent } from "../../../../components/ui/card";
import { Leaf, Heart, Beer, Users, Pizza } from "lucide-react";

export default function InfoBox() {
  return (
    <div className="space-y-10">
      <Card className="border-[#922f4e]">
        <CardContent className="p-4">
          <div>
            <Heart className="h-12 w-12 rounded-full p-3 bg-[]" />
            <br />
            <h3 className="text-[#922f4e] text-xl font-semibold font-chewy">
              ¿Por que donar ?
            </h3>
          </div>
          <br />
          <p className="text-m text-[#4b5563] font-bebas">
            ROOTS es una cooperativa autogestiva que no depende de subsidios
            estatales ni inversores privados. Cada donación nos permite seguir
            creciendo de forma independiente y sostenible.
          </p>
        </CardContent>
      </Card>

      <Card className="border-blue-200">
        <CardContent className="p-4">
          <h3 className="text-[#017d74] text-xl font-semibold mb-2 font-chewy">
            ¿En que usamos las donaciones?
          </h3>
          <ul className="text-m space-y-2 font-bebas">
            <li className="flex items-center gap-2 text-[#0a0a0a]">
              <Beer className="h-4 w-4 text-orange-500" />
              Equipamiento para cervecería
            </li>
            <li className="flex items-center gap-2">
              <Pizza className="h-4 w-4 text-rose-500" />
              Mejoras en la cocina
            </li>
            <li className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-500" />
              Capacitaciones para socios
            </li>
            <li className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-sky-600" />
              Proyectos sustentables
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="border-orange-200">
        <CardContent className="p-4">
          <h3 className="text-[#febb07] text-xl font-semibold mb-2 font-chewy">
            Transparencia
          </h3>
          <p className="text-m font-bebas">
            Cada trimestre publicamos un informe detallado de cómo utilizamos
            las donaciones. Creemos en la transparencia total con nuestra
            comunidad.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
