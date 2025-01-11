import Sidebar from '@/components/layout/Sidebar';
import React from 'react';


const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="wrapper flex">
      <Sidebar />
      <main className="flex-grow p-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;