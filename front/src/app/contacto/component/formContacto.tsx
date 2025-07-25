"use client";

import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import { toast } from "sonner";

const ContactoFormulario = () => {
  const initialValues = {
    contactName: "",
    email: "",
    phone: "",
    interests: "",
  };

  const validationSchema = Yup.object({
    contactName: Yup.string().required("Campo requerido"),
    email: Yup.string().email("Email inválido").required("Campo requerido"),
    phone: Yup.string().required("Campo requerido"),
  });

  return (
    <div className="bg-white w-1/2 p-6 rounded-xl shadow-md space-y-6">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            const res = await fetch("/api/contact", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(values),
            });

            if (res.ok) {
              toast.success("Mensaje enviado con éxito.");
              resetForm();
            } else {
              toast.error("Hubo un error al enviar el mensaje.");
            }
          } catch (error) {
            toast.error("Hubo un error al enviar el mensaje.");
            console.error("Error al enviar:", error);
            alert("Error al enviar el mensaje.");
          }
        }}
      >
        {({ handleChange }) => (
          <Form className="space-y-4 font-bebas">
            <div>
              <Label>Nombre *</Label>
              <Input
                name="contactName"
                onChange={handleChange}
                placeholder="Tu nombre"
              />
              <ErrorMessage
                name="contactName"
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
                name="interests"
                onChange={handleChange}
                placeholder="Ej: Proceso de cerveza, cocina cooperativa, historia de ROOTS"
              />
            </div>

            <Button type="submit" className="w-full mt-4">
              Enviar mensaje
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ContactoFormulario;
