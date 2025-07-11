const InfoBox = () => {
  return (
    <aside className="space-y-20">
      {/* ¿Qué vas a ver? */}
      <div className="border border-sky-200 bg-white p-5 rounded-xl">
        <div className="flex items-center gap-2 mb-7">
          <div className="bg-sky-400 text-white rounded-full p-2">👁️</div>
          <h3 className="text-sky-600 font-bold text-lg">¿Qué vas a ver?</h3>
        </div>
        <ul className="space-y-9 text-gray-700 text-sm">
          <li>🗑️ Proceso completo de cerveza artesanal</li>
          <li>🍽️ Cocina cooperativa en funcionamiento</li>
          <li>🥟 Taller de empanadas (si hay producción)</li>
          <li>🌱 Huerta orgánica y compostaje</li>
          <li>💗 Charla sobre cooperativismo</li>
        </ul>
      </div>

      {/* Información práctica */}
      <div className="border border-orange-200 bg-white-50 p-5 rounded-xl">
        <h3 className="text-orange-600 font-bold text-lg mb-3">
          Información práctica
        </h3>
        <ul className="space-y-6 text-sm text-gray-800">
          <li>
            <strong>⏳ Duración: 2 horas</strong>
            <br />
            <span className="text-gray-500">Incluye degustación</span>
          </li>
          <li>
            <strong>👥 Grupos de hasta 15 personas</strong>
            <br />
            <span className="text-gray-500">Visitas personalizadas</span>
          </li>
          <li>
            <strong>📍 La Plata, Buenos Aires</strong>
            <br />
            <span className="text-gray-500">
              Te enviamos la dirección exacta
            </span>
          </li>
        </ul>
      </div>

      {/* ¿Cuánto cuesta? */}
      <div className="border border-pink-200 bg-white-50 p-5 rounded-xl">
        <h3 className="text-pink-600 font-bold text-lg mb-3">
          ¿Cuánto cuesta?
        </h3>
        <ul className="space-y-2 text-sm text-gray-800">
          <li className="flex justify-between">
            <span>Visita estándar</span>
            <span className="bg-sky-500 text-white text-xs px-2 py-1 rounded-full">
              $3.000
            </span>
          </li>
          <li className="flex justify-between">
            <span>Estudiantes</span>
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              $2.000
            </span>
          </li>
          <li className="flex justify-between">
            <span>Grupos +10 personas</span>
            <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
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
