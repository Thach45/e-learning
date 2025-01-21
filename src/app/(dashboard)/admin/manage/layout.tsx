
import Sidebar from '@/components/layout/Sidebar';
import { menuItemAdmin } from '@/const/menuItems';
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
    if(user?.role !== EUserRole.ADMIN) {
      return redirect("/sign-in");
    }
  } else {
    return redirect("/sign-in");
  }
  

  

  return (
    <div className="wrapper flex">
      <Sidebar menuItem={menuItemAdmin} />
      <main className="flex-grow p-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;