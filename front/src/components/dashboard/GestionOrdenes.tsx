"use client"

import { useEffect, useState } from "react"
import { fetchOrders, updateOrderStatus } from "../../app/utils/OrdenesHelper"
import type { IOrder } from "../../app/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import {
    ShoppingCart,
    Search,
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
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { toast } from "sonner"

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
    const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([])
    const [loading, setLoading] = useState(true)
    const [updatingId, setUpdatingId] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")

    useEffect(() => {
        const cargarOrdenes = async () => {
            try {
                const { data } = await fetchOrders()
                setOrders(data)
                setFilteredOrders(data)
            } catch (error) {
                console.error("Error al cargar órdenes:", error)
            } finally {
                setLoading(false)
            }
        }
        cargarOrdenes()
    }, [])

    useEffect(() => {
        let filtered = orders.filter(
            (order) =>
                order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.user.email.toLowerCase().includes(searchTerm.toLowerCase()),
        )

        if (statusFilter !== "all") {
            filtered = filtered.filter((order) => order.status === statusFilter)
        }

        setFilteredOrders(filtered)
    }, [searchTerm, statusFilter, orders])

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        setUpdatingId(orderId)
        try {
            await updateOrderStatus(orderId, newStatus)
            // Actualizar localmente el estado
            setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))

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

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const totalOrders = orders.length
    const activeOrders = orders.filter((o) => o.status === "active").length
    const processedOrders = orders.filter((o) => o.status === "processed").length
    const finalizedOrders = orders.filter((o) => o.status === "finalized").length
    const cancelledOrders = orders.filter((o) => o.status === "cancelled").length

    if (loading) {
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
                                <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
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
                                <p className="text-2xl font-bold text-blue-600">{activeOrders}</p>
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
                                <p className="text-2xl font-bold text-yellow-600">{processedOrders}</p>
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
                                <p className="text-2xl font-bold text-green-600">{finalizedOrders}</p>
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
                                <p className="text-2xl font-bold text-red-600">{cancelledOrders}</p>
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
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Buscar por ID, usuario o email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
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

            {/* Results info */}
            {searchTerm || statusFilter !== "all" ? (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Mostrando {filteredOrders.length} de {orders.length} órdenes
                    </p>
                    {(searchTerm || statusFilter !== "all") && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setSearchTerm("")
                                setStatusFilter("all")
                            }}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            Limpiar filtros
                        </Button>
                    )}
                </div>
            ) : null}

            {/* Orders Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Lista de Órdenes
                    </CardTitle>
                    <CardDescription>
                        {filteredOrders.length} orden{filteredOrders.length !== 1 ? "es" : ""} encontrada
                        {filteredOrders.length !== 1 ? "s" : ""}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-12">
                            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">No se encontraron órdenes</h3>
                            <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
                        </div>
                    ) : (
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
                                    {filteredOrders.map((order) => {
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
                                                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${order.user.name}`} />
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
                                                            <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                                                            <DropdownMenuItem>Imprimir orden</DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem>Contactar cliente</DropdownMenuItem>
                                                            <DropdownMenuItem className="text-red-600">Cancelar orden</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
