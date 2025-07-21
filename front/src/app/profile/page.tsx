"use client";
import Link from "next/link";
import DataUser from "./component/dataUser";
import Image from "next/image";
import { Footer } from "@/src/components/landing/Footer";
import ButtonLogout from "@/src/components/botones/cerrarSesion";
import ButtonHome from "@/src/components/botones/verSitio";
import Sidebar from "@/src/components/contenedores/sidebar";

const Profile = () => {

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
              <ButtonHome/>
              <ButtonLogout/>
            </div>
          </div>
        </div>
      </header>
      <div className="flex">
        <DataUser />
      </div>
      <Footer/>
    </>
  );
};

export default Profile;
