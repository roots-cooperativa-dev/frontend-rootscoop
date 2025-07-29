import axios from "axios";
import { IUsuario } from "../types";
import { getAuthHeader } from "./CategoriasHelper";
import { CrearUsuarioDTO } from "../dto/CrearUsuarioDTO";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchUsers = async (
    page: number = 1,
    limit: number = 10
): Promise<{ users: IUsuario[]; total: number; pages: number }> => {
    try {
        const response = await axios.get(`${API_URL}/users`, {
            params: { page, limit },
            headers: getAuthHeader().headers
        });

        return {
            users: response.data.items || [],
            total: response.data.total || 0,
            pages: response.data.pages || 1
        };
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        return {
            users: [],
            total: 0,
            pages: 0
        };
    }
};

export const fetchUserById = async (userId: string): Promise<IUsuario | null> => {
    try {
        const response = await axios.get(`${API_URL}/users/${userId}`, {
            headers: getAuthHeader().headers
        });
        return response.data || null;
    } catch (error) {
        console.error("Error al obtener usuario:", error);
        return null;
    }
};


export const deleteUser = async (userId: string): Promise<boolean> => {
    try {
        await axios.delete(`${API_URL}/users/${userId}`, {
            headers: getAuthHeader().headers
        });
        return true;
    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        return false;
    }
};

export const createUser = async (userData: CrearUsuarioDTO): Promise<IUsuario | null> => {
    try {
        const config = await getAuthHeader();
        const response = await axios.post(`${API_URL}/auth/signup`, userData, config);
        return response.data || null;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.error("Error al crear usuario:", error.response?.data || error.message);
        } else {
            console.error("Error desconocido al crear usuario:", error);
        }
        return null;
    }
};

export const updateUser = async (userId: string, userData: Partial<IUsuario>): Promise<IUsuario | null> => {
    try {
        const payload = { ...userData, id: userId };

        const response = await axios.put(`${API_URL}/users/upadte/user`, payload, {
            headers: getAuthHeader().headers,
        });

        return response.data || null;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.error("Error al actualizar usuario:", error.response?.data || error.message);
        } else {
            console.error("Error desconocido:", error);
        }
        return null;
    }
};

export const updateUserRoles = async (
    userId: string,
    roles: { isAdmin: boolean; isDonator: boolean }
): Promise<boolean> => {
    try {
        const config = await getAuthHeader();
        await axios.patch(`${API_URL}/users/roles/${userId}`, roles, config);
        return true;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            const data = error.response?.data;

            console.error("Error al actualizar roles:");

            if (data?.errors) {
                // Si el backend devuelve errores tipo { errors: { campo: [errores] } }
                Object.entries(data.errors).forEach(([field, messages]) => {
                    console.error(`${field}: ${(messages as string[]).join(", ")}`);
                });
            } else if (data?.message) {
                console.error("Mensaje:", data.message);
            } else {
                console.error("Mensaje genérico:", error.message);
            }

        } else {
            console.error("Error desconocido:", error);
        }
        return false;
    }
};

