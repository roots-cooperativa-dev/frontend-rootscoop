"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { fetchDonationById } from "../../app/utils/DonacionesHelper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import {
    Gift,
    DollarSign,
    User,
    Mail,
    Phone,
    Calendar,
    CreditCard,
    Clock,
    XCircle,
    CheckCircle,
    AlertCircle,
    ArrowLeft,
    Loader2,
    Hash,
    MapPin,
} from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"

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
        default:
            return {
                label: status,
                color: "bg-gray-100 text-gray-800 border-gray-200",
                icon: Clock,
            }
    }
}

export const DetalleDonaciones = () => {
    const params = useParams()
    const id = params?.id
    const [donation, setDonation] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getDonation = async () => {
            if (!id) {
                setLoading(false)
                return
            }
            try {
                const data = await fetchDonationById(id as string)
                setDonation(data)
            } catch (error) {
                console.error("Error al cargar la donación:", error)
                setDonation(null) // Asegurarse de que la donación sea nula en caso de error
            } finally {
                setLoading(false)
            }
        }
        getDonation()
    }, [id])

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
                    <p className="text-gray-500">Cargando detalles de la donación...</p>
                </div>
            </div>
        )
    }

    if (!donation) {
        return (
            <div className="p-6 space-y-6">
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-red-600 mb-2">Donación no encontrada</h2>
                    <p className="text-gray-500 mb-4">La donación que buscas no existe o fue eliminada.</p>
                    <Link href="/dashboard/donaciones">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver a donaciones
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    const {
        id: donationId,
        pagoId,
        amount,
        status,
        statusDetail,
        currencyId,
        paymentTypeId,
        paymentMethodId,
        dateApproved,
        createdAt,
        user,
    } = donation

    const statusConfig = getStatusConfig(status)
    const StatusIcon = statusConfig.icon

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Link href="/dashboard/donaciones">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Volver
                            </Button>
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#017d74] to-[#015d54] rounded-xl flex items-center justify-center">
                            <Gift className="w-5 h-5 text-white" />
                        </div>
                        Detalle de Donación #{donationId.slice(-8)}
                    </h1>
                    <p className="text-gray-600 mt-1">Información completa de la donación y el donador.</p>
                </div>
            </div>

            {/* Donation Summary Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Resumen de la Donación
                    </CardTitle>
                    <CardDescription>Detalles principales de la transacción.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Hash className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-700">ID de Pago:</span>
                        <span className="text-gray-900 font-medium">{pagoId}</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-700">Monto:</span>
                        <span className="text-gray-900 font-bold">
                            ${amount} {currencyId}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <StatusIcon className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-700">Estado:</span>
                        <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <CreditCard className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-700">Método:</span>
                        <span className="text-gray-900">
                            {paymentMethodId} ({paymentTypeId})
                        </span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-700">Aprobado:</span>
                        <span className="text-gray-900">{new Date(dateApproved).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold text-gray-700">Creado:</span>
                        <span className="text-gray-900">{new Date(createdAt).toLocaleString()}</span>
                    </div>
                </CardContent>
            </Card>

            {/* User Details Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Detalles del Donador
                    </CardTitle>
                    <CardDescription>Información de contacto del usuario que realizó la donación.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} />
                            <AvatarFallback className="bg-[#017d74] text-white text-lg">
                                {getInitials(user?.name || "UN")}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-xl font-semibold text-gray-900">{user?.name || "Usuario Desconocido"}</p>
                            <p className="text-gray-600">@{user?.username || "N/A"}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span className="font-semibold text-gray-700">Email:</span>
                            <span className="text-gray-900">{user?.email || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span className="font-semibold text-gray-700">Teléfono:</span>
                            <span className="text-gray-900">{user?.phone || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="font-semibold text-gray-700">Nacimiento:</span>
                            <span className="text-gray-900">
                                {user?.birthdate ? new Date(user.birthdate).toLocaleDateString() : "N/A"}
                            </span>
                        </div>
                        {user?.address?.street && (
                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                <MapPin className="w-4 h-4 text-gray-500" />
                                <span className="font-semibold text-gray-700">Dirección:</span>
                                <span className="text-gray-900">{user.address.street}</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
