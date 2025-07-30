"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "../../../components/ui/button";
import { CheckCircle } from "lucide-react";
import { useCartContext } from "@/src/context/cartContext";
import { deleteCart } from "../../../services/comprar";
import { useAuthContext } from "@/src/context/authContext";

function SuccessCompraContent() {
  const { resetCart } = useCartContext();
  const { token } = useAuthContext();
  const searchParams = useSearchParams();
  const paymentId = searchParams?.get("payment_id");
  const router = useRouter();

  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleGoHome = async () => {
    setIsRedirecting(true);
    try {
      resetCart(); // Limpiar carrito local
      await deleteCart(token); // Eliminar carrito del backend
    } catch (error) {
      console.error("Error al eliminar el carrito:", error);
    } finally {
      router.push("/"); // Redirigir siempre
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center space-y-6">
        <CheckCircle className="text-green-600 w-12 h-12 mx-auto" />
        <h1 className="text-3xl font-bold text-green-600">¡Compra aprobada!</h1>

        {paymentId && (
          <p className="text-sm text-gray-700">ID de pago: {paymentId}</p>
        )}

        <p className="text-gray-600">
          Muchas gracias por aportar, tu compra fue procesada correctamente.
        </p>

        <Button
          onClick={handleGoHome}
          disabled={isRedirecting}
          className="bg-green-600 hover:bg-green-700 text-white w-full"
        >
          {isRedirecting ? "Redirigiendo..." : "Ir al inicio"}
        </Button>
      </div>
    </div>
  );
}

export default function SuccessCompraPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Cargando...</div>}>
      <SuccessCompraContent />
    </Suspense>
  );
}
