import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export function BottomCTA() {
  return (
    <section id="waitlist" className="py-32 bg-alabaster relative overflow-hidden">
      <div className="absolute inset-0 bg-terracotta/5 mix-blend-multiply" />
      <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium text-charcoal mb-6 leading-tight">
            Be the first to build your digital storefront.
          </h2>
          <p className="text-lg sm:text-xl text-charcoal/70 font-sans mb-12 max-w-2xl mx-auto leading-relaxed">
            We are opening Atelier to an exclusive group of 100 founding creators. Join the waitlist to secure your username.
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 px-6 py-4 rounded-full bg-white border border-black/10 focus:outline-none focus:ring-2 focus:ring-terracotta/50 font-sans text-charcoal placeholder:text-charcoal/40"
              required
            />
            <button 
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-terracotta hover:bg-terracotta-dark text-white font-medium transition-colors whitespace-nowrap"
            >
              Join Waitlist
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
          <p className="mt-6 text-sm text-charcoal/40 font-sans">
            No spam. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
