'use client'
import Image from "next/image";
import ButtonLogout from "../botones/cerrarSesion";
import ButtonHome from "../botones/verSitio";
import Link from "next/link";

const HeaderProfile = () => {
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
              <ButtonLogout />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default HeaderProfile;
