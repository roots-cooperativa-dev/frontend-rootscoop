"use client"

import { Sun, Eye, LogOut, Bell, Search, User, ChevronDown } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/src/context/authContext"

export const DashboardNavbar = () => {
  const {resetUserData } = useAuthContext();
    const router = useRouter();
    const Logout = () => {
      resetUserData();
      router.push("/");}
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/60 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
            </div>
          </div>
          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* View Site Button */}
            <Button
              variant="outline"
              size="sm"
              className="border-[#017d74] text-[#017d74] bg-transparent hover:bg-[#017d74]/5 transition-all duration-200 font-medium"
              asChild
            >
              <Link href="/">
                <Eye className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Ver sitio</span>
              </Link>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 hover:bg-gray-100 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Usuario" />
                    <AvatarFallback className="bg-[#017d74] text-white text-sm">U</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">Usuario</p>
                    <p className="text-xs text-gray-500">Administrador</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/profile">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Perfil
                </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={Logout} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar..."
              className="pl-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
            />
          </div>
        </div>
      </div>
    </header>
  )
}
