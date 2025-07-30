"use client"

import { useEffect, useState } from "react"
import { fetchVisitas, eliminarVisita } from "../../app/utils/VisitasHelper"
import type { IVisita } from "../../app/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import Link from "next/link"
import { Eye, Plus, Calendar, Clock, MapPin, Loader2, Trash2 } from "lucide-react"
import { cn } from "../../lib/utils"
import { toast } from "sonner"
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
} from "../../components/ui/alert-dialog" // Importar componentes de AlertDialog

export const GestionVisitas = () => {
    const [visitas, setVisitas] = useState<IVisita[]>([])
    const [loading, setLoading] = useState(true)
    const [visitaAEliminar, setVisitaAEliminar] = useState<IVisita | null>(null) // Estado para la visita a eliminar
    const [dialogOpen, setDialogOpen] = useState(false) // Estado para controlar la apertura del AlertDialog

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

    const handleEliminar = async () => {
        if (!visitaAEliminar) return // Asegurarse de que hay una visita seleccionada

        try {
            const success = await eliminarVisita(visitaAEliminar.id)
            if (success) {
                setVisitas((prev) => prev.filter((v) => v.id !== visitaAEliminar.id))
                toast.success("Visita eliminada correctamente")
                setDialogOpen(false) // Cerrar el diálogo después de la eliminación
                setVisitaAEliminar(null) // Limpiar la visita a eliminar
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

    // Stats calculations (moved here to be accessible for rendering)
    const totalVisitas = visitas.length
    const activeVisitas = visitas.filter((v) => v.status === "active").length
    const totalTurnos = visitas.reduce((acc, v) => acc + (v.availableSlots?.length || 0), 0)

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
                                <p className="text-2xl font-bold text-gray-900">{totalVisitas}</p>
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
                                <p className="text-2xl font-bold text-gray-900">{activeVisitas}</p>
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
                                <p className="text-2xl font-bold text-gray-900">{totalTurnos}</p>
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
                                                <Link href={`/dashboard/visitas/edit/${visita.id}`}>
                                                    <Button size="sm" variant="outline">
                                                        Editar
                                                    </Button>
                                                </Link>

                                                {visita.availableSlots && visita.availableSlots.length > 0 && (
                                                    <Link href={`/dashboard/visitas/${visita.id}/slots`}>
                                                        <Button size="sm" variant="outline">
                                                            <Eye className="w-4 h-4 mr-1" />
                                                            Agregar Horario
                                                        </Button>
                                                    </Link>
                                                )}

                                                <AlertDialog
                                                    open={dialogOpen && visitaAEliminar?.id === visita.id}
                                                    onOpenChange={setDialogOpen}
                                                >
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => {
                                                                setVisitaAEliminar(visita)
                                                                setDialogOpen(true)
                                                            }}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>¿Eliminar visita?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar la visita "
                                                                <strong>{visitaAEliminar?.title}</strong>"?
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction onClick={handleEliminar}>Eliminar</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
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
