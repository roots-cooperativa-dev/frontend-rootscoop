"use client";

import { IProducto } from "@/src/app/types";
import { useAuthContext } from "../../context/authContext";
import { useCartContext } from "../../context/cartContext";
import { routes } from "../../routes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addProductToCart } from "@/src/services/cart";

const CartAddBtn = ({ product }: { product: IProducto }) => {
  const router = useRouter();
  const { isAuth, token } = useAuthContext();
  const { addToCart, isProductInCart } = useCartContext();

  const redirigirLogin = () => {
    toast.error("Para añadir al carrito debe iniciar sesión o registrarte");
    setTimeout(() => {
      router.push(routes.login);
    }, 3600);
  };

  const onAddElement = async () => {
    if (!product?.sizes?.[0]?.id) {
      toast.error("Este producto no tiene una talla válida.");
      return;
    }

    const datos = {
      productId: product.id,
      productSizeId: product.sizes[0].id,
      quantity: 1,
    };

    try {
      const productCart = await addProductToCart(datos, token);

      if (!productCart) {
        toast.error("No se pudo agregar el producto al carrito.");
        return;
      }

      addToCart(productCart); // sincroniza localStorage internamente
      toast.success("Producto añadido al carrito");

    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      toast.error("Hubo un error al agregar el producto.");
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

  return (
    <button
      onClick={onAddElement}
      disabled={isProductInCart(product.id)}
      className={`text-white mt-4 w-full ${
        isProductInCart(product.id) ? "bg-gray-400 cursor-not-allowed" : "bg-[#017d74] hover:bg-[#015D54]"
      } focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center`}
    >
      {isProductInCart(product.id) ? "Ya en el carrito" : "Agregar al carrito"}
    </button>
  );
};

export default CartAddBtn;
