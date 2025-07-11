'use client';
import { Sun } from "lucide-react";
import Link from 'next/link';

export const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-8">
                    <div>
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 bg-[#017d74] rounded-full flex items-center justify-center shadow-lg">
                                <Sun className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-black text-white">ROOTS</span>
                        </div>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            Cooperativa de Trabajo gastronómica y cultural. Construyendo alternativas desde 2013. Cerveza, pizza,
                            empanadas y mucho amor cooperativo.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold mb-6 text-xl text-[#febb07]">Enlaces</h3>
                        <div className="space-y-3">
                            <Link
                                href="/productos"
                                className="block text-gray-300 hover:text-[#922f4e] transition-colors font-medium text-lg"
                            >
                                Productos
                            </Link>
                            <Link
                                href="/visitas"
                                className="block text-gray-300 hover:text-[#017d74] transition-colors font-medium text-lg"
                            >
                                Visitas
                            </Link>
                            <Link
                                href="/donaciones"
                                className="block text-gray-300 hover:text-[#febb07] transition-colors font-medium text-lg"
                            >
                                Donaciones
                            </Link>
                            <Link
                                href="/contacto"
                                className="block text-gray-300 hover:text-[#642d91] transition-colors font-medium text-lg"
                            >
                                Contacto
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold mb-6 text-xl text-[#febb07]">Contacto</h3>
                        <div className="space-y-3 text-gray-300">
                            <p className="text-lg">La Plata, Buenos Aires</p>
                            <p className="text-lg">Argentina</p>
                            <Link
                                href="/contacto"
                                className="text-[#017d74] hover:text-[#febb07] transition-colors font-bold text-lg"
                            >
                                Formulario de contacto →
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                    <p className="text-gray-400 text-lg">
                        &copy; 2025 ROOTS Cooperativa de Trabajo Ltda. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}