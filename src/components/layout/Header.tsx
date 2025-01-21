"use client";

import { Search, ShoppingCart, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useAuth, useUser } from '@clerk/nextjs';
import { ModeToggle } from '@/components/mode/ToggleMode';

export default function Header() {
    const {user} = useUser();
    const {signOut} = useAuth()
    const handleLogOut = async () => {
        await signOut();
    }
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Menu className="h-6 w-6 md:hidden" />
          <h1 className="text-3xl font-bold">Udemy</h1>
        </div>
        <div className="hidden md:flex items-center space-x-4 flex-1 max-w-xl mx-4">
          <Input type="text" placeholder="Search for anything" className="w-full" />
          <Search className="h-5 w-5 text-gray-500" />
        </div>
        <nav className="hidden md:flex items-center space-x-4">
        
          <Link href="/courses" className="text-sm font-medium hover:text-purple-600">Teach on Udemy</Link>
          <ShoppingCart className="h-6 w-6" />
          {!user ? (
            <>  
                <Button variant="outline" className="text-sm">Log in</Button>
                <Button className="text-sm">Sign up</Button>
            </>
                
          ) : (
                <Button variant="outline" className="text-sm" onClick={handleLogOut}>Log out</Button>
          )}
         

          <Button variant="ghost" className="p-2">
             <ModeToggle/>
          </Button>
        </nav>
      </div>
    </header>
  )
}

