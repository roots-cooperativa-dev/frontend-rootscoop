'use client';

import { IProducto } from "../../app/types/index";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Star, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import CartAddBtn from "../cart/cartAddBtn";

interface Props {
  producto: IProducto;
}

const ProductoDetalle = ({ producto }: Props) => {
  const stock = producto.sizes[0]?.stock ?? 0;
  const price = producto.sizes[0]?.price ?? "-";
  const imagenes = producto.files || [];

  const [imagenSeleccionada, setImagenSeleccionada] = useState(imagenes[0]?.url || "/img/image-not-found.jpg");
  const [cantidad, setCantidad] = useState<number>(1);

  const incrementarCantidad = () => {
    if (cantidad < stock) setCantidad((prev) => prev + 1);
  };

  const decrementarCantidad = () => {
    if (cantidad > 1) setCantidad((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b shadow-sm bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
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
          <Link
            href="/productos"
            className="flex items-center space-x-2 text-gray-600 hover:text-[#017d74] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Volver a productos</span>
          </Link>
        </div>
      </header>
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Galería de imágenes */}
          <div>
            <div className="mb-4">
              <Image
                src={imagenSeleccionada}
                alt={producto.name}
                width={600}
                height={400}
                className="rounded-lg object-cover w-full max-h-[500px]"
              />
            </div>
            {/* Miniaturas */}
            <div className="flex gap-3 overflow-x-auto">
              {imagenes.map((img, i) => (
                <Image
                  key={i}
                  src={img.url || "/img/image-not-found.jpg"}
                  alt={`Imagen ${i + 1}`}
                  width={100}
                  height={100}
                  onClick={() => setImagenSeleccionada(img.url || "/img/image-not-found.jpg")}
                  className={`cursor-pointer rounded-lg border-2 ${(img.url || "/img/image-not-found.jpg") === imagenSeleccionada ? "border-[#017d74]" : "border-transparent"
                    }`}
                />
              ))}
            </div>
          </div>
          {/* Info del producto */}
          <div>
            <h1 className="text-4xl font-bold text-[#017d74] mb-2">{producto.name}</h1>
            <Badge className="mb-4 bg-[#febb07] text-black">{producto.category.name}</Badge>
            <p className="text-lg text-gray-700 font-popular mb-6">{producto.details}</p>
            <div className="flex items-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < 4 ? "fill-[#febb07] text-[#febb07]" : "text-gray-300"}`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-500">(12 reseñas)</span>
            </div>
            <p className="text-3xl font-bold text-[#922f4e] mb-2">${price}</p>
            <p className="mb-6 text-gray-600">
              {stock > 0 ? (
                <span className="text-green-600 font-medium">En stock ({stock} disponibles)</span>
              ) : (
                <span className="text-red-500 font-medium">Producto sin stock</span>
              )}
            </p>

            {/* Cantidad */}
            <div className="flex items-center gap-4 mb-4">
              <span className="font-semibold text-gray-700">Cantidad:</span>
              <div className="flex items-center border rounded px-3 py-1">
                <button
                  onClick={decrementarCantidad}
                  className="text-xl px-2 font-bold"
                  disabled={cantidad <= 1}
                >
                  -
                </button>
                <span className="px-3">{cantidad}</span>
                <button
                  onClick={incrementarCantidad}
                  className="text-xl px-2 font-bold"
                  disabled={cantidad >= stock}
                >
                  +
                </button>
              </div>
            </div>

            {/* Botón Comprar */}
            <Button
              className={`w-full text-lg font-bold shadow-md ${stock > 0 ? "bg-[#922f4e] hover:bg-[#642d91] text-white" : "bg-gray-300 text-gray-500"
                }`}
              disabled={stock === 0}
              asChild={stock > 0}
            >
              {stock > 0 ? <Link href="/paginaError">Comprar ahora</Link> : "Agotado"}
            </Button>

            {/* Botón Agregar al carrito */}
            <CartAddBtn product={producto} quantity={cantidad} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoDetalle;
