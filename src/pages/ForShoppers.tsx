import { useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, ShoppingBag, Star, TrendingUp, Gift } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function ForShoppers() {
  const features = [
    {
      icon: <Star className="w-6 h-6 text-terracotta" />,
      title: "Discover Creators",
      description: "Find new creators to follow and shop their curated collections.",
      link: "/discover-creators"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-terracotta" />,
      title: "Trending Products",
      description: "See what's popular right now across all creator storefronts.",
      link: "/trending-products"
    },
    {
      icon: <ShoppingBag className="w-6 h-6 text-terracotta" />,
      title: "Shop by Category",
      description: "Browse fashion, beauty, home, and more from trusted tastemakers.",
      link: "/shop-by-category"
    },
    {
      icon: <Gift className="w-6 h-6 text-terracotta" />,
      title: "Gift Guides",
      description: "Find the perfect gift with curated guides for every occasion.",
      link: "/gift-guides"
    }
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-charcoal mb-6">
            Shop the best, curated by the best.
          </h1>
          <p className="text-lg text-charcoal/70">
            Discover products you'll love through the lens of your favorite creators. Shop their exact looks, home decor, and daily essentials.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl border border-black/5 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-terracotta/10 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium text-charcoal mb-3">{feature.title}</h3>
              <p className="text-charcoal/70 mb-6">{feature.description}</p>
              <Link to={feature.link} className="inline-flex items-center text-sm font-medium text-terracotta hover:text-terracotta-dark transition-colors">
                Explore <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* How it works Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24 scroll-mt-20"
        >
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-serif font-medium text-charcoal mb-4">How it works</h2>
            <p className="text-lg text-charcoal/70">
              A seamless shopping experience powered by creators you trust.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-terracotta/10 text-terracotta rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-serif font-medium">1</div>
              <h3 className="text-xl font-medium text-charcoal mb-3">Discover Creators</h3>
              <p className="text-charcoal/70">Find creators whose style matches yours and explore their curated storefronts.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-terracotta/10 text-terracotta rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-serif font-medium">2</div>
              <h3 className="text-xl font-medium text-charcoal mb-3">Shop Their Picks</h3>
              <p className="text-charcoal/70">Browse exact items and similar alternatives recommended by your favorite creators.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-terracotta/10 text-terracotta rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-serif font-medium">3</div>
              <h3 className="text-xl font-medium text-charcoal mb-3">Checkout Seamlessly</h3>
              <p className="text-charcoal/70">Purchase directly through the platform with a single, unified checkout experience.</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-charcoal text-alabaster rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl font-serif font-medium mb-4">Ready to start shopping?</h2>
          <p className="text-alabaster/70 mb-8 max-w-xl mx-auto">
            Join thousands of shoppers discovering their new favorite products through creator recommendations.
          </p>
          <Link to="/" className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-charcoal bg-alabaster hover:bg-white transition-colors rounded-full">
            Start Exploring
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
