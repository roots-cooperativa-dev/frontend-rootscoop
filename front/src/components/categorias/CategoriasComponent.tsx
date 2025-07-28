"use client"

import type React from "react"
import { useEffect, useState } from "react"
import {
    fetchCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
    restaurarCategoria,
} from "../../app/utils/CategoriasHelper"
import type { ICategory } from "../../app/types"
import {
    Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import {
    Pencil, Trash2, Plus, Search, Undo2, CheckCircle,
    XCircle, Loader2, Tag,
} from "lucide-react"
import { toast } from "sonner"
import {
    AlertDialog, AlertDialogTrigger, AlertDialogContent,
    AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
    AlertDialogFooter, AlertDialogCancel, AlertDialogAction,
} from "../../components/ui/alert-dialog"
import { cn } from "../../lib/utils"

export const CategoriasCRUD = () => {
    const [categorias, setCategorias] = useState<ICategory[]>([])
    const [loading, setLoading] = useState(true)
    const [newName, setNewName] = useState("")
    const [errorNombre, setErrorNombre] = useState<string | null>(null)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editingName, setEditingName] = useState("")
    const [categoriaAEliminar, setCategoriaAEliminar] = useState<ICategory | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [isCreating, setIsCreating] = useState(false)
    const [mostrarEliminadas, setMostrarEliminadas] = useState(false)
    const [page, setPage] = useState(1)
    const [limit] = useState(5)
    const [totalPages, setTotalPages] = useState(1)
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

    const loadCategorias = async () => {
        setLoading(true)
        try {
            const { categories, pages } = await fetchCategorias(page, limit)
            setCategorias(categories)
            setTotalPages(pages)
        } catch (error) {
            toast.error("Error cargando categorías")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCategorias()
    }, [page, mostrarEliminadas])

    const filteredCategorias = categorias
        .filter((c) =>
            mostrarEliminadas ? c.deletedAt : !c.deletedAt
        )
        .filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const handleCrear = async () => {
        if (!newName.trim() || errorNombre) return
        setIsCreating(true)
        try {
            const nueva = await crearCategoria(newName.trim())
            if (nueva) {
                setNewName("")
                toast.success("Categoría creada con éxito")
                await loadCategorias()
            } else {
                toast.error("Error al crear categoría")
            }
        } catch (error) {
            toast.error("Error al crear categoría")
        } finally {
            setIsCreating(false)
        }
    }

    const handleActualizar = async (id: string) => {
        if (!editingName.trim()) {
            toast.error("El nombre no puede estar vacío")
            return
        }
        setActionLoadingId(id)
        try {
            const updated = await actualizarCategoria(id, editingName.trim())
            if (updated) {
                await loadCategorias()
                setEditingId(null)
                setEditingName("")
                toast.success("Categoría actualizada")
            } else {
                toast.error("Error al actualizar categoría")
            }
        } catch (error) {
            toast.error("Error al actualizar categoría")
        } finally {
            setActionLoadingId(null)
        }
    }

    const handleEliminarConfirmado = async () => {
        if (!categoriaAEliminar) return
        setActionLoadingId(categoriaAEliminar.id)
        try {
            await eliminarCategoria(categoriaAEliminar.id)
            await loadCategorias()
            setCategoriaAEliminar(null)
            toast.success("Categoría eliminada")
        } catch {
            toast.error("Error al eliminar categoría")
        } finally {
            setActionLoadingId(null)
        }
    }

    const handleRestaurar = async (id: string) => {
        setActionLoadingId(id)
        try {
            const restored = await restaurarCategoria(id)
            if (restored) {
                toast.success("Categoría restaurada")
                await loadCategorias()
            } else {
                toast.error("Error al restaurar categoría")
            }
        } catch {
            toast.error("Error al restaurar categoría")
        } finally {
            setActionLoadingId(null)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleCrear()
        }
    }

    const handleInputChange = (value: string) => {
        setNewName(value)

        const nombreNormalizado = value.trim().toLowerCase()

        const categoriaActiva = categorias.find(
            (cat) => cat.name.trim().toLowerCase() === nombreNormalizado && !cat.deletedAt
        )

        const categoriaEliminada = categorias.find(
            (cat) => cat.name.trim().toLowerCase() === nombreNormalizado && !!cat.deletedAt
        )

        if (categoriaActiva) {
            setErrorNombre("Ya existe una categoría con ese nombre.")
        } else if (categoriaEliminada) {
            setErrorNombre(
                "Ya existe una categoría con ese nombre, pero está eliminada. Ve a 'Ver Eliminadas' y restáurala."
            )
        } else {
            setErrorNombre(null)
        }
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#017d74] to-[#015d54] rounded-xl flex items-center justify-center">
                            <Tag className="w-5 h-5 text-white" />
                        </div>
                        Gestión de Categorías
                    </h1>
                    <p className="text-gray-600 mt-1">Administra las categorías de tus productos</p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => {
                        setMostrarEliminadas(!mostrarEliminadas)
                        setPage(1)
                    }}
                >
                    {mostrarEliminadas ? (
                        <>
                            <CheckCircle className="w-4 h-4 mr-2 text-green-600" /> Ver Activas
                        </>
                    ) : (
                        <>
                            <Trash2 className="w-4 h-4 mr-2 text-red-600" /> Ver Eliminadas
                        </>
                    )}
                </Button>
            </div>

            {/* Crear nueva categoría */}
            {!mostrarEliminadas && (
                <Card className="border-2 border-dashed border-gray-200 hover:border-[#017d74]/30 transition-colors">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl text-[#017d74] flex items-center gap-2">
                            <Plus className="w-5 h-5" /> Crear Nueva Categoría
                        </CardTitle>
                        <CardDescription>Agrega una nueva categoría a tu sistema.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1 relative">
                                <Input
                                    placeholder="Ingresa el nombre de la categoría..."
                                    value={newName}
                                    onChange={(e) => handleInputChange(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="pr-10 focus:border-[#017d74] focus:ring-[#017d74]"
                                    disabled={isCreating}
                                />
                                {newName && !isCreating && (
                                    <button
                                        onClick={() => {
                                            setNewName("")
                                            setErrorNombre(null)
                                        }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <XCircle className="w-4 h-4" />
                                    </button>
                                )}
                                {errorNombre && (
                                    <p className="mt-1 text-sm text-red-600">{errorNombre}</p>
                                )}
                            </div>
                            <Button
                                onClick={handleCrear}
                                disabled={!newName.trim() || isCreating || !!errorNombre}
                                className="bg-[#017d74] hover:bg-[#015d54] text-white px-6 shadow-md hover:shadow-lg transition-all"
                            >
                                {isCreating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Creando...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4 mr-2" />
                                        Crear
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Search and Categories List */}
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                        <Tag className="w-5 h-5" />
                        Lista de Categorías
                    </CardTitle>
                    <CardDescription>{mostrarEliminadas ? "Categorías eliminadas" : "Categorías activas"}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Buscar categorías..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 focus:border-[#017d74] focus:ring-[#017d74]"
                        />
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-[#017d74] mb-4" />
                            <p className="text-gray-500">Cargando categorías...</p>
                        </div>
                    ) : filteredCategorias.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Tag className="w-12 h-12 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron categorías</h3>
                            <p className="text-gray-500">
                                {searchTerm
                                    ? "No hay categorías que coincidan con tu búsqueda."
                                    : mostrarEliminadas
                                        ? "No hay categorías eliminadas."
                                        : "No hay categorías activas. ¡Crea una nueva!"}
                            </p>
                            {searchTerm && (
                                <Button
                                    variant="ghost"
                                    onClick={() => setSearchTerm("")}
                                    className="mt-4 text-gray-500 hover:text-gray-700"
                                >
                                    Limpiar búsqueda
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredCategorias.map((categoria) => (
                                <Card key={categoria.id} className="shadow-sm">
                                    <CardContent className="py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                                        {editingId === categoria.id ? (
                                            <div className="flex w-full items-center gap-3 flex-wrap">
                                                <Input
                                                    value={editingName}
                                                    onChange={(e) => setEditingName(e.target.value)}
                                                    onKeyDown={(e) => e.key === "Enter" && handleActualizar(categoria.id)}
                                                    className="flex-1 min-w-[150px]"
                                                    disabled={actionLoadingId === categoria.id}
                                                />
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 text-white hover:bg-green-700"
                                                    onClick={() => handleActualizar(categoria.id)}
                                                    disabled={actionLoadingId === categoria.id}
                                                >
                                                    {actionLoadingId === categoria.id ? (
                                                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                                    ) : (
                                                        <CheckCircle className="w-4 h-4 mr-1" />
                                                    )}{" "}
                                                    Guardar
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setEditingId(null)}
                                                    disabled={actionLoadingId === categoria.id}
                                                >
                                                    <XCircle className="w-4 h-4 mr-1" /> Cancelar
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between w-full items-center flex-wrap gap-2">
                                                <div>
                                                    <h3 className="text-lg font-semibold text-gray-900">{categoria.name}</h3>
                                                    <p className="text-sm text-gray-500">ID: {categoria.id}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        className={cn(
                                                            "font-medium",
                                                            categoria.deletedAt ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800",
                                                        )}
                                                    >
                                                        {categoria.deletedAt ? "Eliminada" : "Activa"}
                                                    </Badge>
                                                    {mostrarEliminadas ? (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleRestaurar(categoria.id)}
                                                            disabled={actionLoadingId === categoria.id}
                                                            className="bg-blue-600 text-white hover:bg-blue-700"
                                                        >
                                                            {actionLoadingId === categoria.id ? (
                                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                            ) : (
                                                                <Undo2 className="w-4 h-4 mr-2" />
                                                            )}
                                                            Restaurar
                                                        </Button>

                                                    ) : (
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setEditingId(categoria.id)
                                                                    setEditingName(categoria.name)
                                                                }}
                                                            >
                                                                <Pencil className="w-4 h-4 mr-1" /> Editar
                                                            </Button>
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => setCategoriaAEliminar(categoria)}
                                                                        className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                                                                    >
                                                                        <Trash2 className="w-4 h-4 mr-1" /> Eliminar
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            Esta acción eliminará permanentemente la categoría{" "}
                                                                            <strong>{categoriaAEliminar?.name}</strong>.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                        <AlertDialogAction onClick={handleEliminarConfirmado}>Eliminar</AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && !loading && filteredCategorias.length > 0 && (
                        <div className="flex justify-center items-center gap-4 mt-6">
                            <Button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1} variant="outline">
                                Anterior
                            </Button>
                            <span className="text-gray-700 font-medium">
                                Página {page} de {totalPages}
                            </span>
                            <Button
                                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={page === totalPages}
                                variant="outline"
                            >
                                Siguiente
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
