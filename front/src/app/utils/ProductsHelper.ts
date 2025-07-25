// ProductosHelper.ts
import axios from "axios";
import { IProducto, ProductoQueryParams } from "../types";
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
        Authorization: `Bearer ${token}`,
    };
};



export const fetchProductos = async ({
    page = 1,
    limit = 10,
    name,
    categoryId,
    minPrice,
    maxPrice
}: {
    page?: number
    limit?: number
    name?: string
    categoryId?: string
    minPrice?: number
    maxPrice?: number
}): Promise<{ products: IProducto[]; pages: number }> => {
    try {
        const response = await axios.get(`${API_URL}/products`, {
            params: { page, limit, name, categoryId, minPrice, maxPrice }
        })

        return {
            products: response.data.products || [],
            pages: response.data.pages || 1
        }
    } catch (error) {
        console.error("Error al obtener productos:", error)
        return { products: [], pages: 1 }
    }
}



export const fetchProductoById = async (
    id: string
): Promise<IProducto | null> => {
    try {
        const response = await axios.get<IProducto>(`${API_URL}/products/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching producto con ID ${id}:`, error);
        return null;
    }
};

export const crearProducto = async (
    producto: ProductoDTO
): Promise<IProducto | null> => {
    try {
        const response = await axios.post<IProducto>(
            `${API_URL}/products`,
            producto,
            { headers: getAuthHeader() }
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
            { headers: getAuthHeader() }
        );
        return response.data;
    } catch (error) {
        console.error(`Error actualizando producto con ID ${id}:`, error);
        return null;
    }
};

export const eliminarProducto = async (id: string): Promise<boolean> => {
    try {
        await axios.delete(`${API_URL}/products/${id}`, {
            headers: getAuthHeader(),
        });
        return true;
    } catch (error) {
        console.error(`Error eliminando producto con ID ${id}:`, error);
        return false;
    }
};

export const subirImagen = async (file: File, name: string): Promise<any> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", name);

    try {
        const headers = {
            ...getAuthHeader(),
            "Content-Type": "multipart/form-data",
        };

        const response = await axios.post(
            `${API_URL}/file-upload/uploadImg`,
            formData,
            { headers }
        );

        return response.data;
    } catch (error) {
        console.error("Error subiendo imagen:", error);
        return null;
    }
};
