import Sidebar from '@/components/layout/Sidebar';
import {  menuItemExpert } from '@/const/menuItems';
import { getUser } from '@/lib/actions/user.actions';
import { EUserRole } from '@/types/enums';

import { auth } from '@clerk/nextjs/server';

import { redirect } from 'next/navigation';




const Layout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const {userId} = await auth();
  if(userId) {
    const user = await getUser(userId);
    if(user?.role !== EUserRole.EXPERT) {
      return redirect("/sign-in");
    }
  } else {
    return redirect("/sign-in");
  }
  

  
  return (
    
    <div className="wrapper flex relative">
      <div className={`flex h-screen flex-col justify-between bg-white border-r fixed dark:bg-black dark:text-white 
        `}>
        <Sidebar menuItem={menuItemExpert} isOpen={false} />
       
      </div>
      <main className="flex-grow p-4  ml-[250px]">
        {children}
      </main>
    </div>
  );
};


export default Layout;