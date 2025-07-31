"use client"

import { useEffect, useState } from "react"
import { fetchDonacionesConUsuarios } from "../../app/utils/DonacionesHelper"
import type { IDonation } from "../../app/types"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Skeleton } from "../../components/ui/skeleton"
import {
    Gift,
    DollarSign,
    User,
    Calendar,
    CreditCard,
    CheckCircle,
    Clock,
    XCircle,
    AlertCircle,
    Filter,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Eye,
} from "lucide-react"
import { cn } from "../../lib/utils"
import Link from "next/link"

// Helper para configurar el estilo de los badges de estado
const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
        case "approved":
            return {
                label: "Aprobado",
                color: "bg-green-100 text-green-800 border-green-200",
                icon: CheckCircle,
            }
        case "pending":
            return {
                label: "Pendiente",
                color: "bg-yellow-100 text-yellow-800 border-yellow-200",
                icon: Clock,
            }
        case "rejected":
            return {
                label: "Rechazado",
                color: "bg-red-100 text-red-800 border-red-200",
                icon: XCircle,
            }
        case "in_process":
            return {
                label: "En Proceso",
                color: "bg-blue-100 text-blue-800 border-blue-200",
                icon: AlertCircle,
            }
        default:
            return {
                label: status,
                color: "bg-gray-100 text-gray-800 border-gray-200",
                icon: Clock,
            }
    }
}

export const DonacionesComponent = () => {
    const [donaciones, setDonaciones] = useState<IDonation[]>([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<"pending" | "in_process" | "approved" | "rejected" | "all">("all")
    const limit = 10

    useEffect(() => {
        const loadDonaciones = async () => {
            setLoading(true)
            try {
                const { donations, pages } = await fetchDonacionesConUsuarios(
                    page,
                    limit,
                    status === "all" ? undefined : status,
                )
                setDonaciones(donations)
                setTotalPages(pages)
            } catch (error) {
                console.error("Error al cargar donaciones:", error)
                setDonaciones([])
            } finally {
                setLoading(false)
            }
        }

        loadDonaciones()
    }, [page, status])

    const formatDate = (iso: string) => {
        try {
            return format(new Date(iso), "dd/MM/yyyy HH:mm")
        } catch {
            return iso
        }
    }

    const handleStatusChange = (value: string) => {
        setStatus(value as any)
        setPage(1) // Resetear página al cambiar filtro
    }

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages && !loading) {
            setPage(newPage)
        }
    }

    const handleViewDetail = (donacion: IDonation) => {
        // Aquí puedes implementar la lógica para ver el detalle
        // Por ejemplo, navegar a una página de detalle o abrir un modal
        console.log("Ver detalle de donación:", donacion)
        // Ejemplo de navegación:
        // router.push(`/donaciones/${donacion.id}`)
    }

    // Calcular estadísticas
    const stats = {
        total: donaciones.length,
        approved: donaciones.filter((d) => d.status === "approved").length,
        pending: donaciones.filter((d) => d.status === "pending").length,
        rejected: donaciones.filter((d) => d.status === "rejected").length,
        in_process: donaciones.filter((d) => d.status === "in_process").length,
    }

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#017d74] to-[#015d54] rounded-xl flex items-center justify-center shadow-lg">
                            <Gift className="w-5 h-5 text-white" />
                        </div>
                        Listado de Donaciones
                    </h1>
                    <p className="text-gray-600 mt-1">Gestiona y visualiza todas las donaciones del sistema.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total</p>
                            <p className="text-2xl font-bold text-gray-900">{loading ? "..." : stats.total}</p>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Gift className="w-6 h-6 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Aprobadas</p>
                            <p className="text-2xl font-bold text-green-600">{loading ? "..." : stats.approved}</p>
                        </div>
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pendientes</p>
                            <p className="text-2xl font-bold text-yellow-600">{loading ? "..." : stats.pending}</p>
                        </div>
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">En Proceso</p>
                            <p className="text-2xl font-bold text-blue-600">{loading ? "..." : stats.in_process}</p>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <AlertCircle className="w-6 h-6 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Rechazadas</p>
                            <p className="text-2xl font-bold text-red-600">{loading ? "..." : stats.rejected}</p>
                        </div>
                        <div className="p-2 bg-red-100 rounded-lg">
                            <XCircle className="w-6 h-6 text-red-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filtros */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="w-5 h-5 text-[#017d74]" />
                        Filtros
                    </CardTitle>
                    <CardDescription>Filtra las donaciones por estado</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                            Estado:
                        </label>
                        <Select value={status} onValueChange={handleStatusChange}>
                            <SelectTrigger className="w-full sm:w-64 border-gray-200 focus:border-[#017d74] focus:ring-[#017d74]">
                                <SelectValue placeholder="Seleccionar estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estados</SelectItem>
                                <SelectItem value="pending">Pendiente</SelectItem>
                                <SelectItem value="in_process">En Proceso</SelectItem>
                                <SelectItem value="approved">Aprobado</SelectItem>
                                <SelectItem value="rejected">Rechazado</SelectItem>
                            </SelectContent>
                        </Select>
                        {status !== "all" && (
                            <Button
                                variant="outline"
                                onClick={() => handleStatusChange("all")}
                                className="w-full sm:w-auto bg-transparent"
                            >
                                Limpiar filtro
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Lista de donaciones */}
            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-[#017d74]" />
                        Donaciones
                    </CardTitle>
                    <CardDescription>
                        {loading
                            ? "Cargando donaciones..."
                            : `Mostrando ${donaciones.length} donacion${donaciones.length !== 1 ? "es" : ""}`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Card key={i} className="p-4">
                                    <div className="flex items-center space-x-4">
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                        <div className="space-y-2 flex-1">
                                            <Skeleton className="h-4 w-[250px]" />
                                            <Skeleton className="h-4 w-[200px]" />
                                            <Skeleton className="h-4 w-[150px]" />
                                        </div>
                                        <Skeleton className="h-6 w-20" />
                                        <Skeleton className="h-8 w-24" />
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : donaciones.length === 0 ? (
                        <div className="text-center py-12">
                            <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                {status !== "all" ? "No se encontraron donaciones" : "No hay donaciones registradas"}
                            </h3>
                            <p className="text-gray-500 mb-4">
                                {status !== "all"
                                    ? "No hay donaciones que coincidan con el filtro seleccionado."
                                    : "Aún no se han registrado donaciones en el sistema."}
                            </p>
                            {status !== "all" && (
                                <Button variant="outline" onClick={() => handleStatusChange("all")} className="bg-transparent">
                                    Ver todas las donaciones
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {donaciones.map((don) => {
                                const statusConfig = getStatusConfig(don.status)
                                const StatusIcon = statusConfig.icon
                                return (
                                    <Card key={don.id} className="hover:shadow-md transition-shadow border-l-4 border-l-[#017d74]">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                                {/* Información principal */}
                                                <div className="flex-1 space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-[#017d74]/20 to-[#015d54]/10 rounded-full flex items-center justify-center">
                                                            <DollarSign className="w-5 h-5 text-[#017d74]" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-lg text-gray-900">
                                                                ${don.amount.toLocaleString()} {don.currencyId}
                                                            </h3>
                                                            <p className="text-sm text-gray-600">ID: {don.pagoId}</p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <CreditCard className="w-4 h-4 text-gray-500" />
                                                            <span className="text-gray-700">
                                                                <strong>Método:</strong> {don.paymentMethodId} ({don.paymentTypeId})
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-4 h-4 text-gray-500" />
                                                            <span className="text-gray-700">
                                                                <strong>Fecha:</strong> {formatDate(don.createdAt)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {don.statusDetail && (
                                                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                                            <strong>Detalle:</strong> {don.statusDetail}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Estado, usuario y acciones */}
                                                <div className="flex flex-col items-start lg:items-end gap-3">
                                                    <Badge variant="outline" className={cn("font-medium", statusConfig.color)}>
                                                        <StatusIcon className="w-3 h-3 mr-1" />
                                                        {statusConfig.label}
                                                    </Badge>

                                                    <div className="flex items-center gap-2 text-sm">
                                                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                                                            <User className="w-3 h-3 text-gray-600" />
                                                        </div>
                                                        <div className="text-right">
                                                            {don.user ? (
                                                                <div>
                                                                    <p className="font-medium text-gray-900">{don.user.name}</p>
                                                                    <p className="text-gray-600">{don.user.email}</p>
                                                                </div>
                                                            ) : (
                                                                <p className="text-gray-500 italic">No asignado</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Botón Ver Detalle */}
                                                    <div className="flex gap-2 mt-2">
                                                        <Link href={`/dashboard/donaciones/${don.id}`} className="flex items-center">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleViewDetail(don)}
                                                            className="flex items-center gap-2 hover:bg-[#017d74] hover:text-white transition-colors"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            Ver Detalle
                                                        </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    )}

                    {/* Paginación */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-8 pt-6 border-t">
                            <div className="text-sm text-gray-600">
                                Página {page} de {totalPages}
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page <= 1 || loading}
                                    className="flex items-center gap-1 bg-transparent"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Anterior
                                </Button>

                                <div className="flex items-center gap-1">
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
                                                onClick={() => handlePageChange(pageNum)}
                                                disabled={loading}
                                                className={`w-10 h-8 p-0 ${page === pageNum ? "bg-[#017d74] hover:bg-[#015d54] text-white" : "hover:bg-gray-50"
                                                    }`}
                                            >
                                                {pageNum}
                                            </Button>
                                        )
                                    })}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page >= totalPages || loading}
                                    className="flex items-center gap-1 bg-transparent"
                                >
                                    Siguiente
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Loading overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
                    <Card className="p-6">
                        <div className="flex items-center gap-3">
                            <Loader2 className="w-6 h-6 animate-spin text-[#017d74]" />
                            <span className="text-gray-700">Cargando donaciones...</span>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    )
}
