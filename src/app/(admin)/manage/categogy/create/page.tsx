"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

import { PacmanLoader } from "react-spinners"
import { useState } from "react"
import mongoose from "mongoose"
import { createCategory } from "@/lib/actions/categogy.action"

const categorySchema = z.object({
  title: z.string().min(1, "Title is required"),
  courses: z.array(z.string()).optional(),
  deleted: z.boolean().optional(),
})

type CategoryFormData = z.infer<typeof categorySchema>

export default function CreateCategoryForm() {
  const {
    
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      title: "",
      courses: [],
      deleted: false,
    },
  })

  const [loading, setLoading] = useState(false)

    

  const onSubmit = async (data: CategoryFormData) => {
    setLoading(true)
    const categoryData = {
      title: data.title,
      courses: data.courses ? data.courses.map((id) => new mongoose.Types.ObjectId(id)) : [],
      created_at: new Date(),
      deleted: data.deleted || false,
    }

    try {
      console.log("Category data to be submitted:", categoryData)
      createCategory(categoryData)
      console.log("Category created:", categoryData)
      reset()
      alert("Category created successfully!")
    } catch (error) {
      console.error("Error creating category:", error)
      alert("Failed to create category")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PacmanLoader />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card className="mx-16">
        <CardHeader>
          <CardTitle>Create New Category</CardTitle>
          <CardDescription>Enter the details for your new course category.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

         

          <div className="flex items-center space-x-2">
            <input type="checkbox" id="deleted" {...register("deleted")} />
            <Label htmlFor="deleted">Deleted</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Create Category
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}

