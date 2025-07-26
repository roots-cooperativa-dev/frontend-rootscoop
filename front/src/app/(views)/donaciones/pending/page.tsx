"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PendingContent() {
  const searchParams = useSearchParams();
  const status = searchParams?.get("status");

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold text-yellow-600">
        Tu pago está pendiente ⏳
      </h1>
      {status && <p className="mt-4 text-yellow-500">Estado: {status}</p>}
      <p className="mt-2 text-gray-600">
        Te avisaremos cuando se confirme. ¡Gracias por tu paciencia!
      </p>
    </div>
  );
}

export default function PendingPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <PendingContent />
    </Suspense>
  );
}
