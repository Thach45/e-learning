"use client";
import React, { useEffect, useState } from 'react'
import { TLinkItem } from '@/types/index';
import Items from '@/components/layout/renderItems';
import { UserButton, useUser } from '@clerk/nextjs';
import { ModeToggle } from '@/components/mode/ToggleMode';


import { Button } from '../ui/button';
import { getUser } from '@/lib/actions/user.actions';
import { EUserRole } from '@/types/enums';
import Link from 'next/link';



const Sidebar: React.FC<{menuItem: TLinkItem[], isOpen : boolean}> = ({menuItem, isOpen}) => {
  const { user } = useUser();
  const [role, setRole] = useState<string | undefined>(undefined);
  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUser(user?.id as string);
      setRole(data?.role);
    }
    fetchUser();
  }, [user]);
  
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
        <ModeToggle  />
      {role === EUserRole.EXPERT && (
        <div className="mx-0">
          <Link href="/expert/manage/dashboard" className="block">
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-medium py-2.5 shadow-lg hover:shadow-blue-500/30 transition-all duration-200 flex items-center justify-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5"
              >
                <path d="M20 7h-3a2 2 0 0 1-2-2V2" />
                <path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z" />
                <path d="M3 7v10a2 2 0 0 0 2 2h4" />
                <path d="m12 12 4 4-4 4" />
              </svg>
              Quản lý khóa học
            </Button>
          </Link>
        </div>
      )}
      </div>
    </div>
  </>
  
  );
};

export default Sidebar;