import axios from "axios";
import { getAuthHeader } from "./CategoriasHelper";
import { fetchUserById } from "./UsuariosHelper";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchDonationsWithUsers = async () => {
    try {
        const { headers } = await getAuthHeader();

        const response = await axios.get(`${API_URL}/donations`, { headers });
        const donations = response.data;

        const donationsWithUsers = await Promise.all(
            donations.map(async (donation: any) => {
                const user = await fetchUserById(donation.userId); 
                return {
                    ...donation,
                    user
                };
            })
        );

        return donationsWithUsers;
    } catch (error) {
        console.error("Error al obtener donaciones con usuarios:", error);
        return [];
    }
};
