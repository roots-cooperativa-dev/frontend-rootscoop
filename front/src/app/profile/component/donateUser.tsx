"use client";

import { useAuthContext } from "@/src/context/authContext";
import { format } from "date-fns";

const DonateUser = () => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Cargando datos...</p>
      </div>
    );
  }

  if (!user || !user.donates || user.donates.length === 0) {
    return (
      <div className="flex justify-center w-full items-center h-screen">
        <h1 className="text-center text-gray-500 text-lg">Aún no realizaste donaciones</h1>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6 text-[#017d74]">
        Tus Donaciones
      </h1>
      <ul className="space-y-4">
        {user.donates.map((donate) => (
          <li
            key={donate.id}
            className="bg-white p-4 rounded-xl shadow border border-gray-200"
          >
            <p><strong>Monto:</strong> ${donate.amount} {donate.currencyId}</p>
            <p><strong>Método de pago:</strong> {donate.paymentTypeId} - {donate.paymentMethodId}</p>
            <p><strong>Estado:</strong> {donate.status} ({donate.statusDetail})</p>
            <p><strong>Fecha:</strong> {format(new Date(donate.dateApproved), "dd/MM/yyyy HH:mm")}</p>
            <p className="text-sm text-gray-500">ID de pago: {donate.pagoId}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DonateUser;
