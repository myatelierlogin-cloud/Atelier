import { motion } from "motion/react";
import { Gift, Package, Truck, CheckSquare } from "lucide-react";
import { Link } from "react-router-dom";

export default function BrandGifting() {
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
            <Gift className="w-8 h-8 text-terracotta" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-charcoal mb-6">
            Product Gifting
          </h1>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            Send products to creators seamlessly. Manage inventory, track deliveries, and ensure your products get into the right hands without the logistical headache.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <Package className="w-6 h-6 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">Inventory Management</h3>
            <p className="text-charcoal/70">
              Keep track of what you're sending and to whom. Avoid double-shipping and ensure you always have enough stock for your campaigns.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <Truck className="w-6 h-6 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">Delivery Tracking</h3>
            <p className="text-charcoal/70">
              Monitor shipments in real-time. Know exactly when a creator receives your product so you can follow up and coordinate content creation.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <CheckSquare className="w-6 h-6 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">Content Verification</h3>
            <p className="text-charcoal/70">
              Ensure creators post about the products they receive. Track mentions and tags to verify that your gifting efforts are generating ROI.
            </p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-charcoal text-alabaster rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl font-serif font-medium mb-4">Simplify your gifting process.</h2>
          <p className="text-alabaster/70 mb-8 max-w-xl mx-auto">
            Stop managing spreadsheets and start sending products efficiently.
          </p>
          <Link to="/" className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-charcoal bg-alabaster hover:bg-white transition-colors rounded-full">
            Book a Demo to Streamline Gifting
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
