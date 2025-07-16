'use client';

import { useEffect, useState } from "react";
import {
    fetchCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
} from "../../app/utils/CategoriasHelper";
import { ICategory } from "../../app/types";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
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
} from "../../components/ui/alert-dialog";

export const CategoriasCRUD = () => {
    const [categorias, setCategorias] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState("");
    const [categoriaAEliminar, setCategoriaAEliminar] = useState<{ id: number, name: string } | null>(null);

    const loadCategorias = async () => {
        setLoading(true);
        const data = await fetchCategorias();
        setCategorias(data);
        setLoading(false);
    };

    useEffect(() => {
        loadCategorias();
    }, []);

    const handleCrear = async () => {
        if (!newName.trim()) {
            toast.error("El nombre no puede estar vacío");
            return;
        }

        const nueva = await crearCategoria(newName.trim());
        if (nueva) {
            setCategorias((prev) => [...prev, nueva]);
            setNewName("");
            toast.success("Categoría creada con éxito");
        } else {
            toast.error("Error al crear categoría");
        }
    };

    const handleActualizar = async (id: number) => {
        if (!editingName.trim()) {
            toast.error("El nombre no puede estar vacío");
            return;
        }

        const updated = await actualizarCategoria(id, editingName.trim());
        if (updated) {
            setCategorias((prev) =>
                prev.map((cat) => (cat.id === id.toString() ? updated : cat))
            );
            setEditingId(null);
            setEditingName("");
            toast.success("Categoría actualizada");
        } else {
            toast.error("Error al actualizar categoría");
        }
    };

    const handleEliminarConfirmado = async () => {
        if (!categoriaAEliminar) return;

        toast.promise(
            eliminarCategoria(categoriaAEliminar.id),
            {
                loading: "Eliminando categoría...",
                success: () => {
                    setCategorias((prev) =>
                        prev.filter((cat) => Number(cat.id) !== categoriaAEliminar.id)
                    );
                    setCategoriaAEliminar(null);
                    return "Categoría eliminada";
                },
                error: "Error al eliminar categoría",
            }
        );
    };

    return (
        <div className="container mx-auto max-w-3xl py-12">
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-2xl text-[#017d74]">Administrar Categorías</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-3">
                        <Input
                            placeholder="Nombre de la nueva categoría"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                        <Button onClick={handleCrear} className="bg-[#922f4e] hover:bg-[#642d91] text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Crear
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Separator className="mb-6" />

            {loading ? (
                <p className="text-gray-500">Cargando categorías...</p>
            ) : categorias.length === 0 ? (
                <p className="text-gray-500">No hay categorías creadas aún.</p>
            ) : (
                categorias.map(({ id, name }) => (
                    <Card key={id} className="mb-4">
                        <CardContent className="flex items-center justify-between py-4">
                            {editingId === Number(id) ? (
                                <>
                                    <Input
                                        value={editingName}
                                        onChange={(e) => setEditingName(e.target.value)}
                                        className="flex-grow mr-2"
                                    />
                                    <Button
                                        onClick={() => handleActualizar(Number(id))}
                                        className="mr-2 bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        Guardar
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => {
                                            setEditingId(null);
                                            setEditingName("");
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <span className="text-lg font-medium text-gray-800">{name}</span>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setEditingId(Number(id));
                                                setEditingName(name);
                                            }}
                                        >
                                            <Pencil className="w-4 h-4 mr-1" />
                                            Editar
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="destructive"
                                                    onClick={() => setCategoriaAEliminar({ id: Number(id), name })}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1" />
                                                    Eliminar
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Esta acción eliminará la categoría <strong>{categoriaAEliminar?.name}</strong> permanentemente. No se puede deshacer.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel onClick={() => setCategoriaAEliminar(null)}>
                                                        Cancelar
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction onClick={handleEliminarConfirmado}>
                                                        Confirmar
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
};
