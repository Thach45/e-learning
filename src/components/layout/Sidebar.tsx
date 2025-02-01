"use client";
import React from 'react'
import { TLinkItem } from '@/types/index';
import Items from '@/components/layout/renderItems';
import { UserButton, useUser } from '@clerk/nextjs';
import { ModeToggle } from '@/components/mode/ToggleMode';


const Sidebar: React.FC<{menuItem: TLinkItem[], isOpen : boolean}> = ({menuItem, isOpen}) => {
  const { user } = useUser();
  
  return (
  <>
    <div className={`${isOpen ? "hidden": ""}  `}>
      
        
        {/* Logo Section */}
        <div className="flex h-16 items-center px-6 border-b relative ">
          <h1 className="text-xl font-bold">LearnHub</h1>
        </div>

        {/* User Profile Section */}
        <div className="flex items-center gap-4 p-4 border-b ">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <UserButton/>
          </div>
          <div className="flex justify-between">
            <p className="font-medium">{user ? user.username : "User"}</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 ">
          <ul className="space-y-2">
            {menuItem.map((item,index) => (
              <Items key={index} {...item}  />
            ))}
          </ul>
        </nav>

        {/* Bottom Section */}

      {/* Toggle Button */}
     
    </div>
    <div className={`border-t p-4 relative ${isOpen ?  "hidden": ""}`}>
      <div className="flex items-center gap-3 rounded-lg px-3 py-2">
        <ModeToggle />
      </div>
    </div>
  </>
  
  );
};

export default Sidebar;