import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../context/authContext";
import { Toaster } from 'sonner';
import { CartProvider } from "../context/cartContext";

export const metadata: Metadata = {
  title: "Roots Cooperativa",
  description:
    "Roots Cooperativa de Trabajo - Construyendo Soberanía Alimentaria y Economía Social desde 2013",
  generator: "Next.js",
  icons: {
    icon: "favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
      <CartProvider>
        <body>{children}
          <Toaster />
        </body>
      </CartProvider>
      </AuthProvider>
    </html>
  );
}
