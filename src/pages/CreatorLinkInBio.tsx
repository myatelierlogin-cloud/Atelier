import { motion } from "motion/react";
import { Link as LinkIcon, Layout, Palette, MousePointerClick } from "lucide-react";
import { Link } from "react-router-dom";

export default function CreatorLinkInBio() {
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
            <LinkIcon className="w-8 h-8 text-terracotta" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-charcoal mb-6">
            The Ultimate Link in Bio
          </h1>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            Why settle for a basic list of links like Linktree or Beacons when you can have a fully immersive, shoppable storefront? Your link in bio is your digital home—make it count.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <Layout className="w-6 h-6 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">Beyond Basic Links</h3>
            <p className="text-charcoal/70">
              Unlike traditional link-in-bio tools, Atelier lets you create interactive, visual spaces. Tag products directly on your photos so your audience can shop your exact look.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <Palette className="w-6 h-6 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">Your Aesthetic</h3>
            <p className="text-charcoal/70">
              Customize your storefront to match your personal brand. No more generic, cookie-cutter pages. Your Atelier space looks and feels like you.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <MousePointerClick className="w-6 h-6 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">Higher Conversion</h3>
            <p className="text-charcoal/70">
              By combining your content and your shop into one seamless experience, you reduce friction for your followers, leading to higher click-throughs and more sales.
            </p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-charcoal text-alabaster rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl font-serif font-medium mb-4">Upgrade your link in bio today.</h2>
          <p className="text-alabaster/70 mb-8 max-w-xl mx-auto">
            Stop sending your followers to a boring list of links. Give them an interactive shopping experience.
          </p>
          <Link to="/" className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-charcoal bg-alabaster hover:bg-white transition-colors rounded-full">
            Apply as a Creator to Build Your Storefront
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
