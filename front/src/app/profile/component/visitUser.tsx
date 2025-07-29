"use client";

import Loading from "@/src/components/loading/pantallaCargando";
import { useAuthContext } from "@/src/context/authContext";
import { format } from "date-fns";

const VisitasAgendadas = () => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading/>
      </div>
    );
  }

  if (!user || !user.appointments || user.appointments.length === 0) {
    return (
      <div className="flex w-full justify-center items-center h-screen">
        <h1 className="text-center text-gray-500 text-lg">
          No tenés turnos registrados
        </h1>
      </div>
    );
  }

  return (
    <div className="p-4 w-full mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6 text-[#017d74]">
        Tus Turnos
      </h1>
      <ul className="space-y-4">
        {user.appointments.map((appointment: any) => (
          <li
            key={appointment.id}
            className="bg-white p-4 rounded-xl shadow border border-gray-200"
          >
            <p>
              <strong>Fecha:</strong>{" "}
              {appointment.date && !isNaN(new Date(appointment.date).getTime())
                ? format(new Date(appointment.date), "dd/MM/yyyy HH:mm")
                : "Fecha inválida"}
            </p>
            <p>
              <strong>Estado:</strong> {appointment.status}
            </p>
            {appointment.reason && (
              <p>
                <strong>Motivo:</strong> {appointment.reason}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VisitasAgendadas;
