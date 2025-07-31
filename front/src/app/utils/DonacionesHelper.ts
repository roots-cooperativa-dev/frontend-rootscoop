import axios from "axios";
import { getAuthHeader } from "./CategoriasHelper";
import { fetchUserById } from "./UsuariosHelper";
import { IDonation } from "../../app/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Trae una donación por ID, validando que el ID sea string no vacío,
 * y si tiene userId válido, trae el usuario.
 */
export const fetchDonationByIdUser = async (id: string | null | undefined) => {
    if (typeof id !== "string" || id.trim() === "") {
        console.warn("⚠️ ID inválido o vacío, no se realizará la consulta.");
        return null;
    }

    try {
        const { headers } = await getAuthHeader();
        console.log(`📡 Consultando donación con ID: ${id}`);

        const response = await axios.get(`${API_URL}/donations/${id}`, { headers });
        const donation = response.data;

        if (!donation) {
            console.warn("⚠️ Donación no encontrada o respuesta vacía");
            return null;
        }

        // Solo busca usuario si userId es string válido
        const user =
            donation.userId && typeof donation.userId === "string" && donation.userId.trim() !== ""
                ? await fetchUserById(donation.userId)
                : null;

        return {
            ...donation,
            user,
        };
    } catch (error: any) {
        console.error(`❌ Error al obtener la donación con ID ${id}:`, error.message ?? error);
        if (error.response) {
            console.error("Detalles de la respuesta de error:", error.response.data);
        }
        return null;
    }
};

/**
 * Trae una donación por ID (sin validación explícita de ID)
 */
export const fetchDonationById = async (id: string) => {
    try {
        const { headers } = await getAuthHeader();
        const response = await axios.get(`${API_URL}/donations/${id}`, { headers });
        const donation = response.data;

        const user = donation.userId ? await fetchUserById(donation.userId) : null;

        return {
            ...donation,
            user,
        };
    } catch (error) {
        console.error(`❌ Error al obtener la donación con ID ${id}:`, error);
        return null;
    }
};

/**
 * Trae listado paginado de donaciones, con usuario embebido en cada donación
 * Solo consulta usuario si userId válido (string no vacío)
 */

export const fetchDonacionesConUsuarios = async (
    page: number = 1,
    limit: number = 10,
    status?: "pending" | "in_process" | "approved" | "rejected"
) => {
    try {
        const { headers } = await getAuthHeader();

        const params: any = { page, limit };
        if (status) {
            params.status = status;
        }

        const response = await axios.get(`${API_URL}/donations`, {
            params,
            headers,
        });

        const { items = [], total = 0, pages = 1 } = response.data;

        const donacionesConUsuario = await Promise.all(
            items.map(async (donation: IDonation) => {
                if (
                    donation.userId &&
                    typeof donation.userId === "string" &&
                    donation.userId.trim() !== ""
                ) {
                    const user = await fetchUserById(donation.userId);
                    return { ...donation, user };
                }
                return { ...donation, user: null };
            })
        );

        return {
            donations: donacionesConUsuario,
            total,
            pages,
        };
    } catch (error) {
        console.error("❌ Error al obtener donaciones con usuarios:", error);
        return {
            donations: [],
            total: 0,
            pages: 0,
        };
    }
};

