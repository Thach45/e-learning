"use client"

import Sidebar from '@/components/layout/Sidebar';
import { menuItem } from '@/const/menuItems';
import { ArrowLeftRight } from 'lucide-react';
import React from 'react';


const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    return !isOpen;
  }

  return (
    <div className="wrapper flex relative">
      <div className={`flex h-screen flex-col justify-between bg-white border-r fixed dark:bg-black dark:text-white 
        ${!isOpen ? "w-64": "w-0 text-[0px]"} transition-width duration-300 ease-in-out`}>
        <Sidebar menuItem={menuItem} isOpen={isOpen} />
        <div className="absolute right-[-10px] top-[50%]">
          <ArrowLeftRight size={24}  className="w-6 h-6 text-gray-500 dark:text-gray-300 cursor-pointer"
          onClick={()=>toggleSidebar()} />
        </div>
      </div>
      <main className={`flex-grow p-4  ${!isOpen ? "ml-[250px] ": "m-auto"}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;