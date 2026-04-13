import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Hero } from "../components/Hero";
import { Problem } from "../components/Problem";
import { Features } from "../components/Features";
import { DemoSpace } from "../components/DemoSpace";
import { SocialProof } from "../components/SocialProof";
import { Pricing } from "../components/Pricing";
import { BottomCTA } from "../components/BottomCTA";
import { Footer } from "../components/Footer";
import { motion } from "motion/react";
import { ArrowRight, DollarSign, Link as LinkIcon, Briefcase, BarChart, Users, Image as ImageIcon, Tag } from "lucide-react";
import { Link } from "react-router-dom";

function CreatorFeatures() {
  const features = [
    {
      icon: <DollarSign className="w-6 h-6 text-terracotta" />,
      title: "Monetization",
      description: "Earn commission on every sale you generate through your curated links.",
      link: "/for-creators/monetization"
    },
    {
      icon: <LinkIcon className="w-6 h-6 text-terracotta" />,
      title: "Link in Bio",
      description: "A beautiful, customizable storefront that serves as your digital hub.",
      link: "/for-creators/link-in-bio"
    },
    {
      icon: <Briefcase className="w-6 h-6 text-terracotta" />,
      title: "Portfolios",
      description: "Showcase your best work and past collaborations to attract new brand deals.",
      link: "/for-creators/portfolios"
    },
    {
      icon: <BarChart className="w-6 h-6 text-terracotta" />,
      title: "Analytics",
      description: "Deep insights into your audience, clicks, and conversion rates.",
      link: "/for-creators/analytics"
    },
    {
      icon: <Users className="w-6 h-6 text-terracotta" />,
      title: "Brand Partnerships",
      description: "Connect directly with top brands for sponsored content and exclusive campaigns.",
      link: "/for-creators/brand-partnerships"
    }
  ];

  return (
    <div className="py-24 bg-alabaster">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-charcoal mb-6">
            Everything you need to grow
          </h2>
          <p className="text-lg text-charcoal/70">
            The all-in-one platform for creators to monetize their audience, manage brand relationships, and build their digital storefront.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-8 rounded-2xl border border-black/5 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-terracotta/10 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-medium text-charcoal mb-3">{feature.title}</h3>
              <p className="text-charcoal/70 mb-6">{feature.description}</p>
              <Link to={feature.link} className="inline-flex items-center text-sm font-medium text-terracotta hover:text-terracotta-dark transition-colors">
                Learn more <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HowTaggingWorks() {
  return (
    <section className="py-24 bg-white border-y border-black/5 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-medium text-charcoal mb-6">
            Two Ways to Build Your Storefront
          </h2>
          <p className="text-lg text-charcoal/70">
            Whether you're uploading your own lifestyle photos or using brand-provided imagery, making your content shoppable is effortless.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Path 1: Upload & Tag */}
          <div className="bg-alabaster rounded-3xl p-8 md:p-12 border border-black/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8 relative z-10">
              <Tag className="w-7 h-7 text-terracotta" />
            </div>
            
            <h3 className="text-2xl font-serif font-medium text-charcoal mb-4 relative z-10">
              Upload & Tag Multiple Products
            </h3>
            <p className="text-charcoal/70 mb-8 relative z-10">
              Upload your own lifestyle photos, flatlays, or room setups. Click anywhere on the image to tag multiple products within a single piece of content. Perfect for "get the look" or "room tour" posts.
            </p>
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-3 text-sm font-medium text-charcoal">
                <div className="w-6 h-6 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center text-xs shrink-0">1</div>
                Upload your photo
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-charcoal">
                <div className="w-6 h-6 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center text-xs shrink-0">2</div>
                Click to tag multiple items
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-charcoal">
                <div className="w-6 h-6 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center text-xs shrink-0">3</div>
                Share your interactive shoppable image
              </div>
            </div>
          </div>

          {/* Path 2: Brand Stock Images */}
          <div className="bg-charcoal rounded-3xl p-8 md:p-12 border border-black/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8 relative z-10">
              <ImageIcon className="w-7 h-7 text-alabaster" />
            </div>
            
            <h3 className="text-2xl font-serif font-medium text-alabaster mb-4 relative z-10">
              Use Brand Stock Images
            </h3>
            <p className="text-alabaster/70 mb-8 relative z-10">
              Partnering with a brand? Use their high-quality stock images directly. No tagging required—the entire image acts as a single product link, letting you focus on curation rather than setup.
            </p>
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-3 text-sm font-medium text-alabaster">
                <div className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center text-xs shrink-0">1</div>
                Select brand partner
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-alabaster">
                <div className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center text-xs shrink-0">2</div>
                Choose provided stock images
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-alabaster">
                <div className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center text-xs shrink-0">3</div>
                Instantly add to your storefront
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ForCreators() {
  return (
    <div className="min-h-screen bg-alabaster text-charcoal selection:bg-terracotta/20 selection:text-terracotta-dark">
      <main>
        <Hero />
        <Problem />
        <HowTaggingWorks />
        <Features />
        <CreatorFeatures />
        <DemoSpace />
        <SocialProof />
        <Pricing />
        <BottomCTA />
      </main>
      <Footer />
    </div>
  );
}
