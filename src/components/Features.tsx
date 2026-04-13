import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "motion/react";
import { Sparkles, Scissors, LockKeyhole, DollarSign, Link, ArrowRight } from "lucide-react";

function TypewriterEffect({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, i));
      i++;
      if (i > text.length) {
        clearInterval(interval);
      }
    }, 30);
    
    return () => clearInterval(interval);
  }, [text, isInView]);

  return (
    <div ref={ref} className="text-sm text-charcoal/80 font-serif leading-relaxed min-h-[80px]">
      {displayedText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="inline-block w-1.5 h-4 bg-terracotta ml-1 align-middle"
      />
    </div>
  );
}

const features = [
  {
    title: "The Interactive Silhouette Canvas.",
    description: "Paste any link and our system instantly isolates the product into a clean silhouette. Arrange items on a freeform canvas. When followers hover or tap an object, they get quick specs, price, and a direct link.",
    icon: Scissors,
    visual: (
      <div className="relative w-full aspect-square bg-stone-100 rounded-2xl overflow-hidden border border-black/5 flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-48 h-48"
        >
          <motion.img 
            initial={{ filter: "grayscale(100%)" }}
            whileInView={{ filter: "grayscale(0%)" }}
            transition={{ duration: 1 }}
            src="https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=400&h=400" 
            alt="Ceramic Vase" 
            className="w-full h-full object-cover mix-blend-multiply"
            style={{ clipPath: 'circle(40% at 50% 50%)' }}
            referrerPolicy="no-referrer"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1.1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute inset-0 border-2 border-dashed border-terracotta/50 rounded-full" 
          />
          
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="absolute -top-12 -right-12 bg-white p-3 rounded-xl shadow-xl border border-black/5 z-10 w-40"
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-serif font-medium">Ceramic Vase</span>
              <span className="text-xs font-mono text-terracotta">$120</span>
            </div>
            <div className="w-full h-6 bg-charcoal rounded flex items-center justify-center text-[10px] text-white font-medium mt-2">
              Add to Cart
            </div>
          </motion.div>
        </motion.div>
      </div>
    )
  },
  {
    title: "AI-Powered Descriptions.",
    description: "Don't waste time writing copy. Our AI automatically generates compelling, aesthetic-focused descriptions for every item you drop onto your board based on the original product page.",
    icon: Sparkles,
    visual: (
      <div className="relative w-full aspect-square bg-alabaster rounded-2xl overflow-hidden border border-black/5 p-8 flex flex-col justify-center">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-black/5 relative mt-8">
          <div className="w-8 h-8 rounded-full bg-terracotta/10 flex items-center justify-center absolute -top-4 -left-4">
            <Sparkles className="w-4 h-4 text-terracotta" />
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute -top-12 left-4 bg-terracotta text-white text-[10px] font-mono px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-3 h-3" />
            </motion.div>
            <span>Generating description</span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
              ...
            </motion.span>
          </motion.div>

          <div className="h-2 w-1/3 bg-stone-200 rounded mb-4" />
          <TypewriterEffect text="This stunning ceramic vase features a minimalist silhouette and a matte finish. Perfect for displaying dried florals or as a standalone sculptural piece in any modern living space." />
        </div>
      </div>
    )
  },
  {
    title: "Atelier Storefront.",
    description: "Your link-in-bio should be an extension of your aesthetic. Build a polished, immersive storefront by simply turning your pictures into shoppable objects. Whether you use your own affiliate links or provide a regular URL, you can seamlessly showcase and monetize your curated vibe in minutes.",
    icon: DollarSign,
    visual: (
      <div className="relative w-full aspect-square bg-terracotta/5 rounded-2xl overflow-hidden border border-terracotta/10 flex items-center justify-center p-3 sm:p-6">
        <div className="flex items-center justify-center gap-2 sm:gap-4 w-full max-w-lg">
          
          {/* Left Side: Dashboard Snippet */}
          <div className="flex-1 min-w-0 bg-white rounded-xl shadow-lg border border-black/5 p-3 sm:p-4 relative z-10">
            <div className="flex items-center gap-3 mb-4 border-b border-black/5 pb-3">
              <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center overflow-hidden shrink-0">
                 <img src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=100&h=100" alt="Chair" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-charcoal truncate">Lounge Chair</div>
                <div className="text-[10px] text-charcoal/50 mt-0.5">Edit Details</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-medium text-charcoal/70 mb-1">Product Name</label>
                <div className="w-full h-7 bg-stone-50 rounded border border-black/5 px-2 flex items-center text-[10px] text-charcoal">
                  Lounge Chair
                </div>
              </div>
              
              <div className="relative">
                <label className="block text-[10px] font-medium text-terracotta mb-1 flex items-center gap-1">
                  <Link className="w-2.5 h-2.5" /> Affiliate Link
                </label>
                <motion.div 
                  animate={{ boxShadow: ["0 0 0 0px rgba(217, 119, 87, 0)", "0 0 0 4px rgba(217, 119, 87, 0.2)", "0 0 0 0px rgba(217, 119, 87, 0)"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-full h-8 bg-white rounded-md border-2 border-terracotta px-2 flex items-center text-[10px] text-charcoal relative z-20 overflow-hidden"
                >
                  <span className="text-charcoal/40 mr-1 shrink-0">https://</span>
                  <span className="truncate">brand.com/p/chair</span>
                  <motion.div 
                    animate={{ opacity: [1, 0] }} 
                    transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    className="w-[1.5px] h-3 bg-terracotta ml-1 shrink-0"
                  />
                </motion.div>

                <motion.div 
                  animate={{ y: [-5, -25], x: [0, 10], opacity: [0, 1, 0], scale: [0.8, 1.2] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-terracotta flex items-center justify-center shadow-sm z-30"
                >
                  <DollarSign className="w-3 h-3 text-white" />
                </motion.div>
                <motion.div 
                  animate={{ y: [-5, -35], x: [0, -15], opacity: [0, 1, 0], scale: [0.6, 1] }}
                  transition={{ duration: 2.5, delay: 0.7, repeat: Infinity, ease: "easeOut" }}
                  className="absolute top-0 right-3 w-5 h-5 rounded-full bg-sage flex items-center justify-center shadow-sm z-30"
                >
                  <DollarSign className="w-2.5 h-2.5 text-white" />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Middle: Arrow/Path */}
          <div className="flex flex-col items-center justify-center shrink-0 text-terracotta/50">
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.div>
          </div>

          {/* Right Side: Storefront Snippet */}
          <div className="w-28 sm:w-36 bg-white rounded-xl shadow-lg border border-black/5 overflow-hidden flex flex-col relative z-10 shrink-0">
            <div className="h-8 sm:h-10 border-b border-black/5 flex items-center justify-center bg-stone-50">
              <span className="text-[9px] sm:text-[10px] font-serif font-medium text-charcoal">My Storefront</span>
            </div>
            <div className="p-1.5 sm:p-2 grid grid-cols-2 gap-1.5 sm:gap-2">
              <div className="aspect-square bg-stone-100 rounded-md overflow-hidden">
                <img src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=100&h=100" alt="Chair" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square bg-stone-100 rounded-md overflow-hidden">
                <img src="https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=100&h=100" alt="Decor" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square bg-stone-100 rounded-md overflow-hidden">
                <img src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=100&h=100" alt="Room" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-square bg-stone-100 rounded-md overflow-hidden">
                <img src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=100&h=100" alt="Furniture" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="h-8 sm:h-10 bg-stone-50 border-t border-black/5 flex items-center justify-center">
              <div className="w-12 sm:w-16 h-1.5 sm:h-2 bg-stone-200 rounded-full"></div>
            </div>
          </div>

        </div>
      </div>
    )
  }
];

export function Features() {
  return (
    <section className="py-24 lg:py-32 bg-alabaster">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-20 lg:mb-32">
          <h2 className="text-4xl sm:text-5xl font-serif font-medium text-charcoal mb-6">
            Everything you need to build your digital storefront.
          </h2>
        </div>

        <div className="space-y-24 lg:space-y-32">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`grid lg:grid-cols-2 gap-12 lg:gap-24 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}
            >
              <motion.div
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={index % 2 === 1 ? 'lg:col-start-2' : ''}
              >
                <div className="w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-5 h-5 text-terracotta" />
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <h3 className="text-3xl font-serif font-medium text-charcoal">
                    {feature.title}
                  </h3>
                  {(feature as any).badge && (
                    <span className="px-3 py-1 text-xs font-medium text-terracotta bg-terracotta/10 rounded-full border border-terracotta/20">
                      {(feature as any).badge}
                    </span>
                  )}
                </div>
                <p className="text-lg text-charcoal/70 font-sans leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={index % 2 === 1 ? 'lg:col-start-1' : ''}
              >
                {feature.visual}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
