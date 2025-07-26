"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams?.get("payment_id");

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold text-green-600">
        ¡Gracias por tu donación! 💚
      </h1>
      {paymentId && <p className="mt-4">ID de pago: {paymentId}</p>}
      <p className="mt-2 text-gray-600">
        Tu aporte ayuda a sostener ROOTS de manera autogestiva.
      </p>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
