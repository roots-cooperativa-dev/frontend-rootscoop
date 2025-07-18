"use client";

import { useEffect, useState } from "react";
import { Formik, Form, ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type Slot = {
  id: string;
  date: string;
  startTime: string;
  isBooked: boolean;
};

type Visita = {
  id: string;
  title: string;
  availableSlots: Slot[];
};

export default function ReservaForm() {
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<
    Date | undefined
  >();
  const [slotsDisponibles, setSlotsDisponibles] = useState<Slot[]>([]);
  const [fechasConSlots, setFechasConSlots] = useState<Date[]>([]);

  useEffect(() => {
    const fetchVisitas = async () => {
      try {
        const res = await axios.get("http://localhost:3000/visits");
        setVisitas(res.data);
      } catch (error) {
        console.error("Error al obtener visitas:", error);
      }
    };

    fetchVisitas();
  }, []);

  // Generar las fechas que tienen slots disponibles
  useEffect(() => {
    const fechasDisponibles: Date[] = [];

    visitas.forEach((visita) => {
      visita.availableSlots.forEach((slot) => {
        if (!slot.isBooked) {
          const fecha = new Date(slot.date + "T00:00:00");
          // Evitar duplicados
          if (
            !fechasDisponibles.some(
              (f) => f.toDateString() === fecha.toDateString()
            )
          ) {
            fechasDisponibles.push(fecha);
          }
        }
      });
    });

    setFechasConSlots(fechasDisponibles);
    console.log(
      "Fechas con slots disponibles:",
      fechasDisponibles.map((f) => f.toDateString())
    );
  }, [visitas]);

  useEffect(() => {
    if (fechaSeleccionada) {
      const fechaStr = fechaSeleccionada.toISOString().split("T")[0];

      const slots = visitas.flatMap((visita) =>
        visita.availableSlots.filter(
          (slot) => slot.date === fechaStr && !slot.isBooked
        )
      );

      setSlotsDisponibles(slots);
    } else {
      setSlotsDisponibles([]);
    }
  }, [fechaSeleccionada, visitas]);

  const formik = useFormik({
    initialValues: {
      nombre: "",
      email: "",
      slotId: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("Campo obligatorio"),
      email: Yup.string().email("Email inválido").required("Campo obligatorio"),
      slotId: Yup.string().required("Selecciona un horario"),
    }),
    onSubmit: async (values) => {
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/reservas`, values);
        alert("Reserva enviada con éxito");
        formik.resetForm();
        setFechaSeleccionada(undefined);
      } catch (err) {
        console.error("Error al enviar reserva", err);
        alert("Ocurrió un error al enviar la reserva");
      }
    },
  });

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl space-y-6">
      <h2 className="text-3xl font-bold text-[#017d74] font-chewy text-center">
        Reserva tu visita
      </h2>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block text-m font-bebas font-semibold text-gray-700">
            Nombre
          </label>
          <input
            name="nombre"
            value={formik.values.nombre}
            onChange={formik.handleChange}
            className="w-full mt-1 p-2 border rounded-lg"
          />
          {formik.touched.nombre && formik.errors.nombre && (
            <p className="text-red-500 text-sm">{formik.errors.nombre}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-m font-bebas font-semibold text-gray-700">
            Email
          </label>
          <input
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            className="w-full mt-1 p-2 border rounded-lg"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm">{formik.errors.email}</p>
          )}
        </div>

        {/* Selección de fecha */}
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
              modifiers={{
                available: fechasConSlots,
              }}
              modifiersClassNames={{
                available: "fecha-disponible",
              }}
              disabled={(date) => {
                // Deshabilitar fechas que no tienen slots disponibles
                return !fechasConSlots.some(
                  (fecha) => fecha.toDateString() === date.toDateString()
                );
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

        {/* Mensaje si se selecciona fecha sin slots */}
        {fechaSeleccionada && slotsDisponibles.length === 0 && (
          <div className="p-3 bg-yellow-100 border border-yellow-400 rounded-lg">
            <p className="text-yellow-700 text-sm">
              No hay horarios disponibles para la fecha seleccionada.
            </p>
          </div>
        )}

        {/* Horarios disponibles */}
        {slotsDisponibles.length > 0 && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Horario disponible
            </label>
            <select
              name="slotId"
              value={formik.values.slotId}
              onChange={formik.handleChange}
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
