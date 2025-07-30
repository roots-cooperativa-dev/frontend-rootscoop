import axios from "axios";
import { getAuthHeader } from "./CategoriasHelper";
import { fetchUserById } from "./UsuariosHelper";
const API_URL = process.env.NEXT_PUBLIC_API_URL;



export const fetchDonationsWithUsers = async (page = 1, limit = 10) => {
    try {
        const { headers } = await getAuthHeader();

        const response = await axios.get(`${API_URL}/donations?page=${page}&limit=${limit}`, { headers });
        const { items, total, pages } = response.data;

        const donationsWithUsers = await Promise.all(
            items.map(async (donation: any) => {
                const user = await fetchUserById(donation.userId);
                return {
                    ...donation,
                    user,
                };
            })
        );

        return {
            items: donationsWithUsers,
            total,
            pages,
        };
    } catch (error) {
        console.error("Error al obtener donaciones con usuarios:", error);
        return { items: [], total: 0, pages: 1 };
    }
};


export const fetchDonationById = async (id: string) => {
    try {
        const { headers } = await getAuthHeader();
        const response = await axios.get(`${API_URL}/donations/${id}`, { headers });
        const donation = response.data;

        const user = await fetchUserById(donation.userId);

        const fullDonation = {
            ...donation,
            user,
        };
        return fullDonation;
    } catch (error) {
        console.error(`❌ Error al obtener la donación con ID ${id}:`, error);
        return null;
    }
};
