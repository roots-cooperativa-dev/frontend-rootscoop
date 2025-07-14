'use client';

import { Sun, Package, Edit, Eye, Plus, LogOut } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import Link from "next/link";

const sidebarLinks = [
  { href: "/dashboard", label: "Inicio", icon: <Sun className="w-5 h-5" /> },
  { href: "/dashboard/proyectos", label: "Proyectos", icon: <Package className="w-5 h-5" /> },
  { href: "/dashboard/editar", label: "Editar", icon: <Edit className="w-5 h-5" /> },
  { href: "/dashboard/ver", label: "Ver", icon: <Eye className="w-5 h-5" /> },
];

export const DashboardSidebar = () => (
  <aside className="hidden md:flex flex-col w-64 h-screen bg-white border-r px-4 py-6 gap-4">
    <div className="flex items-center gap-2 mb-8">
      <span className="text-xl font-bold">Panel</span>
      <Badge variant="secondary">Beta</Badge>
    </div>
    <nav className="flex-1 flex flex-col gap-2">
      {sidebarLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
        >
          {link.icon}
          <span>{link.label}</span>
        </Link>
      ))}
    </nav>
    <div className="mt-auto flex flex-col gap-2">
      <Button variant="outline" className="w-full flex items-center gap-2">
        <Plus className="w-4 h-4" /> Nuevo
      </Button>
      <Button variant="destructive" className="w-full flex items-center gap-2">
        <LogOut className="w-4 h-4" /> Salir
      </Button>
    </div>
  </aside>
);