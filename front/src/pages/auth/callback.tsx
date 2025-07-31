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
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import DatePicker from "react-datepicker";
import { useFormik } from "formik";
import * as Yup from "yup";
import "react-datepicker/dist/react-datepicker.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { es } from "date-fns/locale";
import { Input } from "@/src/components/ui/input";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function Callback() {
  const router = useRouter();
  const { user, token, saveUserData } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const hasRun = useRef(false);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordRequirements = [
    {
      label: "Al menos una letra minúscula",
      test: (value: string) => /[a-z]/.test(value),
    },
    {
      label: "Al menos una letra mayúscula",
      test: (value: string) => /[A-Z]/.test(value),
    },
    {
      label: "Al menos un número",
      test: (value: string) => /\d/.test(value),
    },
    {
      label: "Al menos un carácter especial (!@#$%^&)",
      test: (value: string) => /[!@#$%^&]/.test(value),
    },
  ];
  useEffect(() => {
    if (!router.isReady || hasRun.current) return;

    const accessToken = router.query.token as string;
    const userId = router.query.userId as string;

    if (!accessToken || !userId) return;

    hasRun.current = true;

    const fetchUser = async () => {
      try {
        const userData = await getUserById(userId, accessToken);
        saveUserData({
          user: {
            id: userId,
            name: userData.name,
            username: userData.username,
            birthdate: userData.birthdate,
            phone: userData.phone,
            email: userData.email,
            isAdmin: userData.isAdmin,
            isSuperAdmin: userData.isAdmin,
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
        const birthYear = userData.birthdate
          ? new Date(userData.birthdate).getFullYear()
          : null;
        const currentYear = new Date().getFullYear();

        if (birthYear && birthYear !== currentYear) {
          router.push("/");
          return;
        }else{
          setLoadingUser(false)
        }
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
      }
    };

    fetchUser();
  }, [router.isReady, router.query, saveUserData]);

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
        .required("Requerido")
        .matches(/^(?=.*[a-z])/, "Debe incluir al menos una letra minúscula")
        .matches(/^(?=.*[A-Z])/, "Debe incluir al menos una letra mayúscula")
        .matches(/^(?=.*\d)/, "Debe incluir al menos un número")
        .matches(
          /^(?=.*[!@#$%^&])/,
          "Debe incluir un carácter especial (!@#$%^&)"
        ),
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
      phone: Yup.number()
        .typeError("Escribe solo número")
        .required("Requerido"),
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
        //.finally(() => setLoadingUser(false));
    } else {
        //setLoadingUser(false);
    }
  }, [user, token]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    let map: mapboxgl.Map | null = null;
    let marker: mapboxgl.Marker | null = null;

    const initializeMap = async () => {
      const MapboxGeocoder = (await import("@mapbox/mapbox-gl-geocoder"))
        .default;

      map = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [
          formik.values.address.longitude || -58.3816,
          formik.values.address.latitude || -34.6037,
        ],
        zoom: 12,
      });

      marker = new mapboxgl.Marker({ draggable: true })
        .setLngLat([
          formik.values.address.longitude || -58.3816,
          formik.values.address.latitude || -34.6037,
        ])
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
          formik.setFieldValue("address", {
            street: place_name,
            latitude: center[1],
            longitude: center[0],
          });
        }
      });

      marker.on("dragend", () => {
        const lngLat = marker!.getLngLat();
        formik.setFieldValue("address", {
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
  }, [mapContainerRef.current]);

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
            <Input
              type="text"
              name="name"
              placeholder="Nombre completo"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm">{formik.errors.name}</p>
            )}

            <div>
              <h2 className="text-sm font-medium">Fecha de nacimiento</h2>
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
                placeholderText="Año-mes-día"
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

            <Input
              type="text"
              name="username"
              placeholder="Nombre de usuario"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.username && formik.errors.username && (
              <p className="text-red-500 text-sm">{formik.errors.username}</p>
            )}

            <Input
              type="tel"
              name="phone"
              placeholder="Teléfono"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-red-500 text-sm">{formik.errors.phone}</p>
            )}

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Contraseña"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
              <p className="text-red-500 text-sm">{formik.errors.password}</p>
            )}
            <div className="text-sm mt-2 space-y-1">
              {passwordRequirements.map((req, index) => {
                const passed = req.test(formik.values.password);
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-2 ${
                      passed ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    <span>{passed ? "✔️" : "❌"}</span>
                    <span>{req.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Repetir contraseña"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
            </div>
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className="text-red-500 text-xs">
                  {formik.errors.confirmPassword}
                </p>
              )}

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
