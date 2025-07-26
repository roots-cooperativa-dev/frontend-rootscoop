"use client";

export default function FailurePage() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold text-red-600">¡Pago rechazado!</h1>
      <p className="mt-4 text-gray-700">
        Hubo un problema al procesar tu donación. Podés intentar nuevamente o
        contactarnos por redes sociales.
      </p>
      <a
        href="/donaciones"
        className="mt-6 inline-block text-red-600 underline"
      >
        Volver a intentar
      </a>
    </div>
  );
}
