"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "../../../../components/ui/button";
import { useRouter } from "next/navigation";

function FailureContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams?.get("payment_id");
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-red-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center space-y-6">
        <h1 className="text-3xl font-bold text-red-600">
          ¡Ups! Hubo un problema con tu donación ❌
        </h1>

        {paymentId && (
          <p className="text-sm text-gray-700">ID de pago: {paymentId}</p>
        )}

        <p className="text-gray-600">
          No pudimos procesar tu donación. Te recomendamos intentar nuevamente o
          consultarnos.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Button
            onClick={() => router.push("/")}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Ir al inicio
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-100"
          >
            <a
              href="https://wa.link/b4wyji"
              target="_blank"
              rel="noopener noreferrer"
            >
              Consultar por WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function FailurePage() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Cargando...</div>}>
      <FailureContent />
    </Suspense>
  );
}
