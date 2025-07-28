"use client"

import { useEffect, useState } from "react"
import { fetchVisitas, eliminarVisita } from "../../app/utils/VisitasHelper"
import type { IVisita } from "../../app/types"
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow
} from "../../components/ui/table"
import {
    Card, CardContent, CardHeader,
    CardTitle, CardDescription
} from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import Link from "next/link"
import {
    Eye, Plus, Calendar, Clock, MapPin, Loader2, Trash2
} from "lucide-react"
import { cn } from "../../lib/utils"
import { toast } from "sonner"

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

    const handleEliminar = async (id: string) => {
        const confirm = window.confirm("¿Estás seguro de que deseas eliminar esta visita?")
        if (!confirm) return

        try {
            const success = await eliminarVisita(id)
            if (success) {
                setVisitas((prev) => prev.filter((v) => v.id !== id))
                toast.success("Visita eliminada correctamente")
            } else {
                toast.error("No se pudo eliminar la visita")
            }
        } catch (error) {
            toast.error("Error inesperado al eliminar la visita")
        }
    }

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
                {/* ... Tarjetas como ya tenías ... */}
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
                                    <TableHead>Slots</TableHead>
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
                                                    visita.status === "active"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                )}
                                            >
                                                {visita.status === "active" ? "Activa" : "Inactiva"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{visita.availableSlots?.length || 0} slots</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/dashboard/visitas/${visita.id}/slots`}>
                                                    <Button size="sm" variant="outline">
                                                        <Plus className="w-4 h-4 mr-1" />
                                                        Agregar Slots
                                                    </Button>
                                                </Link>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleEliminar(visita.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
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
