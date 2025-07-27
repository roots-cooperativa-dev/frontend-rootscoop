

import axios from "axios";
import { IOrdersResponse } from "../types/index";
import { getAuthHeader } from "./CategoriasHelper";
import { IOrderById } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchOrders = async (): Promise<IOrdersResponse> => {
    try {
        const response = await axios.get<IOrdersResponse>(`${API_URL}/orders`, {
            headers: getAuthHeader().headers,
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener órdenes:", error);
        return { data: [], total: 0 };
    }
};

export const updateOrderStatus = async (
    orderId: string,
    status: string
): Promise<void> => {
    try {
        await axios.put(
            `${API_URL}/orders/${orderId}/status`,
            { status },
            {
                headers: getAuthHeader().headers,
            }
        );
    } catch (error) {
        console.error("Error al actualizar estado de orden:", error);
        throw error;
    }
};

export const fetchOrderById = async (id: string): Promise<IOrderById | null> => {
    try {
        const response = await axios.get<IOrderById>(`${API_URL}/orders/${id}`, getAuthHeader());
        return response.data;
    } catch (error) {
        console.error(`Error al obtener orden con ID ${id}:`, error);
        return null;
    }
};