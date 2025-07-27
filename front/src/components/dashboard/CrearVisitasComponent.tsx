'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { crearVisita } from '../../app/utils/VisitasHelper'
import type { VisitaDTO } from '../../app/dto/VisitaDTO'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Button } from '../../components/ui/button'
import { Textarea } from '../../components/ui/textarea'
import { toast } from 'sonner'

export const CrearVisitasComponent = () => {
    const [form, setForm] = useState<VisitaDTO>({
        title: '',
        description: '',
        people: 1,
    })
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({
            ...prev,
            [name]: name === 'people' ? parseInt(value) : value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!form.title || !form.description || !form.people) {
            toast.warning('Todos los campos son obligatorios')
            return
        }

        setLoading(true)
        const nuevaVisita = await crearVisita(form)
        setLoading(false)

        if (nuevaVisita) {
            toast.success('Visita creada con éxito')
            router.push('/dashboard/visitas')
        } else {
            toast.error('Error al crear la visita')
        }
    }

    return (
        <div className="max-w-2xl mx-auto mt-8 p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Crear Nueva Visita</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="title">Título</Label>
                            <Input
                                id="title"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="description">Descripción</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="people">Cantidad de personas</Label>
                            <Input
                                id="people"
                                name="people"
                                type="number"
                                min={1}
                                value={form.people}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="flex justify-between items-center">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Creando...' : 'Crear Visita'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
