import { motion } from "motion/react";
import { Search, Filter, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function BrandDiscovery() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-alabaster">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="w-16 h-16 bg-terracotta/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8 text-terracotta" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-charcoal mb-6">
            Influencer Discovery
          </h1>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            Find the perfect creators for your brand. Our advanced search and filtering tools help you identify partners whose aesthetic and audience align perfectly with your products.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <Filter className="w-6 h-6 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">Advanced Filtering</h3>
            <p className="text-charcoal/70">
              Search by niche, engagement rate, follower count, and audience demographics to find creators who truly match your target market.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <Star className="w-6 h-6 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">Vetted Talent</h3>
            <p className="text-charcoal/70">
              Access a curated network of high-quality creators. Review their past portfolios, brand partnerships, and performance metrics before reaching out.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <Users className="w-6 h-6 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">Direct Outreach</h3>
            <p className="text-charcoal/70">
              Contact creators directly through the platform. Send campaign briefs, negotiate rates, and build long-lasting relationships without the hassle of cold emails.
            </p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-charcoal text-alabaster rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl font-serif font-medium mb-4">Find your next brand ambassador.</h2>
          <p className="text-alabaster/70 mb-8 max-w-xl mx-auto">
            Stop wasting time scrolling. Use data-driven discovery to find creators who will actually drive results.
          </p>
          <Link to="/" className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-charcoal bg-alabaster hover:bg-white transition-colors rounded-full">
            Book a Demo to Start Discovering
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
