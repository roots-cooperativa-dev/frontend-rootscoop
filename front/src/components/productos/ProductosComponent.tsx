"use client"

import { useEffect, useState, useCallback } from "react"
import { fetchProductos } from "../../app/utils/ProductsHelper"
import { fetchCategorias } from "../../app/utils/CategoriasHelper"
import type { IProducto, ICategory } from "../../app/types"
import { ShoppingBag, ArrowLeft, Heart, Star, Search, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card"
import { Badge } from "../ui/badge"
import Link from "next/link"
import { Button } from "../ui/button"
import Image from "next/image"
import AuthProducts from "../authNav/authProductos"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { toast } from "sonner"

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

export const Productos = () => {
  const [productos, setProductos] = useState<IProducto[]>([])
  const [categorias, setCategorias] = useState<ICategory[]>([])
  const [selectedCategorias, setSelectedCategorias] = useState<string[]>([])
  const [name, setName] = useState<string>("")
  const [minPrice, setMinPrice] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalProducts, setTotalProducts] = useState<number>(0)
  const itemsPerPage = 2


  const debouncedSearchTerm = useDebounce(name, 500)

  const loadProductos = useCallback(
    async (
      filters: {
        categorias?: string[]
        name?: string
        minPrice?: string
        maxPrice?: string
        page?: number
      } = {},
    ) => {
      setLoading(true)
      try {
        const response = await fetchProductos({
          categoryId: filters.categorias?.length ? filters.categorias.join(",") : undefined,
          name: filters.name || undefined,
          minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
          maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
          page: filters.page || currentPage,
          limit: itemsPerPage,
        })

        console.log("Respuesta de la API:", response) // Para debug

        const activos = response.products.filter((p) => !p.deletedAt)
        setProductos(activos)

        // Usar los valores correctos de la respuesta de la API
        if (response.pages) {
          setTotalPages(response.pages)
        } else {
          // Fallback si no hay información de paginación
          setTotalPages(activos.length < itemsPerPage ? 1 : currentPage + 1)
        }

        // Establecer el total correcto
        if ('totalCount' in response && typeof (response as any).totalCount === 'number') {
          setTotalProducts((response as any).totalCount)
        } else {
          // Si no hay totalCount, usar una estimación
          setTotalProducts(activos.length < itemsPerPage ? activos.length : currentPage * itemsPerPage + 1)
        }
      } catch (error) {
        console.error("Error al filtrar productos:", error)
        toast.error("Error al cargar productos")
        // En caso de error, resetear valores
        setProductos([])
        setTotalPages(1)
        setTotalProducts(0)
      } finally {
        setLoading(false)
      }
    },
    [currentPage, itemsPerPage],
  )

  // Efecto para búsqueda en tiempo real
  useEffect(() => {
    // Solo ejecutar si realmente cambió el término de búsqueda
    setCurrentPage(1) // Resetear a página 1 cuando se busca
    loadProductos({
      categorias: selectedCategorias,
      name: debouncedSearchTerm,
      minPrice,
      maxPrice,
      page: 1,
    })
  }, [debouncedSearchTerm])

  // Efecto separado para filtros (sin búsqueda)
  useEffect(() => {
    if (name === debouncedSearchTerm) {
      // Solo si no hay búsqueda pendiente
      loadProductos({
        categorias: selectedCategorias,
        name: debouncedSearchTerm,
        minPrice,
        maxPrice,
        page: currentPage,
      })
    }
  }, [currentPage, selectedCategorias, minPrice, maxPrice])

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const { categories } = await fetchCategorias()
        setCategorias(categories)
        await loadProductos({ page: 1 })
      } catch (error) {
        console.error("Error cargando datos iniciales:", error)
        toast.error("Error al cargar categorías")
      }
    }
    loadInitialData()
  }, [])

  const toggleCategoria = async (id: string) => {
    const nuevasCategorias = id === "all" ? [] : [id]
    setSelectedCategorias(nuevasCategorias)
    setCurrentPage(1)
    await loadProductos({
      categorias: nuevasCategorias,
      name: debouncedSearchTerm,
      minPrice,
      maxPrice,
      page: 1,
    })
  }

  const limpiarFiltros = async () => {
    setSelectedCategorias([])
    setName("")
    setMinPrice("")
    setMaxPrice("")
    setCurrentPage(1)
    await loadProductos({ page: 1 })
  }

  const aplicarFiltros = async () => {
    setCurrentPage(1)
    await loadProductos({
      categorias: selectedCategorias,
      name: debouncedSearchTerm,
      minPrice,
      maxPrice,
      page: 1,
    })
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && !loading) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
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
              <AuthNav />
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
        <div className="text-center mb-12">
          <h1 className="font-chewy text-5xl font-black text-[#017d74] mb-4">Productos ROOTS</h1>
          <p className="font-bebas text-xl text-gray-700 max-w-3xl mx-auto font-medium">
            Productos con identidad cooperativa. Cada compra apoya nuestro trabajo colectivo y fortalece la red de{" "}
            <span className="text-[#922f4e] font-bold">economía social</span>.
          </p>
        </div>

        {/* Filtros */}
        <Card className="mb-6 border-2 border-gray-100 shadow-sm">
          <CardContent className="py-4">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar productos en tiempo real..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-[#017d74] focus:ring-[#017d74]"
                  />
                  {name && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-2 h-2 bg-[#017d74] rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              </div>
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
              <div className="flex gap-2">
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={limpiarFiltros}
                    className="border-gray-200 hover:border-[#922f4e] hover:text-[#922f4e] bg-transparent"
                    disabled={loading}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Limpiar
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información de resultados */}
        {(hasActiveFilters || totalProducts > 0) && (
          <div className="mb-6 p-4 bg-[#017d74]/5 border border-[#017d74]/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-[#017d74] text-white">
                  {totalProducts} productos encontrados
                </Badge>
                {selectedCategorias.length > 0 && (
                  <span className="text-sm text-gray-600">
                    en {selectedCategorias.length} categoría
                    {selectedCategorias.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
              {totalPages > 1 && (
                <span className="text-sm text-gray-600">
                  Página {currentPage} de {totalPages}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Contenido principal */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#017d74] mx-auto"></div>
              <p className="text-gray-500">{name ? "Buscando productos..." : "Cargando productos..."}</p>
            </div>
          </div>
        ) : productos.length === 0 ? (
          <div className="text-center py-20">
            <div className="space-y-4">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-600">No se encontraron productos</h3>
              <p className="text-gray-500">
                {name ? `No hay productos que coincidan con "${name}"` : "Intenta ajustar los filtros de búsqueda"}
              </p>
              <Button onClick={limpiarFiltros} variant="outline" className="mt-4 bg-transparent">
                Ver todos los productos
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Grid de productos */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productos.map((producto) => (
                <Link
                  key={producto.id}
                  href={`/productos/${producto.id}`}
                  className="group transition-all duration-300 border-2 border-gray-100 hover:border-[#017d74] hover:-translate-y-1 rounded-xl overflow-hidden"
                >
                  <Card className="flex flex-col justify-between h-full">
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
                        onClick={(e) => e.preventDefault()}
                      >
                        <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                      </Button>
                      {producto.sizes[0]?.stock > 0 && producto.sizes[0]?.stock <= 5 && (
                        <Badge className="absolute top-3 left-3 bg-orange-500 text-white text-xs">
                          ¡Últimas unidades!
                        </Badge>
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
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <Card className="mt-8 border-2 border-gray-100 shadow-sm">
                <CardContent className="py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        disabled={currentPage <= 1 || loading}
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="flex items-center space-x-2 border-gray-200 hover:border-[#017d74] hover:text-[#017d74]"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Anterior</span>
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Páginas */}
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            disabled={loading}
                            className={`w-10 h-10 p-0 ${currentPage === pageNum
                                ? "bg-[#017d74] hover:bg-[#015d54] text-white"
                                : "border-gray-200 hover:border-[#017d74] hover:text-[#017d74]"
                              }`}
                          >
                            {pageNum}
                          </Button>
                        )
                      })}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        disabled={currentPage >= totalPages || loading}
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="flex items-center space-x-2 border-gray-200 hover:border-[#017d74] hover:text-[#017d74]"
                      >
                        <span>Siguiente</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-center mt-4">
                    <span className="text-sm text-gray-600">
                      Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, totalProducts)} -{" "}
                      {Math.min(currentPage * itemsPerPage, totalProducts)} de {totalProducts} productos
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
