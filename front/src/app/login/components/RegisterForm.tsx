// components/RegisterForm.tsx
"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

export default function RegisterForm() {
  const formik = useFormik({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: Yup.object({
      name: Yup.string().required("Requerido"),
      email: Yup.string().email("Email inválido").required("Requerido"),
      password: Yup.string().min(6, "Mínimo 6 caracteres").required("Requerido"),
    }),
    onSubmit: (values) => {
      console.log("Registro:", values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <Input
          name="name"
          placeholder="Nombre completo"
          value={formik.values.name}
          onChange={formik.handleChange}
        />
        {formik.touched.name && formik.errors.name && (
          <p className="text-red-500 text-xs">{formik.errors.name}</p>
        )}
      </div>
      <div>
        <Input
          type="email"
          name="email"
          placeholder="tu@email.com"
          value={formik.values.email}
          onChange={formik.handleChange}
        />
        {formik.touched.email && formik.errors.email && (
          <p className="text-red-500 text-xs">{formik.errors.email}</p>
        )}
      </div>
      <div>
        <Input
          type="password"
          name="password"
          placeholder="********"
          value={formik.values.password}
          onChange={formik.handleChange}
        />
        {formik.touched.password && formik.errors.password && (
          <p className="text-red-500 text-xs">{formik.errors.password}</p>
        )}
      </div>
      <Button type="submit" className="w-full">Registrarse</Button>
    </form>
  );
}
