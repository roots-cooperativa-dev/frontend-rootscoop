import axios from "axios";
import { getAuthHeader } from "./CategoriasHelper";
import type { AppointmentsQueryParams, IAppointmentsPaginatedResponse } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAllAppointments = async (
    params: AppointmentsQueryParams = {}
): Promise<IAppointmentsPaginatedResponse> => {
    try {
        const headers = await getAuthHeader();
        const response = await axios.get(`${API_URL}/visits/allAppointments`, {
            headers: headers.headers,
            params,
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener todas las citas:", error);
        throw error;
    }
};

export const updateAppointmentStatus = async (
    appointmentId: string,
    status: "pending" | "approved" | "rejected" | "cancelled" | "completed"
): Promise<void> => {
    try {
        const headers = await getAuthHeader();
        await axios.put(
            `${API_URL}/visits/appointments/${appointmentId}/status/${status}`,
            {},
            {
                headers: headers.headers,
            }
        );
    } catch (error) {
        console.error("Error al actualizar el estado de la cita:", error);
        throw error;
    }
};