"use client"

import { useEffect, useState } from "react"
import { fetchOrders, updateOrderStatus } from "../../app/utils/OrdenesHelper"
import type { IOrder } from "../../app/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import {
    ShoppingCart,
    Mail,
    Calendar,
    DollarSign,
    Package,
    Clock,
    CheckCircle,
    XCircle,
    Truck,
    Filter,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { toast } from "sonner"
import Link from "next/link"

const estados = ["active", "finalized", "cancelled", "processed"]

const getStatusConfig = (status: string) => {
    switch (status) {
        case "active":
            return {
                label: "Activa",
                color: "bg-blue-100 text-blue-800 border-blue-200",
                icon: Clock,
            }
        case "processed":
            return {
                label: "Procesada",
                color: "bg-yellow-100 text-yellow-800 border-yellow-200",
                icon: Truck,
            }
        case "finalized":
            return {
                label: "Finalizada",
                color: "bg-green-100 text-green-800 border-green-200",
                icon: CheckCircle,
            }
        case "cancelled":
            return {
                label: "Cancelada",
                color: "bg-red-100 text-red-800 border-red-200",
                icon: XCircle,
            }
        default:
            return {
                label: status,
                color: "bg-gray-100 text-gray-800 border-gray-200",
                icon: Clock,
            }
    }
}

export const GestionOrdenes = () => {
    const [orders, setOrders] = useState<IOrder[]>([])
    const [loading, setLoading] = useState(true)
    const [updatingId, setUpdatingId] = useState<string | null>(null)
    const [statusFilter, setStatusFilter] = useState<string>("all")

    // Estados para paginación
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalOrders, setTotalOrders] = useState(0)
    const [limit] = useState(10)

    // Calcular estadísticas localmente basadas en todas las órdenes cargadas
    const stats = {
        total: totalOrders,
        active: orders.filter((o) => o.status === "active").length,
        processed: orders.filter((o) => o.status === "processed").length,
        finalized: orders.filter((o) => o.status === "finalized").length,
        cancelled: orders.filter((o) => o.status === "cancelled").length,
    }

    const cargarOrdenes = async (page = currentPage, resetPage = false) => {
        setLoading(true)
        try {
            const response = await fetchOrders(
                resetPage ? 1 : page,
                limit,
                statusFilter !== "all" ? (statusFilter as any) : undefined,
            )

            setOrders(response.data)
            setTotalPages(Math.ceil(response.total / limit))
            setTotalOrders(response.total)

            if (resetPage) {
                setCurrentPage(1)
            }
        } catch (error) {
            console.error("Error al cargar órdenes:", error)
            toast.error("Error al cargar órdenes")
        } finally {
            setLoading(false)
        }
    }

    // Efecto para filtros (solo status)
    useEffect(() => {
        setCurrentPage(1)
        cargarOrdenes(1, true)
    }, [statusFilter])

    // Cargar datos iniciales
    useEffect(() => {
        cargarOrdenes(1, true)
    }, [])

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        setUpdatingId(orderId)
        try {
            await updateOrderStatus(orderId, newStatus)
            // Recargar la página actual para mantener la paginación
            await cargarOrdenes(currentPage, false)
            // Mostrar toast de éxito con sonner
            toast.success("Estado actualizado", {
                description: `La orden #${orderId.slice(-8)} ha sido actualizada a ${getStatusConfig(newStatus).label}`,
                duration: 3000,
            })
        } catch (error) {
            console.error("Error al actualizar el estado:", error)
            // Mostrar toast de error con sonner
            toast.error("Error al actualizar", {
                description: "No se pudo actualizar el estado de la orden. Intenta nuevamente.",
                duration: 4000,
            })
        } finally {
            setUpdatingId(null)
        }
    }

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages && !loading) {
            setCurrentPage(page)
            window.scrollTo({ top: 0, behavior: "smooth" })
        }
    }

    const limpiarFiltros = () => {
        setStatusFilter("all")
        setCurrentPage(1)
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const hasActiveFilters = statusFilter !== "all"

    if (loading && currentPage === 1) {
        return (
            <div className="p-6">
                <div className="flex justify-center items-center py-20">
                    <div className="text-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#017d74] mx-auto"></div>
                        <p className="text-gray-500">Cargando órdenes...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <ShoppingCart className="w-8 h-8 text-[#017d74]" />
                        Gestión de Órdenes
                    </h2>
                    <p className="text-gray-600 mt-1">Administra y supervisa todas las órdenes del sistema</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Órdenes</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <div className="p-2 bg-gray-100 rounded-lg">
                                <ShoppingCart className="w-6 h-6 text-gray-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Activas</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
                            </div>
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Clock className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Procesadas</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.processed}</p>
                            </div>
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Truck className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Finalizadas</p>
                                <p className="text-2xl font-bold text-green-600">{stats.finalized}</p>
                            </div>
                            <div className="p-2 bg-green-100 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Canceladas</p>
                                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                            </div>
                            <div className="p-2 bg-red-100 rounded-lg">
                                <XCircle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex gap-2 flex-wrap">
                            <Button
                                variant={statusFilter === "all" ? "default" : "outline"}
                                onClick={() => setStatusFilter("all")}
                                size="sm"
                                className={statusFilter === "all" ? "bg-[#017d74] hover:bg-[#015d54]" : ""}
                            >
                                Todas
                            </Button>
                            {estados.map((status) => {
                                const config = getStatusConfig(status)
                                const Icon = config.icon
                                return (
                                    <Button
                                        key={status}
                                        variant={statusFilter === status ? "default" : "outline"}
                                        onClick={() => setStatusFilter(status)}
                                        size="sm"
                                        className={
                                            statusFilter === status
                                                ? status === "active"
                                                    ? "bg-blue-600 hover:bg-blue-700"
                                                    : status === "processed"
                                                        ? "bg-yellow-600 hover:bg-yellow-700"
                                                        : status === "finalized"
                                                            ? "bg-green-600 hover:bg-green-700"
                                                            : "bg-red-600 hover:bg-red-700"
                                                : ""
                                        }
                                    >
                                        <Icon className="w-3 h-3 mr-1" />
                                        {config.label}
                                    </Button>
                                )
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Información de resultados */}
            {(hasActiveFilters || totalOrders > 0) && (
                <div className="p-4 bg-[#017d74]/5 border border-[#017d74]/20 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="bg-[#017d74] text-white">
                                {loading ? "Buscando..." : `${totalOrders} órdenes encontradas`}
                            </Badge>
                            {statusFilter !== "all" && (
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                    {getStatusConfig(statusFilter).label}
                                </Badge>
                            )}
                        </div>
                        {totalPages > 1 && (
                            <span className="text-sm text-gray-600">
                                Página {currentPage} de {totalPages}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Results info */}
            {hasActiveFilters && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Mostrando {orders.length} de {totalOrders} órdenes
                    </p>
                    <Button variant="ghost" size="sm" onClick={limpiarFiltros} className="text-gray-500 hover:text-gray-700">
                        Limpiar filtros
                    </Button>
                </div>
            )}

            {/* Orders Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Lista de Órdenes
                    </CardTitle>
                    <CardDescription>
                        {loading
                            ? "Cargando órdenes..."
                            : `${orders.length} orden${orders.length !== 1 ? "es" : ""} encontrada${orders.length !== 1 ? "s" : ""}${totalPages > 1 ? ` de ${totalOrders} totales` : ""
                            }`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {orders.length === 0 && !loading ? (
                        <div className="text-center py-12">
                            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                {hasActiveFilters ? "No se encontraron órdenes" : "No hay órdenes disponibles"}
                            </h3>
                            <p className="text-gray-500">
                                {hasActiveFilters
                                    ? "No se encontraron órdenes que coincidan con los filtros aplicados."
                                    : "Aún no se han registrado órdenes en el sistema."}
                            </p>
                            {hasActiveFilters && (
                                <Button variant="outline" onClick={limpiarFiltros} className="mt-4 bg-transparent">
                                    Limpiar filtros
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Orden</TableHead>
                                            <TableHead>Cliente</TableHead>
                                            <TableHead>Estado</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Productos</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orders.map((order) => {
                                            const statusConfig = getStatusConfig(order.status)
                                            const StatusIcon = statusConfig.icon
                                            return (
                                                <TableRow key={order.id} className="hover:bg-gray-50">
                                                    <TableCell>
                                                        <div className="space-y-1">
                                                            <p className="font-medium text-gray-900">#{order.id.slice(-8)}</p>
                                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                                <Calendar className="w-3 h-3" />
                                                                {new Date(order.date).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarImage
                                                                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${order.user.name}`}
                                                                />
                                                                <AvatarFallback className="bg-[#017d74] text-white text-xs">
                                                                    {getInitials(order.user.name)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <p className="font-medium text-gray-900 text-sm">{order.user.name}</p>
                                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                                    <Mail className="w-3 h-3" />
                                                                    {order.user.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-2">
                                                            <Badge variant="outline" className={statusConfig.color}>
                                                                <StatusIcon className="w-3 h-3 mr-1" />
                                                                {statusConfig.label}
                                                            </Badge>
                                                            <Select
                                                                value={order.status}
                                                                onValueChange={(newStatus) => handleStatusChange(order.id, newStatus)}
                                                                disabled={updatingId === order.id}
                                                            >
                                                                <SelectTrigger className="w-32 h-8 text-xs">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {estados.map((status) => {
                                                                        const config = getStatusConfig(status)
                                                                        const Icon = config.icon
                                                                        return (
                                                                            <SelectItem key={status} value={status}>
                                                                                <div className="flex items-center gap-2">
                                                                                    <Icon className="w-3 h-3" />
                                                                                    {config.label}
                                                                                </div>
                                                                            </SelectItem>
                                                                        )
                                                                    })}
                                                                </SelectContent>
                                                            </Select>
                                                            {updatingId === order.id && (
                                                                <div className="flex items-center gap-1 text-xs text-blue-600">
                                                                    <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600"></div>
                                                                    Actualizando...
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-1 font-semibold text-[#017d74]">
                                                            <DollarSign className="w-4 h-4" />
                                                            {order.orderDetail.total}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="space-y-2 max-w-xs">
                                                            {order.orderDetail.products.slice(0, 2).map((product) => (
                                                                <div key={product.id} className="text-sm">
                                                                    <div className="flex items-center gap-1">
                                                                        <Package className="w-3 h-3 text-gray-400" />
                                                                        <span className="font-medium">{product.name}</span>
                                                                        {product.isDeleted && (
                                                                            <Badge variant="destructive" className="text-xs">
                                                                                Eliminado
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                    {product.sizes.slice(0, 1).map((size) => (
                                                                        <div key={size.id} className="text-xs text-gray-500 ml-4">
                                                                            {size.size} - ${size.price}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ))}
                                                            {order.orderDetail.products.length > 2 && (
                                                                <p className="text-xs text-gray-500">
                                                                    +{order.orderDetail.products.length - 2} productos más
                                                                </p>
                                                            )}
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
                                                                <Link href={`/dashboard/ordenes/${order.id}`}>
                                                                    <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                                                                </Link>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleStatusChange(order.id, "cancelled")}
                                                                    disabled={updatingId === order.id || order.status === "cancelled"}
                                                                    className="text-red-600"
                                                                >
                                                                    Cancelar orden
                                                                </DropdownMenuItem>
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
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1 || loading}
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
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i
                                            } else {
                                                pageNum = currentPage - 2 + i
                                            }

                                            return (
                                                <Button
                                                    key={pageNum}
                                                    variant={currentPage === pageNum ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => handlePageChange(pageNum)}
                                                    disabled={loading}
                                                    className={`w-10 h-10 p-0 ${currentPage === pageNum ? "bg-[#017d74] hover:bg-[#015d54] text-white" : "hover:bg-gray-50"
                                                        }`}
                                                >
                                                    {pageNum}
                                                </Button>
                                            )
                                        })}
                                    </div>

                                    <Button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages || loading}
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
                                    Mostrando {Math.min((currentPage - 1) * limit + 1, totalOrders)} -{" "}
                                    {Math.min(currentPage * limit, totalOrders)} de {totalOrders} órdenes
                                </span>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
