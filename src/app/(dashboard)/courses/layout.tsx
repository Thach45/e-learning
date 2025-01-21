import Sidebar from '@/components/layout/Sidebar';
import { menuItem } from '@/const/menuItems';
import React from 'react';


const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="wrapper flex">
      <Sidebar menuItem={menuItem} />
      <main className="flex-grow p-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;