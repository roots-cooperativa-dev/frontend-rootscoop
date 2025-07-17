import { ICategory } from "../types";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeader = () => {
    const userString = localStorage.getItem("user");
    let token = "";

    if (userString) {
        try {
            const user = JSON.parse(userString);
            token = user.accessToken;
        } catch (error) {
            console.error("Error parsing user from localStorage:", error);
        }
    } else {
        console.warn("No user found in localStorage.");
    }

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
    id: string,
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
    if (!id || id === "NaN") {
        console.error("ID inválido para eliminación de categoría:", id);
        return false;
    }

    try {
        await axios.delete(`${API_URL}/category/${id}`, getAuthHeader());
        return true;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.error("Error response:", error.response?.data);
        } else {
            console.error("Error deleting categoria:", error);
        }
        return false;
    }
};


