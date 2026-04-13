import { useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, Search, Target, Megaphone, Gift, PieChart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function ForBrands() {
  const features = [
    {
      icon: <Search className="w-6 h-6 text-terracotta" />,
      title: "Influencer Discovery",
      description: "Find the perfect creators for your brand with advanced search and filtering.",
      link: "/for-brands/discovery"
    },
    {
      icon: <Target className="w-6 h-6 text-terracotta" />,
      title: "Campaign Management",
      description: "Streamline your influencer marketing campaigns from start to finish.",
      link: "/for-brands/campaigns"
    },
    {
      icon: <Megaphone className="w-6 h-6 text-terracotta" />,
      title: "Affiliate Marketing",
      description: "Set up and manage commission structures to drive sales.",
      link: "/for-brands/affiliate"
    },
    {
      icon: <Gift className="w-6 h-6 text-terracotta" />,
      title: "Gifting",
      description: "Send products to creators seamlessly and track deliveries.",
      link: "/for-brands/gifting"
    },
    {
      icon: <PieChart className="w-6 h-6 text-terracotta" />,
      title: "Reporting",
      description: "Measure ROI with comprehensive analytics on clicks, conversions, and reach.",
      link: "/for-brands/reporting"
    }
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-charcoal mb-6">
            Scale your influencer marketing.
          </h1>
          <p className="text-lg text-charcoal/70">
            Connect with top creators, manage campaigns, and drive measurable ROI—all in one place.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl border border-black/5 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-terracotta/10 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium text-charcoal mb-3">{feature.title}</h3>
              <p className="text-charcoal/70 mb-6">{feature.description}</p>
              <Link to={feature.link} className="inline-flex items-center text-sm font-medium text-terracotta hover:text-terracotta-dark transition-colors">
                Explore features <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* How it works Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24 scroll-mt-20"
        >
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-serif font-medium text-charcoal mb-4">How it all ties together</h2>
            <p className="text-lg text-charcoal/70">
              A seamless ecosystem connecting your brand with the right creators and eager shoppers.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-terracotta/10 text-terracotta rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-serif font-medium">1</div>
              <h3 className="text-xl font-medium text-charcoal mb-3">Connect & Collaborate</h3>
              <p className="text-charcoal/70">Discover creators aligned with your brand values and seamlessly onboard them to your campaigns.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-terracotta/10 text-terracotta rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-serif font-medium">2</div>
              <h3 className="text-xl font-medium text-charcoal mb-3">Creators Curate</h3>
              <p className="text-charcoal/70">Creators feature your products in their authentic content, tagging them in shoppable posts and storefronts.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-terracotta/10 text-terracotta rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-serif font-medium">3</div>
              <h3 className="text-xl font-medium text-charcoal mb-3">Shoppers Convert</h3>
              <p className="text-charcoal/70">Highly engaged shoppers discover your products through trusted voices, driving frictionless conversions.</p>
            </div>
          </div>
        </motion.div>

        {/* Pricing Section */}
        <motion.div 
          id="pricing"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-12 text-center border border-black/5 mb-24 relative overflow-hidden scroll-mt-20"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <h2 className="text-3xl font-serif font-medium text-charcoal mb-4">Pricing</h2>
            <p className="text-charcoal/70 mb-8 max-w-xl mx-auto">
              We offer custom pricing plans tailored to the size and needs of your brand. Get in touch with our team to find the perfect fit.
            </p>
            <Link to="/contact-sales" className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-white bg-terracotta hover:bg-terracotta-dark transition-colors rounded-full">
              Contact Sales
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-charcoal text-alabaster rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl font-serif font-medium mb-4">Ready to grow your brand?</h2>
          <p className="text-alabaster/70 mb-8 max-w-xl mx-auto">
            Join hundreds of brands using our platform to scale their influencer marketing efforts.
          </p>
          <Link to="/" className="inline-flex items-center justify-center px-8 py-4 text-sm font-medium text-charcoal bg-alabaster hover:bg-white transition-colors rounded-full">
            Book a Demo
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
