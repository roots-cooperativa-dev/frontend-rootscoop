"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { fetchVisitas, agregarTurnoAVisita } from "../../app/utils/VisitasHelper"
import type { IVisita } from "../../app/types"
import { Loader2, Calendar, Clock, Users, Plus, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { toast } from "sonner"
import Link from "next/link"
import { cn } from "../../lib/utils"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
} from "../../components/ui/dialog"

export const DetalleVisita = () => {
    const params = useParams()
    const visitaId = params?.id as string
    const [visita, setVisita] = useState<IVisita | null>(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false) // State for modal
    const [formData, setFormData] = useState({
        date: "",
        startTime: "",
        endTime: "",
        maxAppointments: 1,
    })

    useEffect(() => {
        const cargarVisita = async () => {
            try {
                const visitas = await fetchVisitas()
                const encontrada = visitas.find((v) => v.id === visitaId)
                setVisita(encontrada || null)
            } catch (err) {
                console.error("Error al cargar la visita", err)
            } finally {
                setLoading(false)
            }
        }

        if (visitaId) cargarVisita()
    }, [visitaId])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: name === "maxAppointments" ? Number.parseInt(value) : value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setSubmitting(true)
        try {
            await agregarTurnoAVisita(visitaId, formData)
            toast.success("Turno agregado correctamente")
            setFormData({
                date: "",
                startTime: "",
                endTime: "",
                maxAppointments: 1,
            })
            // Refrescar los datos de la visita
            const visitas = await fetchVisitas()
            const encontrada = visitas.find((v) => v.id === visitaId)
            setVisita(encontrada || null)
            setIsModalOpen(false) // Close modal on success
        } catch (error) {
            toast.error("Error al agregar el turno")
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#017d74] mb-4" />
                    <p className="text-gray-500">Cargando detalles de la visita...</p>
                </div>
            </div>
        )
    }

    if (!visita) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-lg font-semibold text-red-600 mb-2">No se encontró la visita</h2>
                    <p className="text-gray-500 mb-4">La visita que buscas no existe o fue eliminada.</p>
                    <Link href="/dashboard/visitas">
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver a visitas
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Link href="/dashboard/visitas">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Volver
                            </Button>
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#017d74] to-[#015d54] rounded-xl flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-white" />
                        </div>
                        Detalle de Visita
                    </h1>
                    <p className="text-gray-600 mt-1">Gestiona los Slots y horarios de la visita</p>
                </div>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#017d74] hover:bg-[#015d54] text-white shadow-md">
                            <Plus className="w-4 h-4 mr-2" />
                            Agregar Turno
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Agregar Nuevo Turno</DialogTitle>
                            <DialogDescription>Completa los datos para agregar un nuevo turno a esta visita.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Fecha del turno</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="maxAppointments">Cantidad máxima de citas</Label>
                                <Input
                                    id="maxAppointments"
                                    type="number"
                                    name="maxAppointments"
                                    value={formData.maxAppointments}
                                    onChange={handleChange}
                                    required
                                    min={1}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="startTime">Hora de inicio</Label>
                                <Input
                                    id="startTime"
                                    type="time"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    required
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endTime">Hora de finalización</Label>
                                <Input
                                    id="endTime"
                                    type="time"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    required
                                    className="w-full"
                                />
                            </div>
                            <DialogFooter>
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-[#017d74] hover:bg-[#015d54] text-white shadow-md"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Guardando turno...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Agregar Turno
                                        </>
                                    )}
                                </Button>
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                    Cancelar
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Capacidad</p>
                                <p className="text-2xl font-bold text-gray-900">{visita.people} personas</p>
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
                                <p className="text-sm font-medium text-gray-600">Slots Disponibles</p>
                                <p className="text-2xl font-bold text-gray-900">{visita.availableSlots?.length || 0}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div
                                className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center",
                                    visita.status === "active" ? "bg-green-100" : "bg-red-100",
                                )}
                            >
                                <CheckCircle
                                    className={cn("w-6 h-6", visita.status === "active" ? "text-green-600" : "text-red-600")}
                                />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">Estado</p>
                                <p className="text-2xl font-bold text-gray-900">{visita.status === "active" ? "Activa" : "Inactiva"}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* VISITA DETALLE */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Información de la Visita
                    </CardTitle>
                    <CardDescription>Detalles completos de la visita seleccionada</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-gray-500">Título</Label>
                                <h3 className="text-xl font-semibold text-gray-900 mt-1">{visita.title}</h3>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-500">Descripción</Label>
                                <p className="text-gray-700 mt-1">{visita.description}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700">Capacidad:</span>
                                    <span className="font-semibold text-gray-900">{visita.people} personas</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700">Slots:</span>
                                    <span className="font-semibold text-gray-900">{visita.availableSlots?.length || 0}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700">Estado:</span>
                                    <Badge
                                        className={cn(
                                            "font-medium",
                                            visita.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
                                        )}
                                    >
                                        {visita.status === "active" ? "Activa" : "Inactiva"}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* LISTADO DE Slots */}
            {visita.availableSlots && visita.availableSlots.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Slots Cargados
                        </CardTitle>
                        <CardDescription>Lista de Slots agregados a esta visita</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {visita.availableSlots.map((slot, idx) => (
                            <div key={idx} className="p-4 border rounded-lg bg-gray-50 shadow-sm space-y-2">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <span className="font-semibold">Fecha:</span> {slot.date}
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span className="font-semibold">Hora:</span> {slot.startTime} - {slot.endTime}
                                </div>
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Users className="w-4 h-4 text-gray-500" />
                                    <span className="font-semibold">Máx. citas:</span> {slot.maxAppointments}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
            {visita.availableSlots && visita.availableSlots.length === 0 && !loading && (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Clock className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay Slots cargados</h3>
                        <p className="text-gray-500 text-center mb-4">
                            Agrega el primer turno para esta visita usando el botón "Agregar Turno".
                        </p>
                        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-[#017d74] hover:bg-[#015d54] text-white">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Agregar Turno
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Agregar Nuevo Turno</DialogTitle>
                                    <DialogDescription>Completa los datos para agregar un nuevo turno a esta visita.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Fecha del turno</Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                            required
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="maxAppointments">Cantidad máxima de citas</Label>
                                        <Input
                                            id="maxAppointments"
                                            type="number"
                                            name="maxAppointments"
                                            value={formData.maxAppointments}
                                            onChange={handleChange}
                                            required
                                            min={1}
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="startTime">Hora de inicio</Label>
                                        <Input
                                            id="startTime"
                                            type="time"
                                            name="startTime"
                                            value={formData.startTime}
                                            onChange={handleChange}
                                            required
                                            className="w-full"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="endTime">Hora de finalización</Label>
                                        <Input
                                            id="endTime"
                                            type="time"
                                            name="endTime"
                                            value={formData.endTime}
                                            onChange={handleChange}
                                            required
                                            className="w-full"
                                        />
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="submit"
                                            disabled={submitting}
                                            className="bg-[#017d74] hover:bg-[#015d54] text-white shadow-md"
                                        >
                                            {submitting ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Guardando turno...
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Agregar Turno
                                                </>
                                            )}
                                        </Button>
                                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                            Cancelar
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
