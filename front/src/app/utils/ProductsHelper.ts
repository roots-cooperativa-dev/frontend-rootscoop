// ProductosHelper.ts
import axios from "axios";
import { IProducto } from "../types";
import { ProductoDTO } from "../dto/ProductoDTO";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeader = () => {
    const userString = localStorage.getItem("user");
    let token = "";

    if (userString) {
        try {
            const user = JSON.parse(userString);
            token = user.accessToken;
        } catch (error) {
            console.error("Error parsing token:", error);
        }
    }

    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

/**
 * Sube uno o varios archivos y devuelve un array con sus IDs
 * @param files FileList o array de Files
 */
export const uploadFile = async (
    files: FileList | File[]
): Promise<string[]> => {
    const uploadedIds: string[] = [];

    for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(
                `${API_URL}/file-upload/uploadImg`,
                formData,
                getAuthHeader()
            );
            uploadedIds.push(response.data.id); // ← Asegurate que tu backend devuelve `id`
        } catch (error) {
            console.error("Error al subir imagen:", error);
        }
    }

    return uploadedIds;
};
export const fetchProductos = async (): Promise<IProducto[]> => {
    try {
        const response = await axios.get<IProducto[]>(`${API_URL}/products`);
        return response.data;
    } catch (error) {
        console.error("Error fetching productos:", error);
        return [];
    }
};

export const fetchProductoById = async (id: string): Promise<IProducto | null> => {
    try {
        const response = await axios.get<IProducto>(`${API_URL}/products/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching producto con ID ${id}:`, error);
        return null;
    }
};

export const crearProducto = async (producto: ProductoDTO): Promise<IProducto | null> => {
    try {
        const response = await axios.post<IProducto>(
            `${API_URL}/products`,
            producto,
            getAuthHeader()
        );
        return response.data;
    } catch (error) {
        console.error("Error al crear producto:", error);
        return null;
    }
};

export const actualizarProducto = async (
    id: string,
    productoActualizado: ProductoDTO
): Promise<IProducto | null> => {
    try {
        const response = await axios.put<IProducto>(
            `${API_URL}/products/${id}`,
            productoActualizado,
            getAuthHeader()
        );
        return response.data;
    } catch (error) {
        console.error(`Error actualizando producto con ID ${id}:`, error);
        return null;
    }
};

export const eliminarProducto = async (id: string): Promise<boolean> => {
    try {
        await axios.delete(`${API_URL}/products/${id}`, getAuthHeader());
        return true;
    } catch (error) {
        console.error(`Error eliminando producto con ID ${id}:`, error);
        return false;
    }
};
