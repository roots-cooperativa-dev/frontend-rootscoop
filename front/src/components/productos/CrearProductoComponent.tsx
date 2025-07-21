"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    subirImagen,
    crearProducto,
    actualizarProducto,
    fetchProductoById,
} from "../../app/utils/ProductsHelper";
import { fetchCategorias } from "../../app/utils/CategoriasHelper";
import type { ICategory, IProducto } from "../../app/types";

// UI components (importados individualmente)
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Card } from "../../components/ui/card";
import { CardContent } from "../../components/ui/card";
import { CardHeader } from "../../components/ui/card";
import { CardTitle } from "../../components/ui/card";
import { CardDescription } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Select } from "../../components/ui/select";
import { SelectTrigger } from "../../components/ui/select";
import { SelectValue } from "../../components/ui/select";
import { SelectContent } from "../../components/ui/select";
import { SelectItem } from "../../components/ui/select";

// Íconos (importados individualmente)
import { Plus } from "lucide-react";
import { X } from "lucide-react";
import { Package } from "lucide-react";

type SizeInput = {
    size: string
    price: number
    stock: number
}

const sizeOptions = ["S", "M", "L", "XL"]

const ProductoForm = () => {
    const { id } = useParams()
    const router = useRouter()

    const [producto, setProducto] = useState<IProducto | null>(null)
    const [loading, setLoading] = useState(!!id)

    const [name, setName] = useState("")
    const [details, setDetails] = useState("")
    const [categoryId, setCategoryId] = useState("")
    const [categories, setCategories] = useState<ICategory[]>([])
    const [sizes, setSizes] = useState<SizeInput[]>([{ size: "", price: 0, stock: 0 }])
    const [files, setFiles] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const [existingFiles, setExistingFiles] = useState<{ id: string; url: string }[]>([])

    const [errors, setErrors] = useState<{
        name?: string
        details?: string
        categoryId?: string
        sizes?: string
        images?: string
    }>({})

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await fetchCategorias(1, 100)
                setCategories(res.categories)
            } catch (err) {
                console.error(err)
                toast.error("No se pudieron cargar las categorías")
            }
        }
        loadCategories()
    }, [])

    useEffect(() => {
        if (!id) return
        const loadProducto = async () => {
            try {
                const p = await fetchProductoById(id as string)
                if (p) {
                    setProducto(p)
                    setName(p.name)
                    setDetails(p.details)
                    setCategoryId(p.category.id)
                    setSizes(p.sizes.map(s => ({ size: s.size, price: s.price, stock: s.stock })))
                    setExistingFiles(p.files || [])
                }
            } catch (err) {
                console.error(err)
                toast.error("Error al cargar el producto")
            } finally {
                setLoading(false)
            }
        }
        loadProducto()
    }, [id])

    useEffect(() => {
        return () => {
            imagePreviews.forEach(url => URL.revokeObjectURL(url))
        }
    }, [imagePreviews])

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files || [])
        setFiles(selected)
        imagePreviews.forEach(url => URL.revokeObjectURL(url))
        setImagePreviews(selected.map(file => URL.createObjectURL(file)))
    }

    const removeImage = (i: number) => {
        URL.revokeObjectURL(imagePreviews[i])
        setFiles(files.filter((_, idx) => idx !== i))
        setImagePreviews(imagePreviews.filter((_, idx) => idx !== i))
    }

    const removeExistingImage = (imgId: string) => {
        setExistingFiles(prev => prev.filter(f => f.id !== imgId))
    }

    const handleSizeChange = (index: number, field: keyof SizeInput, value: string | number) => {
        const newSizes: SizeInput[] = [...sizes]
        if (field === "size") {
            newSizes[index][field] = String(value) as SizeInput["size"]
        } else if (field === "price" || field === "stock") {
            newSizes[index][field] = Number(value) as SizeInput[typeof field]
        }
        setSizes(newSizes)
    }

    const addSize = () => setSizes([...sizes, { size: "", price: 0, stock: 0 }])
    const removeSize = (i: number) => setSizes(sizes.filter((_, idx) => idx !== i))

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const newErrors: typeof errors = {}

        if (!name.trim()) newErrors.name = "El nombre es obligatorio"
        if (!details.trim()) newErrors.details = "Los detalles son obligatorios"
        if (!categoryId) newErrors.categoryId = "Debe seleccionar una categoría"
        if (sizes.length === 0) newErrors.sizes = "Debe agregar al menos un talle"
        if (files.length === 0 && existingFiles.length === 0) newErrors.images = "Debe subir al menos una imagen"

        setErrors(newErrors)
        if (Object.keys(newErrors).length > 0) return

        try {
            const subidas = await Promise.all(files.map(f => subirImagen(f, name)))
            const nuevosIds = subidas.filter(i => i?.id).map(i => i.id)
            const existentesIds = existingFiles.map(f => f.id)
            const file_Ids = [...existentesIds, ...nuevosIds]

            const productoData = {
                name,
                details,
                category_Id: categoryId,
                sizes,
                file_Ids,
            }

            const resultado = id
                ? await actualizarProducto(id as string, productoData)
                : await crearProducto(productoData)

            if (resultado) {
                toast.success(id ? "Producto actualizado" : "Producto creado")
                router.push("/productos")
            } else {
                toast.error("Error al guardar el producto")
            }
        } catch (err) {
            console.error(err)
            toast.error("Error en el proceso")
        }
    }

    if (loading) return <p className="text-center mt-10 text-gray-600">Cargando...</p>

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-3xl mx-auto">
                <Card className="shadow-lg border border-gray-200 bg-white">
                    <CardHeader className="space-y-2 pb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gray-900 rounded-lg">
                                <Package className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <CardTitle className="text-3xl font-bold text-gray-900">
                                    {id ? "Editar Producto" : "Crear Producto"}
                                </CardTitle>
                                <CardDescription className="text-gray-600 text-base mt-1">
                                    {id ? "Modifica los datos del producto existente" : "Agrega un nuevo producto al catálogo"}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label>Nombre</Label>
                                    <Input value={name} onChange={e => setName(e.target.value)} />
                                    {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                                </div>

                                <div className="space-y-3">
                                    <Label>Detalles</Label>
                                    <Textarea value={details} onChange={e => setDetails(e.target.value)} />
                                    {errors.details && <p className="text-sm text-red-600">{errors.details}</p>}
                                </div>

                                <div className="space-y-3">
                                    <Label>Categoría</Label>
                                    <Select value={categoryId} onValueChange={setCategoryId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(c => (
                                                <SelectItem key={c.id} value={c.id}>
                                                    {c.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.categoryId && <p className="text-sm text-red-600">{errors.categoryId}</p>}
                                </div>
                            </div>

                            <Separator />
                            <div className="space-y-5">
                                <div className="flex justify-between items-center">
                                    <Label>Talles y Precios</Label>
                                    <Button type="button" variant="outline" onClick={addSize}>
                                        <Plus className="w-4 h-4 mr-1" /> Agregar
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {sizes.map((s, i) => (
                                        <div key={i} className="grid grid-cols-4 gap-4">
                                            <Select
                                                value={s.size}
                                                onValueChange={val => handleSizeChange(i, "size", val)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Talle" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {sizeOptions.map(size => (
                                                        <SelectItem key={size} value={size}>
                                                            {size}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Input
                                                type="number"
                                                value={s.price}
                                                onChange={e => handleSizeChange(i, "price", e.target.value)}
                                                placeholder="Precio"
                                            />
                                            <Input
                                                type="number"
                                                value={s.stock}
                                                onChange={e => handleSizeChange(i, "stock", e.target.value)}
                                                placeholder="Stock"
                                            />
                                            {sizes.length > 1 && (
                                                <Button type="button" variant="ghost" onClick={() => removeSize(i)}>
                                                    <X className="w-4 h-4 text-red-500" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    {errors.sizes && <p className="text-sm text-red-600">{errors.sizes}</p>}
                                </div>
                            </div>

                            <Separator />
                            <div className="space-y-5">
                                <Label>Imágenes</Label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileChange}
                                    className="border rounded px-4 py-2"
                                />
                                {errors.images && <p className="text-sm text-red-600">{errors.images}</p>}

                                {existingFiles.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {existingFiles.map(({ id, url }) => (
                                            <div key={id} className="relative group">
                                                <img src={url} className="rounded object-cover w-full h-32" />
                                                <Button
                                                    type="button"
                                                    onClick={() => removeExistingImage(id)}
                                                    variant="destructive"
                                                    className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full"
                                                >
                                                    <X className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {imagePreviews.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {imagePreviews.map((url, i) => (
                                            <div key={i} className="relative group">
                                                <img src={url} className="rounded object-cover w-full h-32" />
                                                <Button
                                                    type="button"
                                                    onClick={() => removeImage(i)}
                                                    variant="destructive"
                                                    className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full"
                                                >
                                                    <X className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="pt-6">
                                <Button type="submit" className="w-full h-14 text-lg font-semibold">
                                    {id ? "Actualizar Producto" : "Crear Producto"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ProductoForm
