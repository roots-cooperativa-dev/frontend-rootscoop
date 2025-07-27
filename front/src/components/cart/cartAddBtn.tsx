"use client";

import { IProducto } from "@/src/app/types";
import { useAuthContext } from "../../context/authContext";
import { useCartContext } from "../../context/cartContext";
import { routes } from "../../routes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addProductToCart } from "@/src/services/cart";
import { useState } from "react";

const CartAddBtn = ({
  product,
  quantity = 1,
}: {
  product: IProducto;
  quantity?: number;
}) => {
  const router = useRouter();
  const { isAuth, token } = useAuthContext();
  const { addToCart, isProductInCart } = useCartContext();
  const [loading, setLoading] = useState(false);

  const redirigirLogin = () => {
    toast.error("Para añadir al carrito debes iniciar sesión o registrarte");
    setTimeout(() => {
      router.push(routes.login);
    }, 3600);
  };

  const onAddElement = async () => {
    if (loading) return;
    setLoading(true);

    const datos = {
      productId: product.id,
      productSizeId: product.sizes[0]?.id,
      quantity,
    };

    try {
      const productCart = await addProductToCart(datos, token);
      if (!productCart) {
        throw new Error("No se pudo añadir el producto");
      }

      addToCart(productCart);
      toast.success("Producto añadido al carrito");
    } catch (error) {
      toast.error("Error al añadir el producto al carrito");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuth) {
    return (
      <div className="flex flex-col items-center">
        <a
          href={routes.login}
          onClick={redirigirLogin}
          className="w-full text-lg font-bold shadow-md mt-4 text-white bg-[#017d74] hover:bg-[#015D54] focus:ring-4 focus:outline-none rounded-lg px-5 py-2.5 text-center"
        >
          Debes iniciar sesión para añadir al carrito
        </a>
      </div>
    );
  }

  const isInCart = isProductInCart(product.id, product.sizes[0]?.id || "0");

  return (
    <button
      onClick={onAddElement}
      disabled={isInCart || loading}
      className={`text-white mt-4 w-full ${
        loading || isInCart ? "bg-gray-400 cursor-not-allowed" : "bg-[#017d74] hover:bg-[#015D54]"
      } focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800`}
    >
      {loading ? "Añadiendo..." : isInCart ? "Ya en el carrito" : "Agregar al carrito"}
    </button>
  );
};

export default CartAddBtn;
