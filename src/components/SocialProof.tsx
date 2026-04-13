import { motion } from "motion/react";

const quotes = [
  {
    quote: "Finally, a way to charge for my time without losing the aesthetic of my brand. The AI descriptions and auto-cutouts save me hours.",
    author: "Sarah",
    role: "Interior Stylist"
  },
  {
    quote: "I used to send messy PDFs with links. Now I send a beautifully curated Atelier board and my clients can buy directly.",
    author: "Elena",
    role: "Personal Shopper"
  },
  {
    quote: "My followers love the interactive moodboards. The conversion rate is double what I was getting on Linktree.",
    author: "James",
    role: "Desk Setup Creator"
  }
];

export function SocialProof() {
  return (
    <section className="py-24 bg-charcoal text-alabaster overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-alabaster">
            Built for tastemakers.
          </h2>
        </div>

        <div className="flex overflow-x-auto pb-8 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-3 gap-8 snap-x snap-mandatory hide-scrollbar">
          {quotes.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-stone-900/50 p-8 rounded-2xl border border-white/5 flex flex-col justify-between min-w-[300px] md:min-w-0 snap-center"
            >
              <p className="text-lg font-serif italic text-alabaster/90 mb-8 leading-relaxed">
                "{item.quote}"
              </p>
              <div>
                <p className="font-medium text-alabaster">{item.author}</p>
                <p className="text-sm text-alabaster/50 font-sans">{item.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
