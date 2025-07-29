import { useAuthContext } from "@/src/context/authContext";
import Link from "next/link";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartContext } from "@/src/context/cartContext";

const AuthNav = () => {
  const { isAuth, user } = useAuthContext();
  const { cart, total, resetCart } = useCartContext(); //si uso logout debo incluir resetCart

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
};

export default AuthNav;
