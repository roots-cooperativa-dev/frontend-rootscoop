"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { fetchCategorias, crearCategoria, actualizarCategoria, eliminarCategoria } from "../../app/utils/CategoriasHelper"
import type { ICategory } from "../../app/types/index"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Skeleton } from "../../components/ui/skeleton"
import { Pencil, Trash2, Plus, Search, FolderOpen, Package, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "../../components/ui/alert-dialog"
import { cn } from "../../lib/utils"

export const CategoriasCRUD = () => {
    const [categorias, setCategorias] = useState<ICategory[]>([])
    const [loading, setLoading] = useState(true)
    const [newName, setNewName] = useState("")
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editingName, setEditingName] = useState("")
    const [categoriaAEliminar, setCategoriaAEliminar] = useState<ICategory | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [isCreating, setIsCreating] = useState(false)

    const loadCategorias = async () => {
        setLoading(true)
        const data = await fetchCategorias()
        setCategorias(data)
        setLoading(false)
    }

    useEffect(() => {
        loadCategorias()
    }, [])

    const filteredCategorias = categorias.filter((categoria) =>
        categoria.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const handleCrear = async () => {
        if (!newName.trim()) {
            toast.error("El nombre no puede estar vacío")
            return
        }

        setIsCreating(true)
        const nueva = await crearCategoria(newName.trim())

        if (nueva) {
            setCategorias((prev) => [...prev, nueva])
            setNewName("")
            toast.success("Categoría creada con éxito")
        } else {
            toast.error("Error al crear categoría")
        }
        setIsCreating(false)
    }

    const handleActualizar = async (id: string) => {
        if (!editingName.trim()) {
            toast.error("El nombre no puede estar vacío")
            return
        }

        const updated = await actualizarCategoria(String(id), editingName.trim())
        if (updated) {
            await loadCategorias()
            setEditingId(null)
            setEditingName("")
            toast.success("Categoría actualizada")
        } else {
            toast.error("Error al actualizar categoría")
        }
    }

    const handleEliminarConfirmado = async () => {
        if (!categoriaAEliminar) return

        toast.promise(eliminarCategoria(categoriaAEliminar.id), {
            loading: "Eliminando categoría...",
            success: async () => {
                await loadCategorias()
                setCategoriaAEliminar(null)
                return "Categoría eliminada"
            },
            error: "Error al eliminar categoría",
        })
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleCrear()
        }
    }

    return (
        <div className="container mx-auto max-w-4xl py-8 space-y-8">
            {/* Header Section */}
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#017d74] to-[#015d54] rounded-xl flex items-center justify-center shadow-lg">
                        <FolderOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Gestión de Categorías</h1>
                        <p className="text-gray-600">Organiza y administra las categorías de tus productos</p>
                    </div>
                </div>
            </div>

            {/* Create Category Section */}
            <Card className="border-2 border-dashed border-gray-200 hover:border-[#017d74]/30 transition-colors">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-[#017d74] flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Crear Nueva Categoría
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <Input
                                placeholder="Ingresa el nombre de la categoría..."
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="pr-10 focus:border-[#017d74] focus:ring-[#017d74]"
                            />
                            {newName && (
                                <button
                                    onClick={() => setNewName("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <XCircle className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <Button
                            onClick={handleCrear}
                            disabled={!newName.trim() || isCreating}
                            className="bg-[#017d74] hover:bg-[#015d54] text-white px-6 shadow-md hover:shadow-lg transition-all"
                        >
                            {isCreating ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            ) : (
                                <Plus className="w-4 h-4 mr-2" />
                            )}
                            {isCreating ? "Creando..." : "Crear"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Search and Filter */}
            {categorias.length > 0 && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Buscar categorías..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 focus:border-[#017d74] focus:ring-[#017d74]"
                            />
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Categories List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <Card key={i}>
                                <CardContent className="py-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <Skeleton className="w-10 h-10 rounded-lg" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-4 w-32" />
                                                <Skeleton className="h-3 w-24" />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Skeleton className="h-9 w-20" />
                                            <Skeleton className="h-9 w-24" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : categorias.length === 0 ? (
                    <Card className="border-dashed border-2 border-gray-200">
                        <CardContent className="py-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay categorías</h3>
                            <p className="text-gray-500 mb-4">Comienza creando tu primera categoría para organizar tus productos</p>
                            <Button
                                onClick={() => document.querySelector("input")?.focus()}
                                variant="outline"
                                className="border-[#017d74] text-[#017d74] hover:bg-[#017d74]/5"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Crear primera categoría
                            </Button>
                        </CardContent>
                    </Card>
                ) : filteredCategorias.length === 0 ? (
                    <Card className="border-dashed border-2 border-gray-200">
                        <CardContent className="py-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron resultados</h3>
                            <p className="text-gray-500 mb-4">No hay categorías que coincidan con "{searchTerm}"</p>
                            <Button onClick={() => setSearchTerm("")} variant="outline">
                                Limpiar búsqueda
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    filteredCategorias.map(({ id, name }, index) => (
                        <Card
                            key={id}
                            className={cn(
                                "hover:shadow-md transition-all duration-200 border-l-4",
                                editingId === id ? "border-l-blue-500 bg-blue-50/30" : "border-l-[#017d74]",
                            )}
                        >
                            <CardContent className="py-6">
                                {editingId === id ? (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Pencil className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <Input
                                                value={editingName}
                                                onChange={(e) => setEditingName(e.target.value)}
                                                className="font-medium focus:border-blue-500 focus:ring-blue-500"
                                                onKeyPress={(e) => e.key === "Enter" && handleActualizar(id)}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => handleActualizar(id)}
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                Guardar
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setEditingId(null)
                                                    setEditingName("")
                                                }}
                                            >
                                                <XCircle className="w-4 h-4 mr-1" />
                                                Cancelar
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-[#017d74]/10 rounded-lg flex items-center justify-center">
                                                <FolderOpen className="w-5 h-5 text-[#017d74]" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
                                                <p className="text-sm text-gray-500">Categoría #{index + 1}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="bg-[#017d74]/10 text-[#017d74]">
                                                Activa
                                            </Badge>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setEditingId(id)
                                                    setEditingName(name)
                                                }}
                                                className="hover:bg-blue-50 hover:border-blue-300"
                                            >
                                                <Pencil className="w-4 h-4 mr-1" />
                                                Editar
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setCategoriaAEliminar({ id, name })}
                                                        className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Eliminar
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                                                <AlertTriangle className="w-6 h-6 text-red-600" />
                                                            </div>
                                                            <div>
                                                                <AlertDialogTitle className="text-xl">¿Eliminar categoría?</AlertDialogTitle>
                                                            </div>
                                                        </div>
                                                        <AlertDialogDescription className="text-base">
                                                            Esta acción eliminará permanentemente la categoría{" "}
                                                            <span className="font-semibold text-gray-900">"{categoriaAEliminar?.name}"</span>. Esta
                                                            acción no se puede deshacer.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel onClick={() => setCategoriaAEliminar(null)}>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={handleEliminarConfirmado}
                                                            className="bg-red-600 hover:bg-red-700"
                                                        >
                                                            Eliminar categoría
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
