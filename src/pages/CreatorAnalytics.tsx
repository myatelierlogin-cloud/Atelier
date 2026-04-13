import { motion } from "motion/react";
import { BarChart, Activity, Users, Eye } from "lucide-react";
import { Link } from "react-router-dom";

export default function CreatorAnalytics() {
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
            <BarChart className="w-8 h-8 text-terracotta" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-charcoal mb-6">
            Deep Dive Analytics
          </h1>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            Stop guessing what works. Get real-time, actionable insights into your audience's behavior, link clicks, and conversion rates to optimize your content strategy.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <Activity className="w-6 h-6 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">Real-Time Tracking</h3>
            <p className="text-charcoal/70">
              See exactly which products are driving clicks and sales the moment you post. Adjust your strategy on the fly based on live data.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <Users className="w-6 h-6 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">Audience Insights</h3>
            <p className="text-charcoal/70">
              Understand who is shopping your links. Track demographics, device types, and referral sources to better tailor your content.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <Eye className="w-6 h-6 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">Conversion Metrics</h3>
            <p className="text-charcoal/70">
              Go beyond simple click counts. See your actual conversion rates and earnings per click (EPC) to identify your most profitable items.
            </p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-charcoal text-alabaster rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl font-serif font-medium mb-4">Turn data into dollars.</h2>
          <p className="text-alabaster/70 mb-8 max-w-xl mx-auto">
            Use our advanced analytics to understand your audience, optimize your links, and grow your revenue.
          </p>
          <Link to="/" className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-charcoal bg-alabaster hover:bg-white transition-colors rounded-full">
            Apply as a Creator to Access Analytics
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
