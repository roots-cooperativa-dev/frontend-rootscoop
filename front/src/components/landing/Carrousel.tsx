'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ChevronLeft, ChevronRight, Eye, Play } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import Link from 'next/link';
export const CarrouselSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const carouselItems = [
        {
            id: 1,
            type: "visit",
            title: "Conocé el impacto de ROOTS",
            description:
                "Descubrí cómo nuestra cooperativa transforma la comunidad cervecera y construye alternativas de economía social en este video exclusivo.",
            thumbnail: "/historia/foto-local.png",
            buttonText: "Ver video",
            action: "https://www.youtube.com/watch?v=oazy_n1QewA",
            color: "#922f4e",
        },
        {
            id: 2,
            type: "visit",
            title: "Visitá la Mosca Soldado",
            description:
                "Una experiencia única donde podrás conocer a nuestra mosca soldado, que se alimenta de los restos del lúpulo de nuestra cerveza artesanal, creando un ciclo ecológico perfecto.",
            thumbnail: "/historia/mosca-soldado.jpg",
            buttonText: "Ver Video",
            action: "https://www.youtube.com/shorts/BZpREmaEtus",
            color: "#017d74",
        },
    ]
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % carouselItems.length)
    }

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length)
    }

    useEffect(() => {
        const timer = setInterval(nextSlide, 6000)
        return () => clearInterval(timer)
    }, [])
    return (

        <div className="container mx-auto px-4">
            <div className="text-center mb-16">
                <h2 className="font-chewy text-4xl font-black text-[#017d74] mb-4">Explorá ROOTS</h2>
                <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                    Descubrí todas las formas de conocer y ser parte de nuestra cooperativa
                </p>
            </div>
            <div className="relative max-w-5xl mx-auto">
                {/* Carrusel */}
                <div className="overflow-hidden rounded-2xl shadow-2xl">
                    <div
                        className="flex transition-transform duration-700 ease-in-out"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {carouselItems.map((item) => (
                            <div key={item.id} className="w-full flex-shrink-0">
                                <Card className="border-0 shadow-none bg-white">
                                    <div className="grid md:grid-cols-2 gap-0 min-h-[500px]">
                                        {/* Imagen/Video */}
                                        <div className="relative order-2 md:order-1">
                                            <img
                                                src={item.thumbnail || "/placeholder.svg"}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                            {item.type === "youtube" && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-all">
                                                    <div className="w-20 h-20 bg-white/95 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                                                        <Play className="w-10 h-10 text-[#922f4e] ml-1" />
                                                    </div>
                                                </div>
                                            )}
                                            {item.type === "visit" && (
                                                <div className="absolute top-6 right-6">
                                                    <Badge className="bg-[#017d74] text-white text-sm px-3 py-1">
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        Experiencia única
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>

                                        {/* Contenido */}
                                        <div className="p-8 md:p-12 flex flex-col justify-center order-1 md:order-2 bg-gray-50">
                                            <CardHeader className="p-0 mb-6">
                                                <CardTitle className="font-chewy text-3xl md:text-4xl font-black mb-4" style={{ color: item.color }}>
                                                    {item.title}
                                                </CardTitle>
                                                <CardDescription className="text-lg md:text-xl text-gray-700 leading-relaxed">
                                                    {item.description}
                                                </CardDescription>
                                            </CardHeader>

                                            <Button
                                                size="lg"
                                                className="text-white font-bold shadow-xl transform hover:scale-105 transition-all text-lg py-6 px-8"
                                                style={{ backgroundColor: item.color }}
                                                asChild
                                            >
                                                {item.type === "youtube" ? (
                                                    <a href={item.action} target="_blank" rel="noopener noreferrer">
                                                        <Play className="w-6 h-6 mr-3" />
                                                        {item.buttonText}
                                                    </a>
                                                ) : (
                                                    <Link href={item.action}>
                                                        <Eye className="w-6 h-6 mr-3" />
                                                        {item.buttonText}
                                                    </Link>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Controles del carrusel */}
                <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white/95 hover:bg-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110"
                >
                    <ChevronLeft className="w-7 h-7 text-[#017d74]" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white/95 hover:bg-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110"
                >
                    <ChevronRight className="w-7 h-7 text-[#017d74]" />
                </button>

                {/* Indicadores */}
                <div className="flex justify-center mt-8 space-x-3">
                    {carouselItems.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-4 h-4 rounded-full transition-all ${index === currentSlide ? "bg-[#017d74] scale-125" : "bg-gray-300 hover:bg-gray-400"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
} 