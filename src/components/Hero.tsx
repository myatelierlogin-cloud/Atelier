import { motion, AnimatePresence } from "motion/react";
import { MousePointer2, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";

const items = [
  {
    id: 1,
    name: "Wassily Chair",
    price: "$2,450",
    description: "A masterpiece of modernist design. The tubular steel frame and taut leather straps create a striking architectural silhouette.",
    image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=400&h=400"
  },
  {
    id: 2,
    name: "Arco Floor Lamp",
    price: "$3,200",
    description: "An iconic lighting fixture featuring a sweeping stainless steel arc and a solid Carrara marble base.",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=400&h=400"
  },
  {
    id: 3,
    name: "Tabi Boots",
    price: "$980",
    description: "Avant-garde split-toe leather boots that challenge traditional footwear silhouettes.",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=400&h=400"
  }
];

export function Hero() {
  const [isHovered, setIsHovered] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      setCurrentItemIndex((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const currentItem = items[currentItemIndex];

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-medium tracking-tight text-charcoal mb-6 leading-[1.1]">
              Monetize <br className="hidden sm:block" />
              <span className="italic text-terracotta">Your Taste.</span>
            </h1>
            <p className="text-lg sm:text-xl text-charcoal/70 mb-10 leading-relaxed max-w-xl font-sans">
              Stop giving away your expertise for free. Build beautiful, interactive moodboards, earn affiliate commissions, and offer paid 1-on-1 consultations—all in one elegant link-in-bio space.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-alabaster bg-charcoal hover:bg-charcoal/90 transition-colors rounded-full"
              >
                Claim Your Space
              </button>
            </div>
          </motion.div>

          {/* Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative rounded-2xl bg-white shadow-2xl border border-black/5 p-4 aspect-[4/3] group overflow-visible">
              {/* Mockup UI Header */}
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-black/5">
                <div className="w-3 h-3 rounded-full bg-black/10" />
                <div className="w-3 h-3 rounded-full bg-black/10" />
                <div className="w-3 h-3 rounded-full bg-black/10" />
              </div>

              {/* Moodboard Canvas */}
              <div className="relative w-full h-full bg-[#F5F5F0] rounded-xl">
                {/* Instruction */}
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: isHovered ? 0 : 1, y: isHovered ? -10 : 0 }}
                  className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-black/5 flex items-center gap-2 z-10"
                >
                  <MousePointer2 className="w-4 h-4 text-terracotta" />
                  <span className="text-xs font-medium text-charcoal/80">Hover to explore</span>
                </motion.div>

                {/* Upcoming Items Preview */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-black/5 z-10">
                  {items.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => setCurrentItemIndex(index)}
                      className={`relative w-10 h-10 rounded-full overflow-hidden border-2 transition-all ${
                        index === currentItemIndex ? 'border-terracotta scale-110' : 'border-transparent opacity-50 hover:opacity-100'
                      }`}
                    >
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply bg-white" />
                    </button>
                  ))}
                </div>

                {/* Decorative background elements */}
                <div className="absolute top-10 left-10 w-32 h-40 bg-stone-200 rounded-sm rotate-[-6deg] shadow-sm" />
                <div className="absolute bottom-10 right-20 w-48 h-32 bg-stone-300 rounded-sm rotate-[4deg] shadow-sm" />
                
                {/* Interactive Product Silhouette */}
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative"
                  >
                    <AnimatePresence mode="wait">
                      <motion.img 
                        key={currentItem.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        src={currentItem.image} 
                        alt={currentItem.name} 
                        className="w-48 h-48 object-cover rounded-xl shadow-lg mix-blend-multiply"
                        style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)' }}
                        referrerPolicy="no-referrer"
                      />
                    </AnimatePresence>
                    
                    {/* Fake Cursor */}
                    <motion.div 
                      className="absolute -bottom-6 -right-6 text-terracotta z-20 pointer-events-none"
                      animate={{ 
                        x: isHovered ? -20 : 20, 
                        y: isHovered ? -20 : 20,
                        scale: isHovered ? 0.9 : 1
                      }}
                      transition={{ type: "spring", stiffness: 150, damping: 15 }}
                    >
                      <MousePointer2 className="w-8 h-8 fill-terracotta" />
                    </motion.div>

                    {/* Tooltip */}
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ 
                        opacity: isHovered ? 1 : 0, 
                        y: isHovered ? 0 : 10,
                        scale: isHovered ? 1 : 0.95
                      }}
                      transition={{ duration: 0.2 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/20 z-50 pointer-events-none"
                    >
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentItem.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-serif font-medium text-sm">{currentItem.name}</h3>
                            <span className="font-mono text-xs text-terracotta">{currentItem.price}</span>
                          </div>
                          <p className="text-xs text-charcoal/60 font-sans mb-3 leading-relaxed">
                            {currentItem.description}
                          </p>
                          <button className="w-full py-2 bg-charcoal text-alabaster text-xs font-medium rounded-lg flex items-center justify-center gap-2">
                            <ShoppingBag className="w-3 h-3" />
                            Buy Now
                          </button>
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
