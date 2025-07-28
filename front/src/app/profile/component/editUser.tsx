"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle } from "@/src/components/ui/card";
import { useAuthContext } from "@/src/context/authContext";
import { updateUser, getUserById } from "@/src/services/auth";
import Loading from "@/src/components/loading/pantallaCargando";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { toast } from "sonner";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const EditUser = () => {
  const { user, token, saveUserData } = useAuthContext();

  const [formData, setFormData] = useState<Partial<UserGoogle>>({
    name: "",
    email: "",
    birthdate: "",
    username: "",
    phone: "",
    address: { street: "", lat: 0, long: 0 },
  });

  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  // --- Cargar datos del usuario
  useEffect(() => {
    if (user?.id && token) {
      getUserById(user.id, token)
        .then((data) => {
          setFormData(data);
        })
        .catch(() => setError("Error cargando datos del usuario"))
        .finally(() => setLoadingUser(false));
    } else {
      setLoadingUser(false);
    }
  }, [user, token]);

  // --- Inicializar Mapa
  useEffect(() => {
    if (!mapContainerRef.current || !formData.address) return;

    let map: mapboxgl.Map | null = null;
    let marker: mapboxgl.Marker | null = null;

    const lat = formData.address.lat || -34.6037;   // default a Buenos Aires
    const long = formData.address.long || -58.3816; // default a Buenos Aires

    const initializeMap = async () => {
      const MapboxGeocoder = (await import("@mapbox/mapbox-gl-geocoder")).default;

      if (!mapContainerRef.current) return;
      map = new mapboxgl.Map({
        container: mapContainerRef.current as HTMLElement,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [long, lat],
        zoom: 12,
      });

      marker = new mapboxgl.Marker({ draggable: true })
        .setLngLat([long, lat])
        .addTo(map);

      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken ?? "",
        mapboxgl: mapboxgl as unknown as typeof import("mapbox-gl"),
        marker: false,
        placeholder: "Buscar dirección...",
      });

      map.addControl(geocoder);

      geocoder.on("result", (e: any) => {
        const { center, place_name } = e.result;
        if (center) {
          marker!.setLngLat(center);
            setFormData((prev: Partial<UserGoogle>) => ({
            ...prev,
            address: {
              street: place_name,
              lat: center[1],
              long: center[0],
            },
            }));
        }
      });

      marker.on("dragend", () => {
        const lngLat = marker!.getLngLat();
        setFormData((prev) => ({
          ...prev,
          address: {
            street: "Ubicación personalizada",
            lat: lngLat.lat,
            long: lngLat.lng,
          },
        }));
      });
    };

    initializeMap();

    return () => {
      if (map) map.remove();
    };
  }, [formData.address]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: Partial<UserGoogle>) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setError(null);
    setSuccess(null);

    if (!user?.id || !token) {
      setError("No se pudo identificar al usuario.");
      setLoadingSubmit(false);
      return;
    }

    try {
      const updatedUser = await updateUser(user.id, token, formData);
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
              value={formData.name || ""}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email || ""}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="date"
              name="birthdate"
              placeholder="Fecha de nacimiento"
              value={formData.birthdate || ""}
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="username"
              placeholder="Nombre de usuario"
              value={formData.username || ""}
              onChange={handleChange}
              className="border p-2 rounded"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Teléfono"
              value={formData.phone || ""}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            {/* Mapa y dirección */}
            <div className="space-y-2">
              <label className="font-medium text-sm">Dirección:</label>
              <div ref={mapContainerRef} className="h-64 w-full rounded border" />
              {formData.address && (
                <div className="text-sm text-gray-600 mt-2">
                  <p><strong>Dirección:</strong> {formData.address.street}</p>
                  <p><strong>Latitud:</strong> {formData.address.lat}</p>
                  <p><strong>Longitud:</strong> {formData.address.long}</p>
                </div>
              )}
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
