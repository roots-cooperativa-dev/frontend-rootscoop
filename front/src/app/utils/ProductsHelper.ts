import { IProducto } from "../types/index";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchProductos = async (): Promise<IProducto[]> => {
    try {
        const response = await fetch('http://localhost:3000/products');
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching productos:", error);
        return [];
    }
};
