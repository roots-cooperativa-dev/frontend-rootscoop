'use client'

import { Banknote, Calendar, ChartBarStacked, ClipboardPaste, HelpCircle, Home, LogOut, Package, Plus, Settings, ShoppingCart, UserRound, UserRoundPen } from "lucide-react";

import Link from "next/link";
import { Badge } from "../ui/badge";
import { Separator } from "@radix-ui/react-separator";
import { cn } from "@/src/lib/utils";
import { usePathname } from "next/dist/client/components/navigation";
const sidebarLinks = [
  {
    href: "/profile",
    label: "Perfil de usuario",
    icon: UserRound,
    description: "Informacion basica",
  },
  {
    href: "/profile/editar_perfil",
    label: "Editar datos de usuario",
    icon: UserRoundPen,
    description: "Cambia tus datos",
    badge: "",
  },
  {
    href: "/profile/visits",
    label: "Visitas programadas",
    icon: Calendar,
    description: "agenda",
    badge: "",
  },
  {
    href: "/profile/ordenes",
    label: "Ordenes",
    icon: ClipboardPaste,
    description: "Visualiza tus ordenes",
    badge: "",
  },
  {
    href: "/profile/donaciones",
    label: "Donaciones",
    icon: Banknote,
    description: "Donaciones realizadas",
    badge: "",
    
  },
  {
    href: "/profile/carrito",
    label: "Carrito",
    icon: ShoppingCart,
    description: "Listo para comprar",
    badge: "",
  },
];
const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex flex-col w-60 h-screen bg-gradient-to-b from-gray-50 to-white border-r border-gray-200/60 shadow-sm">

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
      </nav>
    </aside>
  );
};

export default Sidebar;
