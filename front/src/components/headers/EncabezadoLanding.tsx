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
import { ChevronDown, Home, LogOut, ShoppingCart, User } from "lucide-react";
import { useAuthContext } from "@/src/context/authContext";
import { useRouter } from "next/navigation";
import { useCartContext } from "@/src/context/cartContext";

const HeaderProfile = () => {
  const { resetUserData, user, isAuth } = useAuthContext();
  const { resetCart, total } = useCartContext();
  const router = useRouter();
  const Logout = () => {
    resetUserData();
    resetCart();
    router.push("/");
  };
  if (isAuth === null) return <p>...cargando</p>;
  if (user?.isAdmin) {
    return (
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <Link href="/profile/carrito">
          <div className="relative w-fit h-8 flex items-center justify-center">
            {Boolean(total) && (
              <span className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center text-[10px] text-white bg-red-500 rounded-full">
                {total}
              </span>
            )}
            <ShoppingCart className="h-6 w-6 text-[#017D74]" />
          </div>
        </Link>
        <Button
          className="font-bebas bg-[#922f4e] hover:bg-[#642d91] text-white font-bold shadow-lg"
          asChild
        >
          <Link href="/dashboard">Admin</Link>
        </Button>
      </div>
    );
  }
  if (isAuth) {
    return (
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <Link href="/profile/carrito">
          <div className="relative w-fit h-8 flex items-center justify-center">
            {Boolean(total) && (
              <span className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center text-[10px] text-white bg-red-500 rounded-full">
                {total}
              </span>
            )}
            <ShoppingCart className="h-6 w-6 text-[#017D74]" />
          </div>
        </Link>
        <Button
          className="font-bebas bg-[#922f4e] hover:bg-[#642d91] text-white font-bold shadow-lg"
          asChild
        >
          <Link href="/profile">Perfil</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="flex items-center space-x-6 rtl:space-x-reverse">
      <Button
        className="font-bebas bg-[#922f4e] hover:bg-[#642d91] text-white font-bold shadow-lg"
        asChild
      >
        <Link href="/login">Iniciar sesión</Link>
      </Button>
    </div>
  );
  return (
    <>
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
                    className="font-bebas bg-[#922f4e] hover:bg-[#642d91] text-white font-bold shadow-lg"
                    asChild
                  >
                    <Link href="/profile">Perfil</Link>
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
