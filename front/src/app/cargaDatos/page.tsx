'use client'
import Loading from "@/src/components/loading/pantallaCargando";
import { useAuthContext } from "@/src/context/authContext";
import { useCartContext } from "@/src/context/cartContext";
import { getCart } from "@/src/services/cart";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DataLoad = () => {
  const { user, token, loading } = useAuthContext();
  const { cart, setCartFromServer } = useCartContext();
  const router = useRouter();
  const [isLoadingCart, setIsLoadingCart] = useState(true);

  const fetchCart = async () => {
    try {
      const data = await getCart(token);
      console.log(data)
      setCartFromServer(data.items, data.total); // ✅ actualiza el context
      console.log(cart);
      router.push("/");
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
    } finally {
      setIsLoadingCart(false);
    }
  };
  useEffect(() => {
    if (token) fetchCart();
  }, [user, token, loading, router]);
  return (
    <>
      <Loading />
    </>
  );
};

export default DataLoad;
