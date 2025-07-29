"use client";

import Loading from "@/src/components/loading/pantallaCargando";
import { useAuthContext } from "@/src/context/authContext";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { getUserById } from "../../../services/auth"; // ajustá el path si es necesario
import { toast } from "sonner";
type Donate = {
  id: string;
  pagoId: string;
  status: string;
  statusDetail: string;
  amount: number;
  currencyId: string;
  paymentTypeId: string;
  paymentMethodId: string;
  dateApproved: string;
  createdAt?: string;
};
const DonateUser = () => {
  const { user, token, loading } = useAuthContext();
  const [donations, setDonations] = useState<Donate[]>([]);
  const [loadingDonations, setLoadingDonations] = useState(true);

  useEffect(() => {
    const fetchUserDonations = async () => {
      if (user?.id && token) {
        try {
          const userData = await getUserById(user.id, token);
          setDonations(userData.donates || []);
        } catch (error) {
          toast.error("Error al obtener tus donaciones");
          console.error(error);
        } finally {
          setLoadingDonations(false);
        }
      }
    };

    fetchUserDonations();
  }, [user]);

  if (loading || loadingDonations) {
    return <Loading />;
  }

  if (!donations || donations.length === 0) {
    return (
      <div className="flex justify-center w-full items-center h-screen">
        <h1 className="text-center text-gray-500 text-lg">
          Aún no realizaste donaciones
        </h1>
      </div>
    );
  }

  return (
    <div className="p-4 w-full">
      <h1 className="text-2xl font-bold text-center mb-6 text-[#017d74]">
        Tus Donaciones
      </h1>
      <ul className="space-y-4">
        {donations.map((donate) => (
          <li
            key={donate.id}
            className="bg-white p-4 rounded-xl shadow border border-gray-200"
          >
            <p>
              <strong>Monto:</strong> ${donate.amount} {donate.currencyId}
            </p>
            <p>
              <strong>Método de pago:</strong> {donate.paymentTypeId} -{" "}
              {donate.paymentMethodId}
            </p>
            <p>
              <strong>Estado:</strong> {donate.status} ({donate.statusDetail})
            </p>
            <p>
              <strong>Fecha:</strong>{" "}
              {format(new Date(donate.dateApproved), "dd/MM/yyyy HH:mm")}
            </p>
            <p className="text-sm text-gray-500">ID de pago: {donate.pagoId}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DonateUser;
