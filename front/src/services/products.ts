'use server'
import axios from "axios";

const axiosApiBack = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const createOrders = async (
  data: { products: number[]; userId: string },
  token: string
) => {
  try {
    const response = await axiosApiBack.post('/orders', data, {
      headers: {
        Authorization: token,
      },
    });

    if (!response.data) throw new Error('No se pudo crear la orden');

    return response.data;
  } catch (e: any) {
    console.warn(e.message);
    return null;
  }
};

export const getOrdersUser = async (token: string, page = 1, limit = 5) => {
  const response = await axiosApiBack.get(`/orders/my-orders?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.data) throw new Error("No se pudieron obtener las órdenes del usuario");

  return response.data;
};

