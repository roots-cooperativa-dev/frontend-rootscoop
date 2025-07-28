import axios from "axios";
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

interface ForgotPasswordData {
  email: string;
}

interface ChangePasswordData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

const axiosApiBack = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const forgotPassword = async (data: ForgotPasswordData) => {
  const response = await axiosApiBack.post("/users/forgot-password", data);
  if (!response.data) throw new Error("problema con la solicitud");
  return {
    message: "Solicitud de cambio de contraseña enviada a tu correo",
    data: response.data,
  };
};

export const resetPassword = async (data: ChangePasswordData) => {
  const response = await axiosApiBack.post("/users/reset-password", data);
  if (!response.data) throw new Error("problema con la solicitud");
  return {
    message: "Solicitud de cambio de contraseña enviada a tu correo",
    data: response.data,
  };
};
