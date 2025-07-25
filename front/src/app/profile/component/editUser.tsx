"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/src/components/ui/card";
import { useAuthContext } from "@/src/context/authContext";
import { updateUser, getUserById } from "@/src/services/auth"; 
import Loading from "@/src/components/loading/pantallaCargando";

const EditUser = () => {
  const { user, token, saveUserData } = useAuthContext();

  const [formData, setFormData] = useState<Partial<UserGoogle>>({
    name: "",
    email: "",
    birthdate: "",
    username: "",
    phone: "",
  });

  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id && token) {
      setLoadingUser(true);
      getUserById(user.id, token)
        .then((data) => {
          setFormData({
            name: data.name,
            email: data.email,
            birthdate: data.birthdate,
            username: data.username,
            phone: data.phone,
          });
        })
        .catch(() => setError("Error cargando datos del usuario"))
        .finally(() => setLoadingUser(false));
    } else {
      setLoadingUser(false);
    }
  }, [user, token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
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
      setSuccess("Datos actualizados correctamente");
    } catch {
      setError("Error actualizando datos del usuario");
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingUser) {
    return (
      <>
      <Loading/>
      </>
    );
  }

  return (
    <>
        <div className="flex flex-col w-screen m-6 bg-slate-50">
          <Card>
            <CardHeader>
              <CardTitle>Cambiar datos personales</CardTitle>
              {error && <p className="text-red-600">{error}</p>}
              {success && <p className="text-green-600">{success}</p>}
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 mt-4"
              >
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
                <button
                  type="submit"
                  disabled={loadingSubmit}
                  className="bg-[#017d74] text-white p-2 rounded hover:bg-[#017d74]"
                >
                  {loadingSubmit ? "Guardando..." : "Guardar cambios"}
                </button>
              </form>
            </CardHeader>
          </Card>
        </div>
    </>
  );
};

export default EditUser;
