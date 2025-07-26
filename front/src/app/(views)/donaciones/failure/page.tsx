"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function FailureContent() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams?.get("message");

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold text-red-600">
        ¡Ups! Algo salió mal 💔
      </h1>
      {errorMessage && (
        <p className="mt-4 text-red-500">Error: {errorMessage}</p>
      )}
      <p className="mt-2 text-gray-600">
        Podés intentar nuevamente o contactarnos si el problema persiste.
      </p>
    </div>
  );
}

export default function FailurePage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <FailureContent />
    </Suspense>
  );
}
