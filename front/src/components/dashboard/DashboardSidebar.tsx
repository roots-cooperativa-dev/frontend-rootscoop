"use client";

import {
  Sun,
  Package,
  BarChartIcon as ChartBarStacked,
  Plus,
  LogOut,
  Home,
  Settings,
  HelpCircle,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
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
    badge: "12",
  },
];

const secondaryLinks = [
  { href: "/dashboard/configuracion", label: "Configuración", icon: Settings },
  { href: "/dashboard/ayuda", label: "Ayuda", icon: HelpCircle },
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
          <div className="w-10 h-10  rounded-xl flex items-center justify-center shadow-sm">
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
                      {link.badge && (
                        <Badge
                          variant="secondary"
                          className={cn(
                            "ml-2 h-5 px-2 text-xs",
                            isActive
                              ? "bg-white/20 text-white border-white/30"
                              : "bg-gray-200 text-gray-600"
                          )}
                        >
                          {link.badge}
                        </Badge>
                      )}
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

        <Separator className="my-4" />

        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
            Herramientas
          </h3>
          <div className="space-y-1">
            {secondaryLinks.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
                >
                  <Icon className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200/60 space-y-2">
        <Button
          variant="outline"
          className="w-full flex items-center gap-2 border-[#017d74]/20 text-[#017d74] hover:bg-[#017d74]/5 hover:border-[#017d74]/30 transition-all duration-200 bg-transparent"
        >
          <Plus className="w-4 h-4" />
          Crear nuevo
        </Button>

        <Button
          variant="ghost"
          onClick={Logout}
          className="w-full flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  );
};
