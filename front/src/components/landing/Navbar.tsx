'use client'
import { Sun, X, Menu } from "lucide-react"
import { useState, useEffect } from "react"
import { Badge } from "../ui/badge"
import Link from "next/link"
import { Button } from "../ui/button"
import Image from "next/image"
import AuthNav from "../authNav/authNav"

export const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    return (
        <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Image
                        src="/logos/roots.png"
                        alt="Rootscoop Logo"
                        width={70}
                        height={40}
                        className="rounded-full object-contain"
                        priority
                    />
                </div>
                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link href="#historia" className="font-bebas text-white/90 hover:text-white transition-colors font-medium">
                        Historia
                    </Link>
                    <Link href="/productos" className="font-bebas text-white/90 hover:text-white transition-colors font-medium">
                        Productos
                    </Link>
                    <Link href="/visitas" className="font-bebas text-white/90 hover:text-white transition-colors font-medium">
                        Visitas
                    </Link>
                    <Link href="/donaciones" className="font-bebas text-white/90 hover:text-white transition-colors font-medium">
                        Donaciones
                    </Link>
                    <Link href="/contacto" className="font-bebas text-white/90 hover:text-white transition-colors font-medium">
                        Contacto
                    </Link>
                    {/* <Button className="font-bebas bg-[#922f4e] hover:bg-[#642d91] text-white font-bold shadow-lg" asChild>
                        <Link href="/login">Iniciar sesión</Link>
                    </Button> */}
                    <AuthNav/>
                </div>
                {/* Mobile Menu Button */}
                <button
                    onClick={toggleMobileMenu}
                    className="md:hidden w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </nav>
            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden mt-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 space-y-4">
                    <Link
                        href="#historia"
                        className="font-bebas block text-white/90 hover:text-white transition-colors font-medium py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Historia
                    </Link>
                    <Link
                        href="/productos"
                        className="font-bebas block text-white/90 hover:text-white transition-colors font-medium py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Productos
                    </Link>
                    <Link
                        href="/visitas"
                        className="font-bebas block text-white/90 hover:text-white transition-colors font-medium py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Visitas
                    </Link>
                    <Link
                        href="/donaciones"
                        className="font-bebas block text-white/90 hover:text-white transition-colors font-medium py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Donaciones
                    </Link>
                    <Link
                        href="/contacto"
                        className="font-bebas block text-white/90 hover:text-white transition-colors font-medium py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Contacto
                    </Link>
                    <Button
                        className="font-bebas w-full bg-[#922f4e] hover:bg-[#642d91] text-white font-bold shadow-lg mt-4"
                        asChild
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <Link href="/login">Iniciar sesión</Link>
                    </Button>
                </div>
            )}
        </div>
    )
}