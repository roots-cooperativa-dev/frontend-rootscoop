"use client";

import { useState, useEffect } from "react";
import type React from "react";
import { useRouter } from "next/navigation";

import { useAuthContext } from "../../context/authContext";
import { DashboardNavbar } from "@/src/components/dashboard/DashboardNavbar";
import { DashboardSidebar } from "@/src/components/dashboard/DashboardSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuth, loading } = useAuthContext();
  const router = useRouter();
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (isAuth === false) {
        router.push("/login");
      } else if (isAuth === true) {
        setCanRender(true);
      }
    }
  }, [isAuth, loading, router]);

  if (loading || !canRender) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
