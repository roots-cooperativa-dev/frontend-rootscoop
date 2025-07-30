"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle } from "@/src/components/ui/card";
import { useAuthContext } from "@/src/context/authContext";
import { updateUser, getUserById } from "@/src/services/auth";
import Loading from "@/src/components/loading/pantallaCargando";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { toast } from "sonner";
import { UpdateUserDTO } from "../../../types/index";
import { FiEye, FiEyeOff } from "react-icons/fi";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const EditUser = () => {
  const { user, token, saveUserData } = useAuthContext();

  const [formData, setFormData] = useState<UpdateUserDTO>({
    name: "",
    birthdate: "",
    username: "",
    phone: 0,
    password: "",
    address: {
      street: "",
      latitude: -34.6037,
      longitude: -58.3816,
    },
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (user?.id && token) {
      getUserById(user.id, token)
        .then((data) => {
          const cleanedData: UpdateUserDTO = {
            name: data.name,
            birthdate: data.birthdate,
            username: data.username,
            phone: Number(data.phone),
            password: "",
            address: {
              street: data.address?.street || "",
              latitude: data.address?.latitude || -34.6037,
              longitude: data.address?.longitude || -58.3816,
            },
          };
          setFormData(cleanedData);
        })
        .catch(() => setError("Error cargando datos del usuario"))
        .finally(() => setLoadingUser(false));
    } else {
      setLoadingUser(false);
    }
  }, [user, token]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const { latitude, longitude } = formData.address;

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
      setFormData((prev) => ({
        ...prev,
        address: {
          street: place_name,
          latitude: center[1],
          longitude: center[0],
        },
      }));
      marker.setLngLat(center);
    });

    marker.on("dragend", () => {
      const lngLat = marker.getLngLat();
      setFormData((prev) => ({
        ...prev,
        address: {
          street: "Ubicación personalizada",
          latitude: lngLat.lat,
          longitude: lngLat.lng,
        },
      }));
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, [formData.address]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "phone" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setConfirmPasswordError(null);
    setLoadingSubmit(true);

    if (!user?.id || !token) {
      setError("No se pudo identificar al usuario.");
      setLoadingSubmit(false);
      return;
    }

    if (!formData.password) {
      setError("La contraseña es obligatoria para guardar los cambios.");
      setLoadingSubmit(false);
      return;
    }

    if (formData.password !== confirmPassword) {
      setConfirmPasswordError("Las contraseñas no coinciden.");
      setLoadingSubmit(false);
      return;
    }

    try {
      const payload = { ...formData }; // confirmPassword no se incluye
      const updatedUser = await updateUser(user.id, token, payload);
      saveUserData({ user: updatedUser, accessToken: token, isAuth: true });
      toast.success("Datos actualizados correctamente");
      setSuccess("Datos actualizados correctamente");
    } catch {
      toast.error("Error actualizando datos del usuario");
      setError("Error actualizando datos del usuario");
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingUser) return <Loading />;

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto m-6 bg-slate-50">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Editar perfil</CardTitle>
          {error && <p className="text-red-600">{error}</p>}
          {success && <p className="text-green-600">{success}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <input
              type="text"
              name="name"
              placeholder="Nombre completo"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="username"
              placeholder="Nombre de usuario"
              value={formData.username}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Teléfono"
              value={formData.phone}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Ingrese su nueva contraseña"
                value={formData.password}
                onChange={handleChange}
                className="border p-2 rounded w-full"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>

            {/* Confirm password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmPasswordError(null);
                }}
                className="border p-2 rounded w-full"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
              >
                {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
            {confirmPasswordError && (
              <p className="text-red-500 text-sm">{confirmPasswordError}</p>
            )}

            {/* Dirección */}
            <div className="space-y-2">
              <label className="font-medium text-sm">Dirección:</label>
              <div ref={mapContainerRef} className="h-64 w-full rounded border" />
              <div className="text-sm text-gray-600 mt-2">
                <p><strong>Dirección:</strong> {formData.address.street}</p>
                <p><strong>Latitud:</strong> {formData.address.latitude}</p>
                <p><strong>Longitud:</strong> {formData.address.longitude}</p>
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
};

export default EditUser;
