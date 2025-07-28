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
          <div className="w-12 h-12 rounded-full bg-[#922f4e] flex items-center justify-center">
            <Eye className="text-white w-6 h-6" />
          </div>
          <h3 className="text-[#922f4e] font-semibold text-lg font-chewy">
            ¿Que vas a ver?
          </h3>
        </div>
        <ul className="space-y-8 text-gray-700 text-m flex-item-center font-bebas">
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
        <h3 className="text-[#febb07] font-semibold text-lg mb-3 font-chewy">
          Informacion practica
        </h3>
        <ul className="space-y-6 text-sm text-gray-800 font-bebas">
          <li>
            <strong className="flex items-center gap-2 ">
              <Clock className="h-4 w-4 text-[#6a4c93]" />
              Duracion: 2 horas
            </strong>

            <span className="text-gray-500 ml-6 font-popular">
              Incluye degustación
            </span>
          </li>
          <li>
            <strong className="flex items-center gap-2 ">
              <Users className="h-4 w-4 text-[#2d9cdb]" />
              Grupos de hasta 15 personas
            </strong>
            <span className="text-gray-500 ml-6 font-popular">
              Visitas personalizadas
            </span>
          </li>
          <li>
            <strong className="flex items-center gap-2 ">
              <MapPin className="h-4 w-4 text-[#e63946]" />
              La Plata, Buenos Aires
            </strong>
            <span className="text-gray-500 ml-6 font-popular">
              Te enviamos la dirección exacta
            </span>
          </li>
        </ul>
      </div>

      {/* ¿Cuánto cuesta? */}
      <div className="border border-[#017d74] bg-white-50 p-5 rounded-xl">
        <h3 className="text-[#017d74] font-semibold text-lg mb-3 font-chewy">
          Cuanto cuesta
        </h3>
        <ul className="space-y-2 text-m text-[#09090b] font-bebas">
          <li className="flex justify-between">
            <span className=" text-m font-bebas">Bono contribucion</span>
            <span className="bg-[#017d74] text-white text-s px-2 py-1 rounded-full font-bebas">
              $20.000
            </span>
          </li>
        </ul>
        <p className="mt-2 text-s text-gray-600 italic font-popular">
          * Incluye degustación de cerveza y productos de la cocina
        </p>
      </div>
    </aside>
  );
};

export default InfoBox;
