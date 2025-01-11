const categories = [
    "Development", "Business", "Finance & Accounting", "IT & Software", "Office Productivity",
    "Personal Development", "Design", "Marketing", "Lifestyle", "Photography & Video"
  ]
  
  export default function Categories() {
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Top categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <a key={index} href="#" className="block p-4 border rounded-lg hover:shadow-md transition-shadow">
                <span className="text-sm font-medium">{category}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    )
  }
  
  