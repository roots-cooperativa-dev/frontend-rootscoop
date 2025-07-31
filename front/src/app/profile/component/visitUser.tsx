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
  const [cancellingId, setCancellingId] = useState<string | null>(null);

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

  const cancelarCita = async (appointmentId: string) => {
    if (!token) {
      toast.error("No hay sesión activa");
      return;
    }

    setCancellingId(appointmentId);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/visits/appointments/${appointmentId}/cancel`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 204) {
        toast.success("Visita cancelada correctamente");

        setVisits((prev) =>
          prev.map((v) =>
            v.id === appointmentId ? { ...v, status: "cancelled" } : v
          )
        );
      } else if (res.status === 400) {
        toast.error("La cita ya fue cancelada o completada");
      } else if (res.status === 401) {
        toast.error("No autorizado. Iniciá sesión nuevamente.");
      } else if (res.status === 404) {
        toast.error("La cita no existe o no tenés permiso");
      } else {
        throw new Error("Error desconocido al cancelar");
      }
    } catch (err) {
      console.error(err);
      toast.error("No se pudo cancelar el turno");
    } finally {
      setCancellingId(null);
    }
  };

  const confirmarCancelacion = (appointmentId: string) => {
    toast("¿Querés cancelar esta visita?", {
      action: {
        label: "Sí, cancelar",
        onClick: () => cancelarCita(appointmentId),
      },
    });
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
                  onClick={() => confirmarCancelacion(appointment.id)}
                  className="mt-3 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition-all"
                  disabled={cancellingId === appointment.id}
                >
                  {cancellingId === appointment.id
                    ? "Cancelando..."
                    : "Cancelar turno"}
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
