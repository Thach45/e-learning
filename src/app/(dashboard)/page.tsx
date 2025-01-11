import Categories from "@/components/layout/Categories";
import FeaturedCourses from "@/components/layout/FeaturedCourses";
import Header from "@/components/layout/Header";
import Hero from "@/components/layout/Hero";


export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main>
        <Hero />
        <Categories />
        <FeaturedCourses />
      </main>
    </div>
  )
}

