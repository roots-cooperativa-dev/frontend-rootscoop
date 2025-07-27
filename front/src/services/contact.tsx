import axios from "axios";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
import { IContactanos } from "../app/types";

const axiosApiBack = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


export const postContact = async (data: IContactanos) => {
  const response = await axiosApiBack.post("/contact", data);
  if (!response.data) throw new Error("Credenciales incorrectas");
  return { message: "Sesión iniciada correctamente", data: response.data };
};