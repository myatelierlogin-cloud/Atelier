import { motion } from "motion/react";
import { PieChart, BarChart2, TrendingUp, Download } from "lucide-react";
import { Link } from "react-router-dom";

export default function BrandReporting() {
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
            <PieChart className="w-8 h-8 text-terracotta" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-charcoal mb-6">
            Comprehensive Reporting
          </h1>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            Measure your ROI with precision. Get detailed analytics on clicks, conversions, and reach to understand exactly how your influencer campaigns are performing.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <BarChart2 className="w-6 h-6 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">Campaign Performance</h3>
            <p className="text-charcoal/70">
              Track key metrics like impressions, engagement, and click-through rates across all your active campaigns in one unified dashboard.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <TrendingUp className="w-6 h-6 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">ROI Tracking</h3>
            <p className="text-charcoal/70">
              See exactly how much revenue each creator is generating. Calculate your return on investment down to the penny to optimize your marketing spend.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <Download className="w-6 h-6 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">Exportable Reports</h3>
            <p className="text-charcoal/70">
              Generate beautiful, easy-to-read reports that you can share with your team or stakeholders. Export data in CSV or PDF formats for further analysis.
            </p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-charcoal text-alabaster rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl font-serif font-medium mb-4">Make data-driven decisions.</h2>
          <p className="text-alabaster/70 mb-8 max-w-xl mx-auto">
            Stop guessing what works. Use our advanced reporting tools to optimize your influencer marketing strategy.
          </p>
          <Link to="/" className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-charcoal bg-alabaster hover:bg-white transition-colors rounded-full">
            Book a Demo to See Our Analytics
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
