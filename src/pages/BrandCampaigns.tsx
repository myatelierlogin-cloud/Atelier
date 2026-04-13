import { motion } from "motion/react";
import { Target, CheckCircle, Calendar, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

export default function BrandCampaigns() {
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
            <Target className="w-8 h-8 text-terracotta" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-charcoal mb-6">
            Campaign Management
          </h1>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            Streamline your entire influencer marketing workflow. From initial outreach to final reporting, manage every aspect of your campaigns in one centralized hub.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <CheckCircle className="w-6 h-6 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">Task Tracking</h3>
            <p className="text-charcoal/70">
              Keep track of deliverables, deadlines, and content approvals. Ensure every creator is on schedule and meeting your campaign requirements.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <Calendar className="w-6 h-6 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">Content Calendar</h3>
            <p className="text-charcoal/70">
              Visualize your entire campaign rollout. See when posts are scheduled to go live and coordinate your marketing efforts accordingly.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white p-8 rounded-2xl border border-black/5"
          >
            <MessageSquare className="w-6 h-6 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">Centralized Comms</h3>
            <p className="text-charcoal/70">
              No more lost emails or scattered DMs. Communicate with all your creators directly within the platform, keeping all campaign details organized.
            </p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-charcoal text-alabaster rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl font-serif font-medium mb-4">Run campaigns with confidence.</h2>
          <p className="text-alabaster/70 mb-8 max-w-xl mx-auto">
            Take the chaos out of influencer marketing and start managing your campaigns like a pro.
          </p>
          <Link to="/" className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-charcoal bg-alabaster hover:bg-white transition-colors rounded-full">
            Book a Demo to Manage Campaigns
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
