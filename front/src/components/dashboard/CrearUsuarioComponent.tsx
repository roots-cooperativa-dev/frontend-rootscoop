'use client'

import { useState } from 'react'
import { createUser } from '../../app/utils/UsuariosHelper'
import { IUsuario } from '../../app/types/index'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { toast } from 'sonner'

export const CrearUsuarioComponent = () => {
    const [formData, setFormData] = useState<Partial<IUsuario> & { password?: string }>({
        name: '',
        email: '',
        birthdate: '',
        phone: '',
        username: '',
        password: '',
        isAdmin: false,
        isDonator: false,
    })

    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        })
    }

    const handleSubmit = async () => {
        const { name, email, username, password } = formData

        if (!name || !email || !username || !password) {
            toast.error('Todos los campos obligatorios deben estar completos.')
            return
        }

        setLoading(true)
        const newUser = await createUser(formData)

        if (newUser) {
            toast.success(`Usuario ${newUser.name} creado con éxito`)
            setFormData({
                name: '',
                email: '',
                birthdate: '',
                phone: '',
                username: '',
                password: '',
                isAdmin: false,
                isDonator: false,
            })
        } else {
            toast.error('Error al crear el usuario')
        }

        setLoading(false)
    }

    return (
        <Card className="max-w-xl mx-auto mt-6">
            <CardHeader>
                <CardTitle>Crear nuevo usuario</CardTitle>
                <CardDescription>Complete los campos para registrar un nuevo usuario.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                        placeholder="Nombre completo"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <Input
                        placeholder="Correo electrónico"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <Input
                        placeholder="Fecha de nacimiento"
                        name="birthdate"
                        type="date"
                        value={formData.birthdate}
                        onChange={handleChange}
                    />
                    <Input
                        placeholder="Teléfono"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    <Input
                        placeholder="Nombre de usuario"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <Input
                        placeholder="Contraseña"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex items-center gap-6 mt-4">
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            name="isAdmin"
                            checked={formData.isAdmin}
                            onChange={handleChange}
                        />
                        Administrador
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                        <input
                            type="checkbox"
                            name="isDonator"
                            checked={formData.isDonator}
                            onChange={handleChange}
                        />
                        Donador
                    </label>
                </div>

                <div className="flex justify-end mt-6">
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Guardando...' : 'Crear Usuario'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}