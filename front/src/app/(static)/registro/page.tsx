"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { postRegister } from "@/src/services/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      birthdate: "",
      phone: "",
      username: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Requerido"),
      email: Yup.string().email("Email inválido").required("Requerido"),
      password: Yup.string()
        .min(6, "Mínimo 6 caracteres")
        .required("Requerido"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
        .required("Requerido"),
      birthdate: Yup.string().required("Requerido"),
      phone: Yup.number().typeError("Debe ser un número").required("Requerido"),
      username: Yup.string().required("Requerido"),
    }),
    onSubmit: async (values) => {
      try {
        const data: RegisterDto = {
          name: values.name,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
          birthdate: values.birthdate,
          phone: Number(values.phone),
          username: values.username,
        };
        console.log(data);
        await postRegister(data);
        toast.success("Usuario registrado correctamente, Inicia sesion");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
        formik.resetForm();
      } catch (error: any) {
        toast.error(error?.message || "Error al registrar el usuario");
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <Input
        name="name"
        placeholder="Nombre completo"
        value={formik.values.name}
        onChange={formik.handleChange}
      />
      {formik.touched.name && formik.errors.name && (
        <p className="text-red-500 text-xs">{formik.errors.name}</p>
      )}

      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="********"
          value={formik.values.password}
          onChange={formik.handleChange}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
        >
          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>
      {formik.touched.email && formik.errors.email && (
        <p className="text-red-500 text-xs">{formik.errors.email}</p>
      )}

      {formik.touched.password && formik.errors.password && (
        <p className="text-red-500 text-xs">{formik.errors.password}</p>
      )}

      <div className="relative">
        <Input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Repetir contraseña"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
        >
          {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>
      {formik.touched.confirmPassword && formik.errors.confirmPassword && (
        <p className="text-red-500 text-xs">{formik.errors.confirmPassword}</p>
      )}

      <Input
        name="birthdate"
        placeholder="Ingresa tu fecha de nacimiento"
        type="date"
        value={formik.values.birthdate}
        onChange={formik.handleChange}
      />
      {formik.touched.birthdate && formik.errors.birthdate && (
        <p className="text-red-500 text-xs">{formik.errors.birthdate}</p>
      )}

      <Input
        name="phone"
        placeholder="Teléfono"
        value={formik.values.phone}
        onChange={formik.handleChange}
      />
      {formik.touched.phone && formik.errors.phone && (
        <p className="text-red-500 text-xs">{formik.errors.phone}</p>
      )}

      <Input
        name="username"
        placeholder="Nombre de usuario"
        value={formik.values.username}
        onChange={formik.handleChange}
      />
      {formik.touched.username && formik.errors.username && (
        <p className="text-red-500 text-xs">{formik.errors.username}</p>
      )}

      <Button type="submit" className="w-full">
        Registrarse
      </Button>
    </form>
  );
}
