"use client"

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react"
import { useParams, useRouter } from "next/navigation"
import { crearVisita, updateVisita, fetchVisitaById } from "../../app/utils/VisitasHelper"
import type { VisitaDTO } from "../../app/dto/VisitaDTO"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Button } from "../../components/ui/button"
import { Textarea } from "../../components/ui/textarea"
import { toast } from "sonner"
import { Loader2, Calendar, ArrowLeft } from "lucide-react" // Importar iconos
import Link from "next/link" // Importar Link para el botón de volver

export const CrearVisitasComponent = () => {
    const [form, setForm] = useState<VisitaDTO>({
        title: "",
        description: "",
        people: 1,
    })
    const [loading, setLoading] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [errors, setErrors] = useState<Partial<Record<keyof VisitaDTO, string>>>({}) // Estado para errores
    const [touched, setTouched] = useState<Partial<Record<keyof VisitaDTO, boolean>>>({}) // Estado para campos tocados
    const [formSubmitted, setFormSubmitted] = useState(false) // Estado para saber si el formulario fue enviado

    const params = useParams()
    const router = useRouter()
    const visitaId = params?.id as string | undefined

    useEffect(() => {
        const fetchVisita = async () => {
            if (visitaId) {
                try {
                    setLoading(true)
                    setEditMode(true)
                    const visita = await fetchVisitaById(visitaId)
                    if (visita) {
                        setForm({
                            title: visita.title,
                            description: visita.description,
                            people: visita.people,
                        })
                    } else {
                        toast.error("No se encontró la visita")
                        router.push("/dashboard/visitas")
                    }
                } catch (error) {
                    toast.error("Error al cargar la visita")
                } finally {
                    setLoading(false)
                }
            }
        }
        fetchVisita()
    }, [visitaId, router])

    // Función de validación que devuelve un objeto con los errores
    const validateForm = (data: VisitaDTO): Partial<Record<keyof VisitaDTO, string>> => {
        const newErrors: Partial<Record<keyof VisitaDTO, string>> = {}
        if (!data.title.trim()) {
            newErrors.title = "El título es obligatorio."
        }
        if (!data.description.trim()) {
            newErrors.description = "La descripción es obligatoria."
        }
        if (isNaN(data.people) || data.people < 1) {
            newErrors.people = "La cantidad de personas debe ser al menos 1."
        }
        return newErrors
    }

    // Efecto para revalidar el formulario cuando cambian los datos o el estado de 'touched'/'formSubmitted'
    useEffect(() => {
        // Solo valida si el formulario ha sido enviado o si algún campo ha sido tocado
        if (formSubmitted || Object.keys(touched).length > 0) {
            setErrors(validateForm(form))
        }
    }, [form, touched, formSubmitted])

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        const parsedValue = name === "people" ? Number.parseInt(value) : value
        setForm((prev) => ({
            ...prev,
            [name]: parsedValue,
        }))
        // Marcar el campo como tocado al cambiar
        setTouched((prev) => ({ ...prev, [name]: true }))
    }

    const handleBlur = (fieldName: keyof VisitaDTO) => {
        // Marcar el campo como tocado al salir de él
        setTouched((prev) => ({ ...prev, [fieldName]: true }))
        // Validar el formulario al salir de un campo
        setErrors(validateForm(form))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setFormSubmitted(true) // Marcar el formulario como enviado

        const currentErrors = validateForm(form) // Obtener los errores más recientes
        setErrors(currentErrors) // Actualizar el estado de errores inmediatamente

        if (Object.keys(currentErrors).length > 0) {
            toast.error("Por favor, corrige los errores del formulario.")
            return
        }

        setLoading(true)
        try {
            if (editMode && visitaId) {
                await updateVisita(visitaId, form)
                toast.success("Visita actualizada con éxito")
            } else {
                await crearVisita(form)
                toast.success("Visita creada con éxito")
            }
            router.push("/dashboard/visitas")
        } catch {
            toast.error("Error al guardar la visita")
        } finally {
            setLoading(false)
        }
    }

    // Determinar si el botón de envío debe estar deshabilitado
    const isFormInvalid = Object.keys(errors).length > 0

    if (loading && editMode) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-[#017d74]" />
                    <p className="text-gray-600">Cargando datos de la visita...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
                        {editMode ? "Editar Visita" : "Crear Nueva Visita"}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {editMode
                            ? "Modifica los datos de la visita existente."
                            : "Complete los campos para registrar una nueva visita."}
                    </p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto">
                <Card className="shadow-lg border border-gray-200 bg-white">
                    <CardHeader>
                        <CardTitle>{editMode ? "Información de la Visita" : "Nueva Visita"}</CardTitle>
                        <CardDescription>Ingrese los detalles para la visita.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-3">
                                <Label htmlFor="title">Título</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur("title")}
                                />
                                {errors.title && (touched.title || formSubmitted) && (
                                    <p className="text-sm text-red-600">{errors.title}</p>
                                )}
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="description">Descripción</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur("description")}
                                />
                                {errors.description && (touched.description || formSubmitted) && (
                                    <p className="text-sm text-red-600">{errors.description}</p>
                                )}
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="people">Cantidad de personas</Label>
                                <Input
                                    id="people"
                                    name="people"
                                    type="number"
                                    value={isNaN(form.people) ? "" : form.people} // Manejar NaN para la visualización
                                    onChange={handleChange}
                                    onBlur={() => handleBlur("people")}
                                />
                                {errors.people && (touched.people || formSubmitted) && (
                                    <p className="text-sm text-red-600">{errors.people}</p>
                                )}
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button
                                    type="submit"
                                    disabled={loading || isFormInvalid} // Deshabilitar si está cargando o hay errores
                                    className="bg-[#017d74] hover:bg-[#015d54] text-white px-6 shadow-md"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            {editMode ? "Actualizando..." : "Creando..."}
                                        </>
                                    ) : editMode ? (
                                        "Actualizar Visita"
                                    ) : (
                                        "Crear Visita"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
