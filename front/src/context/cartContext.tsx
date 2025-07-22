"use client";


import { createContext, useContext, useEffect, useState } from "react";

type CartContextType = {
  cart: Partial<Iproduct>[];
  total: number;
  addToCart: (product: Partial<Iproduct>) => void;
  removeFromCart: (productId: number) => void;
  isProductInCart: (productId: number) => boolean;
  resetCart: () => void;
};

const cartContext = createContext<CartContextType | undefined>(undefined);

const CART_LOCAL_STORANGE_KEY = "cart";
const CART_LOCAL_STORANGE_KEY_TOTAL = "cartTotal";
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartContextType["cart"] | null>(null);
  const [total, setTotal] = useState<number>(0);

  const addToCart = (product: Partial<Iproduct>) => {
    setCart((prevCart) => [...(prevCart || []), product]);
    setTotal((prevTotal) => (prevTotal || 0) + 1);
  };
  const removeFromCart = (productId: number) => {
    setCart((prevCart) => {
      if (!prevCart) return [];
      const updateCart = prevCart.filter((item) => item.id !== productId);
      return updateCart;
    });
    setTotal((prevTotal) => {
      if (prevTotal === undefined || prevTotal <= 0) {
        return 0;
      }
      return prevTotal - 1;
    });
  };
  const isProductInCart = (productId: number) => {
    return cart? cart.some((item) => item.id === productId) : false;
  }
  const resetCart = () => {
    setCart([]);
    setTotal(0);
    localStorage.removeItem(CART_LOCAL_STORANGE_KEY);
    localStorage.removeItem(CART_LOCAL_STORANGE_KEY_TOTAL);
  }
  useEffect(() => {
    if (!cart) return;
    localStorage.setItem(CART_LOCAL_STORANGE_KEY, JSON.stringify(cart));
    localStorage.setItem(
      CART_LOCAL_STORANGE_KEY_TOTAL,
      JSON.stringify(total || 0)
    );
  }, [cart, total]);
  useEffect(() => {
    const storedCart = localStorage.getItem(CART_LOCAL_STORANGE_KEY);
    const storedTotal = localStorage.getItem(CART_LOCAL_STORANGE_KEY_TOTAL);
    if (!storedCart || !storedTotal) {
      setCart([]);
      setTotal(0);
      return;
    }
    setCart(JSON.parse(storedCart));
    setTotal(JSON.parse(storedTotal));
  }, []);
  return (
    <cartContext.Provider
      value={{
        cart: cart || [],
        total: total || 0,
        addToCart,
        removeFromCart,
        isProductInCart,
        resetCart
      }}
    >
      {children}
    </cartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(cartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a AuthProvider");
  }
  return context;
};
