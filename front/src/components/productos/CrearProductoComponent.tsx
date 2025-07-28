"use client"
import { useState, useEffect, type ChangeEvent, type FormEvent } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { subirImagen, crearProducto, actualizarProducto, fetchProductoById } from "../../app/utils/ProductsHelper"
import { fetchCategorias } from "../../app/utils/CategoriasHelper"
import type { ICategory, IProducto } from "../../app/types"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Separator } from "../../components/ui/separator"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/ui/select"
import { Plus, X, Package, Loader2 } from "lucide-react"

type SizeInput = {
    id?: string
    size: string
    price: number
    stock: number
}

const sizeOptions = ["S", "M", "L", "XL"]
const MAX_IMAGE_SIZE_KB = 200; // Tamaño máximo de imagen en KB
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_KB * 1024; // 200KB en bytes


const ProductoForm = () => {
    const params = useParams()
    const id = params && typeof params.id === "string" ? params.id : undefined
    const router = useRouter()
    const [producto, setProducto] = useState<IProducto | null>(null)
    const [loading, setLoading] = useState(!!id)
    const [submitting, setSubmitting] = useState(false)
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
    const [touched, setTouched] = useState<Partial<Record<keyof typeof errors, boolean>>>({})
    const [formSubmitted, setFormSubmitted] = useState(false)

    // Helper to validate UUID
    const esUUID = (val: string): boolean => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        return uuidRegex.test(val)
    }

    // Validation function
    const validateForm = (): Partial<typeof errors> => {
        const newErrors: typeof errors = {}
        if (!name.trim()) newErrors.name = "El nombre es obligatorio."
        if (!details.trim()) newErrors.details = "Los detalles son obligatorios."
        if (!categoryId) {
            newErrors.categoryId = "Debe seleccionar una categoría."
        } else if (!esUUID(categoryId)) {
            newErrors.categoryId = "La categoría debe ser un UUID válido."
        }

        if (sizes.length === 0) {
            newErrors.sizes = "Debe agregar al menos un talle."
        } else if (sizes.some((s) => !s.size || s.price <= 0 || s.stock < 0)) {
            newErrors.sizes = "Todos los talles deben tener datos válidos (talle, precio > 0, stock >= 0)."
        }

        if (files.length === 0 && existingFiles.length === 0) {
            newErrors.images = "Debe subir al menos una imagen."
        }
        return newErrors
    }

    // Load categories on component mount
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await fetchCategorias(1, 100)
                setCategories(res.categories)
            } catch (err) {
                toast.error("No se pudieron cargar las categorías")
            }
        }
        loadCategories()
    }, [])

    // Load product data for edit mode
    useEffect(() => {
        if (!id) {
            setLoading(false)
            return
        }
        const loadProducto = async () => {
            try {
                const p = await fetchProductoById(id as string)
                if (p) {
                    setName(p.name)
                    setDetails(p.details)
                    setCategoryId(p.category.id)
                    setSizes(
                        p.sizes.map((s) => ({
                            id: s.id,
                            size: s.size,
                            price: s.price,
                            stock: s.stock,
                        })),
                    )
                    setExistingFiles(p.files || [])
                } else {
                    toast.error("Producto no encontrado.")
                    router.push("/dashboard/productos")
                }
            } catch {
                toast.error("Error al cargar el producto.")
                router.push("/dashboard/productos")
            } finally {
                setLoading(false)
            }
        }
        loadProducto()
    }, [id, router])

    // Clean up image previews on unmount
    useEffect(() => {
        return () => {
            imagePreviews.forEach((url) => URL.revokeObjectURL(url))
        }
    }, [imagePreviews])

    // Effect to update errors whenever relevant form data changes
    useEffect(() => {
        setErrors(validateForm())
    }, [name, details, categoryId, sizes, files, existingFiles])

    const handleBlur = (fieldName: keyof typeof errors) => {
        setTouched((prev) => ({ ...prev, [fieldName]: true }))
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        if (name === "name") setName(value)
        else if (name === "details") setDetails(value)
        // No need to clear specific error here, useEffect will re-validate
    }

    const handleCategoryChange = (value: string) => {
        setCategoryId(value)
        setTouched((prev) => ({ ...prev, categoryId: true })) // Mark category as touched
    }

    const handleSizeInputChange = (index: number, field: keyof SizeInput, value: string | number) => {
        const newSizes = [...sizes]
        if (field === "size") {
            newSizes[index][field] = String(value)
        } else if (field === "price" || field === "stock") {
            newSizes[index][field] = Number(value)
        }
        setSizes(newSizes)
        setTouched((prev) => ({ ...prev, sizes: true })) // Mark sizes as touched
    }

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || [])
        const newFiles: File[] = []
        const newImagePreviews: string[] = []
        let hasImageSizeError = false

        selectedFiles.forEach((file) => {
            if (file.size > MAX_IMAGE_SIZE_BYTES) {
                toast.error(`La imagen "${file.name}" excede el tamaño máximo de ${MAX_IMAGE_SIZE_KB}KB.`)
                hasImageSizeError = true
            } else {
                newFiles.push(file)
                newImagePreviews.push(URL.createObjectURL(file))
            }
        })

        imagePreviews.forEach((url) => URL.revokeObjectURL(url)) // Revoke old previews

        setFiles(newFiles)
        setImagePreviews(newImagePreviews)
        setTouched((prev) => ({ ...prev, images: true })) // Mark images as touched
    }

    const removeImage = (i: number) => {
        URL.revokeObjectURL(imagePreviews[i])
        setFiles(files.filter((_, idx) => idx !== i))
        setImagePreviews(imagePreviews.filter((_, idx) => idx !== i))
        setTouched((prev) => ({ ...prev, images: true })) // Mark images as touched
    }

    const removeExistingImage = (imgId: string) => {
        setExistingFiles((prev) => prev.filter((f) => f.id !== imgId))
        setTouched((prev) => ({ ...prev, images: true })) // Mark images as touched
    }

    const addSize = () => {
        setSizes([...sizes, { size: "", price: 0, stock: 0 }])
        setTouched((prev) => ({ ...prev, sizes: true })) // Mark sizes as touched
    }

    const removeSize = (i: number) => {
        setSizes(sizes.filter((_, idx) => idx !== i))
        setTouched((prev) => ({ ...prev, sizes: true })) // Mark sizes as touched
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setFormSubmitted(true) // Mark form as submitted to show all errors

        const currentErrors = validateForm() // Get latest errors
        setErrors(currentErrors) // Update errors state immediately

        if (Object.keys(currentErrors).length > 0) {
            toast.error("Por favor, corrige los errores en el formulario.")
            return
        }

        setSubmitting(true)

        try {
            const uploadedFileIds: string[] = []
            for (const file of files) {
                const subida = await subirImagen(file, name)
                if (!subida || !subida.id) {
                    toast.error(subida?.message || subida?.error || "Error al subir una imagen. Intenta nuevamente.")
                    setSubmitting(false)
                    return
                }
                uploadedFileIds.push(subida.id)
            }

            const existingFileIds = existingFiles.map((f) => f.id)
            const allFileIds = [...existingFileIds, ...uploadedFileIds]

            const productoData = {
                name,
                details,
                category_Id: categoryId,
                sizes: sizes.map((s) => {
                    const sizeObj: any = {
                        size: s.size,
                        price: s.price,
                        stock: s.stock,
                    }
                    if (s.id) sizeObj.id = s.id
                    return sizeObj
                }),
                file_Ids: allFileIds,
            }

            console.log("📦 JSON enviado al PUT/POST:", JSON.stringify(productoData, null, 2))

            const resultado = id ? await actualizarProducto(id as string, productoData) : await crearProducto(productoData)

            if (resultado) {
                toast.success(id ? "Producto actualizado correctamente" : "Producto creado correctamente")
                router.push("/dashboard/productos")
            } else {
                toast.error("Error al guardar el producto.")
            }
        } catch (err) {
            console.error("Error en handleSubmit:", err)
            toast.error("Ocurrió un error inesperado al guardar el producto.")
        } finally {
            setSubmitting(false)
        }
    }

    // The submit button should be disabled if there are any errors, regardless of whether they are displayed yet.
    // This prevents submitting invalid data even if the user hasn't blurred all fields.
    const isFormInvalid = Object.keys(errors).length > 0

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-12 h-12 animate-spin text-[#017d74]" />
                    <p className="text-gray-600">Cargando datos del producto...</p>
                </div>
            </div>
        )
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
                                    <Label htmlFor="name">Nombre</Label>
                                    <Input id="name" name="name" value={name} onChange={handleChange} onBlur={() => handleBlur("name")} />
                                    {errors.name && (touched.name || formSubmitted) && (
                                        <p className="text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="details">Detalles</Label>
                                    <Textarea
                                        id="details"
                                        name="details"
                                        value={details}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur("details")}
                                    />
                                    {errors.details && (touched.details || formSubmitted) && (
                                        <p className="text-sm text-red-600">{errors.details}</p>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <Label htmlFor="category">Categoría</Label>
                                    <Select value={categoryId} onValueChange={handleCategoryChange}>
                                        <SelectTrigger id="category" onBlur={() => handleBlur("categoryId")}>
                                            <SelectValue placeholder="Seleccionar categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((c) => (
                                                <SelectItem key={c.id} value={c.id}>
                                                    {c.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.categoryId && (touched.categoryId || formSubmitted) && (
                                        <p className="text-sm text-red-600">{errors.categoryId}</p>
                                    )}
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
                                    <div className="grid grid-cols-4 gap-4 font-semibold text-sm text-gray-600">
                                        <span>Talle</span>
                                        <span>Precio</span>
                                        <span>{id ? "Stock" : "Cantidad"}</span>
                                        <span className="sr-only">Acciones</span>
                                    </div>
                                    {sizes.map((s, i) => (
                                        <div key={i} className="grid grid-cols-4 gap-4 items-center">
                                            <Select value={s.size} onValueChange={(val) => handleSizeInputChange(i, "size", val)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Talle" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {sizeOptions.map((size) => (
                                                        <SelectItem key={size} value={size}>
                                                            {size}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <Input
                                                type="number"
                                                value={s.price}
                                                onChange={(e) => handleSizeInputChange(i, "price", e.target.value)}
                                                placeholder="Precio"
                                                onBlur={() => handleBlur("sizes")} // Mark sizes as touched on blur of any size input
                                            />
                                            <Input
                                                type="number"
                                                value={s.stock}
                                                onChange={(e) => handleSizeInputChange(i, "stock", e.target.value)}
                                                placeholder={id ? "Stock" : "Cantidad"}
                                                onBlur={() => handleBlur("sizes")} // Mark sizes as touched on blur of any size input
                                            />
                                            {sizes.length > 1 && (
                                                <Button type="button" variant="ghost" onClick={() => removeSize(i)}>
                                                    <X className="w-4 h-4 text-red-500" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    {errors.sizes && (touched.sizes || formSubmitted) && (
                                        <p className="text-sm text-red-600">{errors.sizes}</p>
                                    )}
                                </div>
                            </div>
                            <Separator />
                            <div className="space-y-3">
                                <Label className="text-base font-medium">Imágenes</Label>
                                <div
                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-500 transition"
                                    onClick={() => document.getElementById("fileUpload")?.click()}
                                >
                                    <input
                                        id="fileUpload"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <p className="text-gray-500 text-sm">Haz clic o arrastra imágenes aquí</p>
                                    <p className="text-gray-400 text-xs mt-1">Formatos aceptados: JPG, PNG, WEBP</p>
                                </div>
                                {errors.images && (touched.images || formSubmitted) && (
                                    <p className="text-sm text-red-600">{errors.images}</p>
                                )}
                                {existingFiles.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {existingFiles.map(({ id, url }) => (
                                            <div key={id} className="relative group rounded overflow-hidden shadow">
                                                <img
                                                    src={url || "/placeholder.svg"}
                                                    className="object-cover w-full h-32"
                                                    alt="Existing product image"
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={() => removeExistingImage(id)}
                                                    variant="destructive"
                                                    size="icon"
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
                                            <div key={i} className="relative group rounded overflow-hidden shadow">
                                                <img
                                                    src={url || "/placeholder.svg"}
                                                    className="object-cover w-full h-32"
                                                    alt={`New product image preview ${i + 1}`}
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={() => removeImage(i)}
                                                    variant="destructive"
                                                    size="icon"
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
                                <Button
                                    type="submit"
                                    className="w-full h-14 text-lg font-semibold"
                                    disabled={submitting || isFormInvalid} // Disable button when submitting or if there are any errors
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            {id ? "Actualizando..." : "Creando..."}
                                        </>
                                    ) : id ? (
                                        "Actualizar Producto"
                                    ) : (
                                        "Crear Producto"
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

export default ProductoForm
