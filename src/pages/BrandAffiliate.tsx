import { motion } from "motion/react";
import { Megaphone, Link as LinkIcon, DollarSign, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export default function BrandAffiliate() {
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
            <Megaphone className="w-8 h-8 text-terracotta" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-charcoal mb-6">
            Affiliate Marketing
          </h1>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            Turn creators into your best salespeople. Set up and manage commission structures to drive sales and track performance with precision.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <LinkIcon className="w-6 h-6 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">Custom Links</h3>
            <p className="text-charcoal/70">
              Generate unique, trackable affiliate links for every creator. Monitor clicks and conversions in real-time to see who's driving the most traffic.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <DollarSign className="w-6 h-6 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">Flexible Commissions</h3>
            <p className="text-charcoal/70">
              Set flat rates or percentage-based commissions. Offer tiered rewards to incentivize top performers and boost overall sales.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <TrendingUp className="w-6 h-6 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">Automated Payouts</h3>
            <p className="text-charcoal/70">
              Say goodbye to manual spreadsheets. We handle the calculations and payouts automatically, ensuring creators are paid accurately and on time.
            </p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-charcoal text-alabaster rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl font-serif font-medium mb-4">Start driving sales today.</h2>
          <p className="text-alabaster/70 mb-8 max-w-xl mx-auto">
            Build an army of brand advocates who are incentivized to promote your products.
          </p>
          <Link to="/" className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-charcoal bg-alabaster hover:bg-white transition-colors rounded-full">
            Book a Demo to Launch Your Program
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
