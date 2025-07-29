"use client";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { es } from "date-fns/locale";
import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { postRegister } from "@/src/services/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FiEye, FiEyeOff } from "react-icons/fi";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [direccion, setDireccion] = useState({
    street: "",
    latitude: 0,
    longitude: 0,
  });

  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    let map: mapboxgl.Map | null = null;
    let marker: mapboxgl.Marker | null = null;

    const initializeMap = async () => {
      const MapboxGeocoder = (await import("@mapbox/mapbox-gl-geocoder")).default;

      map = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-58.3816, -34.6037],
        zoom: 12,
      });

      marker = new mapboxgl.Marker({ draggable: true })
        .setLngLat([-58.3816, -34.6037])
        .addTo(map);

      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken ?? "",
        mapboxgl: mapboxgl as any,
        marker: false,
        placeholder: "Buscar dirección...",
      });

      map.addControl(geocoder);

      geocoder.on("result", (e: any) => {
        const { center, place_name } = e.result;
        if (center) {
          marker!.setLngLat(center);
          setDireccion({
            street: place_name,
            latitude: center[1],
            longitude: center[0],
          });
        }
      });

      marker.on("dragend", () => {
        const lngLat = marker!.getLngLat();
        setDireccion({
          street: "Ubicación personalizada",
          latitude: lngLat.lat,
          longitude: lngLat.lng,
        });
      });
    };

    initializeMap();

    return () => {
      if (map) map.remove();
    };
  }, []);

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
      password: Yup.string().min(6, "Mínimo 6 caracteres").required("Requerido"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
        .required("Requerido"),
      birthdate: Yup.date()
        .required("Requerido")
        .test("is-18", "Debes tener al menos 18 años", function (value) {
          if (!value) return false;
          const today = new Date();
          const birthDate = new Date(value);
          const age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          return (
            age > 18 ||
            (age === 18 && m >= 0 && today.getDate() >= birthDate.getDate())
          );
        }),
      phone: Yup.number().typeError("Debe ser un número").required("Requerido"),
      username: Yup.string().required("Requerido"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setSubmitting(true);

        const data = {
          name: values.name,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
          birthdate: values.birthdate,
          phone: Number(values.phone),
          username: values.username,
          address: {
            street: direccion.street,
            latitude: direccion.latitude,
            longitude: direccion.longitude,
          },
        };

        await postRegister(data);
        toast.success("Usuario registrado correctamente. Inicia sesión para continuar");

        setTimeout(() => {
          router.push("/login");
        }, 2000);

        resetForm();
      } catch (error: any) {
        console.log(error.response?.data?.message);
        toast.error(error?.response?.data?.message || "Error al registrar el usuario");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <Input
        name="name"
        placeholder="Nombre completo"
        value={formik.values.name}
        onChange={(e) => {
          formik.setFieldTouched("name", true);
          formik.handleChange(e);
        }}
      />
      {formik.touched.name && formik.errors.name && (
        <p className="text-red-500 text-xs">{formik.errors.name}</p>
      )}

      <Input
        type="email"
        name="email"
        placeholder="tu@email.com"
        value={formik.values.email}
        onChange={(e) => {
          formik.setFieldTouched("email", true);
          formik.handleChange(e);
        }}
      />
      {formik.touched.email && formik.errors.email && (
        <p className="text-red-500 text-xs">{formik.errors.email}</p>
      )}

      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="********"
          value={formik.values.password}
          onChange={(e) => {
            formik.setFieldTouched("password", true);
            formik.handleChange(e);
          }}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
        >
          {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>
      {formik.touched.password && formik.errors.password && (
        <p className="text-red-500 text-xs">{formik.errors.password}</p>
      )}

      <div className="relative">
        <Input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Repetir contraseña"
          value={formik.values.confirmPassword}
          onChange={(e) => {
            formik.setFieldTouched("confirmPassword", true);
            formik.handleChange(e);
          }}
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

      <div>
        <DatePicker
          selected={
            formik.values.birthdate ? new Date(formik.values.birthdate) : null
          }
          onChange={(date: Date | null) => {
            formik.setFieldTouched("birthdate", true);
            formik.setFieldValue(
              "birthdate",
              date?.toISOString().split("T")[0] || ""
            );
          }}
          dateFormat="yyyy-MM-dd"
          placeholderText="Ingresar fecha de nacimiento"
          maxDate={new Date()}
          showYearDropdown
          scrollableYearDropdown
          yearDropdownItemNumber={100}
          locale={es}
          className="w-full p-2 border border-gray-300 rounded-md text-sm"
          wrapperClassName="w-full"
        />
        {formik.touched.birthdate && formik.errors.birthdate && (
          <p className="text-red-500 text-xs">{formik.errors.birthdate}</p>
        )}
      </div>

      <Input
        name="phone"
        placeholder="Teléfono"
        value={formik.values.phone}
        onChange={(e) => {
          formik.setFieldTouched("phone", true);
          formik.handleChange(e);
        }}
      />
      {formik.touched.phone && formik.errors.phone && (
        <p className="text-red-500 text-xs">{formik.errors.phone}</p>
      )}

      <Input
        name="username"
        placeholder="Nombre de usuario"
        value={formik.values.username}
        onChange={(e) => {
          formik.setFieldTouched("username", true);
          formik.handleChange(e);
        }}
      />
      {formik.touched.username && formik.errors.username && (
        <p className="text-red-500 text-xs">{formik.errors.username}</p>
      )}

      <div className="space-y-2">
        <label className="font-medium text-sm">Dirección:</label>
        <div ref={mapContainerRef} className="h-64 rounded border" />
        <div className="text-sm text-gray-600 mt-2">
          <p><strong>Dirección:</strong> {direccion.street}</p>
          <p><strong>Latitud:</strong> {direccion.latitude}</p>
          <p><strong>Longitud:</strong> {direccion.longitude}</p>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={formik.isSubmitting}>
        {formik.isSubmitting ? "Registrando..." : "Registrarse"}
      </Button>
    </form>
  );
}
