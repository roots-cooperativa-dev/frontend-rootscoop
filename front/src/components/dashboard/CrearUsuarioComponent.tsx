"use client"

import Link from "next/link"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { createUser, updateUser, fetchUserById } from "../../app/utils/UsuariosHelper"
import type { CrearUsuarioDTO } from "../../app/dto/CrearUsuarioDTO"
import { UserPlus, Loader2, User, ArrowLeft } from "lucide-react"

export const CrearUsuarioComponent = () => {
    const params = useParams()
    const id = params ? params["id"] : undefined
    const router = useRouter()
    const isEdit = !!id && typeof id === "string"

    const [formData, setFormData] = useState<CrearUsuarioDTO>({
        name: "",
        email: "",
        birthdate: "",
        phone: 0,
        username: "",
        password: "",
        confirmPassword: "",
    })
    const [errors, setErrors] = useState<Partial<Record<keyof CrearUsuarioDTO, string>>>({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isEdit) {
            setLoading(true)
            fetchUserById(id as string)
                .then((user) => {
                    if (user) {
                        setFormData({
                            name: user.name,
                            email: user.email,
                            birthdate: user.birthdate,
                            phone: Number(user.phone),
                            username: user.username,
                            password: "", // Passwords are not pre-filled for security
                            confirmPassword: "",
                        })
                    } else {
                        toast.error("No se encontró el usuario")
                        router.push("/dashboard/usuarios")
                    }
                })
                .catch((err) => {
                    console.error("Error fetching user:", err)
                    toast.error("Error al cargar el usuario")
                    router.push("/dashboard/usuarios")
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }, [id, isEdit, router])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: name === "phone" ? Number(value) : value })
        setErrors((prev) => ({ ...prev, [name]: "" })) // Clear error on change
    }

    const validate = (): boolean => {
        const newErrors: typeof errors = {}
        if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio."
        if (!formData.email.trim()) {
            newErrors.email = "El correo electrónico es obligatorio."
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "El correo electrónico no es válido."
        }
        if (!formData.username.trim()) newErrors.username = "El nombre de usuario es obligatorio."

        // Password validation only if creating or if password fields are touched during edit
        if (!isEdit || formData.password || formData.confirmPassword) {
            if (!formData.password) newErrors.password = "La contraseña es obligatoria."
            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = "Las contraseñas no coinciden."
            }
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validate()) return

        setLoading(true)
        try {
            let result;
            if (isEdit) {
                // Remove password fields if empty during edit
                const payload = { ...formData };
                if (!formData.password) {
                    // Don't send password fields if not changing
                    const { password, confirmPassword, ...rest } = payload;
                    result = await updateUser(id as string, { ...rest, phone: String(rest.phone) });
                } else {
                    result = await updateUser(id as string, { ...formData, phone: String(formData.phone) });
                }
            } else {
                // Always send password fields for create
                result = await createUser({
                    ...formData,
                    phone: formData.phone,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword,
                });
            }

            if (result) {
                toast.success(`Usuario ${isEdit ? "actualizado" : "creado"} con éxito`)
                router.push("/dashboard/usuarios")
            } else {
                toast.error("Error al guardar el usuario")
            }
        } catch (error) {
            console.error("Error saving user:", error)
            toast.error("Error al guardar el usuario")
        } finally {
            setLoading(false)
        }
    }

    if (loading && isEdit) {
        return (
            <div className="p-6 flex justify-center items-center py-20">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-[#017d74] mx-auto" />
                    <p className="text-gray-500">Cargando datos del usuario...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Link href="/dashboard/usuarios">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Volver
                            </Button>
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#017d74] to-[#015d54] rounded-xl flex items-center justify-center">
                            {isEdit ? <User className="w-5 h-5 text-white" /> : <UserPlus className="w-5 h-5 text-white" />}
                        </div>
                        {isEdit ? "Editar Usuario" : "Crear Nuevo Usuario"}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {isEdit
                            ? "Modifica los datos del usuario existente."
                            : "Complete los campos para registrar un nuevo usuario en el sistema."}
                    </p>
                </div>
            </div>

            {/* User Form Card */}
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Información del Usuario</CardTitle>
                    <CardDescription>Ingrese los detalles para el usuario.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre completo</Label>
                            <Input
                                id="name"
                                placeholder="Ej: Juan Pérez"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo electrónico</Label>
                            <Input
                                id="email"
                                placeholder="Ej: juan.perez@example.com"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="birthdate">Fecha de nacimiento</Label>
                            <Input
                                id="birthdate"
                                name="birthdate"
                                type="date"
                                value={formData.birthdate}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            {errors.birthdate && <p className="text-red-500 text-sm mt-1">{errors.birthdate}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input
                                id="phone"
                                placeholder="Ej: 1123456789"
                                name="phone"
                                type="number"
                                value={formData.phone || ""}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="username">Nombre de usuario</Label>
                            <Input
                                id="username"
                                placeholder="Ej: juanperez"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                        </div>
                        {/* Password fields */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Contraseña</Label>
                            <Input
                                id="password"
                                placeholder={isEdit ? "Dejar en blanco para no cambiar" : "Ingrese su contraseña"}
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                            <Input
                                id="confirmPassword"
                                placeholder={isEdit ? "Dejar en blanco para no cambiar" : "Confirme su contraseña"}
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-[#017d74] hover:bg-[#015d54] text-white px-6 shadow-md"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    {isEdit ? <User className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                                    {isEdit ? "Actualizar Usuario" : "Crear Usuario"}
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
