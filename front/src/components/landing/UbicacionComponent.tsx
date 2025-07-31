"use client"

import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { MapPin, Instagram, MessageCircle, Phone, Clock, Navigation, ExternalLink, Mail, Building } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

export const UbicacionComponent = () => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null)
    const mapRef = useRef<mapboxgl.Map | null>(null)

    useEffect(() => {
        if (mapRef.current) return

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current!,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [-57.94812620365652, -34.92084001731877], // [lng, lat]
            zoom: 15,
        })

        // Agregamos marcador personalizado
        const marker = new mapboxgl.Marker({
            color: "#017d74",
            scale: 1.2,
        })
            .setLngLat([-57.94812620365652, -34.92084001731877])
            .addTo(mapRef.current)

        // Agregar popup con información
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-3">
          <h3 class="font-bold text-[#017d74] mb-2">ROOTS Cooperativa</h3>
          <p class="text-sm text-gray-600 mb-1">C. 10 1182, La Plata</p>
          <p class="text-sm text-gray-600">Buenos Aires, Argentina</p>
        </div>
      `)

        marker.setPopup(popup)

        // Agregar controles de navegación
        mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right")
        mapRef.current.addControl(new mapboxgl.FullscreenControl(), "top-right")

        return () => {
            mapRef.current?.remove()
        }
    }, [])

    const openInGoogleMaps = () => {
        const url = `https://www.google.com/maps/search/?api=1&query=-34.92084001731877,-57.94812620365652`
        window.open(url, "_blank")
    }

    const openInWaze = () => {
        const url = `https://waze.com/ul?ll=-34.92084001731877,-57.94812620365652&navigate=yes`
        window.open(url, "_blank")
    }

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8 p-6">
            {/* Header centrado */}
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#017d74] to-[#015d54] rounded-xl flex items-center justify-center shadow-lg">
                        <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900">Nuestra Ubicación</h2>
                </div>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Visítanos en nuestra sede principal en La Plata. Estamos aquí para atenderte y brindarte la mejor experiencia
                    cooperativa.
                </p>
            </div>

            {/* Sección principal - Logo y Mapa */}
            <div className="grid lg:grid-cols-2 gap-8 items-start">
                {/* Información principal con logo */}
                <div className="space-y-6">
                    {/* Logo y información principal */}
                    <Card className="shadow-xl border-2 border-[#017d74]/20 bg-gradient-to-br from-white to-[#017d74]/5">
                        <CardHeader className="text-center pb-6">
                            <div className="mx-auto mb-6">
                                <div className="w-24 h-24 bg-gradient-to-br from-[#017d74] to-[#015d54] rounded-3xl flex items-center justify-center shadow-2xl">
                                    <Image
                                        src="/logos/roots.png"
                                        alt="Rootscoop Logo"
                                        width={70}
                                        height={40}
                                        className="rounded-full object-contain"
                                        priority
                                    />
                                </div>
                            </div>
                            <CardTitle className="text-2xl text-[#017d74] mb-2">ROOTS Cooperativa</CardTitle>
                            <Badge className="bg-[#017d74] text-white px-4 py-1 text-sm">Economía Social</Badge>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Dirección */}
                            <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                                <div className="w-10 h-10 bg-[#017d74]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-5 h-5 text-[#017d74]" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 mb-1">Dirección</p>
                                    <p className="text-gray-700">C. 10 1182</p>
                                    <p className="text-gray-700">B1904 La Plata</p>
                                    <p className="text-gray-700">Provincia de Buenos Aires</p>
                                </div>
                            </div>

                            {/* Horarios */}
                            <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                                <div className="w-10 h-10 bg-[#017d74]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Clock className="w-5 h-5 text-[#017d74]" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 mb-1">Horarios de Atención</p>
                                    <p className="text-gray-700">Martes a sabados de 12 a 15 hs y de  19 a 23 hs</p>
                                    <p className="text-gray-700">Domingos de 19 a 23 hs</p>
                                    <p className="text-gray-700">Lunes cerrado 🚫</p>
                                </div>
                            </div>

                            {/* Contacto */}
                            <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                                <div className="w-10 h-10 bg-[#017d74]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-5 h-5 text-[#017d74]" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 mb-1">Contacto</p>
                                    <p className="text-gray-700">+54 221 4235656</p>
                                    <p className="text-gray-700">rootscooperativadev@gmail.com</p>
                                </div>
                            </div>

                            {/* Estado actual */}
                            <div className="flex items-center justify-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="font-semibold text-green-800">Estamos abiertos</span>
                                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                                    Respuesta en 24hs
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Mapa */}
                <div className="space-y-6">
                    <Card className="shadow-xl overflow-hidden border-2 border-[#017d74]/20">
                        <CardHeader className="bg-gradient-to-r from-[#017d74] to-[#015d54] text-white">
                            <CardTitle className="flex items-center gap-3 text-xl">
                                <Navigation className="w-6 h-6" />
                                Mapa Interactivo
                            </CardTitle>
                            <p className="text-[#017d74]/20 text-sm">Haz clic en el marcador para más información</p>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="relative">
                                <div ref={mapContainerRef} className="w-full h-[500px]" />

                                {/* Overlay con información */}
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-4 h-4 bg-[#017d74] rounded-full"></div>
                                                <span className="font-semibold text-gray-900">ROOTS Cooperativa</span>
                                            </div>
                                            <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">Abierto</Badge>
                                        </div>
                                        <p className="text-sm text-gray-600">C. 10 1182, La Plata • A 5 min del centro</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Sección de redes sociales y navegación - Simétrica */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* Redes sociales */}
                <Card className="shadow-xl border-2 border-[#017d74]/20">
                    <CardHeader className="text-center">
                        <CardTitle className="flex items-center justify-center gap-3 text-xl text-[#017d74]">
                            <Building className="w-6 h-6" />
                            Conecta con Nosotros
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Link href="https://www.instagram.com/roots_cooperativa/" target="_blank" className="group">
                                <Button
                                    variant="outline"
                                    className="w-full h-14 border-2 border-pink-200 hover:border-pink-500 hover:bg-pink-50 transition-all duration-300 bg-transparent group-hover:scale-105"
                                >
                                    <div className="flex flex-col items-center gap-1">
                                        <Instagram className="w-6 h-6 text-pink-600" />
                                        <span className="text-sm font-medium text-pink-600">Instagram</span>
                                    </div>
                                </Button>
                            </Link>

                            <Link href="https://wa.link/b4wyji" target="_blank" className="group">
                                <Button
                                    variant="outline"
                                    className="w-full h-14 border-2 border-green-200 hover:border-green-500 hover:bg-green-50 transition-all duration-300 bg-transparent group-hover:scale-105"
                                >
                                    <div className="flex flex-col items-center gap-1">
                                        <MessageCircle className="w-6 h-6 text-green-600" />
                                        <span className="text-sm font-medium text-green-600">WhatsApp</span>
                                    </div>
                                </Button>
                            </Link>
                        </div>

                        <div className="flex items-center gap-2 justify-center pt-4 border-t border-gray-100">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Síguenos para novedades y eventos</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Navegación */}
                <Card className="shadow-xl border-2 border-[#017d74]/20">
                    <CardHeader className="text-center">
                        <CardTitle className="flex items-center justify-center gap-3 text-xl text-[#017d74]">
                            <Navigation className="w-6 h-6" />
                            Cómo Llegar
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                onClick={openInGoogleMaps}
                                variant="outline"
                                className="h-14 border-2 border-blue-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 bg-transparent hover:scale-105"
                            >
                                <div className="flex flex-col items-center gap-1">
                                    <Navigation className="w-6 h-6 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-600">Google Maps</span>
                                </div>
                            </Button>

                            <Button
                                onClick={openInWaze}
                                variant="outline"
                                className="h-14 border-2 border-purple-200 hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 bg-transparent hover:scale-105"
                            >
                                <div className="flex flex-col items-center gap-1">
                                    <ExternalLink className="w-6 h-6 text-purple-600" />
                                    <span className="text-sm font-medium text-purple-600">Waze</span>
                                </div>
                            </Button>
                        </div>

                        <div className="flex items-center gap-2 justify-center pt-4 border-t border-gray-100">
                            <Navigation className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Navegación GPS disponible</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Sección de transporte público - Simétrica */}
            <Card className="shadow-xl border-2 border-[#017d74]/20">
                <CardHeader className="text-center bg-gradient-to-r from-[#017d74]/5 to-[#015d54]/5">
                    <CardTitle className="flex items-center justify-center gap-3 text-2xl text-[#017d74]">
                        <Navigation className="w-7 h-7" />
                        Transporte Público
                    </CardTitle>
                    <p className="text-gray-600">Múltiples opciones para llegar fácilmente</p>
                </CardHeader>
                <CardContent className="p-8">
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Colectivo */}
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-2xl">🚌</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-blue-900 text-lg mb-2">Colectivo</h3>
                                <p className="text-blue-700 font-medium">Líneas: 214, 273, 307</p>
                                <p className="text-sm text-blue-600">Parada: Av. 7 y Calle 10</p>
                                <p className="text-xs text-blue-500 mt-2">Frecuencia: cada 10-15 min</p>
                            </div>
                        </div>

                        {/* Tren */}
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-2xl">🚂</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-green-900 text-lg mb-2">Tren</h3>
                                <p className="text-green-700 font-medium">Línea Roca</p>
                                <p className="text-sm text-green-600">Estación La Plata</p>
                                <p className="text-xs text-green-500 mt-2">+ 10 min caminando</p>
                            </div>
                        </div>

                        <div className="text-center space-y-4">
                            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-2xl">🚗</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-purple-900 text-lg mb-2">Auto Particular</h3>
                                <p className="text-purple-700 font-medium">Estacionamiento gratuito</p>
                                <p className="text-sm text-purple-600">Entrada por Calle 10</p>
                                <p className="text-xs text-purple-500 mt-2">Espacios disponibles</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
