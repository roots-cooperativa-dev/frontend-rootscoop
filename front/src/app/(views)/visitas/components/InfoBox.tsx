import {
  Beer,
  ChefHat,
  Clock,
  Eye,
  Heart,
  Leaf,
  MapPin,
  Pizza,
  Users,
} from "lucide-react";

const InfoBox = () => {
  return (
    <aside className="space-y-20">
      {/* ¿Qué vas a ver? */}
      <div className="border border-sky-200 bg-white p-5 rounded-xl">
        <div className="flex items-center gap-2 mb-7">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#33a5d7] to-teal-300 flex items-center justify-center">
            <Eye className="text-white w-6 h-6" />
          </div>
          <h3 className="text-sky-400 font-bold text-lg">¿Qué vas a ver?</h3>
        </div>
        <ul className="space-y-8 text-gray-700 text-sm flex-item-center">
          <li className="flex items-center gap-2">
            <Beer className="h-4 w-4 text-orange-500" />
            Proceso completo de cerveza artesanal
          </li>
          <li className="flex items-center gap-2">
            <Pizza className="h-4 w-4 text-red-500" />
            Cocina cooperativa en funcionamiento
          </li>
          <li className="flex items-center gap-2">
            <ChefHat className="h-4 w-4 text-[#6a4c93]" />
            Taller de empanadas (si hay producción)
          </li>
          <li className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-[#2d9cdb]" />
            Huerta orgánica y compostaje
          </li>
          <li className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-[#f72585]" />
            Charla sobre cooperativismo
          </li>
        </ul>
      </div>

      {/* Información práctica */}
      <div className="border border-orange-200 bg-white-50 p-5 rounded-xl">
        <h3 className="text-orange-400 font-bold text-lg mb-3">
          Información práctica
        </h3>
        <ul className="space-y-6 text-sm text-gray-800">
          <li>
            <strong className="flex items-center gap-2 ">
              <Clock className="h-4 w-4 text-[#6a4c93]" />
              Duración: 2 horas
            </strong>

            <span className="text-gray-500 ml-6">Incluye degustación</span>
          </li>
          <li>
            <strong className="flex items-center gap-2 ">
              <Users className="h-4 w-4 text-[#2d9cdb]" />
              Grupos de hasta 15 personas
            </strong>
            <span className="text-gray-500 ml-6">Visitas personalizadas</span>
          </li>
          <li>
            <strong className="flex items-center gap-2 ">
              <MapPin className="h-4 w-4 text-[#e63946]" />
              La Plata, Buenos Aires
            </strong>
            <span className="text-gray-500 ml-6">
              Te enviamos la dirección exacta
            </span>
          </li>
        </ul>
      </div>

      {/* ¿Cuánto cuesta? */}
      <div className="border border-pink-200 bg-white-50 p-5 rounded-xl">
        <h3 className="text-[#f72585] font-bold text-lg mb-3">
          ¿Cuánto cuesta?
        </h3>
        <ul className="space-y-2 text-sm text-[#09090b]">
          <li className="flex justify-between">
            <span>Visita estándar</span>
            <span className="bg-sky-500 text-white text-xs px-2 py-1 rounded-full">
              $3.000
            </span>
          </li>
          <li className="flex justify-between">
            <span>Estudiantes</span>
            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
              $2.000
            </span>
          </li>
          <li className="flex justify-between">
            <span>Grupos +10 personas</span>
            <span className="bg-purple-800 text-white text-xs px-2 py-1 rounded-full">
              $2.500
            </span>
          </li>
        </ul>
        <p className="mt-2 text-xs text-gray-600 italic">
          * Incluye degustación de cerveza y productos de la cocina
        </p>
      </div>
    </aside>
  );
};

export default InfoBox;
