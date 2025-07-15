'use client';

import { IProducto } from "../../app/types/index";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Props {
    producto: IProducto;
}

const ProductoDetalle = ({ producto }: Props) => {
    const stock = producto.sizes[0]?.stock ?? 0;
    const price = producto.sizes[0]?.price ?? "-";

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-2 gap-8 items-start">
                <div>
                    <Image
                        src={producto.files[0]?.url || "/img/image-not-found.jpg"}
                        alt={producto.name}
                        width={600}
                        height={400}
                        className="rounded-lg object-cover w-full h-auto"
                    />
                </div>
                <div>
                    <h1 className="text-4xl font-bold text-[#017d74] mb-2">{producto.name}</h1>
                    <Badge className="mb-4 bg-[#febb07] text-black">{producto.category.name}</Badge>
                    <p className="text-lg text-gray-700 font-popular mb-6">{producto.details}</p>
                    <div className="flex items-center mb-4">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-5 h-5 ${i < 4 ? "fill-[#febb07] text-[#febb07]" : "text-gray-300"}`}
                            />
                        ))}
                        <span className="ml-2 text-sm text-gray-500">(12 reseñas)</span>
                    </div>
                    <p className="text-3xl font-bold text-[#922f4e] mb-4">${price}</p>
                    <p className="mb-4 text-gray-600">{stock > 0 ? `Stock disponible: ${stock}` : "Producto sin stock"}</p>
                    <Button
                        className={`w-full ${stock > 0 ? "bg-[#922f4e] hover:bg-[#642d91] text-white" : "bg-gray-400 text-gray-600"}`}
                        disabled={stock === 0}
                        asChild={stock > 0}
                    >
                        {stock > 0 ? <Link href="/login">Comprar ahora</Link> : "Agotado"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductoDetalle;
