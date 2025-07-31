"use client";

import { useEffect, useState } from "react";

import { ShoppingBag, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import Link from "next/link";
import Image from "next/image";
import { fetchProductoDestacado } from "@/src/app/utils/ProductsHelper";
import { IProducto } from "@/src/app/types";

export const ProductoDestacado = () => {
  const [producto, setProducto] = useState<IProducto | null>(null);
  useEffect(() => {
    const getProducto = async () => {
      const res = await fetchProductoDestacado();
      setProducto(res);
    };
    getProducto();
  }, []);

  if (!producto) return null;

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="aspect-square bg-gray-100 rounded-2xl shadow-2xl border-4 border-white overflow-hidden">
              <Image
                src={producto.files[0]?.url || "/img/image-not-found.jpg"}
                alt={producto.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#febb07] rounded-full"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-[#f39d10] rounded-full"></div>
            <div className="absolute top-1/2 -left-6 w-4 h-4 bg-[#017d74] rounded-full"></div>
          </div>

          <div>
            <Badge className="bg-[#febb07] !text-black font-bold mb-4">
              Producto Destacado
            </Badge>
            <h2 className="font-chewy text-4xl font-black text-[#017d74] mb-6">
              {producto.name}
              <span className="font-chewy block text-[#922f4e]">
                Cooperativa
              </span>
            </h2>
            <p className="font-popular text-xl text-gray-700 mb-6 font-medium">
              {producto.details} Representa nuestros valores de{" "}
              <span className="text-[#017d74] font-bold">autogestión</span> y{" "}
              <span className="text-[#922f4e] font-bold">
                trabajo colectivo
              </span>
              .
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-[#017d74] rounded-full"></div>
                <span className="font-popular text-gray-700">
                  100% algodón orgánico
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-[#922f4e] rounded-full"></div>
                <span className="font-popular text-gray-700">
                  Diseño exclusivo cooperativo
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-[#febb07] rounded-full"></div>
                <span className="font-popular text-gray-700">
                  Talles {producto.sizes.map((s) => s.size).join(", ")}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-8">
              <span className="font-popular text-3xl font-bold text-[#017d74]">
                ${producto.sizes[0]?.price.toLocaleString("es-AR")}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-[#922f4e] hover:bg-[#642d91] text-white font-bold shadow-xl transform hover:scale-105 transition-all"
                asChild
              >
                <Link href="/productos" className="font-popular">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Ver todos los productos
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#017d74] text-[#017d74] hover:bg-[#017d74] hover:text-white font-bold shadow-lg bg-transparent"
                asChild
              >
                <Link href="/ubicacion" className="font-popular">
                  <MapPin className="w-5 h-5 mr-2" />
                  Dónde encontrarnos
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
