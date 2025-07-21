"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { useState } from "react";
import { useAuthContext } from "@/src/context/authContext";
import { toast } from "sonner";

export default function DonarFormulario() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();

  const formik = useFormik({
    initialValues: {
      amount: "",
      message: "",
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .required("El monto es obligatorio")
        .min(1, "El monto mínimo es $1"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const res = await axios.post(
          `http://localhost:3000/payments/preference/:${user?.id}`,
          {
            amount: Number(values.amount),
            Message: values.message,
          }
        );

        if (res.data && res.data.init_point) {
          window.location.href = res.data.init_point;
        } else {
          toast("Error al generar el pago.");
        }
      } catch (err) {
        console.error(err);
        toast("Hubo un error al conectar con Mercado Pago.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full mx-auto border border-[#017d74]/30"
    >
      <h2 className="text-2xl font-bold mb-6 text-center font-chewy text-[#017d74]">
        Por si quieres aportar 💚
      </h2>

      <div className="space-y-4">
        <Input
          id="amount"
          name="amount"
          type="number"
          max={1000000}
          placeholder="Ingresá un monto (mínimo $1)"
          value={formik.values.amount}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="h-12 text-lg font-semibold placeholder:text-gray-400 focus:ring-2 focus:ring-[#017d74]/40"
        />
        {formik.touched.amount && formik.errors.amount && (
          <p className="text-sm text-red-500 -mt-2">{formik.errors.amount}</p>
        )}

        <Input
          id="message"
          name="message"
          type="text"
          placeholder="Mensaje o motivo (opcional)"
          value={formik.values.message}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className="h-12 text-base placeholder:text-gray-400 focus:ring-2 focus:ring-[#017d74]/30"
        />
        {formik.touched.message && formik.errors.message && (
          <p className="text-sm text-red-500 -mt-2">{formik.errors.message}</p>
        )}

        <Button
          type="submit"
          className="w-full bg-[#017d74] hover:bg-[#015e5d] text-white text-lg py-2 rounded-xl font-bebas tracking-wide"
          disabled={loading}
        >
          {loading ? "Redirigiendo..." : "Donar"}
        </Button>
      </div>
    </form>
  );
}
