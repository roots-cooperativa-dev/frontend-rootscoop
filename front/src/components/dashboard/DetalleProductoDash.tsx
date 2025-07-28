"use client"

import { useEffect, useState } from "react"
import { fetchProductoById } from "../../app/utils/ProductsHelper"
import type { IProducto } from "../../app/types"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Skeleton } from "../../components/ui/skeleton"
import { Package, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"

interface Props {
    productId: string
}

export const DetalleProductoDash = ({ productId }: Props) => {
    const [producto, setProducto] = useState<IProducto | null>(null)
    const [loading, setLoading] = useState(true)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    useEffect(() => {
        const cargarProducto = async () => {
            try {
                const data = await fetchProductoById(productId)
                setProducto(data)
                setCurrentImageIndex(0) // Reset image index when product changes
            } catch (error) {
                console.error("Error al cargar el producto:", error)
                setProducto(null) // Ensure product is null on error
            } finally {
                setLoading(false)
            }
        }
        cargarProducto()
    }, [productId])

    const prevImage = () => {
        if (!producto?.files || producto.files.length === 0) return
        setCurrentImageIndex((prev) => (prev === 0 ? producto.files.length - 1 : prev - 1))
    }

    const nextImage = () => {
        if (!producto?.files || producto.files.length === 0) return
        setCurrentImageIndex((prev) => (prev === producto.files.length - 1 ? 0 : prev + 1))
    }

    if (loading) {
        return (
            <div className="p-6">
                <Skeleton className="h-10 w-60 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="aspect-square w-full rounded-lg" />
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
            </div>
        )
    }

    if (!producto) {
        return (
            <div className="p-6 text-center">
                <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
                <h2 className="text-xl font-semibold text-red-600">Producto no encontrado</h2>
                <p className="text-gray-500">Verifica el ID o intenta nuevamente.</p>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900">Detalle del Producto</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Slider Imagenes */}
                <Card className="relative overflow-hidden">
                    {producto.files && producto.files.length > 0 ? (
                        <>
                            <img
                                src={producto.files[currentImageIndex].url || "/placeholder.svg"}
                                alt={`${producto.name} imagen ${currentImageIndex + 1}`}
                                className="w-full h-80 md:h-[400px] object-cover rounded-md"
                            />
                            {producto.files.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 p-2 rounded-full shadow"
                                        aria-label="Imagen anterior"
                                    >
                                        <ChevronLeft className="w-6 h-6 text-gray-700" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white bg-opacity-70 hover:bg-opacity-90 p-2 rounded-full shadow"
                                        aria-label="Imagen siguiente"
                                    >
                                        <ChevronRight className="w-6 h-6 text-gray-700" />
                                    </button>
                                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                        {producto.files.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentImageIndex(idx)}
                                                className={`w-3 h-3 rounded-full ${idx === currentImageIndex ? "bg-[#017d74]" : "bg-gray-300"}`}
                                                aria-label={`Ir a imagen ${idx + 1}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="w-full h-80 flex items-center justify-center bg-gray-100 rounded-md">
                            <Package className="w-12 h-12 text-gray-300" />
                        </div>
                    )}
                </Card>
                {/* Info producto */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold">{producto.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-gray-600">{producto.details}</p>
                        <div>
                            <span className="text-sm text-gray-500 font-medium">Categoría:</span>{" "}
                            <span className="font-semibold text-gray-800">{producto.category?.name || "Sin categoría"}</span>
                        </div>
                        <div className="pt-2">
                            <h4 className="text-base font-medium text-gray-800 mb-2">Talles y precios</h4>
                            {producto.sizes?.map((s, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center border border-gray-200 p-2 rounded-md mb-2 bg-gray-50"
                                >
                                    <div className="font-medium text-gray-700">Talle: {s.size}</div>
                                    <div className="text-sm text-gray-600">Precio: ${s.price}</div>
                                    <div className="text-sm text-gray-600">Stock: {s.stock}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
