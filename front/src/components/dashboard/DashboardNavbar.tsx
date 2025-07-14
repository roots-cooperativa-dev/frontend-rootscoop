'use client'

import { Sun, Eye, LogOut } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import Link from "next/link"


export const DashboardNavbar = () => {
    return (
        <div>
          <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#017d74] rounded-full flex items-center justify-center shadow-lg">
                <Sun className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-black text-[#017d74]">ROOTS</span>
                <Badge className="ml-2 bg-[#922f4e] text-white">Admin</Badge>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="border-[#017d74] text-[#017d74] bg-transparent" asChild>
                <Link href="/">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver sitio
                </Link>
              </Button>
              <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50 bg-transparent">
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </header>
        </div>
    )
}