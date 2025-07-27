"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CartProduct } from "../app/types";

type SaveCartLoad = {
  cart: {
    items: any[];
    total: string;
  };
};

type CartContextType = {
  cart: CartProduct[];
  total: number;
  totalAmount: string;
  addToCart: (product: CartProduct) => void;
  removeFromCart: (productId: string) => void;
  isProductInCart: (productId: string) => boolean;
  resetCart: () => void;
  saveCartData: (data: SaveCartLoad) => void;
};

const cartContext = createContext<CartContextType | undefined>(undefined);

const CART_LOCAL_KEY = "cart";
const CART_TOTAL_KEY = "cartTotal";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartProduct[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<string>("0");

  // ✅ Guardar en localStorage
  const persistCart = (cartData: CartProduct[], totalQty: number) => {
    localStorage.setItem(CART_LOCAL_KEY, JSON.stringify(cartData));
    localStorage.setItem(CART_TOTAL_KEY, JSON.stringify(totalQty));
  };

  // ✅ Guardar carrito desde el backend
  const saveCartData = (data: SaveCartLoad) => {
    const adaptedCart: CartProduct[] = data.cart.items.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      details: item.product.details,
      size: item.productSize?.size,
      price: parseFloat(item.priceAtAddition),
      quantity: item.quantity,
    }));

    setCart(adaptedCart);
    setTotalAmount(data.cart.total);

    const totalQuantity = data.cart.items.reduce(
      (acc, item) => acc + (item.quantity || 0),
      0
    );

    setTotal(totalQuantity);
    persistCart(adaptedCart, totalQuantity);
  };

  // ✅ Agregar al carrito
  const addToCart = (product: CartProduct) => {
    const exists = cart.find(
      (item) => item.id === product.id && item.size === product.size
    );

    if (exists) return; // Evitar duplicados

    const updatedCart = [...cart, product];
    const updatedTotal = total + (product.quantity || 1);

    setCart(updatedCart);
    setTotal(updatedTotal);
    persistCart(updatedCart, updatedTotal);
  };

  // ✅ Eliminar del carrito
  const removeFromCart = (productId: string) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    const newTotal = updatedCart.reduce((acc, item) => acc + item.quantity, 0);

    setCart(updatedCart);
    setTotal(newTotal);
    persistCart(updatedCart, newTotal);
  };

  // ✅ Verificar si está en el carrito
  const isProductInCart = (productId: string) => {
    return cart.some((item) => item.id === productId);
  };

  // ✅ Resetear carrito
  const resetCart = () => {
    setCart([]);
    setTotal(0);
    setTotalAmount("0");
    localStorage.removeItem(CART_LOCAL_KEY);
    localStorage.removeItem(CART_TOTAL_KEY);
  };

  // ✅ Cargar carrito desde localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem(CART_LOCAL_KEY);
    const storedTotal = localStorage.getItem(CART_TOTAL_KEY);

    if (storedCart && storedTotal) {
      try {
        const parsedCart = JSON.parse(storedCart);
        const parsedTotal = JSON.parse(storedTotal);
        setCart(parsedCart);
        setTotal(parsedTotal);
      } catch (err) {
        console.warn("Error parsing cart from localStorage", err);
      }
    }
  }, []);

  return (
    <cartContext.Provider
      value={{
        cart,
        total,
        totalAmount,
        addToCart,
        removeFromCart,
        isProductInCart,
        resetCart,
        saveCartData,
      }}
    >
      {children}
    </cartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(cartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};
