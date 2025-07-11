'use client';
export const NuestraHistoria = () => {
    return (

        <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
                <h2 className="font-chewy text-4xl font-chewy font-black text-center mb-4 text-[#017d74]">Nuestra Historia</h2>
                <p className="text-center text-gray-600 mb-12 text-lg">
                    Más de una década construyendo alternativas, tejiendo redes y sembrando futuro
                </p>
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h3 className="text-3xl font-bold mb-6 text-[#922f4e]">Desde 2013 construyendo comunidad</h3>
                        <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
                            <p>
                                <span className="font-bold text-[#642d91]">ROOTS</span> nace en 2013 en La Plata como un sueño
                                compartido por un grupo de amigues que creían en otra forma de trabajar. No queríamos ser empleados,
                                queríamos ser <span className="font-bold text-[#922f4e]">dueños de nuestro tiempo</span> y de
                                nuestro trabajo.
                            </p>
                            <p>
                                Empezamos vendiendo cerveza artesanal en ferias y eventos. Poco a poco fuimos creciendo, sumando
                                compañeres, aprendiendo a <span className="font-bold text-[#017d74]">tomar decisiones juntes</span>.
                                Hoy somos <span className="font-bold text-[#febb07]">11 asociados</span> que construimos día a día
                                una alternativa real al trabajo asalariado.
                            </p>
                            <p>
                                No dependemos de plataformas de delivery ni de intermediarios. Tenemos nuestros propios canales,
                                nuestras redes sociales, nuestros puntos de venta. Construimos una
                                <span className="font-bold text-[#922f4e]"> red de vínculos</span> con otras cooperativas,
                                ilustradores, músicos y espacios culturales de La Plata y la región.
                            </p>
                            <p>
                                Cada pizza que horneamos, cada cerveza que fabricamos, cada empanada que armamos, es un acto
                                político. Es decir <span className="font-bold text-[#017d74]">"se puede vivir de otra manera"</span>
                                . Es demostrar que la economía social no es solo una utopía, sino una realidad que construimos con
                                nuestras manos todos los días.
                            </p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="aspect-square bg-gray-200 rounded-xl overflow-hidden shadow-lg">
                                <img
                                    src="historia/1.png"
                                    alt="Cooperativistas trabajando juntos"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="aspect-square bg-gray-200 rounded-xl overflow-hidden shadow-lg">
                                <img
                                    src="historia/2.png"
                                    alt="Fabricación de cerveza artesanal"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden shadow-lg">
                            <img
                                src="historia/5.png"
                                alt="Feria de productores con ROOTS"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="aspect-square bg-gray-200 rounded-xl overflow-hidden shadow-lg">
                                <img
                                    src="historia/4.png"
                                    alt="Pizza artesanal en horno"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="aspect-square bg-gray-200 rounded-xl overflow-hidden shadow-lg">
                                <img
                                    src="historia/3.png"
                                    alt="Empanadas caseras"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}