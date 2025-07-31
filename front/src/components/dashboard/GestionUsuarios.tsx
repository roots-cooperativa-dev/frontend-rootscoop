"use client"

import { useEffect, useState } from "react"
import { fetchUsers, deleteUser, restoreUser, updateUserRoles } from "../../app/utils/UsuariosHelper"
import type { IUsuario } from "../../app/types"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Skeleton } from "../ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog"
import {
    Search,
    Users,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Filter,
    Shield,
    User,
    Trash2,
    Eye,
    RotateCcw,
    MoreHorizontal,
    Crown,
    Heart,
    X,
    Plus,
    Edit,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "../../lib/utils"
import Link from "next/link"

// Hook personalizado para debounce
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}

export const GestionUsuarios = () => {
    const [usuarios, setUsuarios] = useState<IUsuario[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalUsers, setTotalUsers] = useState(0)
    const [usernameFilter, setUsernameFilter] = useState("")
    const [emailFilter, setEmailFilter] = useState("")
    const [showDeleted, setShowDeleted] = useState(false)

    // Debounce para búsqueda en tiempo real
    const debouncedUsernameFilter = useDebounce(usernameFilter, 500)
    const debouncedEmailFilter = useDebounce(emailFilter, 500)

    const fetchData = async () => {
        setLoading(true)
        try {
            const { users, pages, total } = await fetchUsers({
                page,
                limit: 15,
                username: debouncedUsernameFilter || undefined,
                email: debouncedEmailFilter || undefined,
            })

            const filtered = showDeleted
                ? users.filter((user) => user.deletedAt !== null)
                : users.filter((user) => user.deletedAt === null)

            setUsuarios(filtered)
            setTotalPages(pages)
            setTotalUsers(total || filtered.length)
        } catch (error) {
            console.error("Error fetching users:", error)
            toast.error("Error al cargar usuarios")
        } finally {
            setLoading(false)
        }
    }

    // Efecto para búsqueda en tiempo real
    useEffect(() => {
        setPage(1) // Resetear a página 1 cuando cambian los filtros
        fetchData()
    }, [debouncedUsernameFilter, debouncedEmailFilter, showDeleted])

    // Efecto para cambio de página
    useEffect(() => {
        fetchData()
    }, [page])

    const handleSearch = () => {
        setPage(1)
        fetchData()
    }

    const handleClearFilters = () => {
        setUsernameFilter("")
        setEmailFilter("")
        setShowDeleted(false)
        setPage(1)
    }

    const handleDeleteUser = async (userId: string, userName: string) => {
        try {
            const success = await deleteUser(userId)
            if (success) {
                toast.success(`Usuario ${userName} eliminado correctamente`)
                fetchData()
            } else {
                toast.error("Error al eliminar el usuario")
            }
        } catch (error) {
            toast.error("Error al eliminar el usuario")
        }
    }

    const handleRestoreUser = async (userId: string, userName: string) => {
        try {
            const success = await restoreUser(userId)
            if (success) {
                toast.success(`Usuario ${userName} restaurado correctamente`)
                // Cambiar automáticamente a vista de usuarios activos para ver el usuario restaurado
                setShowDeleted(false)
                setPage(1)
                // fetchData se ejecutará automáticamente por el useEffect de showDeleted
            } else {
                toast.error("Error al restaurar el usuario")
            }
        } catch (error) {
            toast.error("Error al restaurar el usuario")
        }
    }

    const handleRoleToggle = async (user: IUsuario, role: "isAdmin" | "isSuperAdmin" | "isDonator") => {
        try {
            const updatedRoles = {
                isAdmin: user.isAdmin,
                isSuperAdmin: user.isSuperAdmin,
                isDonator: user.isDonator,
            }

            // Lógica de exclusividad entre Admin y SuperAdmin
            if (role === "isAdmin") {
                updatedRoles.isAdmin = !updatedRoles.isAdmin
                // Si se activa Admin, desactivar SuperAdmin
                if (updatedRoles.isAdmin) {
                    updatedRoles.isSuperAdmin = false
                }
            } else if (role === "isSuperAdmin") {
                updatedRoles.isSuperAdmin = !updatedRoles.isSuperAdmin
                // Si se activa SuperAdmin, desactivar Admin
                if (updatedRoles.isSuperAdmin) {
                    updatedRoles.isAdmin = false
                }
            } else {
                // Para isDonator, solo toggle normal
                updatedRoles[role] = !updatedRoles[role]
            }

            const success = await updateUserRoles(user.id, updatedRoles)
            if (success) {
                let message = ""
                if (role === "isAdmin" && updatedRoles.isAdmin) {
                    message = `${user.name} es ahora Admin (SuperAdmin removido)`
                } else if (role === "isSuperAdmin" && updatedRoles.isSuperAdmin) {
                    message = `${user.name} es ahora SuperAdmin (Admin removido)`
                } else if (role === "isDonator") {
                    message = `Rol Donador ${updatedRoles.isDonator ? "agregado" : "removido"} para ${user.name}`
                } else {
                    message = `Rol ${role} actualizado para ${user.name}`
                }

                toast.success(message)
                fetchData()
            } else {
                toast.error("Error al actualizar los roles")
            }
        } catch (error) {
            toast.error("Error al actualizar los roles")
        }
    }

    const getRoleInfo = (usuario: IUsuario) => {
        if (usuario.isSuperAdmin) {
            return {
                label: "SuperAdmin",
                icon: Crown,
                color: "bg-red-100 text-red-800 border-red-200",
                priority: 3,
            }
        }
        if (usuario.isAdmin) {
            return {
                label: "Admin",
                icon: Shield,
                color: "bg-blue-100 text-blue-800 border-blue-200",
                priority: 2,
            }
        }
        return {
            label: "Usuario",
            icon: User,
            color: "bg-gray-100 text-gray-800 border-gray-200",
            priority: 1,
        }
    }

    const hasActiveFilters = usernameFilter || emailFilter || showDeleted

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#017d74] to-[#015d54] rounded-xl flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        Gestión de Usuarios
                    </h1>
                    <p className="text-gray-600 mt-1">Administra usuarios, roles y permisos del sistema</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={showDeleted ? "destructive" : "outline"}
                        onClick={() => {
                            setShowDeleted((prev) => !prev)
                            setPage(1)
                        }}
                        size="sm"
                        className="bg-transparent"
                    >
                        {showDeleted ? (
                            <>
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Activos
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Ver Eliminados
                            </>
                        )}
                    </Button>
                    <Button onClick={fetchData} disabled={loading} variant="outline" size="sm">
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                        Actualizar
                    </Button>
                    <Link href="/dashboard/usuarios/crear">
                        <Button className="bg-[#017d74] hover:bg-[#015d54] text-white" size="sm">
                            <Plus className="h-4 w-4 mr-2" />
                            Crear Usuario
                        </Button>
                    </Link>
                </div>
            </div>
            {/* Filtros */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-[#017d74]" />
                        Búsqueda en Tiempo Real
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-3 items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Buscar por nombre de usuario..."
                                value={usernameFilter}
                                onChange={(e) => setUsernameFilter(e.target.value)}
                                className="pl-10 border-gray-200 focus:border-[#017d74] focus:ring-[#017d74]"
                            />
                            {usernameFilter && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <div className="w-2 h-2 bg-[#017d74] rounded-full animate-pulse"></div>
                                </div>
                            )}
                        </div>
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Buscar por email..."
                                value={emailFilter}
                                onChange={(e) => setEmailFilter(e.target.value)}
                                className="pl-10 border-gray-200 focus:border-[#017d74] focus:ring-[#017d74]"
                            />
                            {emailFilter && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <div className="w-2 h-2 bg-[#017d74] rounded-full animate-pulse"></div>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            {hasActiveFilters && (
                                <Button onClick={handleClearFilters} variant="outline" disabled={loading} className="bg-transparent">
                                    <X className="h-4 w-4 mr-2" />
                                    Limpiar Filtros
                                </Button>
                            )}
                        </div>
                    </div>
                    {(debouncedUsernameFilter || debouncedEmailFilter) && (
                        <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
                            <div className="w-2 h-2 bg-[#017d74] rounded-full animate-pulse"></div>
                            Buscando en tiempo real...
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Información de resultados */}
            {(hasActiveFilters || totalUsers > 0) && (
                <div className="p-4 bg-[#017d74]/5 border border-[#017d74]/20 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="bg-[#017d74] text-white">
                                {loading ? "Buscando..." : `${usuarios.length} usuarios encontrados`}
                            </Badge>
                            {showDeleted && (
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                    Eliminados
                                </Badge>
                            )}
                            {(debouncedUsernameFilter || debouncedEmailFilter) && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    Filtrado
                                </Badge>
                            )}
                        </div>
                        {totalPages > 1 && (
                            <span className="text-sm text-gray-600">
                                Página {page} de {totalPages}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Tabla */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle>Lista de Usuarios</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-3">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="flex items-center space-x-4">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-[200px]" />
                                        <Skeleton className="h-4 w-[150px]" />
                                    </div>
                                    <Skeleton className="h-6 w-20" />
                                    <Skeleton className="h-8 w-8" />
                                </div>
                            ))}
                        </div>
                    ) : usuarios.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {hasActiveFilters ? "No se encontraron usuarios" : "No hay usuarios disponibles"}
                            </h3>
                            <p className="text-gray-500 mb-4">
                                {hasActiveFilters
                                    ? `No se encontraron usuarios que coincidan con ${debouncedUsernameFilter || debouncedEmailFilter ? "la búsqueda" : "los filtros aplicados"
                                    }.`
                                    : "Aún no se han registrado usuarios en el sistema."}
                            </p>
                            {hasActiveFilters && (
                                <Button onClick={handleClearFilters} variant="outline">
                                    Limpiar filtros
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Usuario</TableHead>
                                            <TableHead>Contacto</TableHead>
                                            <TableHead>Roles</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {usuarios.map((usuario) => {
                                            const roleInfo = getRoleInfo(usuario)
                                            const RoleIcon = roleInfo.icon
                                            return (
                                                <TableRow key={usuario.id} className="hover:bg-gray-50">
                                                    <TableCell>
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-10 h-10 bg-gradient-to-br from-[#017d74]/20 to-[#015d54]/10 rounded-full flex items-center justify-center">
                                                                <span className="text-sm font-semibold text-[#017d74]">
                                                                    {usuario.name?.charAt(0)?.toUpperCase() || "U"}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-gray-900">{usuario.name}</div>
                                                                <div className="text-sm text-gray-500">@{usuario.username}</div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <div className="text-sm text-gray-900">{usuario.email}</div>
                                                            <div className="text-sm text-gray-500">{usuario.phone}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="outline" className={cn("font-medium", roleInfo.color)}>
                                                                <RoleIcon className="w-3 h-3 mr-1" />
                                                                {roleInfo.label}
                                                            </Badge>
                                                            {usuario.isDonator && (
                                                                <Badge variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
                                                                    <Heart className="w-3 h-3 mr-1" />
                                                                    Donador
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "font-medium",
                                                                usuario.deletedAt
                                                                    ? "bg-red-50 text-red-700 border-red-200"
                                                                    : "bg-green-50 text-green-700 border-green-200",
                                                            )}
                                                        >
                                                            {usuario.deletedAt ? "Eliminado" : "Activo"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-56">
                                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                                <DropdownMenuSeparator />
                                                                <Link href={`/dashboard/usuarios/${usuario.id}`}>
                                                                    <DropdownMenuItem className="cursor-pointer">
                                                                        <Eye className="mr-2 h-4 w-4" />
                                                                        Ver Detalle
                                                                    </DropdownMenuItem>
                                                                </Link>
                                                                <DropdownMenuSeparator />

                                                                {!usuario.deletedAt && (
                                                                    <>
                                                                        <DropdownMenuLabel className="text-xs font-normal text-gray-500">
                                                                            Roles Administrativos (Excluyentes)
                                                                        </DropdownMenuLabel>
                                                                        <DropdownMenuItem
                                                                            onClick={() => handleRoleToggle(usuario, "isSuperAdmin")}
                                                                            className="cursor-pointer"
                                                                        >
                                                                            <Crown className="mr-2 h-4 w-4" />
                                                                            {usuario.isSuperAdmin ? "Quitar SuperAdmin" : "Hacer SuperAdmin"}
                                                                            {usuario.isAdmin && !usuario.isSuperAdmin && (
                                                                                <span className="ml-2 text-xs text-orange-600">(Removerá Admin)</span>
                                                                            )}
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            onClick={() => handleRoleToggle(usuario, "isAdmin")}
                                                                            className="cursor-pointer"
                                                                        >
                                                                            <Shield className="mr-2 h-4 w-4" />
                                                                            {usuario.isAdmin ? "Quitar Admin" : "Hacer Admin"}
                                                                            {usuario.isSuperAdmin && !usuario.isAdmin && (
                                                                                <span className="ml-2 text-xs text-orange-600">(Removerá SuperAdmin)</span>
                                                                            )}
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuLabel className="text-xs font-normal text-gray-500">
                                                                            Otros Roles
                                                                        </DropdownMenuLabel>
                                                                        <DropdownMenuItem
                                                                            onClick={() => handleRoleToggle(usuario, "isDonator")}
                                                                            className="cursor-pointer"
                                                                        >
                                                                            <Heart className="mr-2 h-4 w-4" />
                                                                            {usuario.isDonator ? "Quitar" : "Hacer"} Donador
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuSeparator />
                                                                    </>
                                                                )}

                                                                {usuario.deletedAt ? (
                                                                    <AlertDialog>
                                                                        <AlertDialogTrigger asChild>
                                                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
                                                                                <RotateCcw className="mr-2 h-4 w-4" />
                                                                                Restaurar Usuario
                                                                            </DropdownMenuItem>
                                                                        </AlertDialogTrigger>
                                                                        <AlertDialogContent>
                                                                            <AlertDialogHeader>
                                                                                <AlertDialogTitle>¿Restaurar usuario?</AlertDialogTitle>
                                                                                <AlertDialogDescription>
                                                                                    ¿Estás seguro de que quieres restaurar a <strong>{usuario.name}</strong>? El
                                                                                    usuario volverá a tener acceso al sistema y será visible en la lista de
                                                                                    usuarios activos.
                                                                                </AlertDialogDescription>
                                                                            </AlertDialogHeader>
                                                                            <AlertDialogFooter>
                                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                                <AlertDialogAction
                                                                                    onClick={() => handleRestoreUser(usuario.id, usuario.name)}
                                                                                    className="bg-green-600 hover:bg-green-700"
                                                                                >
                                                                                    Restaurar
                                                                                </AlertDialogAction>
                                                                            </AlertDialogFooter>
                                                                        </AlertDialogContent>
                                                                    </AlertDialog>
                                                                ) : (
                                                                    <AlertDialog>
                                                                        <AlertDialogTrigger asChild>
                                                                            <DropdownMenuItem
                                                                                onSelect={(e) => e.preventDefault()}
                                                                                className="cursor-pointer text-red-600"
                                                                            >
                                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                                Eliminar Usuario
                                                                            </DropdownMenuItem>
                                                                        </AlertDialogTrigger>
                                                                        <AlertDialogContent>
                                                                            <AlertDialogHeader>
                                                                                <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
                                                                                <AlertDialogDescription>
                                                                                    Esta acción eliminará a <strong>{usuario.name}</strong> del sistema. El
                                                                                    usuario no podrá acceder hasta que sea restaurado.
                                                                                </AlertDialogDescription>
                                                                            </AlertDialogHeader>
                                                                            <AlertDialogFooter>
                                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                                <AlertDialogAction
                                                                                    onClick={() => handleDeleteUser(usuario.id, usuario.name)}
                                                                                    className="bg-red-600 hover:bg-red-700"
                                                                                >
                                                                                    Eliminar
                                                                                </AlertDialogAction>
                                                                            </AlertDialogFooter>
                                                                        </AlertDialogContent>
                                                                    </AlertDialog>
                                                                )}
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Paginación */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                                    <Button
                                        onClick={() => setPage((prev) => prev - 1)}
                                        disabled={page === 1 || loading}
                                        variant="outline"
                                        className="flex items-center space-x-2"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        <span>Anterior</span>
                                    </Button>

                                    <div className="flex items-center space-x-2">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum
                                            if (totalPages <= 5) {
                                                pageNum = i + 1
                                            } else if (page <= 3) {
                                                pageNum = i + 1
                                            } else if (page >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i
                                            } else {
                                                pageNum = page - 2 + i
                                            }

                                            return (
                                                <Button
                                                    key={pageNum}
                                                    variant={page === pageNum ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => setPage(pageNum)}
                                                    disabled={loading}
                                                    className={`w-10 h-10 p-0 ${page === pageNum ? "bg-[#017d74] hover:bg-[#015d54] text-white" : "hover:bg-gray-50"
                                                        }`}
                                                >
                                                    {pageNum}
                                                </Button>
                                            )
                                        })}
                                    </div>

                                    <Button
                                        onClick={() => setPage((prev) => prev + 1)}
                                        disabled={page === totalPages || loading}
                                        variant="outline"
                                        className="flex items-center space-x-2"
                                    >
                                        <span>Siguiente</span>
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}

                            <div className="text-center mt-4">
                                <span className="text-sm text-gray-600">
                                    Mostrando {Math.min((page - 1) * 15 + 1, totalUsers)} - {Math.min(page * 15, totalUsers)} de{" "}
                                    {totalUsers} usuarios
                                </span>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
