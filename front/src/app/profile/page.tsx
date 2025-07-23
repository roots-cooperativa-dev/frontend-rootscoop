"use client";

import DataUser from "./component/dataUser";
import { Footer } from "@/src/components/landing/Footer";
import Sidebar from "@/src/components/contenedores/sidebar";
import HeaderProfile from "@/src/components/headers/EncabezadoPerfil";

const Profile = () => {

  return (
    <>
      <HeaderProfile/>
      <main className="flex">
        <Sidebar/>
        <DataUser />
      </main>
      <Footer/>
    </>
  );
};

export default Profile;
