import { Check } from "lucide-react";
import { motion } from "motion/react";

export const tiers = [
  {
    name: "Starter",
    description: "The perfect taste of interactive curation.",
    price: "$0",
    period: "/ month",
    cta: "Get Started Free",
    highlighted: false,
    features: [
      "1 Free Space (Up to 10 shoppable items)",
      "4.98% Transaction Fee on paid services (Industry-low)",
      "Auto-affiliate link conversion",
      "Basic AI product mapping",
      "Standard Atelier link-in-bio URL"
    ]
  },
  {
    name: "Pay-As-You-Grow",
    description: "For the creator building their portfolio.",
    price: "$0.99",
    period: "/ per Space",
    cta: "Add a Space",
    highlighted: false,
    features: [
      "1 New Space + 10 additional shoppable items per purchase",
      "4.98% Transaction Fee on paid services",
      "Only pay for what you use. No monthly commitment.",
      "Create distinct boards for different vibes or rooms",
      "Interactive hover tags"
    ]
  },
  {
    name: "Atelier Pro",
    description: "For the serious curator and design studio.",
    price: "$12.99",
    period: "/ month",
    subtext: "(Or $120 billed annually)",
    cta: "Upgrade to Pro",
    highlighted: true,
    badge: "Most Popular",
    features: [
      "Unlimited Spaces & Unlimited Items",
      "2% Transaction Fee (Maximize your profits)",
      "Zero platform branding",
      "Advanced click & revenue analytics"
    ]
  }
];

export function Pricing() {
  return (
    <section className="py-24 lg:py-32 bg-alabaster relative overflow-hidden scroll-mt-20" id="pricing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl font-serif font-medium text-charcoal mb-6 tracking-tight"
          >
            Simple, transparent pricing that scales with your aesthetic.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-charcoal/70 font-sans"
          >
            No hidden fees. Keep more of what you earn with selling fees lower than Linktree, Instagram, and Facebook marketplaces.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className={`relative rounded-2xl p-8 sm:p-10 flex flex-col h-full ${
                tier.highlighted 
                  ? "bg-charcoal text-alabaster shadow-2xl ring-1 ring-charcoal/10" 
                  : "bg-white text-charcoal border border-black/5 shadow-sm"
              }`}
            >
              {tier.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-terracotta text-white text-xs font-semibold uppercase tracking-wider py-1.5 px-4 rounded-full">
                    {tier.badge}
                  </span>
                </div>
              )}

              <div className="mb-8">
                <h3 className={`text-xl font-serif font-medium mb-2 ${tier.highlighted ? "text-alabaster" : "text-charcoal"}`}>
                  {tier.name}
                </h3>
                <p className={`text-sm h-10 ${tier.highlighted ? "text-alabaster/70" : "text-charcoal/60"}`}>
                  {tier.description}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-serif font-medium tracking-tight">
                    {tier.price}
                  </span>
                  <span className={`text-sm font-medium ${tier.highlighted ? "text-alabaster/70" : "text-charcoal/60"}`}>
                    {tier.period}
                  </span>
                </div>
                {tier.subtext && (
                  <p className={`text-xs mt-2 ${tier.highlighted ? "text-terracotta/90" : "text-charcoal/50"}`}>
                    {tier.subtext}
                  </p>
                )}
              </div>

              <button
                className={`w-full py-3.5 px-6 rounded-lg text-sm font-medium transition-all duration-200 mb-10 ${
                  tier.highlighted
                    ? "bg-terracotta text-white hover:bg-terracotta-dark shadow-md"
                    : "bg-stone-100 text-charcoal hover:bg-stone-200"
                }`}
              >
                {tier.cta}
              </button>

              <div className="mt-auto">
                <ul className="space-y-4">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 shrink-0 mt-0.5 ${
                        tier.highlighted ? "text-sage" : "text-terracotta"
                      }`} />
                      <span className={`text-sm leading-relaxed ${
                        tier.highlighted ? "text-alabaster/90" : "text-charcoal/80"
                      }`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
