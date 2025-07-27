"use client";

import {
  Sun,
  Package,
  BarChartIcon as ChartBarStacked,
  Plus,
  Home,
  User,
  ClipboardList,
} from "lucide-react";
import { Separator } from "../../components/ui/separator";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "../../lib/utils";
import Image from "next/image";
import { useAuthContext } from "@/src/context/authContext";

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


export const DashboardSidebar = () => {
  const pathname = usePathname();
  const { resetUserData } = useAuthContext();
  const router = useRouter();
  const Logout = () => {
    resetUserData();
    router.push("/");
  };

  return (
    <aside className="hidden md:flex flex-col w-60 h-screen bg-gradient-to-b from-gray-50 to-white border-r border-gray-200/60 shadow-sm">
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
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
            Principal
          </h3>
          <div className="space-y-1">
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
                    <div className="flex items-center justify-between">
                      <span className="truncate">{link.label}</span>
                    </div>
                    {!isActive && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {link.description}
                      </p>
                    )}
                  </div>
                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </aside>
  );
};
