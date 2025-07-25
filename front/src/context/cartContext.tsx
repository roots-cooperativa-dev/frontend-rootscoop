"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CartProduct } from "../app/types";

type CartContextType = {
  cart: CartProduct[];
  total: number;
  totalAmount: string;
  addToCart: (product: CartProduct) => void;
  removeFromCart: (productId: string) => void;
  isProductInCart: (productId: string) => boolean;
  resetCart: () => void;
  setCartFromServer: (items: CartProduct[], totalAmount: string) => void;
};

const cartContext = createContext<CartContextType | undefined>(undefined);

const CART_LOCAL_STORANGE_KEY = "cart";
const CART_LOCAL_STORANGE_KEY_TOTAL = "cartTotal";
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartContextType["cart"] | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<string>('');

  const setCartFromServer = (items: any[], totalAmount: string ) => {
    const adaptedCart: CartProduct[] = items.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      details: item.product.details,
      size: item.productSize?.size,
      price: parseFloat(item.priceAtAddition),
      quantity: item.quantity,
    }));

    setTotalAmount(totalAmount)
    setCart(adaptedCart);
    const totalQuantity = items.reduce(
      (acc, item) => acc + (item.quantity || 0),
      0
    );
    setTotal(parseFloat(totalQuantity));
  };

  const addToCart = (product: CartProduct) => {
    setCart((prevCart) => [...(prevCart || []), product]);
    setTotal((prevTotal) => (prevTotal || 0) + 1);
  };
  const removeFromCart = (productId: string) => {
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
  const isProductInCart = (productId: string) => {
    return cart ? cart.some((item) => item.id === productId) : false;
  };
  const resetCart = () => {
    setCart([]);
    setTotal(0);
    localStorage.removeItem(CART_LOCAL_STORANGE_KEY);
    localStorage.removeItem(CART_LOCAL_STORANGE_KEY_TOTAL);
  };
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
        totalAmount: totalAmount || '0',
        addToCart,
        removeFromCart,
        isProductInCart,
        resetCart,
        setCartFromServer,
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
