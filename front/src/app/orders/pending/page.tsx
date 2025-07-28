"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { Button } from "../../../components/ui/button";
import { Clock } from "lucide-react";

function PendingCompraContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams?.get("payment_id");
  const router = useRouter();

  const whatsappLink = "https://wa.link/b4wyji";

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-yellow-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center space-y-6">
        <Clock className="text-yellow-500 w-12 h-12 mx-auto" />
        <h1 className="text-3xl font-bold text-yellow-600">Pago en proceso</h1>

        {paymentId && (
          <p className="text-sm text-gray-700">ID de pago: {paymentId}</p>
        )}

        <p className="text-gray-600">
          Tu compra está siendo procesada. En breve recibirás la confirmación.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
          <Button
            onClick={() => (window.location.href = whatsappLink)}
            className="bg-green-600 hover:bg-green-700 text-white w-full"
          >
            Consultar por WhatsApp
          </Button>
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="border-yellow-600 text-yellow-600 hover:bg-yellow-100 w-full"
          >
            Ir al inicio
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PendingCompraPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Cargando...</div>}>
      <PendingCompraContent />
    </Suspense>
  );
}
