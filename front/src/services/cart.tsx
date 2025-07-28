"use server";
import axios from "axios";

interface Icart {
  productId: string;
  productSizeId: string;
  quantity: number;
}

const axiosApiBack = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const addProductToCart = async (
  data: Icart,
  token: string | null | undefined
) => {
  try {
    console.log(data);
    console.log(token);
    const response = await axiosApiBack.post("/orders/cart/add", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data) throw new Error("Problema para añadir al carrito");

    return response.data;
  } catch (e: any) {
    console.warn(e.message);
    return null;
  }
};

export const getCart = async (token: string | null | undefined) => {
  try {
    const response = await axiosApiBack.get("/orders/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("RESPONSE DATA:", response.data); // 👈 esto es clave
    if (!response.data) throw new Error("No hay productos en carrito");
    console.log(response);
    return response.data;
  } catch (e: any) {
    console.warn(e.message);
    return null;
  }
};

export const deleteCartItem = async (
  id: string | null | undefined,
  token: string | null | undefined
) => {
  try {
    const response = await axiosApiBack.get(`/orders/cart/items/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data) throw new Error("No se pudo eliminar del carrito");

    return response.data;
  } catch (e: any) {
    console.warn(e.message);
    return null;
  }
};
