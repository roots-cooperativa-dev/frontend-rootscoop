'use client'
import { productos } from "@/src/app/utils/ProductosPreCargados"
import { ShoppingBag, ArrowLeft, Heart, Star } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card"
import { Badge } from "../ui/badge"
import Link from "next/link"
import { Button } from "../ui/button"

export const Productos = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-white border-b shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-[#017d74] rounded-full flex items-center justify-center shadow-lg">
                                <ShoppingBag className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-black text-[#017d74]">ROOTS</span>
                        </Link>
                        <div className="flex items-center space-x-4">
                            <Button className="bg-[#922f4e] hover:bg-[#642d91] text-white font-bold shadow-lg" asChild>
                                <Link href="/login">Ingresar para comprar</Link>
                            </Button>
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
                    <h1 className="text-5xl font-black text-[#017d74] mb-4">Productos ROOTS</h1>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
                        Productos con identidad cooperativa. Cada compra apoya nuestro trabajo colectivo y fortalece la red de
                        <span className="text-[#922f4e] font-bold"> economía social</span>.
                    </p>
                </div>
                {/* Filtros */}
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                    <Badge className="cursor-pointer bg-[#922f4e] text-white hover:bg-[#642d91]">Todos</Badge>
                    <Badge
                        variant="outline"
                        className="cursor-pointer border-[#017d74] text-[#017d74] hover:bg-[#017d74] hover:text-white"
                    >
                        Indumentaria
                    </Badge>
                    <Badge
                        variant="outline"
                        className="cursor-pointer border-[#febb07] text-[#febb07] hover:bg-[#febb07] hover:text-black"
                    >
                        Hogar
                    </Badge>
                    <Badge
                        variant="outline"
                        className="cursor-pointer border-[#f39d10] text-[#f39d10] hover:bg-[#f39d10] hover:text-white"
                    >
                        Accesorios
                    </Badge>
                    <Badge
                        variant="outline"
                        className="cursor-pointer border-[#642d91] text-[#642d91] hover:bg-[#642d91] hover:text-white"
                    >
                        Papelería
                    </Badge>
                </div>
                {/* Productos Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {productos.map((producto) => (
                        <Card
                            key={producto.id}
                            className="overflow-hidden hover:shadow-lg transition-shadow border-2 border-gray-100 hover:border-[#017d74]"
                        >
                            <div className="relative">
                                <img
                                    src={producto.imagen || "/placeholder.svg"}
                                    alt={producto.nombre}
                                    className="w-full h-48 object-cover"
                                />
                                {!producto.disponible && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <Badge className="bg-gray-600 text-white">Agotado</Badge>
                                    </div>
                                )}
                                <Button size="sm" variant="outline" className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white">
                                    <Heart className="w-4 h-4" />
                                </Button>
                            </div>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg text-gray-900">{producto.nombre}</CardTitle>
                                        <Badge variant="outline" className="mt-1 border-[#febb07] text-[#febb07]">
                                            {producto.categoria}
                                        </Badge>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-[#017d74]">${producto.precio}</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="mb-4 text-gray-600">{producto.descripcion}</CardDescription>
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
                                <Button
                                    className={`w-full ${producto.disponible ? "bg-[#922f4e] hover:bg-[#642d91] text-white" : "bg-gray-400 text-gray-600"}`}
                                    disabled={!producto.disponible}
                                    asChild={producto.disponible}
                                >
                                    {producto.disponible ? <Link href="/login">Comprar ahora</Link> : "Agotado"}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                {/* Info Section */}
                <div className="mt-16 bg-gray-50 rounded-lg p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-[#017d74] mb-4">¿Por qué comprar productos ROOTS?</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-[#922f4e] rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="font-semibold mb-2 text-[#922f4e]">Apoyo Cooperativo</h3>
                            <p className="text-gray-600">Cada compra fortalece nuestro trabajo colectivo y la economía social.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-[#017d74] rounded-full flex items-center justify-center mx-auto mb-4">
                                <Star className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="font-semibold mb-2 text-[#017d74]">Calidad Artesanal</h3>
                            <p className="text-gray-600">Productos únicos creados con amor y dedicación por artistas locales.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-[#642d91] rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShoppingBag className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="font-semibold mb-2 text-[#642d91]">Identidad Cooperativa</h3>
                            <p className="text-gray-600">Llevá con vos los valores y la historia de ROOTS.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}