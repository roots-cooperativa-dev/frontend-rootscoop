"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { CalendarDays } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

const ContactoFormulario = () => {
  const initialValues = {
    contactName: "",
    email: "",
    phone: "",
    numberOfPeople: "",
    preferredDate: "",
    preferredTime: "",
    groupType: "",
    interests: "",
    additionalComments: "",
  };

  const validationSchema = Yup.object({
    contactName: Yup.string().required("Campo requerido"),
    email: Yup.string().email("Email inválido").required("Campo requerido"),
    phone: Yup.string().required("Campo requerido"),
    numberOfPeople: Yup.string().required("Campo requerido"),
    preferredDate: Yup.string().required("Campo requerido"),
    preferredTime: Yup.string().required("Campo requerido"),
    groupType: Yup.string().required("Campo requerido"),
  });

  return (
    <div className="bg-white w-1/2 p-6 rounded-xl shadow-md space-y-6">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => console.log(values)}
      >
        {({ handleChange, setFieldValue }) => (
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
              <Label>Teléfono</Label>
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
