"use client"

import { useEffect, useState } from "react"
import { fetchDonationsWithUsers } from "../../app/utils/DonacionesHelper"
import { Input } from "../../components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import {
    Gift,
    DollarSign,
    User,
    CheckCircle,
    Clock,
    XCircle,
    Filter,
    Search,
    Calendar,
    Loader2,
    CreditCard,
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
        default:
            return {
                label: status,
                color: "bg-gray-100 text-gray-800 border-gray-200",
                icon: Clock,
            }
    }
}

export const DonacionesComponent = () => {
    const [donations, setDonations] = useState<any[]>([])
    const [filtered, setFiltered] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Filtros
    const [searchUser, setSearchUser] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [order, setOrder] = useState<"desc" | "asc">("desc")

    useEffect(() => {
        const loadDonations = async () => {
            setLoading(true)
            try {
                const data = await fetchDonationsWithUsers()
                setDonations(data)
                setFiltered(data)
            } catch (error) {
                console.error("Error al cargar donaciones:", error)
                // Puedes añadir un toast de error aquí si lo deseas
            } finally {
                setLoading(false)
            }
        }
        loadDonations()
    }, [])

    useEffect(() => {
        let result = [...donations]

        if (searchUser) {
            result = result.filter((d) => d.user?.name?.toLowerCase().includes(searchUser.toLowerCase()))
        }

        if (statusFilter !== "all") {
            result = result.filter((d) => d.status === statusFilter)
        }

        result.sort((a, b) => {
            const dateA = new Date(a.dateApproved).getTime()
            const dateB = new Date(b.dateApproved).getTime()
            return order === "desc" ? dateB - dateA : dateA - dateB
        })

        setFiltered(result)
    }, [searchUser, statusFilter, order, donations])

    const clearFilters = () => {
        setSearchUser("")
        setStatusFilter("all")
        setOrder("desc")
    }

    // Calcular estadísticas
    const totalDonations = donations.length
    const approvedDonations = donations.filter((d) => d.status === "approved").length
    const pendingDonations = donations.filter((d) => d.status === "pending").length
    const rejectedDonations = donations.filter((d) => d.status === "rejected").length

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#017d74] to-[#015d54] rounded-xl flex items-center justify-center">
                            <Gift className="w-5 h-5 text-white" />
                        </div>
                        Historial de Donaciones
                    </h1>
                    <p className="text-gray-600 mt-1">Visualiza y filtra el historial de donaciones.</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Donaciones</p>
                            <p className="text-2xl font-bold text-gray-900">{totalDonations}</p>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Gift className="w-6 h-6 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Aprobadas</p>
                            <p className="text-2xl font-bold text-green-600">{approvedDonations}</p>
                        </div>
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pendientes</p>
                            <p className="text-2xl font-bold text-yellow-600">{pendingDonations}</p>
                        </div>
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Rechazadas</p>
                            <p className="text-2xl font-bold text-red-600">{rejectedDonations}</p>
                        </div>
                        <div className="p-2 bg-red-100 rounded-lg">
                            <XCircle className="w-6 h-6 text-red-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filtros */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Buscar por usuario..."
                                value={searchUser}
                                onChange={(e) => setSearchUser(e.target.value)}
                                className="pl-10 w-full"
                            />
                        </div>
                        <Select onValueChange={(value) => setStatusFilter(value)} value={statusFilter}>
                            <SelectTrigger className="w-full sm:w-48">
                                <Filter className="w-4 h-4 mr-2 text-gray-500" />
                                <SelectValue placeholder="Filtrar por estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="approved">Aprobado</SelectItem>
                                <SelectItem value="pending">Pendiente</SelectItem>
                                <SelectItem value="rejected">Rechazado</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select onValueChange={(value: "asc" | "desc") => setOrder(value)} value={order}>
                            <SelectTrigger className="w-full sm:w-48">
                                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                                <SelectValue placeholder="Ordenar por fecha" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="desc">Más reciente</SelectItem>
                                <SelectItem value="asc">Más antigua</SelectItem>
                            </SelectContent>
                        </Select>
                        {(searchUser || statusFilter !== "all" || order !== "desc") && (
                            <Button variant="outline" onClick={clearFilters} className="w-full sm:w-auto bg-transparent">
                                Limpiar filtros
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Lista de donaciones */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Lista de Donaciones
                    </CardTitle>
                    <CardDescription>
                        Mostrando {filtered.length} donacion{filtered.length !== 1 ? "es" : ""}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-[#017d74] mb-4" />
                            <p className="text-gray-500">Cargando donaciones...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-12">
                            <Gift className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">No se encontraron donaciones</h3>
                            <p className="text-gray-500">Intenta ajustar los filtros de búsqueda.</p>
                            {(searchUser || statusFilter !== "all" || order !== "desc") && (
                                <Button variant="outline" onClick={clearFilters} className="mt-4 bg-transparent">
                                    Restablecer filtros
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Usuario</TableHead>
                                        <TableHead>Monto</TableHead>
                                        <TableHead>Estado</TableHead>
                                        <TableHead>Método de Pago</TableHead>
                                        <TableHead>Fecha</TableHead>
                                        <TableHead>Acciones</TableHead>

                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.map((donation) => {
                                        const statusConfig = getStatusConfig(donation.status)
                                        const StatusIcon = statusConfig.icon
                                        return (
                                            <TableRow key={donation.id} className="hover:bg-gray-50">
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4 text-gray-500" />
                                                        <span className="font-medium text-gray-900">{donation.user?.name || "Desconocido"}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 font-semibold text-[#017d74]">
                                                        <DollarSign className="w-4 h-4" />
                                                        {donation.amount}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={cn("font-medium", statusConfig.color)}>
                                                        <StatusIcon className="w-3 h-3 mr-1" />
                                                        {statusConfig.label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 text-sm text-gray-700">
                                                        <CreditCard className="w-4 h-4 text-gray-500" />
                                                        {donation.paymentTypeId} - {donation.paymentMethodId}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4 text-gray-500" />
                                                        {new Date(donation.dateApproved).toLocaleString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Link href={`donaciones/${donation.id}`}>
                                                        <Button variant="ghost" size="sm">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
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
