"use client"

import { useAuthContext } from "../../../context/authContext"
import { routes } from "../../../routes"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/src/components/ui/card"
import type { IUsuario } from "@/src/app/types"
import { fetchUserById } from "../../utils/UsuariosHelper"
import { Loader2, User, Mail, Phone, Calendar, MapPin, Home, Globe } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import Link from "next/link"

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

const DataUser = () => {
  const { user: userContext, token, loading: authLoading } = useAuthContext()
  const [fullUser, setFullUser] = useState<IUsuario | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const router = useRouter()
  const mapContainer = useRef<HTMLDivElement | null>(null)
  const mapInstance = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!authLoading && (!userContext || !token)) {
      router.push(routes.login)
      return
    }

    const loadUser = async () => {
      if (userContext?.id) {
        try {
          const fetched = await fetchUserById(userContext.id)
          setFullUser(fetched)
        } catch (error) {
          console.error("Error fetching user data:", error)
          // Optionally show a toast error
        } finally {
          setDataLoading(false)
        }
      } else {
        setDataLoading(false)
      }
    }
    loadUser()
  }, [userContext, token, authLoading, router])

  const parseCoord = (coord: string | number): number => {
    const parsed = typeof coord === "string" ? Number.parseFloat(coord) : coord
    return Number.isFinite(parsed) ? parsed : Number.NaN
  }

  useEffect(() => {
    if (!fullUser?.address) return

    const lat = parseCoord(fullUser.address.lat)
    const long = parseCoord(fullUser.address.long)

    // Si las coordenadas no son números finitos, no intentes inicializar el mapa.
    if (isNaN(lat) || isNaN(long) || mapInstance.current || !mapContainer.current) return

    const otherPlace = {
      lat: -27.7963,
      long: -64.2615,
    }

    mapInstance.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [long, lat],
      zoom: 14,
    })

    new mapboxgl.Marker({ color: "#017d74" })
      .setLngLat([long, lat])
      .setPopup(new mapboxgl.Popup().setText("Tu ubicación"))
      .addTo(mapInstance.current)

    new mapboxgl.Marker({ color: "#e11d48" })
      .setLngLat([otherPlace.long, otherPlace.lat])
      .setPopup(new mapboxgl.Popup().setText("Destino de ejemplo"))
      .addTo(mapInstance.current)

    mapInstance.current.on("load", async () => {
      const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${long},${lat};${otherPlace.long},${otherPlace.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`
      try {
        const res = await fetch(directionsUrl)
        const data = await res.json()
        const route = data.routes[0].geometry

        if (mapInstance.current?.getSource("route")) {
          ; (mapInstance.current.getSource("route") as mapboxgl.GeoJSONSource).setData(route)
        } else {
          mapInstance.current?.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: route,
            },
          })
          mapInstance.current?.addLayer({
            id: "route-layer",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#3b82f6",
              "line-width": 5,
              "line-opacity": 0.75,
            },
          })
        }
      } catch (error) {
        console.error("Error al obtener la ruta", error)
      }
    })

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [fullUser])

  const getRoleText = (user: IUsuario) => {
    if (user.isAdmin && user.isDonator) return "Admin • Donador"
    if (user.isAdmin) return "Administrador"
    if (user.isDonator) return "Donador"
    return "Usuario"
  }

  const getRoleColor = (user: IUsuario) => {
    if (user.isAdmin) return "bg-red-100 text-red-800 border-red-200"
    if (user.isDonator) return "bg-green-100 text-green-800 border-green-200"
    return "bg-gray-100 text-gray-800 border-gray-200"
  }

  if (authLoading || dataLoading || !fullUser) {
    return (
      <div className="flex items-center justify-center w-full min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 border-4 border-[#017d74] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-700 text-lg">Cargando datos de usuario...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-[#017d74] to-[#015d54] rounded-xl flex items-center justify-center shadow-lg">
            <User className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">Perfil de Usuario</h1>
            <p className="text-lg text-gray-600 mt-1">Información detallada de tu cuenta</p>
          </div>
        </div>

        {/* Personal Information Card */}
        <Card className="shadow-md border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
              <User className="w-6 h-6 text-[#017d74]" />
              Datos Personales
            </CardTitle>
            <CardDescription className="text-gray-600">Información básica de tu perfil.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <User className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Nombre:</span> {fullUser.name}
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <User className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Nombre de usuario:</span> @{fullUser.username}
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Email:</span> {fullUser.email}
              </div>
              {fullUser.phone && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">Teléfono:</span> {fullUser.phone}
                </div>
              )}
              {fullUser.birthdate && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">Fecha de nacimiento:</span>{" "}
                  {new Date(fullUser.birthdate).toLocaleDateString()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Address and Map Card */}
        {fullUser.address &&
          Number.isFinite(parseCoord(fullUser.address.lat)) &&
          Number.isFinite(parseCoord(fullUser.address.long)) ? (
          <Card className="shadow-md border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
                <MapPin className="w-6 h-6 text-[#017d74]" />
                Cómo llegar a Roots
              </CardTitle>
              <CardDescription className="text-gray-600">
                Tu dirección registrada y su ubicación en el mapa.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Home className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Calle:</span> {fullUser.address.street}
              </div>
              <div
                ref={mapContainer}
                className="w-full h-[400px] rounded-lg border border-gray-300 overflow-hidden shadow-inner"
              />
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-md border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-semibold text-gray-800">
                <MapPin className="w-6 h-6 text-gray-400" />
                Ubicación no disponible
              </CardTitle>
              <CardDescription className="text-gray-600">No se pudo cargar la ubicación en el mapa.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
              <MapPin className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay datos de dirección válidos para mostrar en el mapa.
              </h3>
              <p className="text-gray-500 mb-4">Por favor, ve a editar tu perfil para ingresar tu dirección.</p>
              <Link href={`/dashboard/usuarios/edit/${fullUser?.id}`}>
                <Button className="bg-[#017d74] hover:bg-[#015d54] text-white">
                  <User className="w-4 h-4 mr-2" />
                  Editar Usuario
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default DataUser
