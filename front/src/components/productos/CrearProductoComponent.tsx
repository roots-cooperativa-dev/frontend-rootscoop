"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { crearProducto } from "../../app/utils/ProductsHelper"
import { fetchCategorias } from "../../app/utils/CategoriasHelper"
import type { ICategory } from "../../app/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Textarea } from "../../components/ui/textarea"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Progress } from "../../components/ui/progress"
import { Badge } from "../../components/ui/badge"
import { toast } from "sonner"
import { Plus, ImageIcon, XCircle, UploadCloud, Tag, Info, CheckCircle, Loader2, Trash2 } from "lucide-react"
import { cn } from "../../lib/utils"
import { uploadFile } from "../../app/utils/ProductsHelper"

interface SizeInput {
    id: string
    size: string
    price: string
    stock: string
}

export default function CreateProductForm() {
    const [name, setName] = useState("")
    const [details, setDetails] = useState("")
    const [categoryId, setCategoryId] = useState("")
    const [categories, setCategories] = useState<ICategory[]>([])
    const [sizes, setSizes] = useState<SizeInput[]>([{ id: "size-1", size: "", price: "", stock: "" }])
    interface UploadedFile {
        id: string
        url: string
        customName: string
    }
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const loadCategories = async () => {
            const data = await fetchCategorias()
            setCategories(data)
            if (data.length > 0) {
                setCategoryId(data[0].id) // Set first category as default
            }
        }
        loadCategories()
    }, [])

    const generateBaseName = (productName: string) => productName.trim().toLowerCase().replace(/\s+/g, "-") || "producto"

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setIsUploading(true)
        setUploadProgress(0)

        const baseName = generateBaseName(name)
        const newUploadedFiles: UploadedFile[] = []
        let uploadedCount = 0

        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            const index = uploadedFiles.length + newUploadedFiles.length
            const customName = index === 0 ? baseName : `${baseName}-${index}`

            try {
                // Simulate progress
                for (let p = 1; p <= 100; p += 10) {
                    await new Promise((resolve) => setTimeout(resolve, 50))
                    setUploadProgress(Math.min(100, ((uploadedCount + p / 100) / (files.length + uploadedFiles.length)) * 100))
                }

                const uploadedIds = await uploadFile([file]) // Use the mock helper
                if (uploadedIds && uploadedIds.length > 0) {
                    // Assuming uploadFile returns an array of IDs and you have file.url available
                    newUploadedFiles.push({
                        id: uploadedIds[0],
                        url: URL.createObjectURL(file),
                        customName: customName,
                    })
                    uploadedCount++
                }
            } catch (error) {
                console.error("Error al subir imagen:", error)
                toast.error(`Error al subir imagen: ${file.name}`)
            }
        }

        setUploadedFiles((prev) => [...prev, ...newUploadedFiles])
        setIsUploading(false)
        setUploadProgress(100)
        toast.success(`${newUploadedFiles.length} imagen(es) subida(s) con éxito.`)
        e.target.value = "" // Clear input
    }

    const handleRemoveFile = (id: string) => {
        setUploadedFiles((prev) => prev.filter((file) => file.id !== id))
        toast.info("Imagen eliminada de la lista.")
    }

    const handleCustomNameChange = (id: string, newName: string) => {
        setUploadedFiles((prev) => prev.map((file) => (file.id === id ? { ...file, customName: newName } : file)))
    }

    const addSizeField = () => {
        setSizes((prev) => [...prev, { id: `size-${Date.now()}`, size: "", price: "", stock: "" }])
    }

    const removeSizeField = (id: string) => {
        setSizes((prev) => prev.filter((s) => s.id !== id))
    }

    const handleSizeChange = (id: string, field: keyof SizeInput, value: string) => {
        setSizes((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Basic validation
        if (!name.trim()) {
            toast.error("El nombre del producto es obligatorio.")
            setIsSubmitting(false)
            return
        }
        if (!categoryId) {
            toast.error("Debes seleccionar una categoría.")
            setIsSubmitting(false)
            return
        }
        if (sizes.length === 0) {
            toast.error("Debes añadir al menos un talle/precio/stock.")
            setIsSubmitting(false)
            return
        }

        const parsedSizes = sizes.map((s) => ({
            size: s.size.trim(),
            price: Number.parseFloat(s.price),
            stock: Number.parseInt(s.stock, 10),
        }))

        const invalidSizes = parsedSizes.filter(
            (s) => !s.size || isNaN(s.price) || isNaN(s.stock) || s.price < 0 || s.stock < 0,
        )
        if (invalidSizes.length > 0) {
            toast.error("Todos los campos de talle, precio y stock deben ser válidos y no negativos.")
            setIsSubmitting(false)
            return
        }

        const product = {
            name,
            details,
            category_Id: categoryId,
            sizes: parsedSizes,
            file_Ids: uploadedFiles.map((file) => file.id),
        }

        try {
            await crearProducto(product) // Use the mock helper
            toast.success("Producto creado correctamente.")
            // Reset form
            setName("")
            setDetails("")
            setCategoryId(categories.length > 0 ? categories[0].id : "")
            setSizes([{ id: "size-1", size: "", price: "", stock: "" }])
            setUploadedFiles([])
        } catch (error: any) {
            console.error("Error al crear producto:", error)
            toast.error(`Error al crear producto: ${error.message || "Error desconocido"}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container mx-auto max-w-3xl py-8">
            <Card className="shadow-lg">
                <CardHeader className="border-b pb-4">
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <Plus className="w-6 h-6 text-[#017d74]" />
                        Crear Nuevo Producto
                    </CardTitle>
                    <CardDescription>Completa los detalles para añadir un nuevo producto a tu inventario.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Product Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <Info className="w-5 h-5 text-gray-500" />
                                Información General
                            </h3>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nombre del Producto</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Ej: Camiseta de algodón"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="focus:border-[#017d74] focus:ring-[#017d74]"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="details">Descripción / Detalles</Label>
                                <Textarea
                                    id="details"
                                    placeholder="Ej: Camiseta suave y transpirable, ideal para el verano."
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    rows={4}
                                    required
                                    className="focus:border-[#017d74] focus:ring-[#017d74]"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="category">Categoría</Label>
                                <Select value={categoryId} onValueChange={setCategoryId} required>
                                    <SelectTrigger className="w-full focus:ring-[#017d74] focus:border-[#017d74]">
                                        <SelectValue placeholder="Selecciona una categoría" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Sizes and Stock */}
                        <div className="space-y-4 pt-4 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <Tag className="w-5 h-5 text-gray-500" />
                                Talles y Precios
                            </h3>
                            {sizes.map((s, index) => (
                                <div key={s.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                                    <div className="grid gap-2">
                                        <Label htmlFor={`size-${s.id}`}>Talle</Label>
                                        <Input
                                            id={`size-${s.id}`}
                                            type="text"
                                            placeholder="Ej: S, M, L, XL"
                                            value={s.size}
                                            onChange={(e) => handleSizeChange(s.id, "size", e.target.value)}
                                            required
                                            className="focus:border-[#017d74] focus:ring-[#017d74]"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor={`price-${s.id}`}>Precio ($)</Label>
                                        <Input
                                            id={`price-${s.id}`}
                                            type="number"
                                            placeholder="Ej: 29.99"
                                            value={s.price}
                                            onChange={(e) => handleSizeChange(s.id, "price", e.target.value)}
                                            step="0.01"
                                            min="0"
                                            required
                                            className="focus:border-[#017d74] focus:ring-[#017d74]"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor={`stock-${s.id}`}>Stock</Label>
                                        <Input
                                            id={`stock-${s.id}`}
                                            type="number"
                                            placeholder="Ej: 100"
                                            value={s.stock}
                                            onChange={(e) => handleSizeChange(s.id, "stock", e.target.value)}
                                            min="0"
                                            required
                                            className="focus:border-[#017d74] focus:ring-[#017d74]"
                                        />
                                    </div>
                                    {sizes.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeSizeField(s.id)}
                                            className="text-red-500 hover:bg-red-50 border-red-200"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={addSizeField}
                                className="w-full border-dashed border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 bg-transparent"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Añadir otro talle
                            </Button>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-4 pt-4 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-gray-500" />
                                Imágenes del Producto
                            </h3>
                            <div
                                className={cn(
                                    "flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg text-center transition-colors",
                                    isUploading ? "border-blue-400 bg-blue-50/30" : "border-gray-300 hover:border-[#017d74]/50",
                                )}
                            >
                                <UploadCloud className="w-10 h-10 text-gray-400 mb-3" />
                                <p className="text-gray-600 mb-2">Arrastra y suelta imágenes aquí o haz click para subir</p>
                                <Input
                                    type="file"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="image-upload"
                                    disabled={isUploading}
                                />
                                <Label
                                    htmlFor="image-upload"
                                    className={cn(
                                        "cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#017d74] hover:bg-[#015d54] transition-colors",
                                        isUploading && "opacity-70 cursor-not-allowed",
                                    )}
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Subiendo...
                                        </>
                                    ) : (
                                        "Seleccionar Archivos"
                                    )}
                                </Label>
                                {isUploading && <Progress value={uploadProgress} className="w-full mt-4 h-2 bg-gray-200" />}
                            </div>

                            {uploadedFiles.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                    {uploadedFiles.map((file) => (
                                        <Card key={file.id} className="relative group">
                                            <img
                                                src={file.url || "/placeholder.svg?height=100&width=100"}
                                                alt={file.customName}
                                                className="w-full h-32 object-cover rounded-t-lg"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleRemoveFile(file.id)}
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </Button>
                                            <CardContent className="p-3 space-y-2">
                                                <Input
                                                    type="text"
                                                    value={file.customName}
                                                    onChange={(e) => handleCustomNameChange(file.id, e.target.value)}
                                                    placeholder="Nombre de la imagen"
                                                    className="text-sm focus:border-[#017d74] focus:ring-[#017d74]"
                                                />
                                                <Badge variant="secondary" className="text-xs">
                                                    ID: {file.id.substring(0, 8)}...
                                                </Badge>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-[#017d74] hover:bg-[#015d54] text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                            disabled={isSubmitting || isUploading}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Creando Producto...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    Crear Producto
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
