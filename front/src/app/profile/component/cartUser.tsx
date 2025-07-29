"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "../../../routes";
import { useAuthContext } from "../../../context/authContext";
import { useCartContext } from "../../../context/cartContext";
import { getCart, deleteCartItem, updateCartItemQuantity } from "../../../services/cart";
import Loading from "@/src/components/loading/pantallaCargando";
import ButtonBuy from "@/src/components/botonComprar/ButtonBuy";
import { toast } from "sonner";
import Link from "next/link";

const CartPage = () => {
  const { user, token, loading } = useAuthContext();
  const { cart, totalAmount, saveCartData } = useCartContext();
  const router = useRouter();

  const [isLoadingCart, setIsLoadingCart] = useState(true);

  const fetchCart = async () => {
    try {
      if (!token) return;

      const data = await getCart(token);

      if (!data || !data.items || typeof data.total !== "string") return;

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

  const handleDelete = async (itemId: string, token: string | null | undefined) => {
    try {
      const response = await deleteCartItem(itemId, token);
      if (!response) {
        toast.error("Error al eliminar este item");
        return;
      }
      await fetchCart();
      toast.success("Producto eliminado del carrito");
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  const handleQuantityChange = async (itemId: string, quantity: number) => {
    if (quantity < 1) return; // No permitimos cantidades menores a 1
    try {
      await updateCartItemQuantity(itemId, quantity, token);
      await fetchCart();
    } catch (error) {
      toast.error("No se pudo actualizar la cantidad");
      console.error("Error al actualizar cantidad:", error);
    }
  };

  if (isLoadingCart) return <Loading />;

  const showItems = cart && cart.length > 0;

  return (
    <div className="flex pb-6 flex-col items-center w-screen px-5">
      <h1 className="text-2xl font-bold mb-6 mt-6">Carrito de compras</h1>
      <p className="pt-6 pb-6">
        El precio del producto no está incluido en el envío. Uno de nuestros
        socios se comunicará contigo para coordinar la entrega. Ten en cuenta
        que el precio del envío varía según el medio utilizado.
      </p>

      {showItems ? (
        <>
          <ul className="space-y-4 w-full">
            {cart.map((item, index) => (
              <li
                key={item.cartItemId || index}
                className="flex items-center justify-between p-4 border rounded-md bg-white"
              >
                <div>
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-sm">
                    Talla: <strong>{item.size}</strong>
                  </p>
                  <p className="text-sm">
                    Precio unitario: ${item.price.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      className="px-2 py-1 bg-[#017D74] text-white rounded"
                      onClick={() =>
                        item.cartItemId &&
                        handleQuantityChange(item.cartItemId, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span className="text-sm">{item.quantity}</span>
                    <button
                      className="px-2 py-1 bg-[#017D74] text-white rounded"
                      onClick={() =>
                        item.cartItemId &&
                        handleQuantityChange(item.cartItemId, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <p className="text-sm font-semibold mt-1">
                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() =>
                    item.cartItemId && handleDelete(item.cartItemId, token)
                  }
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 text-right">
            <h3 className="text-xl font-bold mt-4">Total: ${totalAmount}</h3>
          </div>
          <ButtonBuy />
        </>
      ) : (
        <>
          <p className="text-gray-500">Tu carrito está vacío.</p>
          <p>
            Ve a nuestra store para{" "}
            <Link
              href="/productos"
              className="text-[#017D74] underline hover:text-[#015e57]"
            >
              comprar
            </Link>
          </p>
        </>
      )}
    </div>
  );
};

export default CartPage;
