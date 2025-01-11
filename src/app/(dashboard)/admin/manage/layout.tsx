
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';


const adminLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) =>  {

  const {userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  return (
   
    <div>{children}</div>
  );
};

export default adminLayout;