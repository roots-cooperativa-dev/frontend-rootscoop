"use server";
import axios from "axios";
import { Icart } from "../app/types";

const axiosApiBack = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const addProductToCart = async (data: Icart, token: string | null | undefined) => {
  try {
    console.log(data)
    console.log(token)
    const response = await axiosApiBack.post("/orders/cart/add", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data) throw new Error("No se pudo añadir al carrito");

    return response.data;
  } catch (e: any) {
    console.warn(e.message);
    return null;
  }
};

export const getCart = async ( token: string | null | undefined) => {
  try {
    const response = await axiosApiBack.get("/orders/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data) throw new Error("No se pudo recuperar datos del carrito");
    console.log(response)
    return response.data;
  } catch (e: any) {
    console.warn(e.message);
    return null;
  }
};

export const deleteCartItem = async ( id: string | null | undefined, token: string) => {
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