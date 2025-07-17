"use client"

import type React from "react"

import { DashboardNavbar } from "@/src/components/dashboard/DashboardNavbar"
import { DashboardSidebar } from "@/src/components/dashboard/DashboardSidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout