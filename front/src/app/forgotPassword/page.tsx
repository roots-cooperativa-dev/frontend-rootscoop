"use client"
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { forgotPassword } from "@/src/services/password";
import { ErrorMessage, Form, Formik, FormikHelpers } from "formik";
import { toast } from "sonner";
import * as Yup from "yup";
import { Label } from "@/src/components/ui/label"; // Corrige import incorrecto desde 'recharts'

// ✅ Tipo para el formulario
interface ForgotPasswordForm {
  email: string;
}

// ✅ Valores iniciales
const initialValues: ForgotPasswordForm = {
  email: "",
};

// ✅ Validación con Yup
const validationSchema = Yup.object({
  email: Yup.string().email("Email inválido").required("Campo requerido"),
});

// ✅ Función de envío
const handleSubmit = async (
  values: ForgotPasswordForm,
  { resetForm, setSubmitting }: FormikHelpers<ForgotPasswordForm>
) => {
  try {
    await forgotPassword(values); // values tiene `{ email }`, así que tu backend debe esperarlo como objeto
    toast.success("Mensaje enviado con éxito.");
    resetForm();
  } catch (error) {
    console.error("Error al enviar:", error);
    toast.error("Hubo un error al enviar el mensaje.");
  } finally {
    setSubmitting(false);
  }
};

const OlvidePass = () => {
  return (
    <div className="flex  items-center justify-center h-screen">
    <div className="bg-white w-4/5 p-6 space-y-6 mx-auto">
      <h1 className="text-2xl font-bold">Cambio de contraseña</h1>
      <p>
        Ingresa el email de tu cuenta. Te enviaremos un correo electrónico con un enlace para cambiar tu contraseña.
      </p>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, isSubmitting }) => (
          <Form className="space-y-4 font-popular">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                type="email"
                name="email"
                id="email"
                onChange={handleChange}
                placeholder="tu@email.com"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Solicitar contraseña nueva"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
    </div>
  );
};

export default OlvidePass;
