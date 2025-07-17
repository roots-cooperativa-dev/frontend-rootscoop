'use client'

import { useEffect, useState } from "react"
import { fetchProductos } from "../../app/utils/ProductsHelper"
import { IProducto } from "../../app/types/index"
import { ShoppingBag, ArrowLeft, Heart, Star } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../ui/card"
import { Badge } from "../ui/badge"
import Link from "next/link"
import { Button } from "../ui/button"
import Image from "next/image"

export const Productos = () => {
    const [productos, setProductos] = useState<IProducto[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadProductos = async () => {
            const data = await fetchProductos()
            setProductos(data)
            setLoading(false)
        }

        loadProductos()
    }, [])

    return (
        <div className="min-h-screen bg-white">
            <header className="bg-white border-b shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-3">
                            <Image
                                src="/logos/roots.png"
                                alt="Rootscoop Logo"
                                width={300}
                                height={40}
                                className="rounded-full object-contain"
                                priority
                            />
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
                    <h1 className="font-chewy text-5xl font-black text-[#017d74] mb-4">Productos ROOTS</h1>
                    <p className="font-bebas text-xl text-gray-700 max-w-3xl mx-auto font-medium">
                        Productos con identidad cooperativa. Cada compra apoya nuestro trabajo colectivo y fortalece la red de
                        <span className="text-[#922f4e] font-bold"> economía social</span>.
                    </p>
                </div>
                {loading ? (
                    <p className="text-center text-gray-500">Cargando productos...</p>
                ) : productos.length === 0 ? (
                    <p className="text-center text-gray-500">No se encontraron productos.</p>
                ) : (
                    <>
                        <div className="flex flex-wrap gap-2 mb-8 justify-center">
                            <Badge className="cursor-pointer bg-[#922f4e] text-white hover:bg-[#642d91]">Todos</Badge>
                            <Badge variant="outline" className="cursor-pointer border-[#017d74] text-[#017d74] hover:bg-[#017d74] hover:text-white">Indumentaria</Badge>
                            <Badge variant="outline" className="cursor-pointer border-[#febb07] text-[#febb07] hover:bg-[#febb07] hover:text-black">Hogar</Badge>
                            <Badge variant="outline" className="cursor-pointer border-[#f39d10] text-[#f39d10] hover:bg-[#f39d10] hover:text-white">Accesorios</Badge>
                            <Badge variant="outline" className="cursor-pointer border-[#642d91] text-[#642d91] hover:bg-[#642d91] hover:text-white">Papelería</Badge>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {productos.map((producto) => (
                                <Card
                                    key={producto.id}
                                    className="overflow-hidden hover:shadow-lg transition-shadow border-2 border-gray-100 hover:border-[#017d74]"
                                >
                                    <div className="relative">
                                        <img
                                            src={producto.files[0]?.url || "/img/image-not-found.jpg"}
                                            alt={producto.name}
                                            className="w-full h-48 object-cover"
                                        />
                                        {producto.sizes[0]?.stock === 0 && (
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
                                                <CardTitle className="text-lg text-gray-900">{producto.name}</CardTitle>
                                                <Badge variant="outline" className="mt-1 border-[#febb07] text-[#febb07]">
                                                    {producto.category.name}
                                                </Badge>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-[#017d74]">${producto.sizes[0]?.price ?? '-'}</p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="mb-4 text-gray-600">{producto.details}</CardDescription>
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
                                        <div className="space-y-2">
                                            <Button
                                                className={`w-full ${producto.sizes[0]?.stock > 0 ? "bg-[#922f4e] hover:bg-[#642d91] text-white" : "bg-gray-400 text-gray-600"}`}
                                                disabled={producto.sizes[0]?.stock === 0}
                                                asChild={producto.sizes[0]?.stock > 0}
                                            >
                                                {producto.sizes[0]?.stock > 0 ? <Link href="/login">Comprar ahora</Link> : "Agotado"}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="w-full text-[#017d74] border-[#017d74] hover:bg-[#017d74] hover:text-white"
                                                asChild
                                            >
                                                <Link href={`/productos/${producto.id}`}>Ver más</Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </>
                )}
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
