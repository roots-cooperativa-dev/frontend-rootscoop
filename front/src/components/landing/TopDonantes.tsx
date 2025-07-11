'use client'

import { Heart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

export const TopDonantes = () => {
    return (
        <div className="container mx-auto px-4">
            <h2 className="font-chewy text-4xl font-cooperativo font-black text-center mb-4 text-[#017d74]">Nuestros Compañeros de Ruta</h2>
            <p className="text-center text-gray-600 mb-12 text-lg max-w-3xl mx-auto">
                Estas personas y organizaciones apoyan nuestro trabajo cooperativo con donaciones regulares. Su compromiso
                hace posible que sigamos construyendo alternativas de economía social.
            </p>
            <div className="max-w-6xl mx-auto">
                {/* Top 3 Donantes Destacados */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <Card className="text-center border-2 border-[#922f4e]/30 hover:border-[#922f4e] hover:shadow-2xl transition-all transform hover:-translate-y-3 bg-white/90">
                        <CardHeader>
                            <div className="w-20 h-20 bg-[#922f4e] rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                                <span className="text-2xl font-black text-white">1</span>
                            </div>
                            <CardTitle className="text-[#922f4e] text-xl font-bold">Cooperativa Textil Unidos</CardTitle>
                            <Badge className="bg-[#922f4e] text-white font-bold">Compañero Impulsor</Badge>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 font-medium mb-3">
                                "Apoyamos a ROOTS porque creemos en la fuerza del trabajo cooperativo. Juntos construimos un futuro
                                más justo."
                            </p>
                            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                                <Heart className="w-4 h-4 text-[#922f4e]" />
                                <span>Donante desde 2019</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="text-center border-2 border-[#febb07]/30 hover:border-[#febb07] hover:shadow-2xl transition-all transform hover:-translate-y-3 bg-white/90">
                        <CardHeader>
                            <div className="w-20 h-20 bg-[#febb07] rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                                <span className="text-2xl font-black text-white">2</span>
                            </div>
                            <CardTitle className="text-[#f39d10] text-xl font-bold">María Elena Rodríguez</CardTitle>
                            <Badge className="bg-[#febb07] text-white font-bold">Compañera Fiel</Badge>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 font-medium mb-3">
                                "ROOTS representa todo lo que creo: feminismo, cooperativismo y amor por la comunidad. Es mi forma
                                de ser parte."
                            </p>
                            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                                <Heart className="w-4 h-4 text-[#febb07]" />
                                <span>Donante desde 2020</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="text-center border-2 border-[#017d74]/30 hover:border-[#017d74] hover:shadow-2xl transition-all transform hover:-translate-y-3 bg-white/90">
                        <CardHeader>
                            <div className="w-20 h-20 bg-[#017d74] rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                                <span className="text-2xl font-black text-white">3</span>
                            </div>
                            <CardTitle className="text-[#017d74] text-xl font-bold">Fundación Semillas</CardTitle>
                            <Badge className="bg-[#017d74] text-white font-bold">Aliado Estratégico</Badge>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 font-medium mb-3">
                                "Compartimos la visión de soberanía alimentaria. ROOTS es un ejemplo de que otro mundo es posible y
                                necesario."
                            </p>
                            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                                <Heart className="w-4 h-4 text-[#017d74]" />
                                <span>Donante desde 2018</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}