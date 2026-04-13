import React, { useState } from 'react';
import { Gift, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const giftCategories = [
  {
    title: "For Her",
    description: "Curated picks for the special women in your life.",
    image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=800",
    link: "/gift-guides/for-her"
  },
  {
    title: "For Him",
    description: "Thoughtful gifts for the men who have everything.",
    image: "https://images.unsplash.com/photo-1505022610485-0249ba5b3675?auto=format&fit=crop&q=80&w=800",
    link: "/gift-guides/for-him"
  },
  {
    title: "For the Homebody",
    description: "Cozy essentials for those who love staying in.",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800",
    link: "/gift-guides/homebody"
  },
  {
    title: "For the Techie",
    description: "The latest gadgets and accessories they'll love.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800",
    link: "/gift-guides/techie"
  },
  {
    title: "For the Foodie",
    description: "Gourmet treats and kitchen must-haves.",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800",
    link: "/gift-guides/foodie"
  },
  {
    title: "For the Traveler",
    description: "Essentials for their next big adventure.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800",
    link: "/gift-guides/traveler"
  }
];

const occasions = [
  "Birthdays", "Anniversaries", "Weddings", "Graduations", "Housewarming", "Holidays"
];

export default function GiftGuides() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = giftCategories.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-24 pb-16 min-h-screen bg-alabaster">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-terracotta/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Gift className="w-8 h-8 text-terracotta" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-charcoal mb-4">
            Gift Guides
          </h1>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            Find the perfect present for every person and occasion with our curated gift guides.
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-12 relative">
          <input
            type="text"
            placeholder="Search gift guides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-full border border-black/10 focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-all text-lg shadow-sm"
          />
          <Search className="absolute left-4 top-4 w-6 h-6 text-charcoal/40" />
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-serif font-medium text-charcoal mb-6">Shop by Recipient</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category, index) => (
              <Link key={index} to={category.link} className="group relative rounded-2xl overflow-hidden aspect-[4/3] block">
                <img src={category.image} alt={category.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-serif font-medium text-white mb-2">{category.title}</h3>
                  <p className="text-white/80 mb-4">{category.description}</p>
                  <div className="inline-flex items-center text-sm font-medium text-white group-hover:text-terracotta transition-colors">
                    Explore Guide <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-serif font-medium text-charcoal mb-6">Shop by Occasion</h2>
          <div className="flex flex-wrap gap-4">
            {occasions.map((occasion, index) => (
              <Link key={index} to={`/gift-guides/${occasion.toLowerCase()}`} className="px-6 py-3 rounded-full border border-black/10 bg-white text-charcoal font-medium hover:border-terracotta hover:text-terracotta transition-colors shadow-sm">
                {occasion}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
