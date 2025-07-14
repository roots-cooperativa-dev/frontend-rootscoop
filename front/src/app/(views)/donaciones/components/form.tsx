"use client";

import { Card } from "../../../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { Label } from "../../../../components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../../components/ui/radio-group";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function DonacionBox() {
  const montos = [1000, 2500, 5000, 10000, 15000, 25000];

  const validationSchema = Yup.object({
    frecuencia: Yup.string().required("Seleccioná una frecuencia"),
    montoPersonalizado: Yup.number()
      .required("Ingresá un monto")
      .min(500, "El monto mínimo es $5000"),
    nombre: Yup.string().required("Ingresá tu nombre"),
    email: Yup.string().email("Email inválido").required("Ingresá tu email"),
    metodoPago: Yup.string().required("Seleccioná un método de pago"),
  });

  return (
    <Card className="md:col-span-2 p-6">
      <div className="mb-6">
        <h2 className="font-chewy text-2xl font-bold bg-gradient-to-r from-orange-500 via-rose-500 to-indigo-600 bg-clip-text text-transparent">
          Hacer una donacion
        </h2>
        <p className="text-gray-600 mt-1 font-popular">
          Elegí el monto y la frecuencia que más te convenga
        </p>
      </div>
      <Tabs defaultValue="donar" className="w-full font-chewy">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="donar">Donacion</TabsTrigger>
          <TabsTrigger value="suscribirse">Suscripcion</TabsTrigger>
        </TabsList>

        <TabsContent value="donar">
          <Formik
            initialValues={{
              frecuencia: "una_vez",
              montoPersonalizado: "",
              nombre: "",
              email: "",
              mensaje: "",
              metodoPago: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              console.log("Formulario enviado:", values);
            }}
          >
            {({ handleChange, values, setFieldValue }) => (
              <Form className="space-y-4 font-bebas">
                <div>
                  <Label className="block mb-2 font-semibold">Frecuencia</Label>
                  <RadioGroup
                    value={values.frecuencia}
                    onValueChange={handleChange("frecuencia")}
                    className="flex gap-6"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="una_vez" id="una_vez" />
                      <Label htmlFor="una_vez">Una vez</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="mensual" id="mensual" />
                      <Label htmlFor="mensual">Mensual</Label>
                    </div>
                  </RadioGroup>
                  <ErrorMessage
                    name="frecuencia"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>

                <div>
                  <Label className="block mb-2 font-semibold">Monto</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {montos.map((monto) => (
                      <Button
                        type="button"
                        variant="outline"
                        key={monto}
                        onClick={() =>
                          setFieldValue("montoPersonalizado", monto.toString())
                        }
                      >
                        ${monto.toLocaleString()}
                      </Button>
                    ))}
                  </div>
                  <Input
                    className="mt-2"
                    placeholder="O ingresá un monto personalizado"
                    name="montoPersonalizado"
                    value={values.montoPersonalizado}
                    onChange={handleChange}
                  />
                  <ErrorMessage
                    name="montoPersonalizado"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Field
                      as={Input}
                      name="nombre"
                      placeholder="Nombre completo"
                    />
                    <ErrorMessage
                      name="nombre"
                      component="div"
                      className="text-sm text-red-500 mt-1"
                    />
                  </div>
                  <div>
                    <Field
                      as={Input}
                      name="email"
                      placeholder="Email"
                      type="email"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-sm text-red-500 mt-1"
                    />
                  </div>
                </div>

                <Field
                  as={Textarea}
                  name="mensaje"
                  placeholder="Mensaje (opcional)"
                />

                <div>
                  <Label className="block mb-2 font-semibold">
                    Método de pago
                  </Label>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant={
                        values.metodoPago === "tarjeta" ? "default" : "outline"
                      }
                      onClick={() => setFieldValue("metodoPago", "tarjeta")}
                    >
                      Tarjeta de crédito/débito
                    </Button>
                    <Button
                      type="button"
                      variant={
                        values.metodoPago === "transferencia"
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        setFieldValue("metodoPago", "transferencia")
                      }
                    >
                      Transferencia bancaria
                    </Button>
                  </div>
                  <ErrorMessage
                    name="metodoPago"
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full mt-4 bg-gradient-to-r from-pink-500 via-red-500 to-orange-400 text-white"
                >
                  Donar ${values.montoPersonalizado || 0}
                </Button>
              </Form>
            )}
          </Formik>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
