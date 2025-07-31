"use client";
import Image from "next/image";
import ButtonHome from "../botones/verSitio";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChevronDown, Home, LogOut, User } from "lucide-react";
import { useAuthContext } from "@/src/context/authContext";
import { useRouter } from "next/navigation";
import { useCartContext } from "@/src/context/cartContext";

type Props = {
  onToggleSidebar?: () => void;
};

const HeaderProfile = ({ onToggleSidebar }: Props) => {
  const { resetUserData, user, isAuth } = useAuthContext();
  const { resetCart } = useCartContext();
  const router = useRouter();
  const Logout = () => {
    resetUserData();
    resetCart();
    router.push("/");
  };
  return (
    <>
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              className="md:hidden text-white text-3xl rounded bg-[#017D74] p-2"
              onClick={onToggleSidebar}
            >
              ☰
            </button>
            <Link href="/" className="flex">
              <Image
                src="/logos/roots.png"
                alt="Rootscoop Logo"
                width={60}
                height={40}
                className="rounded-full object-scale-down"
                priority
              />
            </Link>
            <div className="flex items-center space-x-4">
              <ButtonHome />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2 hover:bg-gray-100 p-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="/placeholder.svg?height=32&width=32"
                        alt="Usuario"
                      />
                      <AvatarFallback className="bg-[#017d74] text-white text-sm">
                        {" "}
                        {user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.name || "Usuario"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user?.isAdmin ? "Administrador" : "Usuario"}
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user?.isAdmin ? (
                    <Link href="/dashboard">
                      <DropdownMenuItem>
                        <User className="w-4 h-4 mr-2" />
                        Panel Admin
                      </DropdownMenuItem>
                    </Link>
                  ) : (
                    <Link href="/">
                      <DropdownMenuItem>
                        <Home className="w-4 h-4 mr-2" />
                        Inicio
                      </DropdownMenuItem>
                    </Link>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={Logout}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default HeaderProfile;
