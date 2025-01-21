
import Categories from "@/components/layout/Categories";
import FeaturedCourses from "@/components/layout/FeaturedCourses";
import Header from "@/components/layout/Header";
import Hero from "@/components/layout/Hero";
// import { createCourse } from "@/lib/actions/course.action";
// import { createUser } from "@/lib/actions/user.actions";




export default  async function  Home()  {
  // const user = await createUser({
  //   clerkId: 'clerk12345',
  //   name: 'John Doe',
  //   username: 'johndhdsoe',
  //   email: "thaccdshh@gmail"
  // });
  // console.log(user);
  // const course = await createCourse({

  // });
  // console.log(course);
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

