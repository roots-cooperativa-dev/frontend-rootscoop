import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roots Cooperativa",
  description:
    "Roots Cooperativa de Trabajo - Construyendo Soberanía Alimentaria y Economía Social desde 2013",
  generator: "Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
