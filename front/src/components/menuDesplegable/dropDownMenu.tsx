import { useAuthContext } from "@/src/context/authContext";
import { useRouter } from "next/navigation";
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
import { ChevronDown, LogOut, User } from "lucide-react";
import Link from "next/link";

const MenuDesplegable = () => {
  const { resetUserData, user, isAuth } = useAuthContext();
  const router = useRouter();
  const Logout = () => {
    resetUserData();
    router.push("/");
  };
  return (
    <>
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
            <>
              <Link href="/dashboard">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Panel Admin
                </DropdownMenuItem>
              </Link>
              <Link href="/profile">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Perfil
                </DropdownMenuItem>
              </Link>
            </>
          ) : (
            <Link href="/profile">
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Perfil
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
    </>
  );
};

export default MenuDesplegable;
