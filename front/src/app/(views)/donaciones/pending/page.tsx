"use client";

export default function PendingPage() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold text-yellow-600">¡Pago en proceso!</h1>
      <p className="mt-4 text-gray-700">
        Tu donación está siendo procesada por Mercado Pago. Te avisaremos por
        mail una vez que se acredite.
      </p>
      <a href="/" className="mt-6 inline-block text-yellow-600 underline">
        Volver al inicio
      </a>
    </div>
  );
}
