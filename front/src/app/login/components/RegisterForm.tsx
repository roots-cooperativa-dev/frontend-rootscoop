"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { postRegister } from "@/src/services/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterForm() {
  const router = useRouter();

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
        toast.success("Usuario registrado correctamente");
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

      <Input
        type="password"
        name="confirmPassword"
        placeholder="Repetir contraseña"
        value={formik.values.confirmPassword}
        onChange={formik.handleChange}
      />
      {formik.touched.confirmPassword && formik.errors.confirmPassword && (
        <p className="text-red-500 text-xs">{formik.errors.confirmPassword}</p>
      )}

      <Input
        name="birthdate"
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
