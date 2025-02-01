'use client'

import React from 'react'
import { TLinkItem } from '@/types/index'
import Items from '@/components/layout/renderItems'
import { UserButton, useUser } from '@clerk/nextjs'
import { ModeToggle } from '@/components/mode/ToggleMode'
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar'

interface SidebarProps {
  menuItem: TLinkItem[]
}

export function AppSidebar({ menuItem }: SidebarProps) {
  const { user } = useUser()

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-4">
        <h1 className="text-xl font-bold">LearnHub</h1>
      </SidebarHeader>
      <SidebarContent>
        {/* User Profile Section */}
        <div className="flex items-center gap-4 p-4 border-b">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <UserButton />
          </div>
          <div className="flex justify-between">
            <p className="font-medium">{user ? user.username : "User"}</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItem.map((item, index) => (
              <Items key={index} {...item} />
            ))}
          </ul>
        </nav>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <ModeToggle />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
