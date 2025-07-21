import { useAuthContext } from "@/src/context/authContext";
import Link from "next/link";
import { Button } from "../ui/button";

const AuthProducts = () => {
  const { isAuth, user } = useAuthContext();
  if (isAuth === null) return <p>...cargando</p>;
  if (user?.isAdmin) {
    return (
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <Button
          className=" bg-[#922f4e] hover:bg-[#642d91] text-white font-bold shadow-lg"
          asChild
        >
          <Link href="/dashboard">Administrador</Link>
        </Button>
      </div>
    );
  }
  if (isAuth) {
    return (
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        <Button
          className=" bg-[#922f4e] hover:bg-[#642d91] text-white font-bold shadow-lg"
          asChild
        >
          <Link href="/profile">Perfil</Link>
        </Button>
      </div>
    );
  }
  return (
    <Button
      className="bg-[#922f4e] hover:bg-[#642d91] text-white font-bold shadow-lg"
      asChild
    >
      <Link href="/login">Ingresar para comprar</Link>
    </Button>
  );
};

export default AuthProducts;
