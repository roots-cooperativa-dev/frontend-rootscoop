'use client'

import { Card, CardContent } from "../ui/card";
import { Star } from "lucide-react";

const GOOGLE_MAPS_LINK = "https://www.google.com.ar/maps/place/Roots+Pizza/@-34.9209676,-57.9507011,17z/data=!3m1!4b1!4m6!3m5!1s0x95a2e625a88546ef:0xa751095adb320f2b!8m2!3d-34.920972!4d-57.9481262!16s%2Fg%2F11b8_n1rz1?hl=es&entry=ttu&g_ep=EgoyMDI1MDcwOC4wIKXMDSoASAFQAw%3D%3D";

const reviews = [
    {
        text: "Las pizzas para llevar son buenísimas: con un golpe de horno de 20 min quedan como recién hechas, crocantes, con ricos ingredientes. Recomiendo la de hongos (incluye distintas variedades de quesos, incluido queso brie!). Y si pagas con cuenta DNI hay alto descuento. La mejor de LP.",
        author: "Franco C",
        color: "#922f4e",
        avatar: null,
        rating: 5,
        date: "Hace un mes"
    },
    {
        text: "Pizza de molde, muy bueno relleno. Tienen muchas variedades, diferentes masas. Tienen el menú en sus redes y un punto a favor, para los que deseamos probar varios sabores, hacen mitad y mitad  😘",
        author: "Patricia Gonzalez",
        color: "#642d91",
        avatar: null,
        rating: 5,
        date: "Hace 3 Semanas"
    }
];

export const VocesRoots = () => {
    return (
        <div className="container mx-auto px-4">
            <h2 className="text-4xl font-black text-center mb-4 text-[#017d74]">Voces de ROOTS</h2>
            <p className="text-center text-gray-600 mb-12 text-lg">
                Las historias que nos construyen, contadas por quienes las viven
            </p>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {reviews.map((review, idx) => (
                    <a
                        key={idx}
                        href={GOOGLE_MAPS_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-full"
                        title="Ver más en Google Maps"
                    >
                        <Card className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-2xl transition-all cursor-pointer h-full flex flex-col">
                            <CardContent className="pt-0 flex-1 flex flex-col">
                                <div className="flex items-center mb-3">
                                    {review.avatar ? (
                                        <img
                                            src={review.avatar}
                                            alt={review.author}
                                            className="w-12 h-12 rounded-full border border-gray-200 mr-4"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4 text-2xl font-bold text-gray-600 border border-gray-200">
                                            {review.author[0]}
                                        </div>
                                    )}
                                    <div>
                                        <div className="font-semibold text-gray-900">{review.author}</div>
                                        <div className="flex items-center mt-1">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400" : "stroke-yellow-300"}`}
                                                    fill={i < review.rating ? "#facc15" : "none"}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-700 text-base leading-relaxed flex-1">
                                    "{review.text}"
                                </p>
                            </CardContent>
                        </Card>
                    </a>
                ))}
            </div>
        </div>
    );
};