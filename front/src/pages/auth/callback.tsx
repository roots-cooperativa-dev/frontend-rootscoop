// pages/auth/callback.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useAuthContext } from "@/src/context/authContext";
import { getUserById, updateUser } from "@/src/services/auth";
import Loading from "@/src/components/loading/pantallaCargando";
import { Card, CardHeader, CardTitle } from "@/src/components/ui/card";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "sonner";
import { UpdateUserDTO } from "@/src/types";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import mapboxgl from "mapbox-gl";
import DatePicker from "react-datepicker";
import { useFormik } from "formik";
import * as Yup from "yup";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";

export default function Callback() {
  const router = useRouter();
  const { user, token, saveUserData } = useAuthContext();
  const hasRun = useRef(false);

  useEffect(() => {
    if (!router.isReady || hasRun.current) return;

    const accessToken = router.query.token as string;
    const userId = router.query.userId as string;

    if (!accessToken || !userId) return;

    hasRun.current = true;

    const fetchUser = async () => {
      try {
        const userData = await getUserById(userId, accessToken);

        const birthYear = userData.birthdate
          ? new Date(userData.birthdate).getFullYear()
          : null;
        const currentYear = new Date().getFullYear();

        if (birthYear && birthYear !== currentYear) {
          saveUserData({
            user: {
              id: userId,
              name: userData.name,
              username: userData.username,
              birthdate: userData.birthdate,
              phone: userData.phone,
              email: userData.email,
              isAdmin: userData.isAdmin,
              isDonator: userData.isDonator,
              address: userData.address,
              orders: userData.orders,
              appointments: userData.appointments,
              cart: userData.cart,
              donates: userData.donates,
            },
            accessToken: accessToken,
            isAuth: true,
          });
          toast.success("Inicio de sesion completo");
          router.push("/");
          return;
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    };

    fetchUser();
  }, [router.isReady, router.query, saveUserData]);

  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      birthdate: "",
      username: "",
      phone: "",
      password: "",
      confirmPassword: "",
      address: {
        street: "",
        latitude: -34.6037,
        longitude: -58.3816,
      },
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Requerido"),
      password: Yup.string()
        .min(6, "Mínimo 6 caracteres")
        .required("Requerido"),
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
    onSubmit: async (values) => {
      if (!user?.id || !token) {
        setError("No se pudo identificar al usuario.");
        return;
      }
      setLoadingSubmit(true);
      try {
        const payload: UpdateUserDTO = {
          name: values.name,
          birthdate: values.birthdate,
          username: values.username,
          phone: Number(values.phone),
          password: values.password,
          address: values.address,
        };

        const updatedUser = await updateUser(user.id, token, payload);
        saveUserData({ user: updatedUser, accessToken: token, isAuth: true });
        toast.success("Datos actualizados correctamente");
        router.push("/");
      } catch {
        toast.error("Error actualizando datos del usuario");
      } finally {
        setLoadingSubmit(false);
      }
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  useEffect(() => {
    if (user?.id && token) {
      getUserById(user.id, token)
        .then((data) => {
          formik.setValues({
            name: data.name || "",
            birthdate: data.birthdate || "",
            username: data.username || "",
            phone: data.phone?.toString() || "",
            password: "",
            confirmPassword: "",
            address: {
              street: data.address?.street || "",
              latitude: data.address?.latitude || -34.6037,
              longitude: data.address?.longitude || -58.3816,
            },
          });
        })
        .catch(() => setError("Error cargando datos del usuario"))
        .finally(() => setLoadingUser(false));
    } else {
      setLoadingUser(false);
    }
  }, [user, token]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const { latitude, longitude } = formik.values.address;
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLElement,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [longitude, latitude],
      zoom: 12,
    });

    const marker = new mapboxgl.Marker({ draggable: true })
      .setLngLat([longitude, latitude])
      .addTo(map);

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken!,
      mapboxgl: mapboxgl as unknown as typeof import("mapbox-gl"),
      marker: false,
      placeholder: "Buscar dirección...",
    });
    map.addControl(geocoder);

    geocoder.on("result", (e: any) => {
      const { center, place_name } = e.result;
      formik.setFieldValue("address", {
        street: place_name,
        latitude: center[1],
        longitude: center[0],
      });
      marker.setLngLat(center);
    });

    marker.on("dragend", () => {
      const lngLat = marker.getLngLat();
      formik.setFieldValue("address", {
        street: "Ubicación personalizada",
        latitude: lngLat.lat,
        longitude: lngLat.lng,
      });
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, [formik.values.address.latitude, formik.values.address.longitude]);

  if (loadingUser) return <Loading />;

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto m-6 bg-slate-50">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Completá tus datos para finalizar el registro</CardTitle>
          <p>
            Para poder validar tus datos te pediremos que termines de completar
            tu perfil
          </p>
          {error && <p className="text-red-600">{error}</p>}

          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col gap-4 mt-4"
          >
            <input
              type="text"
              name="name"
              placeholder="Nombre completo"
              value={formik.values.name}
              onChange={formik.handleChange}
              className="border p-2 rounded"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm">{formik.errors.name}</p>
            )}

            <div>
              <DatePicker
                selected={
                  formik.values.birthdate
                    ? new Date(formik.values.birthdate)
                    : null
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
              />
              {formik.touched.birthdate && formik.errors.birthdate && (
                <p className="text-red-500 text-xs">
                  {formik.errors.birthdate}
                </p>
              )}
            </div>

            <input
              type="text"
              name="username"
              placeholder="Nombre de usuario"
              value={formik.values.username}
              onChange={formik.handleChange}
              className="border p-2 rounded"
            />
            {formik.touched.username && formik.errors.username && (
              <p className="text-red-500 text-sm">{formik.errors.username}</p>
            )}

            <input
              type="tel"
              name="phone"
              placeholder="Teléfono"
              value={formik.values.phone}
              onChange={formik.handleChange}
              className="border p-2 rounded"
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-red-500 text-sm">{formik.errors.phone}</p>
            )}

            {/* Password */}
            <input
              type="password"
              name="password"
              placeholder="Ingrese su nueva contraseña"
              value={formik.values.password}
              onChange={formik.handleChange}
              className="border p-2 rounded"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm">{formik.errors.password}</p>
            )}

            {/* Confirm password */}
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              className="border p-2 rounded"
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {formik.errors.confirmPassword}
                </p>
              )}

            {/* Dirección */}
            <div className="space-y-2">
              <label className="font-medium text-sm">Dirección:</label>
              <div ref={mapContainerRef} className="h-64 rounded border" />
              <div className="text-sm text-gray-600 mt-2">
                <p>
                  <strong>Dirección:</strong> {formik.values.address.street}
                </p>
                <p>
                  <strong>Latitud:</strong> {formik.values.address.latitude}
                </p>
                <p>
                  <strong>Longitud:</strong> {formik.values.address.longitude}
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingSubmit}
              className="bg-[#017d74] text-white p-2 rounded hover:bg-[#01645f]"
            >
              {loadingSubmit ? "Guardando..." : "Guardar cambios"}
            </button>
          </form>
        </CardHeader>
      </Card>
    </div>
  );
}
