"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { Button } from "../../../../components/ui/button";

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams?.get("payment_id");
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center space-y-6">
        <h1 className="text-3xl font-bold text-green-600">
          ¡Gracias por tu donación! 💚
        </h1>

        {paymentId && (
          <p className="text-sm text-gray-700">ID de pago: {paymentId}</p>
        )}

        <p className="text-gray-600">
          Tu aporte ayuda a sostener ROOTS de manera autogestiva.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Button
            onClick={() => router.push("/")}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Ir al inicio
          </Button>
          <Button
            onClick={() => router.push("/profile")}
            variant="outline"
            className="border-green-600 text-green-600 hover:bg-green-100"
          >
            Ver mi perfil
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Cargando...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
