"use client";

import CreateOrder from "../../../components/createOrder/CreateOrder";
import { useCartContext } from "../../../context/cartContext";
import React, { useEffect } from "react";
import Image from "next/image";
import { routes } from "../../../routes";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../../../context/authContext";

const CartPage = () => {
  const { user, token, loading } = useAuthContext();
  const router = useRouter();

  const { cart, removeFromCart } = useCartContext();
   useEffect(() => {
      if (!loading && (!user || !token)) {
        router.push(routes.login);
        return;
      }
    }, [user, token, loading, router]);

  const showCartItems = cart && cart.length > 0;

  const calculateTotal = (items: Partial<Iproduct>[]) => {
    return items.reduce(
      (total: number, item: Partial<Iproduct>) => total + (item.price || 0),
      0
    );
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Carrito de compras</h1>

      {showCartItems ? (
        <>
          <ul className="space-y-4">
            {cart.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-4 border rounded-md"
              >
                <div className="flex items-center gap-4">
                  {item.image && (
                    <div className="w-24 h-24 relative">
                      <Image
                        src={item.image}
                        alt={item.name || "Producto"}
                        layout="fill"
                        objectFit="contain"
                        className="rounded"
                      />
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <p className="text-gray-500">${item.price?.toFixed(2)}</p>
                  </div>
                </div>
                <button
                  onClick={() => item.id && removeFromCart(item.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6 text-right">
            <CreateOrder />
            <h3 className="text-xl font-bold">
              Total: ${calculateTotal(cart).toFixed(2)}
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
