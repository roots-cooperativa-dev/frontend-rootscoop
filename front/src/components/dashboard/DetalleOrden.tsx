"use client"

import { useEffect, useState } from "react"
import { fetchOrderById } from "../../app/utils/OrdenesHelper"
import type { IOrderById } from "../../app/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import {
    AlertCircle,
    ArrowLeft,
    ShoppingCart,
    Calendar,
    DollarSign,
    User,
    Mail,
    Phone,
    Package,
    CheckCircle,
    XCircle,
    Clock,
    Truck,
} from "lucide-react"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import Link from "next/link"
import { Loader2 } from "lucide-react" // Import Loader2

interface Props {
    OrdenID: string
}

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

export const DetalleOrden = ({ OrdenID }: Props) => {
    const [orden, setOrden] = useState<IOrderById | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOrden = async () => {
            try {
                const data = await fetchOrderById(OrdenID)
                setOrden(data)
            } catch (error) {
                console.error("Error al cargar la orden:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchOrden()
    }, [OrdenID])

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word.charAt(0))
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin text-[#017d74] mx-auto" />
                    <p className="text-gray-500">Cargando detalles de la orden...</p>
                </div>
            </div>
        )
    }

    if (!orden) {
        return (
            <div className="p-6 space-y-6">
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-red-600 mb-2">Orden no encontrada</h2>
                    <p className="text-gray-500 mb-4">La orden que buscas no existe o fue eliminada.</p>
                    <Link href="/dashboard/ordenes">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver a órdenes
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    const statusConfig = getStatusConfig(orden.status)
    const StatusIcon = statusConfig.icon

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Link href="/dashboard/ordenes">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Volver
                            </Button>
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#017d74] to-[#015d54] rounded-xl flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-white" />
                        </div>
                        Detalle de Orden #{orden.id.slice(-8)}
                    </h1>
                    <p className="text-gray-600 mt-1">Información completa de la orden y sus productos</p>
                </div>
            </div>

            {/* Order Summary Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        Resumen de la Orden
                    </CardTitle>
                    <CardDescription>Detalles principales de la orden</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <span className="font-semibold text-gray-700">ID:</span>
                        <span className="text-gray-900 font-medium">{orden.id}</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <StatusIcon className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-700">Estado:</span>
                        <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-700">Fecha:</span>
                        <span className="text-gray-900">{new Date(orden.date).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-700">Total:</span>
                        <span className="text-gray-900 font-bold">${orden.orderDetail.total}</span>
                    </div>
                </CardContent>
            </Card>

            {/* User Details Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Detalles del Cliente
                    </CardTitle>
                    <CardDescription>Información de contacto del cliente</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${orden.user.name}`} />
                            <AvatarFallback className="bg-[#017d74] text-white text-lg">
                                {getInitials(orden.user.name)}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-xl font-semibold text-gray-900">{orden.user.name}</p>
                            <p className="text-gray-600">@{orden.user.username}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span className="font-semibold text-gray-700">Email:</span>
                            <span className="text-gray-900">{orden.user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span className="font-semibold text-gray-700">Teléfono:</span>
                            <span className="text-gray-900">{orden.user.phone}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Products List Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Productos en la Orden
                    </CardTitle>
                    <CardDescription>Lista de todos los productos incluidos en esta orden</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {orden.orderDetail.products.map((prod) => (
                        <div key={prod.id} className="p-4 border rounded-lg bg-gray-50 shadow-sm space-y-3">
                            <div className="flex items-center gap-2">
                                <Package className="w-5 h-5 text-[#017d74]" />
                                <h3 className="font-semibold text-lg text-gray-900">{prod.name}</h3>
                                {prod.isDeleted && (
                                    <Badge variant="destructive" className="ml-auto">
                                        Eliminado
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm text-gray-700">{prod.details}</p>
                            <div className="space-y-1">
                                {prod.sizes.map((s) => (
                                    <div key={s.id} className="flex items-center gap-2 text-sm text-gray-600">
                                        <span className="font-medium">Talle:</span> {s.size} |<span className="font-medium">Precio:</span> $
                                        {s.price} |<span className="font-medium">Stock:</span> {s.stock}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
