import { motion } from "motion/react";
import { DollarSign, ArrowRight, Percent, TrendingUp, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { tiers } from "../components/Pricing";

export default function CreatorMonetization() {
  const starterTier = tiers.find(t => t.name === "Starter");
  const proTier = tiers.find(t => t.name === "Atelier Pro");

  // Extract transaction fees from features (assuming format "X% Transaction Fee...")
  const getFee = (features: string[]) => {
    const feeFeature = features.find(f => f.includes("Transaction Fee"));
    if (feeFeature) {
      const match = feeFeature.match(/(\d+(\.\d+)?)%/);
      return match ? match[0] : "a low";
    }
    return "a low";
  };

  const starterFee = starterTier ? getFee(starterTier.features) : "4.98%";
  const proFee = proTier ? getFee(proTier.features) : "2%";

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
            <DollarSign className="w-8 h-8 text-terracotta" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-charcoal mb-6">
            Keep More of What You Earn
          </h1>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            Unlike other platforms that take a massive cut of your hard-earned commissions, Atelier is built to maximize your profits with industry-low transaction fees.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <Percent className="w-6 h-6 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">Industry-Low Fees</h3>
            <p className="text-charcoal/70">
              Start for free with just a {starterFee} transaction fee on paid services. Upgrade to Pro and drop your fee to an unbeatable {proFee}.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <TrendingUp className="w-6 h-6 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">Auto-Affiliate</h3>
            <p className="text-charcoal/70">
              Simply paste a product link, and we automatically convert it into an affiliate link so you get paid for every sale.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <Wallet className="w-6 h-6 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">Fast Payouts</h3>
            <p className="text-charcoal/70">
              Get access to your earnings quickly and transparently. Track every click, conversion, and payout in real-time.
            </p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-charcoal text-alabaster rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl font-serif font-medium mb-4">Start monetizing your influence today.</h2>
          <p className="text-alabaster/70 mb-8 max-w-xl mx-auto">
            Join the creators who are taking control of their income and building sustainable businesses on Atelier.
          </p>
          <Link to="/" className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-charcoal bg-alabaster hover:bg-white transition-colors rounded-full">
            Apply as a Creator to Start Earning
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
