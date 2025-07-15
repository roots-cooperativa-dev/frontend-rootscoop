import axios from "axios";
import { IProducto } from "../types/index";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
