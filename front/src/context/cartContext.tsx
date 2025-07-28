"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CartProduct } from "../app/types";

type SaveCartLoad = {
  cart: {
    items: any[];
    total: string;
    id: string;
  };
};

type CartContextType = {
  cart: CartProduct[];
  total: number;
  id: string;
  totalAmount: string;
  addToCart: (product: CartProduct) => void;
  removeFromCart: (productId: string, size: string) => void;
  isProductInCart: (productId: string, size: string) => boolean;
  resetCart: () => void;
  saveCartData: (data: SaveCartLoad) => void;
};

const cartContext = createContext<CartContextType | undefined>(undefined);

// 🗝️ Claves del localStorage
const CART_LOCAL_KEY = "cart";
const CART_TOTAL_KEY = "cartTotal";
const CART_ID_KEY = "cartId";
const CART_TOTAL_AMOUNT_KEY = "cartTotalAmount";

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartProduct[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [id, setId] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<string>("0");

  // ✅ Cargar carrito desde localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem(CART_LOCAL_KEY);
    const storedTotal = localStorage.getItem(CART_TOTAL_KEY);
    const storedCartId = localStorage.getItem(CART_ID_KEY);
    const storedTotalAmount = localStorage.getItem(CART_TOTAL_AMOUNT_KEY);

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

    if (storedCartId) {
      setId(storedCartId);
    }

    if (storedTotalAmount) {
      setTotalAmount(storedTotalAmount);
    }
  }, []);

  // ✅ Guardar automáticamente en localStorage cuando el cart, total o totalAmount cambian
  useEffect(() => {
    localStorage.setItem(CART_LOCAL_KEY, JSON.stringify(cart));
    localStorage.setItem(CART_TOTAL_KEY, JSON.stringify(total));
    localStorage.setItem(CART_TOTAL_AMOUNT_KEY, totalAmount);
  }, [cart, total, totalAmount]);

  // ✅ Guardar carrito desde el backend
  const saveCartData = (data: SaveCartLoad) => {
    console.log(data);
    const adaptedCart: CartProduct[] = data.cart.items.map((item) => ({
      id: item.product.id,
      name: item.product.name,
      details: item.product.details,
      size: item.productSize?.size,
      price: parseFloat(item.priceAtAddition),
      quantity: item.quantity,
    }));

    setId(data.cart.id);
    console.log(data.cart.id);
    setCart(adaptedCart);
    setTotalAmount(data.cart.total);

    localStorage.setItem(CART_ID_KEY, data.cart.id);
    localStorage.setItem(CART_TOTAL_AMOUNT_KEY, data.cart.total);

    const totalQuantity = adaptedCart.reduce((acc, item) => acc + (item.quantity || 0), 0);
    setTotal(totalQuantity);
  };

  // ✅ Agregar al carrito
  const addToCart = (product: CartProduct) => {
    const existsIndex = cart.findIndex(
      (item) => item.id === product.id && item.size === product.size
    );

    let updatedCart;

    if (existsIndex !== -1) {
      updatedCart = [...cart];
      updatedCart[existsIndex].quantity += product.quantity;
    } else {
      updatedCart = [...cart, product];
    }

    const updatedTotal = updatedCart.reduce((acc, item) => acc + item.quantity, 0);
    setCart(updatedCart);
    setTotal(updatedTotal);
  };

  // ✅ Eliminar del carrito
  const removeFromCart = (productId: string, size: string) => {
    const updatedCart = cart.filter((item) => !(item.id === productId && item.size === size));
    const newTotal = updatedCart.reduce((acc, item) => acc + item.quantity, 0);

    setCart(updatedCart);
    setTotal(newTotal);
  };

  // ✅ Verificar si el producto está en el carrito
  const isProductInCart = (productId: string, size: string) => {
    return cart.some((item) => item.id === productId && item.size === size);
  };

  // ✅ Resetear carrito
  const resetCart = () => {
    setCart([]);
    setTotal(0);
    setTotalAmount("0");
    setId("");

    localStorage.removeItem(CART_LOCAL_KEY);
    localStorage.removeItem(CART_TOTAL_KEY);
    localStorage.removeItem(CART_ID_KEY);
    localStorage.removeItem(CART_TOTAL_AMOUNT_KEY);
  };

  return (
    <cartContext.Provider
      value={{
        cart,
        total,
        id,
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
