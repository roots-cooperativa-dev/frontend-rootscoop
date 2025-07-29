"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useAuthContext } from "@/src/context/authContext";
import { toast } from "sonner";
import { Slot, Visita } from "../types/index";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ReservaForm() {
  const { token } = useAuthContext();
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<
    Date | undefined
  >();
  const [slotsDisponibles, setSlotsDisponibles] = useState<Slot[]>([]);
  const [fechasConSlots, setFechasConSlots] = useState<Date[]>([]);

  useEffect(() => {
    const fetchVisitas = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/visits`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVisitas(res.data);
      } catch (error) {
        console.error("Error al obtener visitas:", error);
      }
    };
    fetchVisitas();
  }, []);

  const formik = useFormik({
    initialValues: {
      visitaId: "",
      cantidad: "",
      slotId: "",
      description: "",
    },
    validationSchema: Yup.object({
      visitaId: Yup.string().required("Selecciona una visita"),
      cantidad: Yup.number()
        .required("Campo obligatorio")
        .min(1, "Mínimo 1 persona")
        .max(15, "Máximo 15 personas"),
      slotId: Yup.string().required("Selecciona un horario"),
      description: Yup.string().required("Campo obligatorio"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      const slot = slotsDisponibles.find((s) => s.id === values.slotId);
      if (!slot) {
        toast.error("El horario seleccionado ya no está disponible.");
        return;
      }
      const slotDateTime = new Date(`${slot.date}T${slot.startTime}`);
      if (slotDateTime <= new Date()) {
        toast.error("El horario ya pasó, por favor elige otro.");
        return;
      }
      const payload = {
        visitSlotId: values.slotId,
        numberOfPeople: parseInt(values.cantidad),
        description: values.description,
      };
      try {
        await axios.post(`${BACKEND_URL}/visits/appointments`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Reserva enviada con éxito");
        formik.resetForm();
        setFechaSeleccionada(undefined);
        setFechasConSlots([]);
        setSlotsDisponibles([]);
      } catch (err) {
        console.error("Error al enviar reserva", err);
        toast.error("Ocurrió un error al enviar la reserva");
      }
    },
  });

  useEffect(() => {
    const visita = visitas.find((v) => v.id === formik.values.visitaId);
    if (!visita) {
      setFechasConSlots([]);
      return;
    }
    const now = new Date();
    const fechas = visita.availableSlots
      .filter((slot) => {
        const slotDateTime = new Date(`${slot.date}T${slot.startTime}`);
        return !slot.isBooked && slotDateTime > now;
      })
      .map((slot) => new Date(slot.date + "T00:00:00"));
    const fechasUnicas = Array.from(
      new Set(fechas.map((f) => f.toDateString()))
    ).map((str) => new Date(str));
    setFechasConSlots(fechasUnicas);
    setFechaSeleccionada(undefined);
    setSlotsDisponibles([]);
  }, [formik.values.visitaId, visitas]);

  useEffect(() => {
    if (!fechaSeleccionada || !formik.values.visitaId) {
      setSlotsDisponibles([]);
      return;
    }
    const visita = visitas.find((v) => v.id === formik.values.visitaId);
    if (!visita) return;
    const fechaStr = fechaSeleccionada.toISOString().split("T")[0];
    const now = new Date();
    const slots = visita.availableSlots.filter((slot) => {
      const slotDateTime = new Date(`${slot.date}T${slot.startTime}`);
      return slot.date === fechaStr && !slot.isBooked && slotDateTime > now;
    });
    setSlotsDisponibles(slots);
  }, [fechaSeleccionada, visitas, formik.values.visitaId]);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl space-y-6">
      <h2 className="text-3xl font-bold text-[#017d74] font-chewy text-center">
        Reserva tu visita
      </h2>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          🗓️ Próximas visitas disponibles
        </h2>
        <div className="space-y-4">
          {visitas.map((visita) => {
            const slotsValidos = visita.availableSlots.filter((slot) => {
              const fechaHora = new Date(`${slot.date}T${slot.startTime}`);
              return !slot.isBooked && fechaHora > new Date();
            });
            if (slotsValidos.length === 0) return null;
            return (
              <div
                key={visita.id}
                className="border rounded-xl p-4 shadow-sm bg-white"
              >
                <h3 className="text-lg font-semibold text-green-800">
                  {visita.title}
                </h3>
                <ul className="mt-2 space-y-1 text-gray-700">
                  {slotsValidos.map((slot) => (
                    <li key={slot.id} className="text-sm">
                      📅 {slot.date} - 🕒 {slot.startTime}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block text-m font-bebas font-semibold text-gray-700">
            Selecciona una visita
          </label>
          <select
            name="visitaId"
            value={formik.values.visitaId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full mt-1 p-2 border rounded-lg"
          >
            <option value="">-- Selecciona una visita --</option>
            {visitas.map((visita) => (
              <option key={visita.id} value={visita.id}>
                {visita.title}
              </option>
            ))}
          </select>
          {formik.touched.visitaId && formik.errors.visitaId && (
            <p className="text-red-500 text-sm">{formik.errors.visitaId}</p>
          )}
        </div>
        {fechasConSlots.length > 0 && (
          <div>
            <label className="block text-m font-semibold font-bebas text-gray-700 mb-2">
              Selecciona una fecha
            </label>
            <div className="mb-2 text-sm text-gray-600">
              <span className="inline-block w-4 h-4 bg-green-200 border border-green-400 rounded mr-2"></span>
              Fechas disponibles
              <span className="inline-block w-4 h-4 bg-[#017d74] ml-4 mr-2 rounded"></span>
              Fecha seleccionada
            </div>
            <div className="calendar-wrapper">
              <DayPicker
                mode="single"
                selected={fechaSeleccionada}
                onSelect={setFechaSeleccionada}
                modifiers={{ available: fechasConSlots }}
                modifiersClassNames={{ available: "fecha-disponible" }}
                disabled={(date) => {
                  const hoy = new Date();
                  hoy.setHours(0, 0, 0, 0);
                  const esPasada = date < hoy;
                  const noHaySlotEseDía = !fechasConSlots.some(
                    (f) => f.toDateString() === date.toDateString()
                  );
                  return esPasada || noHaySlotEseDía;
                }}
                className="bg-gray-50 p-4 rounded-lg"
              />
            </div>
            <style
              dangerouslySetInnerHTML={{
                __html: `
                .calendar-wrapper .fecha-disponible {
                  background-color: #bbf7d0 !important;
                  border: 2px solid #16a34a !important;
                  color: #166534 !important;
                  font-weight: 600 !important;
                  border-radius: 4px !important;
                }
                .calendar-wrapper .fecha-disponible:hover {
                  background-color: #86efac !important;
                }
                .calendar-wrapper [aria-selected="true"] {
                  background-color: #017d74 !important;
                  color: white !important;
                  font-weight: bold !important;
                  border-radius: 4px !important;
                }
                .calendar-wrapper [aria-selected="true"]:hover {
                  background-color: #016c64 !important;
                }
                .calendar-wrapper [aria-disabled="true"] {
                  color: #9ca3af !important;
                  cursor: not-allowed !important;
                  opacity: 0.5 !important;
                }
              `,
              }}
            />
          </div>
        )}
        {fechaSeleccionada && slotsDisponibles.length === 0 && (
          <div className="p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
            <p className="text-yellow-700 text-sm">
              No hay horarios disponibles para la fecha seleccionada.
            </p>
          </div>
        )}
        {slotsDisponibles.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Horario disponible
            </label>
            <select
              name="slotId"
              value={formik.values.slotId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">-- Seleccionar horario --</option>
              {slotsDisponibles.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {slot.startTime}
                </option>
              ))}
            </select>
            {formik.touched.slotId && formik.errors.slotId && (
              <p className="text-red-500 text-sm">{formik.errors.slotId}</p>
            )}
          </div>
        )}
        <div>
          <label className="block text-m font-bebas font-semibold text-gray-700">
            Cantidad de personas
          </label>
          <input
            type="number"
            name="cantidad"
            min="1"
            max="15"
            value={formik.values.cantidad}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full mt-1 p-2 border rounded-lg"
            placeholder="¿Cuántas personas asistirán?"
          />
          {formik.touched.cantidad && formik.errors.cantidad && (
            <p className="text-red-500 text-sm">{formik.errors.cantidad}</p>
          )}
        </div>
        <div>
          <label className="block text-m font-bebas font-semibold text-gray-700">
            Descripcion de la visita
          </label>
          <textarea
            name="description"
            rows={3}
            placeholder="Especifica motivo de la visita o detalles adicionales..."
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full mt-1 p-2 border rounded-lg"
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-500 text-sm">{formik.errors.description}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={!formik.values.slotId}
          className="w-full bg-[#017d74] text-white py-2 rounded-lg hover:bg-[#016c64] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Reservar
        </button>
      </form>
    </div>
  );
}
