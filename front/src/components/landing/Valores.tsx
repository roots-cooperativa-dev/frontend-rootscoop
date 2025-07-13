'use client';
import { Leaf, Heart, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const Valores = () => {
    return (
        <div className="container mx-auto px-4">
            <h2 className="font-chewy text-4xl font-black text-center mb-4 text-[#017d74]">Nuestros Valores</h2>
            <p className="font-bebas text-center text-gray-600 mb-12 text-lg">
                Los pilares que sostienen nuestro trabajo cooperativo y nuestra forma de ver el mundo
            </p>
            <div className="grid md:grid-cols-3 gap-8">
                <Card className="text-center border-2 border-[#017d74]/20 hover:border-[#017d74] hover:shadow-xl transition-all transform hover:-translate-y-2">
                    <CardHeader>
                        <div className="w-16 h-16 bg-[#017d74] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Leaf className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="font-bebas text-[#017d74] text-xl font-bold">Soberanía Alimentaria</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-popular text-gray-600 font-medium">
                            Creemos en el derecho de los pueblos a decidir qué comer y cómo producir sus alimentos. Promovemos la
                            producción local, sustentable y libre de agrotóxicos.
                        </p>
                    </CardContent>
                </Card>

                <Card className="text-center border-2 border-[#922f4e]/20 hover:border-[#922f4e] hover:shadow-xl transition-all transform hover:-translate-y-2">
                    <CardHeader>
                        <div className="w-16 h-16 bg-[#922f4e] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Heart className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="font-bebas text-[#922f4e] text-xl font-bold">Perspectiva de Género</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-popular text-gray-600 font-medium">
                            Construimos espacios libres de violencias, donde todas las identidades tienen lugar. El feminismo
                            atraviesa nuestro trabajo, nuestras decisiones y nuestra forma de relacionarnos.
                        </p>
                    </CardContent>
                </Card>

                <Card className="text-center border-2 border-[#642d91]/20 hover:border-[#642d91] hover:shadow-xl transition-all transform hover:-translate-y-2">
                    <CardHeader>
                        <div className="w-16 h-16 bg-[#642d91] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="font-bebas text-[#642d91] text-xl font-bold">Trabajo en Red</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-popular text-gray-600 font-medium">
                            Practicamos relaciones comerciales éticas y transparentes. Cada intercambio fortalece la red de
                            economía social y popular que construimos día a día.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}