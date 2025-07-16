'use client'

import { Sun, Eye, LogOut } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import Link from "next/link"
import Image from "next/image"


export const DashboardNavbar = () => {
  return (
    <div>
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image
                src="/logos/roots.png"
                alt="Rootscoop Logo"
                width={300}
                height={40}
                className="rounded-full object-contain"
                priority
              />
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