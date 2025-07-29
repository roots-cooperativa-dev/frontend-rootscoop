"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "../../../routes";
import { useAuthContext } from "../../../context/authContext";
import { useCartContext } from "../../../context/cartContext";
import { getCart, deleteCartItem } from "../../../services/cart";
import Loading from "@/src/components/loading/pantallaCargando";
import ButtonBuy from "@/src/components/botonComprar/ButtonBuy";
import { toast } from "sonner";

const CartPage = () => {
  const { user, token, loading } = useAuthContext();
  const { cart, totalAmount, saveCartData } = useCartContext();
  const router = useRouter();

  const [isLoadingCart, setIsLoadingCart] = useState(true);

  const fetchCart = async () => {
    try {
      if (!token) {
        console.warn("Token no disponible, cancelando fetchCart");
        return;
      }

      const data = await getCart(token);
      console.log("Respuesta del carrito:", data);

      if (!data || !data.items || typeof data.total !== "string") {
        console.warn("Estructura inválida del carrito:", data);
        return;
      }

      saveCartData({ cart: data });
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
    } finally {
      setIsLoadingCart(false);
    }
  };

  useEffect(() => {
    if (loading) return;

    if (!user || !token) {
      router.push(routes.login);
      return;
    }

    fetchCart();
  }, [user, token, loading, router]);

  const handleDelete = async (
    itemId: string,
    token: string | null | undefined
  ) => {
    console.log(itemId);
    try {
      const response = await deleteCartItem(itemId, token);
      console.log(response);

      if (!response) {
        toast.error("Error al eliminar este item");
        throw new Error("No se recibió respuesta al intentar eliminar el item");
      }
      await fetchCart();
      toast.success("Producto eliminado del carrito");
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  if (isLoadingCart) {
    return <Loading />;
  }

  const showItems = cart && cart.length > 0;

  return (
    <div className="flex pb-6 flex-col items-center w-screen px-5">
      <h1 className="text-2xl font-bold mb-6 mt-6">Carrito de compras</h1>
      <p className="pt-6 pb-6">
        El precio del producto no esta incluido en el envio, para hacer envios
        uno de nuestros socios se comunicara contigo para coordinar la entrega,
        ten en cuenta que el precio del envio varia segun el medio utilizado.
      </p>

      {showItems ? (
        <>
          <ul className="space-y-4 w-full">
            {cart.map((item, index) => (
              <li
                key={item.id || index}
                className="flex items-center justify-between p-4 border rounded-md bg-white"
              >
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-sm">
                    Talla: <strong>{item.size}</strong>
                  </p>
                  <p className="text-sm">
                    Precio unitario: ${item.price?.toFixed(2)}
                  </p>
                  <p className="text-sm">Cantidad: {item.quantity}</p>
                  <p className="text-sm font-semibold">
                    Subtotal: ${(item.price! * (item.quantity || 1)).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => item.id && handleDelete(item.id, token)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 text-right ">
            <h3 className="text-xl font-bold mt-4">Total: ${totalAmount}</h3>
          </div>
          <ButtonBuy />
        </>
      ) : (
        <p className="text-gray-500">Tu carrito está vacío.</p>
      )}
    </div>
  );
};

export default CartPage;
