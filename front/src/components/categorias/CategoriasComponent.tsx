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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Pencil, Trash2, Plus, Search, Undo2, CheckCircle, XCircle, Loader2, Tag } from "lucide-react"
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

// Hook personalizado para debounce
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}

export const CategoriasCRUD = () => {
    const [categorias, setCategorias] = useState<ICategory[]>([])
    const [loading, setLoading] = useState(true)
    const [newName, setNewName] = useState("")
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editingName, setEditingName] = useState("")
    const [categoriaAEliminar, setCategoriaAEliminar] = useState<ICategory | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [isCreating, setIsCreating] = useState(false)
    const [mostrarEliminadas, setMostrarEliminadas] = useState(false)
    const [page, setPage] = useState(1)
    const [limit] = useState(5)
    const [totalPages, setTotalPages] = useState(1)
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null) // For individual action loading
    const [isDuplicateName, setIsDuplicateName] = useState(false) // New state for duplicate name validation

    // Debounce para búsqueda en tiempo real
    const debouncedSearchTerm = useDebounce(searchTerm, 500)

    const loadCategorias = async (searchName = "") => {
        setLoading(true)
        try {
            const { categories, pages } = await fetchCategorias(page, limit, searchName)
            const filtradas = mostrarEliminadas
                ? categories.filter((c) => c.deletedAt)
                : categories.filter((c) => !c.deletedAt)
            setCategorias(filtradas)
            setTotalPages(pages)
        } catch (error) {
            toast.error("Error cargando categorías")
        } finally {
            setLoading(false)
        }
    }

    // Efecto para búsqueda en tiempo real
    useEffect(() => {
        setPage(1) // Resetear a página 1 cuando se busca
        loadCategorias(debouncedSearchTerm)
    }, [debouncedSearchTerm, mostrarEliminadas])

    // Efecto para cambio de página
    useEffect(() => {
        loadCategorias(debouncedSearchTerm)
    }, [page])

    // Effect to re-check duplicate name when categories or newName changes
    useEffect(() => {
        const trimmedNewName = newName.trim().toLowerCase()
        const duplicate = categorias.some((cat) => cat.name.toLowerCase() === trimmedNewName && !cat.deletedAt)
        setIsDuplicateName(duplicate)
    }, [newName, categorias])

    const handleCrear = async () => {
        if (!newName.trim()) {
            toast.error("El nombre no puede estar vacío")
            return
        }
        if (isDuplicateName) {
            toast.error("Ya existe una categoría con este nombre.")
            return
        }
        setIsCreating(true)
        try {
            const nueva = await crearCategoria(newName.trim())
            if (nueva) {
                setNewName("")
                toast.success("Categoría creada con éxito")
                await loadCategorias(debouncedSearchTerm)
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
        // Check for duplicate name during edit, excluding the current category being edited
        const trimmedEditingName = editingName.trim().toLowerCase()
        const duplicateOnEdit = categorias.some(
            (cat) => cat.id !== id && cat.name.toLowerCase() === trimmedEditingName && !cat.deletedAt,
        )
        if (duplicateOnEdit) {
            toast.error("Ya existe otra categoría con este nombre.")
            return
        }
        setActionLoadingId(id)
        try {
            const updated = await actualizarCategoria(id, editingName.trim())
            if (updated) {
                await loadCategorias(debouncedSearchTerm)
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
        toast.promise(eliminarCategoria(categoriaAEliminar.id), {
            loading: "Eliminando categoría...",
            success: async () => {
                await loadCategorias(debouncedSearchTerm)
                setCategoriaAEliminar(null)
                setActionLoadingId(null)
                return "Categoría eliminada"
            },
            error: () => {
                setActionLoadingId(null)
                return "Error al eliminar categoría"
            },
        })
    }

    const handleRestaurar = async (id: string) => {
        setActionLoadingId(id)
        toast.promise(restaurarCategoria(id), {
            loading: "Restaurando categoría...",
            success: async () => {
                await loadCategorias(debouncedSearchTerm)
                setActionLoadingId(null)
                return "Categoría restaurada"
            },
            error: () => {
                setActionLoadingId(null)
                return "Error al restaurar categoría"
            },
        })
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleCrear()
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
                        setPage(1) // Reset page when changing view
                    }}
                    className="shadow-sm"
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
            {/* Create New Category Card */}
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
                                    onChange={(e) => setNewName(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className={cn(
                                        "pr-10 focus:border-[#017d74] focus:ring-[#017d74]",
                                        isDuplicateName && "border-red-500 focus:border-red-500 focus:ring-red-500",
                                    )}
                                    disabled={isCreating}
                                />
                                {newName && !isCreating && (
                                    <button
                                        onClick={() => setNewName("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <XCircle className="w-4 h-4" />
                                    </button>
                                )}
                                {isDuplicateName && (
                                    <p className="text-red-500 text-sm mt-1">Ya existe una categoría con este nombre.</p>
                                )}
                            </div>
                            <Button
                                onClick={handleCrear}
                                disabled={!newName.trim() || isCreating || isDuplicateName}
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
                            placeholder="Buscar categorías en tiempo real..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-10 focus:border-[#017d74] focus:ring-[#017d74]"
                        />
                        {searchTerm && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <div className="w-2 h-2 bg-[#017d74] rounded-full animate-pulse"></div>
                            </div>
                        )}
                    </div>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 animate-spin text-[#017d74] mb-4" />
                            <p className="text-gray-500">Cargando categorías...</p>
                        </div>
                    ) : categorias.length === 0 ? (
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
                            {categorias.map((categoria) => (
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
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button
                                                                    size="sm"
                                                                    disabled={actionLoadingId === categoria.id}
                                                                    className="bg-blue-600 text-white hover:bg-blue-700"
                                                                >
                                                                    {actionLoadingId === categoria.id ? (
                                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                                    ) : (
                                                                        <Undo2 className="w-4 h-4 mr-2" />
                                                                    )}{" "}
                                                                    Restaurar
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>¿Restaurar categoría?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Esta acción restaurará la categoría <strong>{categoria.name}</strong>. Estará
                                                                        nuevamente activa en tu lista de categorías.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleRestaurar(categoria.id)}>
                                                                        Restaurar
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
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
                    {totalPages > 1 && !loading && categorias.length > 0 && (
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
