"use client";

import {
  Sun,
  Package,
  BarChartIcon as ChartBarStacked,
  Plus,
  Home,
  User,
  ClipboardList,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "../../lib/utils";
import Image from "next/image";
import { useAuthContext } from "@/src/context/authContext";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const DashboardSidebar = ({ isOpen = false, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const { resetUserData } = useAuthContext();

  const sidebarLinks = [
    {
      href: "/dashboard",
      label: "Inicio",
      icon: Home,
      description: "Panel principal",
    },
    {
      href: "/dashboard/categorias",
      label: "Categorías",
      icon: ChartBarStacked,
      description: "Gestionar categorías",
    },
    {
      href: "/dashboard/productos",
      label: "Productos",
      icon: Package,
      description: "Inventario y productos",
    },
    {
      href: "/dashboard/ordenes",
      label: "Órdenes",
      icon: ClipboardList,
      description: "Historial de pedidos",
    },
    {
      href: "/dashboard/usuarios",
      label: "Usuarios",
      icon: User,
      description: "Gestión de usuarios",
    },
    {
      href: "/dashboard/visitas",
      label: "Visitas",
      icon: Sun,
      description: "Registro de visitas",
    },
    {
      href: "/dashboard/turnos",
      label: "Turnos",
      icon: Plus,
      description: "Registro de turnos",
    },
  ];

  const SidebarContent = (
    <div className="flex flex-col w-60 h-full bg-gradient-to-b from-gray-50 to-white border-r border-gray-200/60 shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200/60">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">
            <Image
              src="/logos/roots.png"
              alt="Rootscoop Logo"
              width={70}
              height={40}
              className="rounded-full object-contain"
              priority
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">Panel</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Administración</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative",
                isActive
                  ? "bg-[#017d74] text-white shadow-md shadow-[#017d74]/25"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              )}
              onClick={onClose}
            >
              <Icon
                className={cn(
                  "w-5 h-5 transition-colors",
                  isActive
                    ? "text-white"
                    : "text-gray-500 group-hover:text-gray-700"
                )}
              />
              <div className="flex-1 min-w-0">
                <span className="truncate">{link.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex">{SidebarContent}</aside>

      {/* Mobile sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <div className="relative z-50 bg-white w-60 h-full shadow-lg">
            <div className="flex justify-end p-2">
              <button onClick={onClose}>
                <X className="w-5 h-5" />
              </button>
            </div>
            {SidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
