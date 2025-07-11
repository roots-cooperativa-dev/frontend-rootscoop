'use client';
import React from "react";
import { Heart, Sparkles, Sun } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export const HeroSection = () => {
    return (
        <div className="relative w-full h-full">
            {/* Video Background */}
            <div className="absolute inset-0">
                <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                    <source src="/videos/hero.webm" type="video/mp4" />
                    {/* Fallback image */}
                    {/* Note: <div> inside <video> is invalid HTML, so fallback should be handled differently */}
                </video>
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Hero Content */}
            <div className="relative z-10 h-full flex items-center justify-center">
                <div className="text-center text-white max-w-4xl mx-auto px-4">
                    <h1 className="font-chewy text-5xl md:text-8xl font-black mb-6 drop-shadow-lg">ROOTS</h1>
                    <p className="text-xl md:text-3xl font-bold mb-4 drop-shadow-md">Cooperativa de Trabajo</p>
                    <p className="text-lg md:text-2xl mb-8 drop-shadow-md max-w-3xl mx-auto">
                        Desde 2013 construyendo
                        <span className="text-[#febb07] font-bold"> Soberanía alimentaria</span>,
                        <span className="text-[#ff7e5f] font-bold"> Perspectiva de genero</span> y
                        <span className="text-[#b6e300] font-bold"> Economía social</span>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-[#922f4e] hover:bg-[#642d91] text-white font-bold shadow-xl transform hover:scale-105 transition-all"
                            asChild
                        >
                            <Link href="#carrusel">
                                <Sparkles className="w-5 h-5 mr-2" />
                                Descubrí ROOTS
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white text-white hover:bg-white hover:text-[#017d74] font-bold shadow-lg bg-white/10 backdrop-blur-sm"
                            asChild
                        >
                            <Link href="#historia">
                                <Heart className="w-5 h-5 mr-2" />
                                Nuestra historia
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
                <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                    <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}