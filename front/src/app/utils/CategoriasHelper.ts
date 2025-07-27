import { ICategory } from "../types";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAuthHeader = () => {
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




export const fetchCategorias = async (
    page: number = 1,
    limit: number = 10
): Promise<{ categories: ICategory[]; total: number; pages: number }> => {
    try {
        const response = await axios.get(`${API_URL}/category`, {
            params: { page, limit },
        });
        return {
            categories: response.data.categories,
            total: response.data.total,
            pages: response.data.pages,
        };
    } catch (error) {
        console.error("Error fetching categorias:", error);
        return {
            categories: [],
            total: 0,
            pages: 0,
        };
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


export const restaurarCategoria = async (id: string): Promise<boolean> => {
    try {
        const config = await getAuthHeader();
        const response = await axios.post(`${API_URL}/category/restore/${id}`, null, config);
        return response.status === 200;
    } catch (error) {
        console.error("Error restaurando categoría", error);
        return false;
    }
};




