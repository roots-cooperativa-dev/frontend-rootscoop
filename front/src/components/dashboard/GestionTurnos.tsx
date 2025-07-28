"use client"

import { useEffect, useState } from "react"
import { fetchAllAppointments, updateAppointmentStatus } from "../../app/utils/TurnosHelper"
import type { IAppointmentsPaginatedResponse } from "@/src/app/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
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
} from "../../components/ui/alert-dialog"
import {
    Calendar,
    Clock,
    Mail,
    Phone,
    MapPin,
    Users,
    FileText,
    CheckCircle,
    XCircle,
    Ban,
    Filter,
    Loader2,
    Building,
    ClipboardList,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "../../lib/utils"

const statusOptions = ["pending", "approved", "rejected", "cancelled", "completed"] as const

const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
        case "pending":
            return {
                label: "Pendiente",
                color: "bg-yellow-100 text-yellow-800 border-yellow-200",
                icon: Clock,
            }
        case "approved":
            return {
                label: "Aprobado",
                color: "bg-green-100 text-green-800 border-green-200",
                icon: CheckCircle,
            }
        case "rejected":
            return {
                label: "Rechazado",
                color: "bg-red-100 text-red-800 border-red-200",
                icon: XCircle,
            }
        case "cancelled":
            return {
                label: "Cancelado",
                color: "bg-gray-100 text-gray-800 border-gray-200",
                icon: Ban,
            }
        case "completed":
            return {
                label: "Completado",
                color: "bg-blue-100 text-blue-800 border-blue-200",
                icon: CheckCircle,
            }
        default:
            return {
                label: status,
                color: "bg-blue-100 text-blue-800 border-blue-200",
                icon: Clock,
            }
    }
}

const getActionConfig = (action: string) => {
    switch (action) {
        case "approved":
            return {
                label: "Aprobar",
                color: "bg-green-600 hover:bg-green-700",
                icon: CheckCircle,
                description: "aprobar",
            }
        case "rejected":
            return {
                label: "Rechazar",
                color: "bg-red-600 hover:bg-red-700",
                icon: XCircle,
                description: "rechazar",
            }
        case "cancelled":
            return {
                label: "Cancelar",
                color: "bg-gray-600 hover:bg-gray-700",
                icon: Ban,
                description: "cancelar",
            }
        case "completed":
            return {
                label: "Completar",
                color: "bg-blue-600 hover:bg-blue-700",
                icon: CheckCircle,
                description: "completar",
            }
        default:
            return {
                label: action,
                color: "bg-blue-600 hover:bg-blue-700",
                icon: Clock,
                description: action,
            }
    }
}

export const GestionTurnos = () => {
    const [appointmentsData, setAppointmentsData] = useState<IAppointmentsPaginatedResponse>()
    const [status, setStatus] = useState<"pending" | "approved" | "rejected" | "cancelled" | "completed" | undefined>()
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [updatingId, setUpdatingId] = useState<string | null>(null)

    const fetchData = async () => {
        setLoading(true)
        try {
            const data = await fetchAllAppointments({ status, page, limit: 3 })
            setAppointmentsData(data)
        } catch (error: any) {
            // Si es un 404, significa que no hay turnos, no es un error real
            if (error?.status === 404 || error?.response?.status === 404) {
                setAppointmentsData({
                    data: [],
                    page: 1,
                    pages: 1,
                    total: 0,
                    limit: 10,
                })
            } else {
                toast.error("Error al cargar los turnos")
                setAppointmentsData(undefined)
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [status, page])

    const handleStatusChange = async (
        id: string,
        newStatus: "approved" | "rejected" | "cancelled" | "completed",
        appointmentInfo: { userName: string; visitTitle: string },
    ) => {
        setUpdatingId(id)
        try {
            await updateAppointmentStatus(id, newStatus)
            toast.success(`Turno ${getActionConfig(newStatus).description} correctamente`, {
                description: `El turno de ${appointmentInfo.userName} para ${appointmentInfo.visitTitle} ha sido ${getActionConfig(newStatus).description}.`,
            })
            await fetchData()
        } catch (error) {
            toast.error("Error al actualizar el estado del turno")
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

    // Stats calculations
    const totalAppointments = appointmentsData?.total || 0
    const pendingCount = appointmentsData?.data.filter((a) => a.status === "pending").length || 0
    const approvedCount = appointmentsData?.data.filter((a) => a.status === "approved").length || 0
    const rejectedCount = appointmentsData?.data.filter((a) => a.status === "rejected").length || 0
    const completedCount = appointmentsData?.data.filter((a) => a.status === "completed").length || 0

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#017d74] to-[#015d54] rounded-xl flex items-center justify-center">
                            <ClipboardList className="w-5 h-5 text-white" />
                        </div>
                        Gestión de Turnos
                    </h1>
                    <p className="text-gray-600 mt-1">Administra y supervisa todas las citas y turnos del sistema</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Turnos</p>
                            <p className="text-2xl font-bold text-gray-900">{totalAppointments}</p>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <ClipboardList className="w-6 h-6 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pendientes</p>
                            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                        </div>
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Aprobados</p>
                            <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
                        </div>
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Rechazados</p>
                            <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
                        </div>
                        <div className="p-2 bg-red-100 rounded-lg">
                            <XCircle className="w-6 h-6 text-red-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Completados</p>
                            <p className="text-2xl font-bold text-blue-600">{completedCount}</p>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        <Filter className="w-5 h-5 text-gray-500" />
                        <Select
                            value={status || "all"}
                            onValueChange={(value) => {
                                setStatus(value === "all" ? undefined : (value as any))
                                setPage(1)
                            }}
                        >
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Filtrar por estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estados</SelectItem>
                                {statusOptions.map((s) => (
                                    <SelectItem key={s} value={s}>
                                        {getStatusConfig(s).label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {status && (
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    setStatus(undefined)
                                    setPage(1)
                                }}
                                className="text-gray-500"
                            >
                                Limpiar filtro
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Appointments List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ClipboardList className="w-5 h-5" />
                        Lista de Turnos
                    </CardTitle>
                    <CardDescription>
                        {status ? (
                            <>
                                Mostrando {appointmentsData?.data.length || 0} turno{appointmentsData?.data.length !== 1 ? "s" : ""}{" "}
                                <Badge variant="outline" className={getStatusConfig(status).color}>
                                    {getStatusConfig(status).label}
                                </Badge>
                                {appointmentsData?.total && (
                                    <span className="text-gray-500 ml-2">
                                        de {appointmentsData.total} total{appointmentsData.total !== 1 ? "es" : ""}
                                    </span>
                                )}
                            </>
                        ) : (
                            <>
                                {appointmentsData?.data.length || 0} turno{appointmentsData?.data.length !== 1 ? "s" : ""} encontrado
                                {appointmentsData?.data.length !== 1 ? "s" : ""}
                            </>
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-[#017d74] mb-4" />
                            <p className="text-gray-500">Cargando turnos...</p>
                        </div>
                    ) : !appointmentsData?.data.length ? (
                        <div className="text-center py-12">
                            <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            {status ? (
                                <>
                                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                        No hay turnos {getStatusConfig(status).label.toLowerCase()}s
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        No se encontraron turnos con estado "{getStatusConfig(status).label}" en este momento.
                                    </p>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setStatus(undefined)
                                            setPage(1)
                                        }}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        Ver todos los turnos
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No se encontraron turnos</h3>
                                    <p className="text-gray-500">No hay turnos registrados en el sistema en este momento.</p>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {appointmentsData.data.map((appt) => {
                                const statusConfig = getStatusConfig(appt.status)
                                const StatusIcon = statusConfig.icon
                                return (
                                    <Card key={appt.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                                {/* User Info */}
                                                <div className="flex items-start gap-4 flex-1">
                                                    <Avatar className="h-12 w-12">
                                                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${appt.user.name}`} />
                                                        <AvatarFallback className="bg-[#017d74] text-white">
                                                            {getInitials(appt.user.name)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <h3 className="text-lg font-semibold text-gray-900">{appt.user.name}</h3>
                                                            <span className="text-gray-500">@{appt.user.username}</span>
                                                            <Badge variant="outline" className={statusConfig.color}>
                                                                <StatusIcon className="w-3 h-3 mr-1" />
                                                                {statusConfig.label}
                                                            </Badge>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                                                            <div className="flex items-center gap-2">
                                                                <Mail className="w-4 h-4 text-gray-400" />
                                                                {appt.user.email}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Phone className="w-4 h-4 text-gray-400" />
                                                                {appt.user.phone}
                                                            </div>
                                                            {appt.user.address && (
                                                                <div className="flex items-center gap-2 md:col-span-2">
                                                                    <MapPin className="w-4 h-4 text-gray-400" />
                                                                    {appt.user.address.street}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Appointment Details */}
                                                <div className="lg:w-80 space-y-3">
                                                    <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Building className="w-4 h-4 text-gray-500" />
                                                            <span className="font-medium">{appt.visitSlot.visit.title}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Calendar className="w-4 h-4 text-gray-400" />
                                                            {appt.visitSlot.date}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Clock className="w-4 h-4 text-gray-400" />
                                                            {appt.visitSlot.startTime} - {appt.visitSlot.endTime}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Users className="w-4 h-4 text-gray-400" />
                                                            {appt.numberOfPeople} persona{appt.numberOfPeople !== 1 ? "s" : ""}
                                                        </div>
                                                        {appt.description && (
                                                            <div className="flex items-start gap-2 text-sm text-gray-600">
                                                                <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                                                                <span className="flex-1">{appt.description}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Action Buttons */}
                                                    {appt.status === "pending" && (
                                                        <div className="flex flex-wrap gap-2">
                                                            {["approved", "rejected", "cancelled"].map((action) => {
                                                                const actionConfig = getActionConfig(action)
                                                                const ActionIcon = actionConfig.icon
                                                                return (
                                                                    <AlertDialog key={action}>
                                                                        <AlertDialogTrigger asChild>
                                                                            <Button
                                                                                size="sm"
                                                                                className={cn("text-white", actionConfig.color)}
                                                                                disabled={updatingId === appt.id}
                                                                            >
                                                                                {updatingId === appt.id ? (
                                                                                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                                                                ) : (
                                                                                    <ActionIcon className="w-4 h-4 mr-1" />
                                                                                )}
                                                                                {actionConfig.label}
                                                                            </Button>
                                                                        </AlertDialogTrigger>
                                                                        <AlertDialogContent>
                                                                            <AlertDialogHeader>
                                                                                <AlertDialogTitle>¿Confirmar {actionConfig.description}?</AlertDialogTitle>
                                                                                <AlertDialogDescription>
                                                                                    ¿Estás seguro de que deseas {actionConfig.description} el turno de{" "}
                                                                                    <strong>{appt.user.name}</strong> para{" "}
                                                                                    <strong>{appt.visitSlot.visit.title}</strong> el día{" "}
                                                                                    <strong>{appt.visitSlot.date}</strong>?
                                                                                    <br />
                                                                                    <br />
                                                                                    Esta acción no se puede deshacer.
                                                                                </AlertDialogDescription>
                                                                            </AlertDialogHeader>
                                                                            <AlertDialogFooter>
                                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                                <AlertDialogAction
                                                                                    onClick={() =>
                                                                                        handleStatusChange(appt.id, action as any, {
                                                                                            userName: appt.user.name,
                                                                                            visitTitle: appt.visitSlot.visit.title,
                                                                                        })
                                                                                    }
                                                                                    className={actionConfig.color}
                                                                                >
                                                                                    {actionConfig.label}
                                                                                </AlertDialogAction>
                                                                            </AlertDialogFooter>
                                                                        </AlertDialogContent>
                                                                    </AlertDialog>
                                                                )
                                                            })}
                                                        </div>
                                                    )}
                                                    {appt.status === "approved" && (
                                                        <div className="flex flex-wrap gap-2">
                                                            {["completed", "cancelled"].map((action) => {
                                                                const actionConfig = getActionConfig(action)
                                                                const ActionIcon = actionConfig.icon
                                                                return (
                                                                    <AlertDialog key={action}>
                                                                        <AlertDialogTrigger asChild>
                                                                            <Button
                                                                                size="sm"
                                                                                className={cn("text-white", actionConfig.color)}
                                                                                disabled={updatingId === appt.id}
                                                                            >
                                                                                {updatingId === appt.id ? (
                                                                                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                                                                ) : (
                                                                                    <ActionIcon className="w-4 h-4 mr-1" />
                                                                                )}
                                                                                {actionConfig.label}
                                                                            </Button>
                                                                        </AlertDialogTrigger>
                                                                        <AlertDialogContent>
                                                                            <AlertDialogHeader>
                                                                                <AlertDialogTitle>¿Confirmar {actionConfig.description}?</AlertDialogTitle>
                                                                                <AlertDialogDescription>
                                                                                    ¿Estás seguro de que deseas {actionConfig.description} el turno de{" "}
                                                                                    <strong>{appt.user.name}</strong> para{" "}
                                                                                    <strong>{appt.visitSlot.visit.title}</strong> el día{" "}
                                                                                    <strong>{appt.visitSlot.date}</strong>?
                                                                                    <br />
                                                                                    <br />
                                                                                    Esta acción no se puede deshacer.
                                                                                </AlertDialogDescription>
                                                                            </AlertDialogHeader>
                                                                            <AlertDialogFooter>
                                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                                <AlertDialogAction
                                                                                    onClick={() =>
                                                                                        handleStatusChange(appt.id, action as any, {
                                                                                            userName: appt.user.name,
                                                                                            visitTitle: appt.visitSlot.visit.title,
                                                                                        })
                                                                                    }
                                                                                    className={actionConfig.color}
                                                                                >
                                                                                    {actionConfig.label}
                                                                                </AlertDialogAction>
                                                                            </AlertDialogFooter>
                                                                        </AlertDialogContent>
                                                                    </AlertDialog>
                                                                )
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {appointmentsData && appointmentsData.pages > 1 && (
                        <div className="flex justify-between items-center mt-6">
                            <Button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page <= 1} variant="outline">
                                Anterior
                            </Button>
                            <span className="text-sm text-gray-600">
                                Página {appointmentsData.page} de {appointmentsData.pages}
                            </span>
                            <Button
                                onClick={() => setPage((prev) => Math.min(prev + 1, appointmentsData.pages))}
                                disabled={page >= appointmentsData.pages}
                                variant="outline"
                            >
                                Siguiente
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
