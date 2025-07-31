"use client";

import Loading from "@/src/components/loading/pantallaCargando";
import { useAuthContext } from "@/src/context/authContext";
import { getUserById } from "@/src/services/auth";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Appointment = {
  id: string;
  userId: string;
  status: "pending" | "confirmed" | "cancelled" | string;
  bookedAt: string; // ISO
  numberOfPeople: number;
  visitSlotId: string;
  description?: string | null;
};

const VisitasAgendadas = () => {
  const { user, token, loading } = useAuthContext();
  const [visit, setVisits] = useState<Appointment[]>([]);
  const [loadingVisits, setLoadingVisits] = useState(true);

  const fetchAppointments = async () => {
    if (!user?.id || !token) return;
    try {
      const userData = await getUserById(user.id, token);
      setVisits(userData.appointments || []);
    } catch (error) {
      toast.error("Error al obtener tus visitas");
      console.error(error);
    } finally {
      setLoadingVisits(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user?.id, token]);

  // 🔴 FUNCIÓN PARA CANCELAR
  const cancelarCita = async (appointmentId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/appointments/${appointmentId}/cancel`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("No se pudo cancelar el turno");

      toast.success("Turno cancelado exitosamente");
      fetchAppointments(); // refresca la lista
    } catch (error) {
      toast.error("Error al cancelar el turno");
      console.error(error);
    }
  };

  if (loading || loadingVisits) return <Loading />;

  if (!visit || visit.length === 0) {
    return (
      <div className="flex w-full justify-center items-center h-screen">
        <h1 className="text-center text-gray-500 text-lg">
          No tenés visitas registradas
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
        {visit.map((appointment) => {
          const isValidBookedAt =
            appointment.bookedAt &&
            !isNaN(new Date(appointment.bookedAt).getTime());

          return (
            <li
              key={appointment.id}
              className="bg-white p-4 rounded-xl shadow border border-gray-200"
            >
              <p>
                <strong>Fecha de reserva:</strong>{" "}
                {isValidBookedAt
                  ? format(new Date(appointment.bookedAt), "dd/MM/yyyy HH:mm")
                  : "Fecha inválida"}
              </p>

              <p>
                <strong>Estado:</strong> {appointment.status}
              </p>

              <p>
                <strong>Personas:</strong> {appointment.numberOfPeople}
              </p>

              {appointment.description && (
                <p>
                  <strong>Descripción:</strong> {appointment.description}
                </p>
              )}

              <p className="text-xs text-gray-500">
                <strong>Slot ID:</strong> {appointment.visitSlotId}
              </p>

              {appointment.status !== "cancelled" && (
                <button
                  onClick={() => cancelarCita(appointment.id)}
                  className="mt-3 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition-all"
                >
                  Cancelar turno
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default VisitasAgendadas;
