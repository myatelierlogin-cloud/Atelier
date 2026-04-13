import { motion } from "motion/react";
import { Briefcase, Image as ImageIcon, Star, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function CreatorPortfolios() {
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
            <Briefcase className="w-8 h-8 text-terracotta" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-charcoal mb-6">
            Your Digital Portfolio
          </h1>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            Move beyond static grids. Unlike LTK or ShopMy, Atelier allows you to build a dynamic, interactive portfolio that showcases your unique aesthetic and past brand collaborations.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <ImageIcon className="w-6 h-6 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">Visual Storytelling</h3>
            <p className="text-charcoal/70">
              Create beautiful, shoppable mood boards and lookbooks. Let brands see how you style products in real-world settings, not just isolated links.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <Star className="w-6 h-6 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">Highlight Partnerships</h3>
            <p className="text-charcoal/70">
              Easily showcase your best sponsored content. A strong portfolio is the key to landing bigger, better deals with premium brands.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <Zap className="w-6 h-6 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">Stand Out</h3>
            <p className="text-charcoal/70">
              When a brand visits your Atelier page, they see a professional, curated experience that proves you take your content creation seriously.
            </p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-charcoal text-alabaster rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl font-serif font-medium mb-4">Build a portfolio that gets you hired.</h2>
          <p className="text-alabaster/70 mb-8 max-w-xl mx-auto">
            Showcase your style, highlight your best work, and attract the brand partnerships you deserve.
          </p>
          <Link to="/" className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-charcoal bg-alabaster hover:bg-white transition-colors rounded-full">
            Apply as a Creator to Build Your Portfolio
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
