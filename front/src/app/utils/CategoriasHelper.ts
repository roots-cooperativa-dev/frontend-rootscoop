import { ICategory } from "../types";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const getAuthHeader = () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlZTkwYmIzYS0xNDExLTQ1NGItOWY5My04OTZlZTg2OTc0ZDYiLCJlbWFpbCI6Im1hcmNvc0BnbWFpbC5jb20iLCJuYW1lIjoiTWFyY29zIiwiaXNBZG1pbiI6dHJ1ZSwiaXNEb25hdG9yIjpmYWxzZSwiaWF0IjoxNzUyNjI2MzU4fQ.t2KQx5USFp1idASvtpBSDNa6Mav6a4UwLiGZVVZjAG4";
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

export const fetchCategorias = async (): Promise<ICategory[]> => {
    try {
        const response = await axios.get<ICategory[]>(`${API_URL}/category`);
        return response.data;
    } catch (error) {
        console.error("Error fetching categorias:", error);
        return [];
    }
};

export const crearCategoria = async (name: string): Promise<ICategory | null> => {
    try {
        const response = await axios.post<ICategory>(
            `${API_URL}/category`,
            { name },
            getAuthHeader()
        );
        return response.data;
    } catch (error) {
        console.error("Error creating categoria:", error);
        return null;
    }
};

export const actualizarCategoria = async (
    id: number,
    name: string
): Promise<ICategory | null> => {
    try {
        const response = await axios.put<ICategory>(
            `${API_URL}/category/${id}`,
            { name },
            getAuthHeader()
        );
        return response.data;
    } catch (error) {
        console.error("Error updating categoria:", error);
        return null;
    }
};

export const eliminarCategoria = async (id: string): Promise<boolean> => {
    try {
        await axios.delete(`${API_URL}/category/${id}`, getAuthHeader());
        return true;
    } catch (error) {
        console.error("Error deleting categoria:", error);
        return false;
    }
};
