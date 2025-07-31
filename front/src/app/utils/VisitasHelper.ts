import axios from "axios";
import { IVisita } from "../types";
import { VisitaDTO, NuevoTurnoDTO } from "../dto/VisitaDTO";
import { getAuthHeader } from "./CategoriasHelper";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchVisitas = async (): Promise<IVisita[]> => {
  try {
    const headers = await getAuthHeader(); // Si es async
    const response = await axios.get(`${API_URL}/visits`, { ...headers });
    return response.data;
  } catch (error) {
    console.error("Error al obtener visitas:", error);
    return [];
  }
};

export const crearVisita = async (visita: VisitaDTO) => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.post(`${API_URL}/visits`, visita, {
      ...headers,
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear visita:", error);
    return null;
  }
};

export const agregarTurnoAVisita = async (
  visitaId: string,
  data: NuevoTurnoDTO
): Promise<void> => {
  try {
    const headers = await getAuthHeader();
    await axios.post(`${API_URL}/visits/${visitaId}/slots`, data, { ...headers });
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data;

      console.error("Error al agregar turno a la visita:");

      if (responseData?.errors) {
        Object.entries(responseData.errors).forEach(([campo, mensajes]) => {
          console.error(`${campo}: ${(mensajes as string[]).join(", ")}`);
        });
      } else if (responseData?.message) {
        console.error("Mensaje:", responseData.message);
      } else {
        console.error("Mensaje genérico:", error.message);
      }
    } else {
      console.error("Error desconocido:", error);
    }

    throw error;
  }
};


export const eliminarVisita = async (visitaId: string): Promise<boolean> => {
  try {
    const headers = await getAuthHeader();
    await axios.delete(`${API_URL}/visits/${visitaId}`, { ...headers });
    return true;
  } catch (error) {
    console.error("Error al eliminar visita:", error);
    return false;
  }
};

export const updateVisita = async (
  visitaId: string,
  visita: VisitaDTO
): Promise<VisitaDTO> => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.put(
      `${API_URL}/visits/${visitaId}`,
      visita,
      { ...headers }
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar visita:", error);
    throw error;
  }
};

export const fetchVisitaById = async (id: string): Promise<IVisita | null> => {
  try {
    const headers = await getAuthHeader();
    const response = await axios.get(`${API_URL}/visits/${id}`, { ...headers });
    return response.data;
  } catch (error) {
    console.error(`Error al obtener la visita con ID ${id}:`, error);
    return null;
  }
};