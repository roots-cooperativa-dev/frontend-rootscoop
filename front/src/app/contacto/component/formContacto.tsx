"use client";

import { Formik, Form, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import { toast } from "sonner";
import { postContact } from "../../../services/contact"; // Ajustá la ruta si es necesario
import { IContactanos } from "@/src/app/types";

const initialValues: IContactanos = {
  name: "",
  email: "",
  phone: "",
  reason: "",
};

const validationSchema = Yup.object({
  name: Yup.string().required("Campo requerido"),
  email: Yup.string().email("Email inválido").required("Campo requerido"),
  phone: Yup.string().required("Campo requerido"),
});

const handleSubmit = async (
  values: IContactanos,
  { resetForm, setSubmitting }: FormikHelpers<IContactanos>
) => {
  try {
    await postContact(values);
    toast.success("Mensaje enviado con éxito.");
    resetForm();
  } catch (error) {
    console.error("Error al enviar:", error);
    toast.error("Hubo un error al enviar el mensaje.");
  } finally {
    setSubmitting(false); // Asegura que se habilite nuevamente el botón
  }
};

const ContactoFormulario = () => {
  return (
    <div className="bg-white w-full p-6 rounded-xl shadow-md space-y-6 mx-auto">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, isSubmitting }) => (
          <Form className="space-y-4 font-popular">
            <div>
              <Label>Nombre *</Label>
              <Input
                name="name"
                onChange={handleChange}
                placeholder="Tu nombre"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="tu@email.com"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <Label>Teléfono *</Label>
              <Input
                name="phone"
                onChange={handleChange}
                placeholder="+54 9 11 1234-5678"
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <Label>Motivo de la consulta</Label>
              <Textarea
                name="reason"
                onChange={handleChange}
                placeholder="Ej: Consulta sobre servicios"
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando..." : "Enviar mensaje"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ContactoFormulario;
