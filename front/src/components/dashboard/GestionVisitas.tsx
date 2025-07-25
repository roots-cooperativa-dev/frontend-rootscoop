"use client"

import { useEffect, useState } from "react"
import { fetchVisitas } from "../../app/utils/VisitasHelper"
import type { IVisita } from "../../app/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import Link from "next/link"
import { Eye, Plus, Calendar, Clock, MapPin, Loader2 } from "lucide-react"
import { cn } from "../../lib/utils"

export const GestionVisitas = () => {
    const [visitas, setVisitas] = useState<IVisita[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const cargarVisitas = async () => {
            try {
                const data = await fetchVisitas()
                setVisitas(data)
            } catch (err) {
                console.error("Error al cargar visitas", err)
            } finally {
                setLoading(false)
            }
        }
        cargarVisitas()
    }, [])

    // Empty state component
    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay visitas disponibles</h3>
            <p className="text-gray-500 text-center mb-4">
                Comienza creando tu primera visita para gestionar los turnos y horarios.
            </p>
            <Link href="/dashboard/visitas/nueva">
                <Button className="bg-[#017d74] hover:bg-[#015d54] text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Visita
                </Button>
            </Link>
        </div>
    )

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#017d74] to-[#015d54] rounded-xl flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-white" />
                        </div>
                        Gestión de Visitas
                    </h1>
                    <p className="text-gray-600 mt-1">Administra las visitas y sus horarios disponibles</p>
                </div>
                <Link href="/dashboard/visitas/nueva">
                    <Button className="bg-[#017d74] hover:bg-[#015d54] text-white shadow-md">
                        <Plus className="w-4 h-4 mr-2" />
                        Crear Visita
                    </Button>
                </Link>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Visitas</p>
                                <p className="text-2xl font-bold text-gray-900">{visitas.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Visitas Activas</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {visitas.filter((v) => v.status === "active").length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                <Clock className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Turnos</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {visitas.reduce((acc, v) => acc + (v.availableSlots?.length || 0), 0)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* LISTADO */}
            <Card>
                <CardHeader>
                    <CardTitle>Visitas</CardTitle>
                    <CardDescription>Mostrando {visitas.length} visitas</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-[#017d74] mb-4" />
                            <p className="text-gray-500">Cargando visitas...</p>
                        </div>
                    ) : !loading && visitas.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Título</TableHead>
                                    <TableHead>Descripción</TableHead>
                                    <TableHead>Personas</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Turnos</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {visitas.map((visita) => (
                                    <TableRow key={visita.id}>
                                        <TableCell>{visita.title}</TableCell>
                                        <TableCell>{visita.description}</TableCell>
                                        <TableCell>{visita.people}</TableCell>
                                        <TableCell>
                                            <Badge
                                                className={cn(
                                                    "font-medium",
                                                    visita.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
                                                )}
                                            >
                                                {visita.status === "active" ? "Activa" : "Inactiva"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{visita.availableSlots?.length || 0} turnos</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {visita.availableSlots && visita.availableSlots.length > 0 && (
                                                    <Link href={`/dashboard/visitas/${visita.id}/turnos`}>
                                                        <Button size="sm" variant="outline">
                                                            <Eye className="w-4 h-4 mr-1" />
                                                            Ver turnos
                                                        </Button>
                                                    </Link>
                                                )}
                                                <Link href={`/dashboard/visitas/${visita.id}/turnos/nuevo`}>
                                                    <Button size="sm" className="bg-[#017d74] text-white hover:bg-[#015d54]">
                                                        <Plus className="w-4 h-4 mr-1" />
                                                        Agregar turno
                                                    </Button>
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
