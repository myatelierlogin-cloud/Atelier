import { motion } from "motion/react";
import { Users, Handshake, Mail, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function CreatorBrandPartnerships() {
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
            <Users className="w-8 h-8 text-terracotta" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-charcoal mb-6">
            Direct Brand Partnerships
          </h1>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            Skip the middleman. Connect directly with top brands for sponsored content, exclusive campaigns, and long-term ambassadorships.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <Handshake className="w-6 h-6 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">Direct Connections</h3>
            <p className="text-charcoal/70">
              Brands use Atelier to discover creators. When you build your portfolio here, you put yourself in front of decision-makers actively looking to hire.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <Mail className="w-6 h-6 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">Inbound Opportunities</h3>
            <p className="text-charcoal/70">
              Receive collaboration requests directly in your dashboard. Review campaign briefs, negotiate rates, and accept offers seamlessly.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <ShieldCheck className="w-6 h-6 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">Secure Payments</h3>
            <p className="text-charcoal/70">
              Never chase an invoice again. Atelier handles the contracts and ensures you get paid securely and on time for your sponsored work.
            </p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-charcoal text-alabaster rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl font-serif font-medium mb-4">Ready to work with top brands?</h2>
          <p className="text-alabaster/70 mb-8 max-w-xl mx-auto">
            Build your portfolio, showcase your value, and start receiving inbound collaboration requests.
          </p>
          <Link to="/" className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-charcoal bg-alabaster hover:bg-white transition-colors rounded-full">
            Apply as a Creator to Partner with Brands
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
