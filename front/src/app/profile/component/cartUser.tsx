"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "../../../routes";
import { useAuthContext } from "../../../context/authContext";
import { useCartContext } from "../../../context/cartContext";
import { getCart, deleteCartItem } from "../../../services/cart";
import Loading from "@/src/components/loading/pantallaCargando";

const CartPage = () => {
  const { user, token, loading } = useAuthContext();
  const { cart, totalAmount, setCartFromServer } = useCartContext();
  const router = useRouter();

  const [isLoadingCart, setIsLoadingCart] = useState(true);

  const fetchCart = async () => {
    try {
      if (!token) {
        console.warn("Token no disponible, cancelando fetchCart");
        return;
      }

      console.log("TOKEN:", token);
      const data = await getCart(token);
      console.log("Respuesta del carrito:", data);

      if (!data || !data.items || typeof data.total !== "number") {
        console.warn("Estructura inválida del carrito:", data);
        return;
      }

      setCartFromServer(data.items, data.total);
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

  const handleDelete = async (itemId: string, token: string) => {
    try {
      await deleteCartItem(itemId, token);
      fetchCart();
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      alert("No se pudo eliminar el producto del carrito.");
    }
  };

  if (isLoadingCart) {
    return <Loading />;
  }

  const showItems = cart && cart.length > 0;

  return (
    <div className="flex flex-col items-center w-screen px-5 ">
      <h1 className="text-2xl font-bold mb-6">Carrito de compras</h1>

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
                  <p className="text-sm">Talla: <strong>{item.size}</strong></p>
                  <p className="text-sm">Precio unitario: ${item.price?.toFixed(2)}</p>
                  <p className="text-sm">Cantidad: {item.quantity}</p>
                  <p className="text-sm font-semibold">
                    Subtotal: ${(item.price! * (item.quantity || 1)).toFixed(2)}
                  </p>
                </div>
                {/* <button
                  onClick={() => item.id && handleDelete(item.id, token)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Eliminar
                </button> */}
              </li>
            ))}
          </ul>

          <div className="mt-6 text-right">
            <h3 className="text-xl font-bold mt-4">
              Total: ${totalAmount}
            </h3>
          </div>
        </>
      ) : (
        <p className="text-gray-500">Tu carrito está vacío.</p>
      )}
    </div>
  );
};

export default CartPage;
