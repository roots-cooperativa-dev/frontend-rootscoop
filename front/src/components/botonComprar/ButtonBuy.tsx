"use client";

import { Button } from "../ui/button";
import { useCartContext } from "@/src/context/cartContext";
import { useAuthContext } from "@/src/context/authContext";
import { orderPayments } from "../../services/comprar";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ButtonBuy = () => {
  const { totalAmount } = useCartContext();
  const { user } = useAuthContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleBuy = async () => {
    if (!user || !user.id) {
      alert("Debes iniciar sesión para continuar con la compra");
      router.push("/login");
      return;
    }

    try {
      setLoading(true);

      const data = {
        amount: parseFloat(totalAmount),
        message: "Compra desde carrito",
        currency: "ARS",
        cartId: user.id, // ✅ asegurate que esto esté disponible en el user
      };

      const result = await orderPayments(data, user.id);

      if (result && result.initPoint) {
        window.location.href = result.initPoint; // 🔁 Redirige al checkout de MercadoPago
      } else {
        alert("No se pudo iniciar el pago. Intenta de nuevo.");
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      alert("Ocurrió un error al intentar pagar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleBuy}
      disabled={loading}
      className={`w-full text-lg font-bold shadow-md bg-[#922f4e] hover:bg-[#642d91] text-white`}
    >
      {loading ? "Redirigiendo..." : "Comprar ahora"}
    </Button>
  );
};

export default ButtonBuy;
