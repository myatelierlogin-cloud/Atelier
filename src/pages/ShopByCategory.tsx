import { useState, useEffect, useMemo } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Shirt, Home, Coffee, Sparkles, Heart, Plane, ArrowRight, Tag } from "lucide-react";
import { api } from "../lib/api";

export default function ShopByCategory() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.spaces.categories()
      .then(({ categories }) => setCategories(categories || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const defaultCategories = [
    {
      id: "fashion",
      title: "Fashion & Style",
      icon: <Shirt className="w-6 h-6 text-terracotta" />,
      subcategories: ["Women's Clothing", "Men's Clothing", "Shoes", "Bags & Accessories", "Jewelry"]
    },
    {
      id: "home",
      title: "Home & Interior",
      icon: <Home className="w-6 h-6 text-terracotta" />,
      subcategories: ["Living Room", "Bedroom", "Furniture", "Home Decor", "Lighting"]
    },
    {
      id: "kitchen",
      title: "Kitchen & Dining",
      icon: <Coffee className="w-6 h-6 text-terracotta" />,
      subcategories: ["Cookware & Bakeware", "Tabletop & Bar", "Small Appliances", "Kitchen Tools", "Pantry"]
    },
    {
      id: "beauty",
      title: "Beauty & Grooming",
      icon: <Sparkles className="w-6 h-6 text-terracotta" />,
      subcategories: ["Skincare", "Makeup", "Haircare", "Fragrance", "Bath & Body"]
    },
    {
      id: "wellness",
      title: "Health & Wellness",
      icon: <Heart className="w-6 h-6 text-terracotta" />,
      subcategories: ["Fitness Equipment", "Activewear", "Supplements", "Mindfulness", "Recovery"]
    },
    {
      id: "travel",
      title: "Travel & Lifestyle",
      icon: <Plane className="w-6 h-6 text-terracotta" />,
      subcategories: ["Luggage", "Travel Accessories", "Tech Essentials", "Outdoor Gear", "Books & Leisure"]
    }
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-alabaster">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-charcoal mb-6">
            Shop by Category
          </h1>
          <p className="text-lg text-charcoal/70">
            Explore curated collections across fashion, home, beauty, and more. Find exactly what you're looking for, recommended by creators you trust.
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12 text-charcoal/60">Loading categories...</div>
        ) : (
          <>
            {categories.length > 0 && (
              <div className="mb-16">
                <h2 className="text-2xl font-serif font-medium text-charcoal mb-8 text-center">Creator Tagged Categories</h2>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {categories.map((category, index) => (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-white px-6 py-3 rounded-full border border-black/5 shadow-sm flex items-center gap-2 hover:border-terracotta/30 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <Tag className="w-4 h-4 text-terracotta/70 group-hover:text-terracotta transition-colors" />
                      <span className="font-medium text-charcoal">{category}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {defaultCategories.map((category, index) => (
                <motion.div 
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl border border-black/5 hover:shadow-md transition-shadow group"
                >
                  <div className="w-12 h-12 bg-terracotta/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-terracotta/20 transition-colors">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-medium text-charcoal mb-4">{category.title}</h3>
                  <ul className="space-y-3 mb-8">
                    {category.subcategories.map((sub, i) => (
                      <li key={i} className="text-charcoal/70 hover:text-terracotta transition-colors cursor-pointer flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-black/10" />
                        {sub}
                      </li>
                    ))}
                    <li className="text-charcoal/50 italic text-sm mt-4">
                      and much more...
                    </li>
                  </ul>
                  <Link to={`/`} className="inline-flex items-center text-sm font-medium text-terracotta hover:text-terracotta-dark transition-colors">
                    View all {category.title.toLowerCase()} <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
