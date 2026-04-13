import { motion } from "motion/react";
import { Link2Off, TrendingDown, MessageSquareOff } from "lucide-react";

const problems = [
  {
    icon: Link2Off,
    title: "Linktree is ugly.",
    description: "Lists of text links don't sell visual products. Your aesthetic deserves a better storefront."
  },
  {
    icon: TrendingDown,
    title: "Pinterest doesn't pay.",
    description: "You build the boards, they keep the traffic. It's time to own your audience and your revenue."
  },
  {
    icon: MessageSquareOff,
    title: "DMs are chaotic.",
    description: "Managing styling requests in Instagram DMs is unscalable. Stop losing track of paying clients."
  }
];

export function Problem() {
  return (
    <section className="py-24 bg-white border-y border-black/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-charcoal mb-4">
            The current system is broken.
          </h2>
          <p className="text-lg text-charcoal/60 font-sans">
            You're doing the hard work of curating, but the platforms are reaping the rewards.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-alabaster flex items-center justify-center mb-6 border border-black/5">
                <problem.icon className="w-8 h-8 text-terracotta" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-serif font-medium text-charcoal mb-3">
                {problem.title}
              </h3>
              <p className="text-charcoal/60 font-sans leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
