'use client';
import { ChefHat, Bike } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';

export const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8">
                    <div>
                        <div className="flex items-center space-x-3 mb-6">
                            <Image
                                src="/logos/roots.png"
                                alt="Rootscoop Logo"
                                width={300}
                                height={40}
                                className="rounded-full object-contain"
                                priority
                            />
                        </div>
                        <p className="font-popular text-gray-300 text-lg leading-relaxed">
                            Cooperativa de Trabajo gastronómica y cultural. Construyendo alternativas desde 2013. Cerveza, pizza,
                            empanadas y mucho amor cooperativo.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold mb-6 text-xl text-[#febb07]">Enlaces</h3>
                        <div className="space-y-3">
                            <Link
                                href="/productos"
                                className="font-bebas block text-gray-300 hover:text-[#922f4e] transition-colors font-medium text-lg"
                            >
                                Productos
                            </Link>
                            <Link
                                href="/visitas"
                                className="font-bebas block text-gray-300 hover:text-[#017d74] transition-colors font-medium text-lg"
                            >
                                Visitas
                            </Link>
                            <Link
                                href="/donaciones"
                                className="font-bebas block text-gray-300 hover:text-[#febb07] transition-colors font-medium text-lg"
                            >
                                Donaciones
                            </Link>
                            <Link
                                href="/contacto"
                                className="font-bebas block text-gray-300 hover:text-[#642d91] transition-colors font-medium text-lg"
                            >
                                Contacto
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold mb-6 text-xl text-[#febb07]">Contacto</h3>
                        <div className="space-y-3 text-gray-300">
                            <p className="font-popular text-lg">La Plata, Buenos Aires</p>
                            <p className="font-popular text-lg">Argentina</p>
                            <Link
                                href="/contacto"
                                className="text-[#017d74] hover:text-[#febb07] transition-colors font-bold text-lg"
                            >
                                Formulario de contacto →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Sección trabajar con nosotros */}
                <div className="mt-12">
                    <h3 className="text-2xl font-black text-[#febb07] text-center mb-6 font-bebas">
                        ¿Querés trabajar con nosotros?
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6 text-center">
                        <Link
                            href="https://docs.google.com/forms/d/10sy_dTqGS0Q5C2c7z9AvcOhAO5jnZl-sBHetyfoSPq8"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group bg-gray-800 hover:bg-[#922f4e] transition-colors rounded-xl p-6 shadow-md flex flex-col items-center space-y-3"
                        >
                            <div className="w-16 h-16 bg-[#922f4e] rounded-full flex items-center justify-center shadow-lg group-hover:bg-white transition-colors">
                                <ChefHat className="w-8 h-8 text-white group-hover:text-[#922f4e]" />
                            </div>
                            <p className="text-lg font-popular text-white font-medium group-hover:text-white">
                                Trabajar en cocina
                            </p>
                        </Link>

                        <Link
                            href="https://docs.google.com/forms/d/1jrgSAR4VH-_JZFXxujBBkKqFBPx3CxY44_bc5BkWClI"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group bg-gray-800 hover:bg-[#017d74] transition-colors rounded-xl p-6 shadow-md flex flex-col items-center space-y-3"
                        >
                            <div className="w-16 h-16 bg-[#017d74] rounded-full flex items-center justify-center shadow-lg group-hover:bg-white transition-colors">
                                <Bike className="w-8 h-8 text-white group-hover:text-[#017d74]" />
                            </div>
                            <p className="text-lg font-popular text-white font-medium group-hover:text-white">
                                Trabajar como repartidor
                            </p>
                        </Link>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-700 mt-12 pt-8 text-center">
                    <p className="text-gray-400 text-lg">
                        &copy; 2025 ROOTS Cooperativa de Trabajo Ltda. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
};
