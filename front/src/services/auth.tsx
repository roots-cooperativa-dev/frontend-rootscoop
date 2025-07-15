import axios from "axios";
const urlBack = "https://roots-api-te93.onrender.com";
const urlLocal = "http://localhost:3003"

const axiosApiBack = axios.create({
  baseURL: urlBack,
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

export const loginGoogle = async (data: any) => {
  const response = window.location.href = "https://roots-api-te93.onrender.com/auth/google";
  console.log(response)
  if (!response) throw new Error("Error en login con Google");
  return {
    message: "Sesión iniciada correctamente con Google",
    data: response,
  };
};
