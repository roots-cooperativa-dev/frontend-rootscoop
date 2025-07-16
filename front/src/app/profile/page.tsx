"use client";
import Link from "next/link";
import DataUser from "./component/dataUser";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useAuthContext } from "@/src/context/authContext";
import { useRouter } from "next/navigation";
import { IoLogOut } from "react-icons/io5";
import { Footer } from "@/src/components/landing/Footer";

const Profile = () => {
  const { isAuth, resetUserData } = useAuthContext();
  const router = useRouter();
  const Logout = () => {
    resetUserData();
    router.push("/");
  };
  return (
    <>
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/logos/roots.png"
                alt="Rootscoop Logo"
                width={300}
                height={40}
                className="rounded-full object-contain"
                priority
              />
            </Link>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-[#017d74] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver</span>
              </Link>
              <button
                className="text-sm  text-blue-600 dark:text-blue-500 hover:underline "
                onClick={Logout}
              >
                <IoLogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <DataUser />
      <Footer/>
    </>
  );
};

export default Profile;
