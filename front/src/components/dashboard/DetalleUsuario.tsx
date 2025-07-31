"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { fetchUserById } from "../../app/utils/UsuariosHelper"
import type { IUsuario } from "../../app/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import {
    User,
    Mail,
    Phone,
    Calendar,
    Shield,
    Heart,
    Gift,
    ArrowLeft,
    AlertCircle,
    Loader2,
    UserCheck,
    Hash,
    Crown,
} from "lucide-react"
import Link from "next/link"
import { cn } from "../../lib/utils"

export const DetalleUsuario = () => {
    const params = useParams()
    const id = params && typeof params.id === "string" ? params.id : undefined
    const [usuario, setUsuario] = useState<IUsuario | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const obtenerUsuario = async () => {
            if (typeof id === "string") {
                try {
                    const data = await fetchUserById(id)
                    setUsuario(data)
                } catch (error) {
                    console.error("Error fetching user:", error)
                } finally {
                    setLoading(false)
                }
            }
        }
        obtenerUsuario()
    }, [id])

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const getRoleColor = (usuario: IUsuario) => {
        if (usuario.isSuperAdmin) return "bg-red-100 text-red-800 border-red-200"
        if (usuario.isAdmin) return "bg-blue-100 text-blue-800 border-blue-200"
        if (usuario.isDonator) return "bg-green-100 text-green-800 border-green-200"
        return "bg-gray-100 text-gray-800 border-gray-200"
    }

    const getRoleText = (usuario: IUsuario) => {
        const roles = []
        if (usuario.isSuperAdmin) roles.push("SuperAdmin")
        if (usuario.isAdmin) roles.push("Admin")
        if (usuario.isDonator) roles.push("Donador")

        if (roles.length === 0) return "Usuario"
        return roles.join(" • ")
    }

    const getMainRole = (usuario: IUsuario) => {
        if (usuario.isSuperAdmin) return { text: "SuperAdmin", priority: 3 }
        if (usuario.isAdmin) return { text: "Administrador", priority: 2 }
        return { text: "Usuario", priority: 1 }
    }

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin text-[#017d74] mb-4" />
                    <p className="text-gray-500">Cargando información del usuario...</p>
                </div>
            </div>
        )
    }

    if (!usuario) {
        return (
            <div className="p-6 space-y-6">
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-red-600 mb-2">Usuario no encontrado</h2>
                    <p className="text-gray-500 mb-4">El usuario que buscas no existe o fue eliminado.</p>
                    <Link href="/dashboard/usuarios">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver a usuarios
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    const mainRole = getMainRole(usuario)

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
                            <User className="w-5 h-5 text-white" />
                        </div>
                        Perfil de Usuario
                    </h1>
                    <p className="text-gray-600 mt-1">Información detallada del usuario seleccionado</p>
                </div>
            </div>

            {/* User Profile Card */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${usuario.name}`} />
                            <AvatarFallback className="bg-[#017d74] text-white text-2xl">{getInitials(usuario.name)}</AvatarFallback>
                        </Avatar>
                        <div className="text-center sm:text-left flex-1">
                            <h2 className="text-2xl font-bold text-gray-900">{usuario.name}</h2>
                            <p className="text-gray-600 text-lg">@{usuario.username}</p>
                            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                                <Badge variant="outline" className={getRoleColor(usuario)}>
                                    {getRoleText(usuario)}
                                </Badge>
                                {usuario.isSuperAdmin && (
                                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                                        <Crown className="w-3 h-3 mr-1" />
                                        SuperAdmin
                                    </Badge>
                                )}
                                {usuario.isAdmin && !usuario.isSuperAdmin && (
                                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                                        <Shield className="w-3 h-3 mr-1" />
                                        Administrador
                                    </Badge>
                                )}
                                {usuario.isDonator && (
                                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                        <Heart className="w-3 h-3 mr-1" />
                                        Donador
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* User Information Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Información Personal
                        </CardTitle>
                        <CardDescription>Datos básicos del usuario</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Hash className="w-4 h-4 text-gray-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">ID de Usuario</p>
                                <p className="text-gray-900 font-mono text-sm">{usuario.id}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <User className="w-4 h-4 text-gray-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Nombre Completo</p>
                                <p className="text-gray-900">{usuario.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <UserCheck className="w-4 h-4 text-gray-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Nombre de Usuario</p>
                                <p className="text-gray-900">@{usuario.username}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Fecha de Nacimiento</p>
                                <p className="text-gray-900">
                                    {usuario.birthdate ? new Date(usuario.birthdate).toLocaleDateString() : "No especificada"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="w-5 h-5" />
                            Información de Contacto
                        </CardTitle>
                        <CardDescription>Datos de contacto del usuario</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Correo Electrónico</p>
                                <p className="text-gray-900">{usuario.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">Teléfono</p>
                                <p className="text-gray-900">{usuario.phone || "No especificado"}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Roles and Permissions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Roles y Permisos
                    </CardTitle>
                    <CardDescription>Configuración de roles del usuario</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* SuperAdmin Role */}
                        <div
                            className={cn(
                                "p-4 rounded-lg border-2 transition-colors",
                                usuario.isSuperAdmin ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200",
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center",
                                        usuario.isSuperAdmin ? "bg-red-100" : "bg-gray-100",
                                    )}
                                >
                                    <Crown className={cn("w-5 h-5", usuario.isSuperAdmin ? "text-red-600" : "text-gray-400")} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">SuperAdmin</h3>
                                    <p className="text-sm text-gray-600">
                                        {usuario.isSuperAdmin ? "Control total del sistema" : "Sin permisos de SuperAdmin"}
                                    </p>
                                </div>
                            </div>
                            <Badge
                                className={cn("mt-3", usuario.isSuperAdmin ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-600")}
                            >
                                {usuario.isSuperAdmin ? "Activo" : "Inactivo"}
                            </Badge>
                        </div>

                        {/* Admin Role */}
                        <div
                            className={cn(
                                "p-4 rounded-lg border-2 transition-colors",
                                usuario.isAdmin && !usuario.isSuperAdmin ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200",
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center",
                                        usuario.isAdmin && !usuario.isSuperAdmin ? "bg-blue-100" : "bg-gray-100",
                                    )}
                                >
                                    <Shield
                                        className={cn(
                                            "w-5 h-5",
                                            usuario.isAdmin && !usuario.isSuperAdmin ? "text-blue-600" : "text-gray-400",
                                        )}
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Administrador</h3>
                                    <p className="text-sm text-gray-600">
                                        {usuario.isAdmin && !usuario.isSuperAdmin
                                            ? "Acceso administrativo"
                                            : "Sin permisos administrativos"}
                                    </p>
                                </div>
                            </div>
                            <Badge
                                className={cn(
                                    "mt-3",
                                    usuario.isAdmin && !usuario.isSuperAdmin ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600",
                                )}
                            >
                                {usuario.isAdmin && !usuario.isSuperAdmin ? "Activo" : "Inactivo"}
                            </Badge>
                        </div>

                        {/* Donator Role */}
                        <div
                            className={cn(
                                "p-4 rounded-lg border-2 transition-colors",
                                usuario.isDonator ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200",
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center",
                                        usuario.isDonator ? "bg-green-100" : "bg-gray-100",
                                    )}
                                >
                                    <Heart className={cn("w-5 h-5", usuario.isDonator ? "text-green-600" : "text-gray-400")} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Donador</h3>
                                    <p className="text-sm text-gray-600">
                                        {usuario.isDonator ? "Usuario con historial de donaciones" : "Sin historial de donaciones"}
                                    </p>
                                </div>
                            </div>
                            <Badge
                                className={cn("mt-3", usuario.isDonator ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600")}
                            >
                                {usuario.isDonator ? "Activo" : "Inactivo"}
                            </Badge>
                        </div>
                    </div>

                    {/* Role Hierarchy Info */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-blue-900 mb-1">Jerarquía de Roles</h4>
                                <p className="text-sm text-blue-700 mb-2">
                                    Los roles administrativos son excluyentes. Un usuario puede ser SuperAdmin O Admin, pero no ambos.
                                </p>
                                <div className="flex items-center gap-2 text-sm text-blue-600">
                                    <Crown className="w-4 h-4" />
                                    <span className="font-medium">SuperAdmin</span>
                                    <span>{">"}</span>
                                    <Shield className="w-4 h-4" />
                                    <span className="font-medium">Admin</span>
                                    <span>{">"}</span>
                                    <User className="w-4 h-4" />
                                    <span className="font-medium">Usuario</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Donations Summary */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Gift className="w-5 h-5" />
                        Resumen de Donaciones
                    </CardTitle>
                    <CardDescription>Historial de donaciones del usuario</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Gift className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{usuario.donates.length}</p>
                            <p className="text-sm text-gray-600">
                                {usuario.donates.length === 1 ? "Donación registrada" : "Donaciones registradas"}
                            </p>
                        </div>
                    </div>
                    {usuario.donates.length === 0 && (
                        <div className="text-center py-8">
                            <Gift className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Sin donaciones registradas</h3>
                            <p className="text-gray-500">Este usuario aún no ha realizado ninguna donación.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
