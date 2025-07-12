// app/login/page.tsx
"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import AuthLayout from "./layoutAuth";
import Image from "next/image";

export default function AuthPage() {
  return (
    <AuthLayout>
      {/* Logo para mobile */}
      <Image 
        src="/logos/sol-negro-sin-fondo.png" 
        alt="Logo mobile" 
        width={100} 
        height={100} 
        className="mb-4 mx-auto md:hidden" 
      />

      {/* Logo para desktop */}
      <Image 
        src="/logos/roots.png" 
        alt="Logo desktop" 
        width={300} 
        height={300} 
        className="mb-4 mx-auto hidden md:block" 
      />
      <h1 className="text-2xl font-semibold mb-2 text-center font-chewy text-[#017d74]">¡Bienvenido/a!</h1>
      
      <p className="mb-6 text-center text-black md:text-gray-500">
        Ingresá a tu cuenta o registrate para ser parte
      </p>
      
      <Tabs defaultValue="login" className="w-full max-w-md">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="login">Ingresar</TabsTrigger>
          <TabsTrigger value="register">Registrarse</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        <TabsContent value="register">
          <RegisterForm />
        </TabsContent>
      </Tabs>
      
      <a href="/" className="mt-4 text-sm text-black md:text-gray-500 hover:underline">
        ← Volver al inicio
      </a>
    </AuthLayout>
  );
}
