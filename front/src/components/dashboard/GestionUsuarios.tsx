"use client"

import { useEffect, useState } from "react"
import type { IUsuario } from "../../app/types"
import { fetchUsers, updateUserRoles } from "../../app/utils/UsuariosHelper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import {
    Users,
    Search,
    Mail,
    Phone,
    User,
    Shield,
    Heart,
    MoreHorizontal,
    UserPlus,
    Filter,
    Loader2,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import Link from "next/link"
import { toast } from "sonner"
import { Switch } from "../../components/ui/switch"
import { Label } from "../../components/ui/label"
import { cn } from "../../lib/utils"

export const GestionUsuarios = () => {
    const [usuarios, setUsuarios] = useState<IUsuario[]>([])
    const [filteredUsuarios, setFilteredUsuarios] = useState<IUsuario[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterRole, setFilterRole] = useState<"all" | "admin" | "donator" | "regular">("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [limit] = useState(5)
    const [updatingRolesId, setUpdatingRolesId] = useState<string | null>(null)

    useEffect(() => {
        const cargarUsuarios = async () => {
            setLoading(true)
            try {
                const data = await fetchUsers(currentPage, limit)
                setUsuarios(data.users)
                setFilteredUsuarios(data.users)
                setTotalPages(data.pages)
            } catch (error) {
                console.error("Error al cargar usuarios:", error)
                toast.error("Error al cargar usuarios")
            } finally {
                setLoading(false)
            }
        }
        cargarUsuarios()
    }, [currentPage, limit])

    useEffect(() => {
        let filtered = usuarios.filter(
            (usuario) =>
                usuario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                usuario.username.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        if (filterRole !== "all") {
            filtered = filtered.filter((usuario) => {
                switch (filterRole) {
                    case "admin":
                        return usuario.isAdmin
                    case "donator":
                        return usuario.isDonator
                    case "regular":
                        return !usuario.isAdmin && !usuario.isDonator
                    default:
                        return true
                }
            })
        }
        setFilteredUsuarios(filtered)
    }, [searchTerm, filterRole, usuarios])

    const getInitials = (name: string) =>
        name
            .split(" ")
            .map((word) => word.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2)

    const getRoleColor = (usuario: IUsuario) => {
        if (usuario.isAdmin) return "bg-red-100 text-red-800 border-red-200"
        if (usuario.isDonator) return "bg-green-100 text-green-800 border-green-200"
        return "bg-gray-100 text-gray-800 border-gray-200"
    }

    const getRoleText = (usuario: IUsuario) => {
        if (usuario.isAdmin && usuario.isDonator) return "Admin • Donador"
        if (usuario.isAdmin) return "Administrador"
        if (usuario.isDonator) return "Donador"
        return "Usuario"
    }

    const handleRoleChange = async (userId: string, roleType: "isAdmin" | "isDonator", checked: boolean) => {
        setUpdatingRolesId(userId)
        try {
            const currentUsuario = usuarios.find((u) => u.id === userId)
            if (!currentUsuario) {
                toast.error("Usuario no encontrado.")
                return
            }

            const updatedRoles = {
                isAdmin: roleType === "isAdmin" ? checked : currentUsuario.isAdmin,
                isDonator: roleType === "isDonator" ? checked : currentUsuario.isDonator,
            }

            const success = await updateUserRoles(userId, updatedRoles)
            if (success) {
                toast.success(`Rol de ${roleType === "isAdmin" ? "administrador" : "donador"} actualizado.`)
                setUsuarios((prev) => prev.map((u) => (u.id === userId ? { ...u, [roleType]: checked } : u)))
            } else {
                toast.error("Error al actualizar rol.")
            }
        } catch (error) {
            console.error("Error al actualizar el rol:", error)
            toast.error("Error al actualizar rol.")
        } finally {
            setUpdatingRolesId(null)
        }
    }

    const totalAdmins = usuarios.filter((u) => u.isAdmin).length
    const totalDonators = usuarios.filter((u) => u.isDonator).length
    const totalRegular = usuarios.filter((u) => !u.isAdmin && !u.isDonator).length

    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center py-20">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-[#017d74] mx-auto" />
                    <p className="text-gray-500">Cargando usuarios...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#017d74] to-[#015d54] rounded-xl flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        Gestión de Usuarios
                    </h1>
                    <p className="text-gray-600 mt-1">Administra y supervisa todos los usuarios del sistema</p>
                </div>
                <Link href="/dashboard/usuarios/crear">
                    <Button className="bg-[#017d74] hover:bg-[#015d54] text-white shadow-md">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Nuevo Usuario
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                            <p className="text-2xl font-bold text-gray-900">{usuarios.length}</p>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Administradores</p>
                            <p className="text-2xl font-bold text-red-600">{totalAdmins}</p>
                        </div>
                        <div className="p-2 bg-red-100 rounded-lg">
                            <Shield className="w-6 h-6 text-red-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Donadores</p>
                            <p className="text-2xl font-bold text-green-600">{totalDonators}</p>
                        </div>
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Heart className="w-6 h-6 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Usuarios Regulares</p>
                            <p className="text-2xl font-bold text-gray-600">{totalRegular}</p>
                        </div>
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <User className="w-6 h-6 text-gray-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <div className="flex-1 w-full sm:w-auto">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Buscar por nombre, email o usuario..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-full"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
                            {["all", "admin", "donator", "regular"].map((role) => (
                                <Button
                                    key={role}
                                    variant={filterRole === role ? "default" : "outline"}
                                    onClick={() => setFilterRole(role as "all" | "admin" | "donator" | "regular")}
                                    size="sm"
                                    className={cn(
                                        filterRole === role &&
                                        (role === "admin"
                                            ? "bg-red-600 hover:bg-red-700"
                                            : role === "donator"
                                                ? "bg-green-600 hover:bg-green-700"
                                                : role === "all"
                                                    ? "bg-[#017d74] hover:bg-[#015d54]"
                                                    : ""),
                                    )}
                                >
                                    {role === "admin" && <Shield className="w-3 h-3 mr-1" />}
                                    {role === "donator" && <Heart className="w-3 h-3 mr-1" />}
                                    {role === "regular" && <User className="w-3 h-3 mr-1" />}
                                    {role === "all" ? "Todos" : role.charAt(0).toUpperCase() + role.slice(1)}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Lista de Usuarios
                    </CardTitle>
                    <CardDescription>
                        {filteredUsuarios.length} usuario{filteredUsuarios.length !== 1 ? "s" : ""} encontrado
                        {filteredUsuarios.length !== 1 ? "s" : ""}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredUsuarios.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">No se encontraron usuarios</h3>
                            <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Usuario</TableHead>
                                            <TableHead>Contacto</TableHead>
                                            <TableHead>Rol Principal</TableHead>
                                            <TableHead>Gestionar Roles</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsuarios.map((usuario) => (
                                            <TableRow key={usuario.id} className="hover:bg-gray-50">
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${usuario.name}`} />
                                                            <AvatarFallback className="bg-[#017d74] text-white">
                                                                {getInitials(usuario.name)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{usuario.name}</p>
                                                            <p className="text-sm text-gray-500">@{usuario.username}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1 text-sm text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="w-3 h-3 text-gray-400" />
                                                            {usuario.email}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="w-3 h-3 text-gray-400" />
                                                            {usuario.phone}
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={getRoleColor(usuario)}>
                                                        {getRoleText(usuario)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center space-x-2">
                                                            <Switch
                                                                id={`admin-switch-${usuario.id}`}
                                                                checked={usuario.isAdmin}
                                                                onCheckedChange={(checked) => handleRoleChange(usuario.id, "isAdmin", checked)}
                                                                disabled={updatingRolesId === usuario.id}
                                                            />
                                                            <Label htmlFor={`admin-switch-${usuario.id}`} className="flex items-center">
                                                                {updatingRolesId === usuario.id && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                                                                Admin
                                                            </Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Switch
                                                                id={`donator-switch-${usuario.id}`}
                                                                checked={usuario.isDonator}
                                                                onCheckedChange={(checked) => handleRoleChange(usuario.id, "isDonator", checked)}
                                                                disabled={updatingRolesId === usuario.id}
                                                            />
                                                            <Label htmlFor={`donator-switch-${usuario.id}`} className="flex items-center">
                                                                {updatingRolesId === usuario.id && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                                                                Donador
                                                            </Label>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                            <Link href={`/dashboard/usuarios/${usuario.id}`} className="flex items-center">
                                                                <DropdownMenuItem>Ver Perfil</DropdownMenuItem>
                                                            </Link>
                                                            <DropdownMenuSeparator />
                                                            <Link href={`/dashboard/usuarios/edit/${usuario.id}`} className="flex items-center">
                                                                <DropdownMenuItem>Editar usuario</DropdownMenuItem>
                                                            </Link>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-red-600">Eliminar usuario</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            {/* Pagination */}
                            <div className="flex justify-between items-center mt-4">
                                <Button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    variant="outline"
                                >
                                    Anterior
                                </Button>
                                <span className="text-sm text-gray-600">
                                    Página {currentPage} de {totalPages}
                                </span>
                                <Button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    variant="outline"
                                >
                                    Siguiente
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
