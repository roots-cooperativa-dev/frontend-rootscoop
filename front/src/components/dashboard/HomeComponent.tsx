"use client"

import type React from "react"

import { Badge } from "../../components/ui/badge"

import { useEffect, useState } from "react"
import { fetchVisitas } from "../../app/utils/VisitasHelper"
import { fetchCategorias } from "../../app/utils/CategoriasHelper"
import { fetchProductos } from "../../app/utils/ProductsHelper"
import { fetchUsers } from "../../app/utils/UsuariosHelper"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts" // Removed Line, LineChart
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Calendar, Box, Users, Tag, Loader2, TrendingUp, Package, Clock } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../../components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { cn } from "../../lib/utils"
import type { IUsuario } from "../../app/types" // Import the IUsuario interface

export const HomeComponent = () => {
    const [loading, setLoading] = useState(true)
    const [totalVisitas, setTotalVisitas] = useState(0)
    const [totalCategorias, setTotalCategorias] = useState(0)
    const [totalProductos, setTotalProductos] = useState(0)
    const [totalUsuarios, setTotalUsuarios] = useState(0)
    const [productosPorCategoria, setProductosPorCategoria] = useState<any[]>([])
    const [ultimasVisitas, setUltimasVisitas] = useState<any[]>([])
    const [usuariosPorMes, setUsuariosPorMes] = useState<any[]>([]) // State for real user data

    useEffect(() => {
        const cargarDatos = async () => {
            setLoading(true)
            try {
                const visitas = await fetchVisitas()
                const { categories } = await fetchCategorias(1, 100)
                const { products } = await fetchProductos({ page: 1, limit: 100 })
                const { users } = (await fetchUsers(1, 100)) as { users: IUsuario[] } // Cast to IUsuario[]

                setTotalVisitas(visitas.length)
                setTotalCategorias(categories.length)
                setTotalProductos(products.length)
                setTotalUsuarios(users.length)

                // Agrupar productos por categoría
                const agrupados = categories.map((cat) => {
                    const count = products.filter((p) => p.category.id === cat.id).length
                    return { name: cat.name, productos: count }
                })
                setProductosPorCategoria(agrupados)

                // Últimas 5 visitas, ordenadas por fecha si es posible
                const sortedVisitas = [...visitas].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                setUltimasVisitas(sortedVisitas.slice(0, 5))

                // Procesar usuarios por mes (usando createdAt)
                const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
                const currentYear = new Date().getFullYear()
                const monthlyUserCounts: { [key: string]: number } = {}

                // Initialize counts for all months of the current year to 0
                for (let i = 0; i < 12; i++) {
                    monthlyUserCounts[monthNames[i]] = 0
                }

                users.forEach((user) => {
                    const createdAtDate = new Date(user.createdAt)
                    if (createdAtDate.getFullYear() === currentYear) {
                        // Only count users from the current year
                        const monthIndex = createdAtDate.getMonth()
                        const monthName = monthNames[monthIndex]
                        monthlyUserCounts[monthName] = (monthlyUserCounts[monthName] || 0) + 1
                    }
                })

                const processedUsersByMonth = monthNames.map((month) => ({
                    mes: month,
                    usuarios: monthlyUserCounts[month],
                }))
                setUsuariosPorMes(processedUsersByMonth)
            } catch (error) {
                console.error("Error cargando datos del dashboard:", error)
            } finally {
                setLoading(false)
            }
        }
        cargarDatos()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-12 h-12 text-[#017d74] animate-spin" />
                <p className="ml-4 text-lg text-gray-600">Cargando datos del dashboard...</p>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-8">
            {/* Header Principal */}
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#017d74] to-[#015d54] rounded-xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 leading-tight">Panel de Administración</h1>
                    <p className="text-lg text-gray-600 mt-1">Visión general de tu sistema</p>
                </div>
            </div>

            {/* Números principales */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<Calendar className="text-blue-600" />}
                    label="Total Visitas"
                    value={totalVisitas}
                    bgColor="bg-blue-50"
                    iconBg="bg-blue-100"
                />
                <StatCard
                    icon={<Box className="text-green-600" />}
                    label="Total Productos"
                    value={totalProductos}
                    bgColor="bg-green-50"
                    iconBg="bg-green-100"
                />
                <StatCard
                    icon={<Users className="text-purple-600" />}
                    label="Total Usuarios"
                    value={totalUsuarios}
                    bgColor="bg-purple-50"
                    iconBg="bg-purple-100"
                />
                <StatCard
                    icon={<Tag className="text-orange-600" />}
                    label="Total Categorías"
                    value={totalCategorias}
                    bgColor="bg-orange-50"
                    iconBg="bg-orange-100"
                />
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    {" "}
                    {/* Removed shadow-lg */}
                    <CardHeader>
                        <CardTitle>Productos por Categoría</CardTitle> {/* Title size is default, can be adjusted with className */}
                        <CardDescription>Distribución de productos en tus categorías.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{
                                productos: {
                                    label: "Productos",
                                    color: "hsl(var(--chart-1))", // Usará el color primario de shadcn/ui
                                },
                            }}
                            className="h-[300px] w-full"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={productosPorCategoria}>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                    <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
                                    <YAxis tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                    <Bar dataKey="productos" fill="var(--color-productos)" /> {/* Removed radius */}
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <Card>
                    {" "}
                    {/* Removed shadow-lg */}
                    <CardHeader>
                        <CardTitle>Crecimiento de Usuarios</CardTitle> {/* Title size is default, can be adjusted with className */}
                        <CardDescription>Nuevos usuarios registrados por mes (Año actual).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer
                            config={{
                                usuarios: {
                                    label: "Usuarios",
                                    color: "hsl(var(--chart-2))", // Usará el color secundario de shadcn/ui
                                },
                            }}
                            className="h-[300px] w-full"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={usuariosPorMes}>
                                    {" "}
                                    {/* Changed to BarChart */}
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="mes" tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
                                    <YAxis tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
                                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                    <Bar
                                        dataKey="usuarios"
                                        fill="var(--color-usuarios)"
                                        radius={[4, 4, 0, 0]} // Subtle rounded top corners for bars
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Últimas visitas */}
            <Card>
                {" "}
                {/* Removed shadow-lg */}
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-700" />
                        Últimas Visitas Registradas
                    </CardTitle>
                    <CardDescription>Un vistazo rápido a las visitas más recientes.</CardDescription>
                </CardHeader>
                <CardContent>
                    {ultimasVisitas.length === 0 ? (
                        <div className="text-center py-8">
                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay visitas recientes</h3>
                            <p className="text-gray-500">Aún no se han registrado visitas en el sistema.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Título</TableHead>
                                        <TableHead>Descripción</TableHead>
                                        <TableHead>Personas</TableHead>
                                        <TableHead>Estado</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ultimasVisitas.map((visita, index) => (
                                        <TableRow key={index} className="hover:bg-gray-50">
                                            <TableCell className="font-medium">{visita.title}</TableCell>
                                            <TableCell className="text-gray-600">{visita.description}</TableCell>
                                            <TableCell className="text-gray-600">{visita.people}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    className={cn(
                                                        "font-medium",
                                                        visita.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
                                                    )}
                                                >
                                                    {visita.status === "active" ? "Activa" : "Inactiva"}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

// Componente reutilizable para cada número principal
const StatCard = ({
    icon,
    label,
    value,
    bgColor,
    iconBg,
}: {
    icon: React.ReactNode
    label: string
    value: number
    bgColor: string
    iconBg: string
}) => (
    <Card className={cn("shadow-md", bgColor)}>
        {" "}
        {/* Removed hover:shadow-lg */}
        <CardContent className="p-6 flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600">{label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
            </div>
            <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center shadow-sm", iconBg)}>{icon}</div>
        </CardContent>
    </Card>
)
