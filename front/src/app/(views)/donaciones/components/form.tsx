"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { useState } from "react";
import { useAuthContext } from "@/src/context/authContext";
import { toast } from "sonner";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export default function DonarFormulario() {
  const [loading, setLoading] = useState(false);
  const { user, token } = useAuthContext();

  const formik = useFormik({
    initialValues: {
      amount: "",
      message: "",
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .typeError("El monto debe ser un número válido")
        .required("El monto es obligatorio")
        .min(1, "El monto mínimo es $1")
        .max(10_000_000, "El monto máximo es $5.000.000"),
      message: Yup.string()
        .required("El mensaje es obligatorio")
        .min(3, "El mensaje debe tener al menos 3 caracteres"),
    }),
    onSubmit: async (values) => {
      if (!token) {
        toast.error("No hay token de autenticación. Por favor iniciá sesión.");
        return;
      }
      try {
        setLoading(true);
        const res = await axios.post(
          `${BACKEND_URL}/payments/create-preference/${user?.id}`,
          {
            amount: Number(values.amount),
            message: values.message,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data && res.data.initPoint) {
          window.location.href = res.data.initPoint;
        } else {
          toast.error("Error al generar el pago.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Hubo un error al conectar con Mercado Pago.");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const errors = await formik.validateForm();

    formik.setTouched(
      Object.keys(formik.values).reduce<Record<string, boolean>>((acc, key) => {
        acc[key] = true;
        return acc;
      }, {}),
      true
    );

    if (Object.keys(errors).length) {
      Object.values(errors).forEach((msg) => toast.error(String(msg)));
      return;
    }

    await formik.submitForm();
  };

  // 🧠 Nuevo: solo permite números con hasta 2 decimales
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      formik.setFieldValue("amount", value);
    }
  };

  // 🧠 Nuevo: bloquea pegado con formato inválido
  const handleAmountPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData("Text");
    if (!/^\d*\.?\d{0,2}$/.test(pastedText)) {
      e.preventDefault();
      toast.error("Solo se permiten números con hasta 2 decimales.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full mx-auto border border-[#017d74]/30"
    >
      <h2 className="text-2xl font-bold mb-6 text-center font-chewy text-[#017d74]">
        Por si quieres aportar 💚
      </h2>

      <div className="space-y-4">
        <Input
          id="amount"
          name="amount"
          type="text"
          inputMode="decimal"
          placeholder="Ingresá un monto (mínimo $1)"
          value={formik.values.amount}
          onChange={handleAmountChange}
          onPaste={handleAmountPaste}
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
          placeholder="Mensaje o motivo"
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
