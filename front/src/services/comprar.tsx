import axios from "axios";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

interface pay{
  amount: number,
  message: string,
  currency: string,
  cartId: string
}

const axiosApiBack = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const orderPayments = async (data: pay, userId: string, token:string |null | undefined) => {
  const response = await axiosApiBack.post(`/order-payments/create-preference/${userId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.data) throw new Error("Error al crear la preferencia de pago");
  return response.data;
};

export const deleteCart = async ( token:string |null | undefined) => {
  const response = await axiosApiBack.post(`/orders/cart/checkout`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.data) throw new Error("Error al eliminar todo del carrito");
  return response.data;
};