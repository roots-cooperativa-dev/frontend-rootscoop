"use client"

import { useEffect, useState } from "react"
import { fetchUsers, deleteUser } from "../../app/utils/UsuariosHelper"
import type { IUsuario } from "../../app/types"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Skeleton } from "../ui/skeleton"
import { Search, Users, ChevronLeft, ChevronRight, RefreshCw, Filter, UserCheck, Shield, User } from "lucide-react"
import { toast } from "sonner"

export const GestionUsuarios = () => {
    const [usuarios, setUsuarios] = useState<IUsuario[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [usernameFilter, setUsernameFilter] = useState("")
    const [emailFilter, setEmailFilter] = useState("")


    const fetchData = async () => {
        setLoading(true)
        const { users, pages } = await fetchUsers({
            page,
            limit: 10,
            username: usernameFilter || undefined,
            email: emailFilter || undefined,
        })
        setUsuarios(users)
        setTotalPages(pages)
        setLoading(false)
    }

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
        setPage(1)
        setTimeout(fetchData, 100)
    }
    const handleDeleteUser = async (userId: string) => {
        if (!confirm("¿Estás seguro que deseas eliminar este usuario?")) return;

        const success = await deleteUser(userId);
        if (success) {
            toast.success("Usuario eliminado correctamente");
            fetchData(); // refresca la lista
        } else {
            toast.error("Error al eliminar el usuario");
        }
    }

    const getRoleIcon = (usuario: IUsuario) => {
        if (usuario.isSuperAdmin) return <Shield className="h-4 w-4" />
        if (usuario.isAdmin) return <UserCheck className="h-4 w-4" />
        return <User className="h-4 w-4" />
    }

    const getRoleBadge = (usuario: IUsuario) => {
        if (usuario.isSuperAdmin) {
            return (
                <Badge variant="destructive" className="ml-2 bg-red-100 text-red-800 border-red-200">
                    SuperAdmin
                </Badge>
            )
        }
        if (usuario.isAdmin) {
            return (
                <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800 border-blue-200">
                    Admin
                </Badge>
            )
        }
        return (
            <Badge variant="outline" className="ml-2 bg-gray-50 text-gray-700 border-gray-200">
                Usuario
            </Badge>
        )
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Gestión de Usuarios</h1>
                        <p className="text-muted-foreground">Administra y busca usuarios del sistema</p>
                    </div>
                </div>
                <Button onClick={fetchData} disabled={loading} variant="outline" size="sm">
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Actualizar
                </Button>
            </div>

            {/* Filters */}
            <Card className="shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2 text-lg">
                        <Filter className="h-5 w-5 text-primary" />
                        <span>Filtros de Búsqueda</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                            <Input
                                placeholder="🔍 Buscar por username..."
                                value={usernameFilter}
                                onChange={(e) => setUsernameFilter(e.target.value)}
                                className="h-10"
                            />
                        </div>
                        <div className="flex-1">
                            <Input
                                placeholder="📧 Buscar por email..."
                                value={emailFilter}
                                onChange={(e) => setEmailFilter(e.target.value)}
                                className="h-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleSearch} disabled={loading} className="h-10 px-6">
                                <Search className="h-4 w-4 mr-2" />
                                Buscar
                            </Button>
                            <Button
                                onClick={handleClearFilters}
                                variant="outline"
                                disabled={loading}
                                className="h-10 px-4 bg-transparent"
                            >
                                Limpiar
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Content */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Card key={i} className="shadow-sm">
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4" />
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <Skeleton className="h-4 w-4/6" />
                                <Skeleton className="h-6 w-20" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : usuarios.length === 0 ? (
                <Card className="shadow-sm">
                    <CardContent className="text-center py-12">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Users className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron usuarios</h3>
                        <p className="text-gray-500 mb-4">Intenta ajustar los filtros de búsqueda</p>
                        <Button onClick={handleClearFilters} variant="outline">
                            Limpiar filtros
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Results Header */}
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Mostrando {usuarios.length} usuario{usuarios.length !== 1 ? "s" : ""}
                            {totalPages > 1 && ` • Página ${page} de ${totalPages}`}
                        </p>
                    </div>

                    {/* Users Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {usuarios.map((usuario) => (
                            <Card
                                key={usuario.id}
                                className="shadow-sm hover:shadow-md transition-shadow duration-200 border-l-4 border-l-primary/20"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-semibold text-primary">
                                                {usuario.name?.charAt(0)?.toUpperCase() || "U"}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-lg truncate">{usuario.name}</CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center space-x-2">
                                            <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                            <span className="text-gray-600">Username:</span>
                                            <span className="font-medium truncate">{usuario.username}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-lg">📧</span>
                                            <span className="text-gray-600">Email:</span>
                                            <span className="font-medium truncate">{usuario.email}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-lg">📱</span>
                                            <span className="text-gray-600">Teléfono:</span>
                                            <span className="font-medium">{usuario.phone}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                        <div className="flex items-center space-x-2">
                                            {getRoleIcon(usuario)}
                                            <span className="text-sm text-gray-600">Rol:</span>
                                        </div>
                                        {getRoleBadge(usuario)}
                                    </div>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDeleteUser(usuario.id)}
                                    >
                                        Eliminar
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <Card className="shadow-sm">
                    <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                            <Button
                                variant="outline"
                                disabled={page <= 1 || loading}
                                onClick={() => setPage((prev) => prev - 1)}
                                className="flex items-center space-x-2"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                <span>Anterior</span>
                            </Button>

                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-muted-foreground">
                                    Página {page} de {totalPages}
                                </span>
                            </div>

                            <Button
                                variant="outline"
                                disabled={page >= totalPages || loading}
                                onClick={() => setPage((prev) => prev + 1)}
                                className="flex items-center space-x-2"
                            >
                                <span>Siguiente</span>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
