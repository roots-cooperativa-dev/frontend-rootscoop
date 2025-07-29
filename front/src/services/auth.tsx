'use server'
import axios from "axios";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;
import { LoginDto, RegisterDto, UpdateUserDTO, UserGoogle } from "../types";

const axiosApiBack = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const postRegister = async (data: RegisterDto) => {
  const response = await axiosApiBack.post("/auth/signup", data);
  if (!response.data) throw new Error("No se pudo registrar el usuario");
  return "Usuario registrado correctamente";
};

export const postLogin = async (data: LoginDto) => {
  const response = await axiosApiBack.post("/auth/signin", data);
  if (!response.data) throw new Error("Credenciales incorrectas");
  return { message: "Sesión iniciada correctamente", data: response.data };
};


export const getUserById = async (id: string, token: string) => {
  const response = await axiosApiBack.get(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.data) throw new Error("No se pudieron obtener los datos del usuario");

  return response.data;
};

export const updateUser = async (
  id: string,
  token: string,
  data: UpdateUserDTO
) => {
  const response = await axiosApiBack.put(
    `/users/update/user`, // NUEVA RUTA
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        id: id, // PASAR ID COMO PARÁMETRO DE QUERY
      },
    }
  );

  if (!response.data) throw new Error("No se pudo actualizar el usuario");

  return response.data;
};






export const actualizarUser = async (
  id: string,
  token: string,
  data: Partial<UserGoogle>
) => {
  const response = await axiosApiBack.put(`/users/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.data) throw new Error("No se pudo actualizar el usuario");

  return response.data;
};
