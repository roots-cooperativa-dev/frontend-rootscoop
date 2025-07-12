import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Separator } from "../../../../components/ui/separator";
import {
  BadgeCheck,
  Wrench,
  Leaf,
  Heart,
  Flame,
  Beer,
  Users,
} from "lucide-react";

export default function InfoBox() {
  return (
    <div className="space-y-10">
      <Card className="border-pink-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-4 w-4 text-pink-500" />
            <h3 className="text-pink-600 font-semibold">¿Por qué donar?</h3>
          </div>
          <p className="text-sm">
            ROOTS es una cooperativa autogestiva que no depende de subsidios
            estatales ni inversores privados. Cada donación nos permite seguir
            creciendo de forma independiente y sostenible.
          </p>
        </CardContent>
      </Card>

      <Card className="border-blue-200">
        <CardContent className="p-4">
          <h3 className="text-blue-600 font-semibold mb-2">
            ¿En qué usamos las donaciones?
          </h3>
          <ul className="text-sm space-y-2">
            <li className="flex items-center gap-2">
              <Beer className="h-4 w-4 text-orange-500" />
              Equipamiento para cervecería
            </li>
            <li className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-rose-500" />
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
          <h3 className="text-orange-500 font-semibold mb-2">Transparencia</h3>
          <p className="text-sm">
            Cada trimestre publicamos un informe detallado de cómo utilizamos
            las donaciones. Creemos en la transparencia total con nuestra
            comunidad.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
