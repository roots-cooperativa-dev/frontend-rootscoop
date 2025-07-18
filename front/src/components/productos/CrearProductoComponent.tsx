"use client"

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react"
import { toast } from "sonner"
import { subirImagen, crearProducto } from "../../app/utils/ProductsHelper"
import { fetchCategorias } from "../../app/utils/CategoriasHelper"
import type { ICategory } from "../../app/types"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Separator } from "../../components/ui/separator"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select"
import { Plus, X, Package, Tag, DollarSign, Hash, Upload, FolderOpen, ImageIcon } from "lucide-react"

interface SizeInput {
    size: string
    price: number
    stock: number
}

const CreateProductForm = () => {
    const [name, setName] = useState("")
    const [details, setDetails] = useState("")
    const [categoryId, setCategoryId] = useState("")
    const [categories, setCategories] = useState<ICategory[]>([])
    const [sizes, setSizes] = useState<SizeInput[]>([{ size: "", price: 0, stock: 0 }])
    const [files, setFiles] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])

    const sizeOptions = ["S", "M", "L", "XL"]

    useEffect(() => {
        const loadCategories = async () => {
            const cats = await fetchCategorias()
            setCategories(cats)
        }
        loadCategories()
    }, [])

    // Cleanup URLs when component unmounts or images change
    useEffect(() => {
        return () => {
            imagePreviews.forEach((url) => URL.revokeObjectURL(url))
        }
    }, [imagePreviews])

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || [])
        setFiles(selectedFiles)

        // Create preview URLs
        const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file))

        // Cleanup old URLs
        imagePreviews.forEach((url) => URL.revokeObjectURL(url))

        setImagePreviews(newPreviews)
    }

    const removeImage = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index)
        const newPreviews = imagePreviews.filter((_, i) => i !== index)

        // Cleanup the removed URL
        URL.revokeObjectURL(imagePreviews[index])

        setFiles(newFiles)
        setImagePreviews(newPreviews)
    }

    const handleSizeChange = (index: number, field: keyof SizeInput, value: string | number) => {
        const newSizes = [...sizes]
        if (field === "size") {
            newSizes[index].size = String(value)
        } else if (field === "price") {
            newSizes[index].price = Number(value)
        } else if (field === "stock") {
            newSizes[index].stock = Number(value)
        }
        setSizes(newSizes)
    }

    const addSize = () => {
        setSizes([...sizes, { size: "", price: 0, stock: 0 }])
    }

    const removeSize = (index: number) => {
        const newSizes = sizes.filter((_, i) => i !== index)
        setSizes(newSizes)
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!name || !details || !categoryId || sizes.length === 0 || files.length === 0) {
            toast.error("Todos los campos son obligatorios")
            return
        }

        try {
            const fileUploadPromises = files.map((file) => subirImagen(file, name))
            const uploadedImages = await Promise.all(fileUploadPromises)
            const fileIds = uploadedImages.filter((img) => img?.id).map((img) => img.id)

            if (fileIds.length === 0) {
                toast.error("Error al subir imágenes")
                return
            }

            const productoData = {
                name,
                details,
                category_Id: categoryId,
                sizes,
                file_Ids: fileIds,
            }

            const creado = await crearProducto(productoData)
            if (creado) {
                toast.success("Producto creado exitosamente")
                console.log("Producto:", creado)

                // Cleanup URLs before reset
                imagePreviews.forEach((url) => URL.revokeObjectURL(url))

                // Reset
                setName("")
                setDetails("")
                setCategoryId("")
                setSizes([{ size: "", price: 0, stock: 0 }])
                setFiles([])
                setImagePreviews([])
            } else {
                toast.error("Error al crear el producto")
            }
        } catch (error) {
            console.error("Error:", error)
            toast.error("Error general en el proceso")
        }
    }

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
                                <CardTitle className="text-3xl font-bold text-gray-900">Crear Nuevo Producto</CardTitle>
                                <CardDescription className="text-gray-600 text-base mt-1">
                                    Completa todos los campos para agregar el producto al catálogo
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Información básica */}
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Tag className="h-4 w-4 text-gray-600" />
                                        Nombre del producto
                                    </Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Remera edición limitada"
                                        className="h-12 text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                                        required
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="details" className="text-sm font-semibold text-gray-700">
                                        Detalles
                                    </Label>
                                    <Textarea
                                        id="details"
                                        value={details}
                                        onChange={(e) => setDetails(e.target.value)}
                                        placeholder="Descripción breve del producto"
                                        className="min-h-[120px] text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500 resize-none"
                                        required
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <FolderOpen className="h-4 w-4 text-gray-600" />
                                        Categoría
                                    </Label>
                                    <Select onValueChange={setCategoryId} value={categoryId}>
                                        <SelectTrigger className="h-12 text-base border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                                            <SelectValue placeholder="Seleccionar categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id} className="text-base">
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Separator className="bg-gray-200" />

                            {/* Talles y precios */}
                            <div className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Hash className="h-4 w-4 text-gray-600" />
                                        Talles y Precios
                                    </Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addSize}
                                        className="h-9 px-4 text-gray-700 border-gray-300 hover:bg-gray-50 bg-transparent"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Agregar talle
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {sizes.map((s, index) => (
                                        <Card key={index} className="p-5 bg-gray-50 border-gray-200">
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-medium text-gray-600">Talle</Label>
                                                    <Select onValueChange={(value) => handleSizeChange(index, "size", value)} value={s.size}>
                                                        <SelectTrigger className="h-10 text-sm bg-white">
                                                            <SelectValue placeholder="Seleccionar talle" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {sizeOptions.map((size) => (
                                                                <SelectItem key={size} value={size}>
                                                                    {size}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                                        <DollarSign className="h-3 w-3 text-gray-500" />
                                                        Precio
                                                    </Label>
                                                    <Input
                                                        type="number"
                                                        value={s.price}
                                                        onChange={(e) => handleSizeChange(index, "price", e.target.value)}
                                                        placeholder="0.00"
                                                        className="h-10 text-sm bg-white"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-medium text-gray-600">Stock</Label>
                                                    <Input
                                                        type="number"
                                                        value={s.stock}
                                                        onChange={(e) => handleSizeChange(index, "stock", e.target.value)}
                                                        placeholder="0"
                                                        className="h-10 text-sm bg-white"
                                                        required
                                                    />
                                                </div>
                                                <div className="flex justify-end">
                                                    {sizes.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            onClick={() => removeSize(index)}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-10 w-10 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            <Separator className="bg-gray-200" />

                            {/* Imágenes */}
                            <div className="space-y-5">
                                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Upload className="h-4 w-4 text-gray-600" />
                                    Imágenes del producto
                                </Label>

                                <div className="relative">
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors bg-gray-50/50">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            required
                                        />
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="p-4 bg-gray-100 rounded-full">
                                                <Upload className="h-8 w-8 text-gray-600" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-base font-medium text-gray-700">
                                                    Arrastra las imágenes aquí o haz clic para seleccionar
                                                </p>
                                                <p className="text-sm text-gray-500">PNG, JPG, JPEG hasta 10MB cada una</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Image Previews */}
                                {files.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <ImageIcon className="h-4 w-4 text-gray-600" />
                                            <p className="text-sm font-medium text-gray-600">{files.length} imagen(es) seleccionada(s)</p>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {imagePreviews.map((preview, index) => (
                                                <div key={index} className="relative group">
                                                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                                        <img
                                                            src={preview || "/placeholder.svg"}
                                                            alt={`Preview ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>

                                                    {/* Remove button */}
                                                    <Button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        variant="destructive"
                                                        size="sm"
                                                        className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>

                                                    {/* File name badge */}
                                                    <div className="absolute bottom-2 left-2 right-2">
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-xs bg-black/70 text-white hover:bg-black/70 truncate max-w-full"
                                                        >
                                                            {files[index].name}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Botón de envío */}
                            <div className="pt-6">
                                <Button
                                    type="submit"
                                    className="w-full h-14 text-lg font-semibold bg-gray-900 hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    <Package className="h-5 w-5 mr-3" />
                                    Crear Producto
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default CreateProductForm
