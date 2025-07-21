'use client'
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AuthNav from "../authNav/authNav";

const HeaderBasic = () => {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/logos/roots.png"
              alt="Rootscoop Logo"
              width={60}
              height={60}
              className="rounded-full object-contain"
              priority
            />
          </Link>
          <div className="flex items-center space-x-4">
            <AuthNav/>
            <Link
              href="/"
              className="flex items-center space-x-2 text-gray-600 hover:text-[#017d74] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-chewy">Volver al inicio</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderBasic;
