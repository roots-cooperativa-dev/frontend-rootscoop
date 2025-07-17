import { useAuthContext } from "@/src/context/authContext";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
const ButtonLogout = () => {
  const {resetUserData } = useAuthContext();
  const router = useRouter();
  const Logout = () => {
    resetUserData();
    router.push("/");
  };
  return (
    <>
      <Button
        variant="outline"
        className="border-red-500 text-red-500 hover:bg-red-50 bg-transparent"
        onClick={Logout}
      >
        <LogOut className="w-4 h-4 mr-2" />
        Cerrar sesión
      </Button>
    </>
  );
};

export default ButtonLogout;
