'user client'

import { Beer, Pizza, ChefHat } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"

export const LoqueHacemos = () => {
    return (
        <div className="container mx-auto px-4">
            <h2 className="text-4xl font-black text-center mb-4 text-[#017d74]">Lo que hacemos</h2>
            <p className="text-center text-gray-600 mb-12 text-lg max-w-3xl mx-auto">
                Somos mucho más que una cooperativa. Somos un espacio de encuentro, creación y resistencia. Cada cerveza que
                fabricamos, cada pizza que horneamos, cada empanada que armamos, lleva el amor y la dedicación de 11
                compañeres trabajando juntas.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
                <Card className="text-center border-2 border-[#922f4e]/20 hover:border-[#922f4e] hover:shadow-xl transition-all transform hover:-translate-y-2">
                    <CardHeader>
                        <div className="w-16 h-16 bg-[#922f4e] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Beer className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-[#922f4e] text-xl font-bold">Cerveza Artesanal</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 font-medium">
                            Fabricamos cerveza con ingredientes locales y procesos sustentables. Cada lote es una celebración del
                            trabajo colectivo y la tradición cervecera argentina.
                        </p>
                    </CardContent>
                </Card>
                <Card className="text-center border-2 border-[#febb07]/20 hover:border-[#febb07] hover:shadow-xl transition-all transform hover:-translate-y-2">
                    <CardHeader>
                        <div className="w-16 h-16 bg-[#febb07] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Pizza className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-[#f39d10] text-xl font-bold">Pizzas Artesanales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 font-medium">
                            Nuestras pizzas son famosas en La Plata. Ingredientes frescos y técnicas artesanales y el secreto de
                            la cocina cooperativa que transforma cada bocado en una experiencia única.
                        </p>
                    </CardContent>
                </Card>
                <Card className="text-center border-2 border-[#017d74]/20 hover:border-[#017d74] hover:shadow-xl transition-all transform hover:-translate-y-2">
                    <CardHeader>
                        <div className="w-16 h-16 bg-[#017d74] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <ChefHat className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-[#017d74] text-xl font-bold">Empanadas Artesanales</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600 font-medium">
                            Empanadas hechas como en casa, con recetas que pasan de generación en generación. Cada repulgue cuenta
                            la historia de nuestras familias y tradiciones.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}