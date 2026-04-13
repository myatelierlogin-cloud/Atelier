import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Briefcase, ArrowRight } from 'lucide-react';

export default function ForYouLanding() {
  const roles = [
    {
      id: 'shopper',
      title: 'For Shoppers',
      description: 'Discover trending products, shop by category, and find the perfect gifts curated by top creators.',
      icon: ShoppingBag,
      path: '/for-shoppers',
      color: 'bg-rose-100 text-rose-600'
    },
    {
      id: 'creator',
      title: 'For Creators',
      description: 'Monetize your audience, build your portfolio, and partner with top brands in your niche.',
      icon: Star,
      path: '/for-creators',
      color: 'bg-amber-100 text-amber-600'
    },
    {
      id: 'brand',
      title: 'For Brands',
      description: 'Discover influencers, manage campaigns, and track affiliate marketing ROI all in one place.',
      icon: Briefcase,
      path: '/for-brands',
      color: 'bg-blue-100 text-blue-600'
    }
  ];

  return (
    <div className="min-h-screen bg-alabaster pt-32 pb-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-serif font-medium text-charcoal mb-6"
          >
            Choose Your Path
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-charcoal/70"
          >
            Whether you're here to discover, create, or grow your business, Atelier has the tools you need.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Link 
                  to={role.path}
                  className="block h-full bg-white rounded-3xl p-8 shadow-sm border border-black/5 hover:shadow-md hover:border-black/10 transition-all group"
                >
                  <div className={`w-14 h-14 rounded-2xl ${role.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h2 className="text-2xl font-serif font-medium text-charcoal mb-4">{role.title}</h2>
                  <p className="text-charcoal/70 mb-8 line-clamp-3">{role.description}</p>
                  <div className="flex items-center text-sm font-medium text-charcoal group-hover:text-terracotta transition-colors mt-auto">
                    Explore {role.title.replace('For ', '')}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
