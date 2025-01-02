import React from 'react'
import {
 
  Settings,
  User
} from 'lucide-react';
import Items from '@/components/layout/renderItems';
import menuItem from '@/const/menuItems';



const Sidebar = () => {
  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r">
      {/* Logo Section */}
      <div className="flex h-16 items-center px-6 border-b">
        <h1 className="text-xl font-bold">LearnHub</h1>
      </div>

      {/* User Profile Section */}
      <div className="flex items-center gap-4 p-4 border-b">
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
          <User className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <p className="font-medium">John Doe</p>
          <p className="text-sm text-gray-500">Student</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
         {menuItem.map((item,index) => (
            <Items key={index} {...item}  />
          )
         )}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="border-t p-4">
        <a href="/settings" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100 transition-colors">
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </a>s
      </div>
    </div>
  );
};

export default Sidebar;




