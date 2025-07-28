"use client"
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { ErrorMessage, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { changePassword } from "@/src/services/password";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiEye, FiEyeOff } from "react-icons/fi";

// ✅ Tipo del formulario
interface ChangePasswordForm {
  token: string;
  password: string;
  confirmPassword: string;
}

// ✅ Valores iniciales
const initialValues: ChangePasswordForm = {
  token: "",
  password: "",
  confirmPassword: "",
};

// ✅ Validación con Yup
const validationSchema = Yup.object({
  token: Yup.string().email("Email inválido").required("Campo requerido"),
  password: Yup.string().min(6, "Mínimo 6 caracteres").required("Requerido"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
    .required("Requerido"),
});

const CambiarPass = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ Función de envío
  const handleSubmit = async (
    values: ChangePasswordForm,
    { resetForm, setSubmitting }: FormikHelpers<ChangePasswordForm>
  ) => {
    try {
      await changePassword(values); // 👈 Enviamos email, password y confirmPassword
      toast.success("Contraseña actualizada con éxito.");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      resetForm();
    } catch (error) {
      console.error("Error al enviar:", error);
      toast.error("Hubo un error al cambiar la contraseña.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white w-4/5 p-6 space-y-6 mx-auto rounded-xl shadow-md">
        <h1 className="text-2xl font-bold">Cambio de contraseña</h1>
        <p>
          Ingresa el email y la nueva contraseña que deseas establecer.
        </p>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, values, errors, touched, isSubmitting }) => (
            <Form className="space-y-4 font-popular">
              <div>
                <Label htmlFor="token">Email *</Label>
                <Input
                  type="email"
                  name="token"
                  id="token"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.token}
                  placeholder="tu@email.com"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="relative">
                <Label htmlFor="password">Nueva contraseña *</Label>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="********"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
                {touched.password && errors.password && (
                  <p className="text-red-500 text-xs">{errors.password}</p>
                )}
              </div>

              <div className="relative">
                <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Repetir contraseña"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff size={18} />
                  ) : (
                    <FiEye size={18} />
                  )}
                </button>
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="text-red-500 text-xs">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Cambiar contraseña"}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CambiarPass;
