"use client"

import type React from "react"
import { AppSidebar } from "@/components/layout/Sidebar"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { menuItem } from "@/const/menuItems"
import { ArrowLeftRight } from "lucide-react"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar menuItem={menuItem} />
        <SidebarInset className="flex flex-col flex-grow">
          <header className="flex h-14 items-center border-b px-4 lg:h-[60px]">
            <SidebarTrigger>
              <ArrowLeftRight className="h-6 w-6" />
              <span className="sr-only">Toggle Sidebar</span>
            </SidebarTrigger>
          </header>
          <main className="flex-1 overflow-auto p-4">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

