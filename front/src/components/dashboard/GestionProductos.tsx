"use client"

import { useEffect, useState } from "react"
import { fetchProductos, eliminarProducto, restaurarProducto } from "../../app/utils/ProductsHelper"
import { fetchCategorias } from "../../app/utils/CategoriasHelper"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Plus, Eye, Edit, Trash2, Search, Filter, Package, ShoppingBag } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import Link from "next/link"
import { cn } from "../../lib/utils"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog"
import type { IProducto, ICategory } from "../../app/types"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip"

export const GestionProductos = () => {
  const [productos, setProductos] = useState<IProducto[]>([])
  const [categorias, setCategorias] = useState<ICategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "available" | "deleted">("all")
  const [categoryIdFilter, setCategoryIdFilter] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [productoAEliminar, setProductoAEliminar] = useState<IProducto | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(10)

  useEffect(() => {
    const obtenerCategorias = async () => {
      try {
        const res = await fetchCategorias(1, 100)
        setCategorias(res.categories)
      } catch (err) {
        console.error("Error cargando categorías", err)
      }
    }
    obtenerCategorias()
  }, [])

  useEffect(() => {
    const obtenerProductos = async () => {
      setLoading(true)
      try {
        const data = await fetchProductos({
          page: currentPage,
          limit,
          name: searchTerm || undefined,
          categoryId: categoryIdFilter || undefined,
          minPrice: minPrice ? Number.parseFloat(minPrice) : undefined,
          maxPrice: maxPrice ? Number.parseFloat(maxPrice) : undefined,
        })
        let filteredProducts = data.products;
        if (statusFilter === "available") {
          filteredProducts = filteredProducts.filter((p) => !p.deletedAt);
        } else if (statusFilter === "deleted") {
          filteredProducts = filteredProducts.filter((p) => !!p.deletedAt);
        }
        setProductos(filteredProducts)
        setTotalPages(data.pages)
      } catch (error) {
        toast.error("Error cargando productos")
      } finally {
        setLoading(false)
      }
    }
    obtenerProductos()
  }, [searchTerm, categoryIdFilter, minPrice, maxPrice, currentPage, statusFilter])

  const handleEliminarProducto = async () => {
    if (!productoAEliminar) return
    const eliminado = await eliminarProducto(productoAEliminar.id)
    if (eliminado) {
      toast.success("Producto eliminado correctamente")
      setProductos((prev) => prev.filter((p) => p.id !== productoAEliminar.id))
      setDialogOpen(false)
      setProductoAEliminar(null)
    } else {
      toast.error("No se pudo eliminar el producto")
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#017d74] to-[#015d54] rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            Gestión de Productos
          </h1>
          <p className="text-gray-600 mt-1">Administra tu inventario y catálogo de productos</p>
        </div>
        <Link href="/dashboard/productos/crear">
          <Button className="bg-[#017d74] hover:bg-[#015d54] text-white shadow-md">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Producto
          </Button>
        </Link>
      </div>

      {/* FILTROS */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={categoryIdFilter} onValueChange={setCategoryIdFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Precio mínimo"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-32"
            />
            <Input
              type="number"
              placeholder="Precio máximo"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-32"
            />
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as "all" | "available" | "deleted")}
            >
              <SelectTrigger className="w-48 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="available">Disponibles</SelectItem>
                <SelectItem value="deleted">Eliminados</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setCategoryIdFilter("")
                setMinPrice("")
                setMaxPrice("")
                setStatusFilter("all")
                setCurrentPage(1)
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* LISTADO */}
      <Card>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
          <CardDescription>Mostrando {productos.length} productos</CardDescription>
        </CardHeader>
        <CardContent>
          {!loading && productos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos disponibles</h3>
              <p className="text-gray-500 text-center mb-4">
                No se encontraron productos que coincidan con los filtros aplicados.
              </p>
              <Link href="/dashboard/productos/crear">
                <Button className="bg-[#017d74] hover:bg-[#015d54] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Producto
                </Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imagen</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productos.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell>
                      {producto.files?.[0]?.url ? (
                        <img
                          src={producto.files[0].url || "/placeholder.svg"}
                          className="w-12 h-12 object-cover rounded-lg"
                          alt={producto.name}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{producto.name}</TableCell>
                    <TableCell>${producto.sizes?.[0]?.price ?? "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        className={cn(
                          "font-medium",
                          !producto.deletedAt ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        )}
                      >
                        {!producto.deletedAt ? "Disponible" : "Eliminado"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link href={`/dashboard/productos/${producto.id}`}>
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent>Ver detalles</TooltipContent>
                          </Tooltip>

                          {!producto.deletedAt && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link href={`/dashboard/productos/edit/${producto.id}`}>
                                  <Button variant="ghost" size="sm">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent>Editar producto</TooltipContent>
                            </Tooltip>
                          )}

                          {producto.deletedAt ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <Package className="w-4 h-4 text-green-700" /> Restaurar
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>¿Restaurar producto?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        ¿Estás seguro de que querés restaurar el producto <strong>{producto.name}</strong>? Esta acción lo volverá a activar en el sistema.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={async () => {
                                          const ok = await restaurarProducto(producto.id)
                                          if (ok) {
                                            toast.success("Producto restaurado correctamente")
                                            setProductos((prev) =>
                                              prev.map((p) =>
                                                p.id === producto.id ? { ...p, deletedAt: null } : p
                                              )
                                            )
                                          } else {
                                            toast.error("No se pudo restaurar el producto")
                                          }
                                        }}
                                      >
                                        Restaurar
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </TooltipTrigger>
                              <TooltipContent>Restaurar producto</TooltipContent>
                            </Tooltip>
                          ) : (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => {
                                        setProductoAEliminar(producto)
                                        setDialogOpen(true)
                                      }}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Esta acción no se puede deshacer. ¿Eliminar <strong>{producto.name}</strong>?
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction onClick={handleEliminarProducto}>
                                        Eliminar
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </TooltipTrigger>
                              <TooltipContent>Eliminar producto</TooltipContent>
                            </Tooltip>
                          )}
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {/* PAGINACIÓN */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
              >
                Anterior
              </Button>
              <span className="text-sm text-gray-600">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
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
