'use client';

import { ShoppingBag, Calendar, Gift, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import Link from "next/link";

export const Servicios = () => {
    return (
        <div className="container mx-auto px-4">
            <h2 className="text-4xl font-chewy font-black text-center mb-4 text-[#017d74]">como participar</h2>
            <p className="font-bebas text-center text-gray-600 mb-12 text-lg">
                Hay muchas formas de ser parte de esta construccion colectiva. Cada aporte suma, cada gesto cuenta.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="flex flex-col justify-between hover:shadow-2xl transition-all transform hover:-translate-y-3 border-2 border-[#922f4e]/20 hover:border-[#922f4e]">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-[#922f4e] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <ShoppingBag className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="font-bebas text-[#922f4e] font-bold">Productos</CardTitle>
                        <CardDescription className=" font-popular font-medium">Merch y productos con identidad cooperativa</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full bg-[#922f4e] hover:bg-[#642d91] text-white font-bold shadow-lg" asChild>
                            <Link href="/productos">Ver tienda</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="flex flex-col justify-between hover:shadow-2xl transition-all transform hover:-translate-y-3 border-2 border-[#922f4e]/20 hover:border-[#922f4e]">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-[#017d74] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Calendar className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="font-bebas text-[#017d74] font-bold">Visitas</CardTitle>
                        <CardDescription className="font-popular font-medium">Conocé nuestra planta de investigación</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full bg-[#922f4e] hover:bg-[#642d91] text-white font-bold shadow-lg" asChild>
                            <Link href="/visitas">Reservar visita</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="flex flex-col justify-between hover:shadow-2xl transition-all transform hover:-translate-y-3 border-2 border-[#922f4e]/20 hover:border-[#922f4e]">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-[#febb07] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <Gift className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="font-bebas text-[#f39d10] font-bold">Donaciones</CardTitle>
                        <CardDescription className="font-popular font-medium">Apoyá nuestro trabajo cooperativo</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full bg-[#922f4e] hover:bg-[#642d91] text-white font-bold shadow-lg" asChild>
                            <Link href="/donaciones">Donar</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card className="flex flex-col justify-between hover:shadow-2xl transition-all transform hover:-translate-y-3 border-2 border-[#922f4e]/20 hover:border-[#922f4e]">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-[#642d91] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <MapPin className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="font-bebas text-[#642d91] font-bold">Ubicaciones</CardTitle>
                        <CardDescription className="font-popular font-medium">Ferias, nodos y almacenes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full bg-[#922f4e] hover:bg-[#642d91] text-white font-bold shadow-lg" asChild>
                            <Link href="/ubicaciones">Ver mapa</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}