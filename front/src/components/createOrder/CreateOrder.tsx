'use client';

import { createOrders } from "../../services/products";
import { toast } from "sonner";
import { useCartContext } from "../../context/cartContext";
import { useAuthContext } from "../../context/authContext";

const CreateOrder = () => {
  const { cart, resetCart } = useCartContext();
  const { user, token } = useAuthContext();

  const crearOrden = async () => {
    if (!user?.id || !token) {
      toast.error("Usuario no autenticado");
      return;
    }

    if (!cart.length) {
      toast.error("El carrito está vacío");
      return;
    }

    const productIds = cart.map((item) => item.id).filter(Boolean) as number[];

    const orderData = {
      products: productIds,
      userId: user.id,
    };

    const response = await createOrders(orderData, token);

    if (response) {
      toast.success("Orden creada con éxito");
      resetCart();
      // Aquí podés redirigir o mostrar una nueva vista si querés
    } else {
      toast.error("No se pudo crear la orden");
    }
  };

  return (
    <div className="flex flex-row gap-2">
      <button
        onClick={crearOrden}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Crear orden
      </button>
    </div>
  );
};

export default CreateOrder;
