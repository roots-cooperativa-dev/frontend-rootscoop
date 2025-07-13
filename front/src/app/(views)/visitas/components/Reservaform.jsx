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

const ReservaFormulario = () => {
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
    <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
      <h2 className="text-xl font-semibold text-[#017d74]">Reservar visita</h2>
      <p className="mt-2 text-s text-gray-600 italic">
        Completa el formulario y te confirmaremos la disponibildad
      </p>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => console.log(values)}
      >
        {({ handleChange, setFieldValue }) => (
          <Form className="space-y-4">
            <div>
              <Label>Nombre del contacto</Label>
              <Input name="contactName" onChange={handleChange} />
              <ErrorMessage
                name="contactName"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <Label>Email</Label>
              <Input type="email" name="email" onChange={handleChange} />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <Label>Teléfono</Label>
              <Input name="phone" onChange={handleChange} />
              <ErrorMessage
                name="phone"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <Label>Cantidad de personas</Label>
              <Select
                onValueChange={(value) =>
                  setFieldValue("numberOfPeople", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cantidad" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(15)].map((_, i) => (
                    <SelectItem key={i} value={(i + 1).toString()}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <ErrorMessage
                name="numberOfPeople"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Fecha preferida</Label>
                <Input
                  type="date"
                  name="preferredDate"
                  onChange={handleChange}
                />
                <ErrorMessage
                  name="preferredDate"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div>
                <Label>Horario preferido</Label>
                <Input
                  type="time"
                  name="preferredTime"
                  onChange={handleChange}
                />
                <ErrorMessage
                  name="preferredTime"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>

            <div>
              <Label>Tipo de grupo</Label>
              <Select
                onValueChange={(value) => setFieldValue("groupType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar grupo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Estudiantes">Estudiantes</SelectItem>
                  <SelectItem value="Cooperativistas">
                    Cooperativistas
                  </SelectItem>
                  <SelectItem value="General">General</SelectItem>
                </SelectContent>
              </Select>
              <ErrorMessage
                name="groupType"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div>
              <Label>¿Qué les interesa conocer?</Label>
              <Textarea name="interests" onChange={handleChange} />
            </div>

            <div>
              <Label>Comentarios adicionales</Label>
              <Textarea name="additionalComments" onChange={handleChange} />
            </div>

            <Button type="submit" className="w-full mt-4">
              <CalendarDays className="w-5 h-5" />
              Reservar visita
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ReservaFormulario;
