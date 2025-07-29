import axios from "axios";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

const axiosApiBack = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getUserVisits = async ( token: string) => {
  const response = await axiosApiBack.get(`/visits/my-appointments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.data) throw new Error("No se pudieron obtener los datos del usuario");

  return response.data;
};