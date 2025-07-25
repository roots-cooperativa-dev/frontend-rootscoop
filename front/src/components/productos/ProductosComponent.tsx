"use client"

import { useEffect, useState } from "react"
import { fetchProductos } from "../../app/utils/ProductsHelper"
import { fetchCategorias } from "../../app/utils/CategoriasHelper"
import type { IProducto, ICategory } from "../../app/types"
import { ShoppingBag, ArrowLeft, Heart, Star, Search, X } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card"
import { Badge } from "../ui/badge"
import Link from "next/link"
import { Button } from "../ui/button"
import Image from "next/image"
import AuthProducts from "../authNav/authProductos"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"

export const Productos = () => {
    const [productos, setProductos] = useState<IProducto[]>([])
    const [categorias, setCategorias] = useState<ICategory[]>([])
    const [selectedCategorias, setSelectedCategorias] = useState<string[]>([])
    const [name, setName] = useState<string>("")
    const [minPrice, setMinPrice] = useState<string>("")
    const [maxPrice, setMaxPrice] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(true)

    const loadProductos = async (
        filters: { categorias?: string[]; name?: string; minPrice?: string; maxPrice?: string } = {},
    ) => {
        setLoading(true)
        try {
            const { products } = await fetchProductos({
                categoryId: filters.categorias?.length ? filters.categorias.join(",") : undefined,
                name: filters.name || undefined,
                minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
                maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
                page: 1,
                limit: 100,
            })
            setProductos(products)
        } catch (error) {
            console.error("Error al filtrar productos:", error)
        } finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        const loadInitialData = async () => {
            const { categories } = await fetchCategorias()
            setCategorias(categories)
            await loadProductos()
        }
        loadInitialData()
    }, [])

    const toggleCategoria = async (id: string) => {
        const nuevasCategorias = id === "all" ? [] : [id]
        setSelectedCategorias(nuevasCategorias)
        await loadProductos({ categorias: nuevasCategorias, name, minPrice, maxPrice })
    }

    const limpiarFiltros = async () => {
        setSelectedCategorias([])
        setName("")
        setMinPrice("")
        setMaxPrice("")
        await loadProductos()
    }

    const aplicarFiltros = async () => {
        await loadProductos({ categorias: selectedCategorias, name, minPrice, maxPrice })
    }

    const hasActiveFilters = selectedCategorias.length > 0 || name || minPrice || maxPrice

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <header className="bg-white border-b shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-3">
                            <Image
                                src="/logos/roots.png"
                                alt="Rootscoop Logo"
                                width={70}
                                height={40}
                                className="rounded-full object-contain"
                                priority
                            />
                        </Link>
                        <div className="flex items-center space-x-4">
                            <AuthProducts />
                            <Link
                                href="/"
                                className="flex items-center space-x-2 text-gray-600 hover:text-[#017d74] transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Volver</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <h1 className="font-chewy text-5xl font-black text-[#017d74] mb-4">Productos ROOTS</h1>
                    <p className="font-bebas text-xl text-gray-700 max-w-3xl mx-auto font-medium">
                        Productos con identidad cooperativa. Cada compra apoya nuestro trabajo colectivo y fortalece la red de{" "}
                        <span className="text-[#922f4e] font-bold">economía social</span>.
                    </p>
                </div>

                {/* Filtros compactos en una línea */}
                <Card className="mb-6 border-2 border-gray-100 shadow-sm">
                    <CardContent className="py-4">
                        <div className="flex flex-wrap items-end gap-4">
                            {/* Búsqueda */}
                            <div className="flex-1 min-w-[200px]">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Buscar productos..."
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-10 border-gray-200 focus:border-[#017d74] focus:ring-[#017d74]"
                                    />
                                </div>
                            </div>

                            {/* Categorías */}
                            <div className="min-w-[180px]">
                                <Select
                                    value={selectedCategorias.length === 1 ? selectedCategorias[0] : ""}
                                    onValueChange={(value) => {
                                        if (value === "all") {
                                            setSelectedCategorias([])
                                        } else {
                                            setSelectedCategorias([value])
                                        }
                                    }}
                                >
                                    <SelectTrigger className="border-gray-200 focus:border-[#017d74] focus:ring-[#017d74]">
                                        <SelectValue placeholder="Todas las categorías" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todas las categorías</SelectItem>
                                        {categorias.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Precio mínimo */}
                            <div className="min-w-[120px]">
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">$</span>
                                    <Input
                                        placeholder="Min"
                                        type="number"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="pl-8 border-gray-200 focus:border-[#017d74] focus:ring-[#017d74]"
                                    />
                                </div>
                            </div>

                            {/* Precio máximo */}
                            <div className="min-w-[120px]">
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">$</span>
                                    <Input
                                        placeholder="Max"
                                        type="number"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="pl-8 border-gray-200 focus:border-[#017d74] focus:ring-[#017d74]"
                                    />
                                </div>
                            </div>

                            {/* Botones de acción */}
                            <div className="flex gap-2">
                                <Button onClick={aplicarFiltros} className="bg-[#017d74] hover:bg-[#015d54] text-white">
                                    <Search className="w-4 h-4 mr-1" />
                                    Filtrar
                                </Button>
                                {hasActiveFilters && (
                                    <Button
                                        variant="outline"
                                        onClick={limpiarFiltros}
                                        className="border-gray-200 hover:border-[#922f4e] hover:text-[#922f4e] bg-transparent"
                                    >
                                        <X className="w-4 h-4 mr-1" />
                                        Limpiar
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Indicador de filtros activos */}
                {hasActiveFilters && (
                    <div className="mb-6 p-4 bg-[#017d74]/5 border border-[#017d74]/20 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Badge variant="secondary" className="bg-[#017d74] text-white">
                                    {productos.length} productos encontrados
                                </Badge>
                                {selectedCategorias.length > 0 && (
                                    <span className="text-sm text-gray-600">
                                        en {selectedCategorias.length} categoría{selectedCategorias.length > 1 ? "s" : ""}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Productos */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="text-center space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#017d74] mx-auto"></div>
                            <p className="text-gray-500">Cargando productos...</p>
                        </div>
                    </div>
                ) : productos.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="space-y-4">
                            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto" />
                            <h3 className="text-xl font-semibold text-gray-600">No se encontraron productos</h3>
                            <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
                            <Button onClick={limpiarFiltros} variant="outline" className="mt-4 bg-transparent">
                                Ver todos los productos
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {productos.map((producto) => (
                            <Card
                                key={producto.id}
                                className="flex flex-col justify-between h-full group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-[#017d74] hover:-translate-y-1"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={producto.files[0]?.url || "/img/image-not-found.jpg"}
                                        alt={producto.name}
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {producto.sizes[0]?.stock === 0 && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <Badge className="bg-red-600 text-white font-semibold">Sin stock</Badge>
                                        </div>
                                    )}
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white shadow-md border-0 hover:scale-110 transition-transform"
                                    >
                                        <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                                    </Button>
                                    {producto.sizes[0]?.stock > 0 && producto.sizes[0]?.stock <= 5 && (
                                        <Badge className="absolute top-3 left-3 bg-orange-500 text-white text-xs">¡Últimas unidades!</Badge>
                                    )}
                                </div>
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <CardTitle className="text-lg text-gray-900 line-clamp-2 group-hover:text-[#017d74] transition-colors">
                                                {producto.name}
                                            </CardTitle>
                                            <Badge variant="outline" className="mt-2 border-[#febb07] text-[#febb07] bg-[#febb07]/10">
                                                {producto.category.name}
                                            </Badge>
                                        </div>
                                        <div className="text-right ml-3">
                                            <p className="text-2xl font-bold text-[#017d74]">${producto.sizes[0]?.price ?? "-"}</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex flex-col justify-between flex-grow pt-0">
                                    <CardDescription className="mb-4 text-gray-600 line-clamp-2">{producto.details}</CardDescription>
                                    <div className="flex items-center mb-4">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < 4 ? "fill-[#febb07] text-[#febb07]" : "text-gray-300"}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-600 ml-2">(12 reseñas)</span>
                                    </div>
                                    <div className="space-y-2 mt-auto">
                                        <Button
                                            className={`w-full transition-all duration-200 ${producto.sizes[0]?.stock > 0
                                                ? "bg-[#922f4e] hover:bg-[#7a2741] text-white shadow-md hover:shadow-lg"
                                                : "bg-gray-400 text-gray-600 cursor-not-allowed"
                                                }`}
                                            disabled={producto.sizes[0]?.stock === 0}
                                            asChild={producto.sizes[0]?.stock > 0}
                                        >
                                            {producto.sizes[0]?.stock > 0 ? (
                                                <Link href="/paginaError" className="flex items-center justify-center">
                                                    <ShoppingBag className="w-4 h-4 mr-2" />
                                                    Comprar ahora
                                                </Link>
                                            ) : (
                                                <span>Sin stock</span>
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full text-[#017d74] border-[#017d74] hover:bg-[#017d74] hover:text-white transition-all duration-200 bg-transparent"
                                            asChild
                                        >
                                            <Link href={`/productos/${producto.id}`}>Ver detalles</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
