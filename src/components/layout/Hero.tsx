"use client"
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs';

export default function Hero() {
    const Login = () => {
        window.location.href = "/sign-in"
    }
    const startCourse = () => {
        window.location.href = "/courses"
    }
    const user = useUser();

  return (
    <section className="bg-gray-900 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-bold mb-4">Learn without limits</h2>
          <p className="text-xl mb-6">Start, switch, or advance your career with more than 5,000 courses, Professional Certificates, and degrees from world-class universities and companies.</p>
          <div className="space-x-4">
          {!user ? (
                <Button size="lg" onClick={Login}>Join for Free</Button>
            ) : (
                <Button size="lg" onClick={startCourse}>Get Started</Button>
            )}
            
            
          </div>
        </div>
      </div>
    </section>
  )
}

