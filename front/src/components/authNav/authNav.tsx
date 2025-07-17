import { useAuthContext } from "@/src/context/authContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoLogOut } from "react-icons/io5";
import { Button } from "../ui/button";

const AuthNav = () => {
  const {isAuth } = useAuthContext();
  if (isAuth === null) return <p>...cargando</p>;
  if (isAuth) {
    return (
      <div className="flex items-center justify-end space-x-4 rtl:space-x-reverse">
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
