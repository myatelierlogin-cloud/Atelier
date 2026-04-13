import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Star, Bookmark, ChevronRight, TrendingUp, ShoppingBag, Gift, Sparkles, Search, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

type Tab = "Discover" | "Products" | "Creators" | "Brands" | "Categories" | "Circles" | "My Circles";

interface Product {
  id: string;
  name: string;
  brand?: string;
  price?: string;
  image?: string;
  url?: string;
  category?: string;
  description?: string;
  curator?: string;
  curatorId?: string;
  spaceId?: string;
}

export default function ShopHub() {
  const [activeTab, setActiveTab] = useState<Tab>("Discover");
  const [tabHistory, setTabHistory] = useState<Tab[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [curators, setCurators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleTabChange = (newTab: Tab) => {
    if (newTab !== activeTab) {
      setTabHistory(prev => [...prev, activeTab]);
      setActiveTab(newTab);
    }
  };

  const handleBack = () => {
    if (tabHistory.length > 0) {
      const prevTab = tabHistory[tabHistory.length - 1];
      setTabHistory(prev => prev.slice(0, -1));
      setActiveTab(prevTab);
    }
  };

  useEffect(() => {
    const handleResetTab = () => {
      setActiveTab("Discover");
      setTabHistory([]);
    };
    window.addEventListener('reset-shop-tab', handleResetTab as EventListener);
    return () => window.removeEventListener('reset-shop-tab', handleResetTab as EventListener);
  }, []);

  useEffect(() => {
    Promise.all([api.spaces.all(), api.profile.creators()])
      .then(([spacesRes, creatorsRes]) => {
        const allSpaces: any[] = spacesRes.spaces || [];
        const allProducts: Product[] = [];

        allSpaces.forEach(space => {
          const markers = Array.isArray(space.markers) ? space.markers : [];
          markers.forEach((marker: any) => {
            if (marker.details) {
              allProducts.push({
                id: marker.id || Math.random().toString(),
                name: marker.details.title || marker.details.name || 'Unknown Product',
                brand: marker.details.brand,
                price: marker.details.price,
                image: marker.details.image || marker.details.imageUrl || space.imageUrl,
                url: marker.details.url || marker.details.buyLink,
                category: marker.details.category,
                description: marker.details.description,
                curator: space.username || 'Unknown Curator',
                curatorId: space.userId,
                spaceId: space.id,
              });
            }
          });
        });

        setProducts(allProducts);
        setCurators(creatorsRes.creators || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const tabs: Tab[] = ["Discover", "Products", "Creators", "Brands", "Categories", "Circles", "My Circles"];

  const categories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => {
      if (p.category) cats.add(p.category.trim());
    });
    return Array.from(cats).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  }, [products]);

  const brands = useMemo(() => {
    const brs = new Set<string>();
    products.forEach(p => {
      if (p.brand) brs.add(p.brand.trim());
    });
    return Array.from(brs).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  }, [products]);

  if (loading) {
    return <div className="pt-32 text-center text-charcoal/60">Loading Shop Hub...</div>;
  }

  return (
    <div className="pt-20 min-h-screen bg-alabaster">
      {/* Sub-Navigation */}
      <div className="sticky top-20 z-40 bg-alabaster/90 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar py-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`whitespace-nowrap text-sm font-medium transition-colors relative ${
                  activeTab === tab ? "text-charcoal" : "text-charcoal/50 hover:text-charcoal/80"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-4 left-0 right-0 h-0.5 bg-terracotta"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {tabHistory.length > 0 && (
          <button 
            onClick={handleBack} 
            className="mb-6 flex items-center gap-2 text-sm font-medium text-charcoal/60 hover:text-terracotta transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to {tabHistory[tabHistory.length - 1]}
          </button>
        )}
        {/* Main Content Area */}
        <div className="min-h-[60vh]">
          {activeTab === "Discover" && <DiscoverFeed setActiveTab={handleTabChange} products={products} categories={categories} brands={brands} curators={curators} />}
          {activeTab === "Products" && <ProductFeed products={products} />}
          {activeTab === "Creators" && <CuratorGrid products={products} curators={curators} />}
          {activeTab === "Brands" && <BrandGrid brands={brands} />}
          {activeTab === "Categories" && <CategoryGrid categories={categories} />}
          {activeTab === "Circles" && <CircleGrid />}
          {activeTab === "My Circles" && <MyCirclesGrid setActiveTab={setActiveTab} />}
        </div>
      </div>
    </div>
  );
}

function DiscoverFeed({ setActiveTab, products, categories, brands, curators }: { setActiveTab: (tab: Tab) => void, products: Product[], categories: string[], brands: string[], curators: any[] }) {
  const features = [
    {
      icon: <Star className="w-5 h-5 text-terracotta" />,
      title: "Discover Creators",
      description: "Find new creators to follow and shop their curated collections.",
      tab: "Creators" as Tab,
      sectionId: "shop-by-creator"
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-terracotta" />,
      title: "Trending Products",
      description: "See what's popular right now across all creator storefronts.",
      tab: "Products" as Tab,
      sectionId: "trending-products"
    },
    {
      icon: <ShoppingBag className="w-5 h-5 text-terracotta" />,
      title: "Shop by Category",
      description: "Browse fashion, beauty, home, and more from trusted tastemakers.",
      tab: "Categories" as Tab,
      sectionId: "shop-by-category"
    },
    {
      icon: <Sparkles className="w-5 h-5 text-terracotta" />,
      title: "Curated Circles",
      description: "Find the perfect aesthetic with curated circles for every occasion.",
      tab: "Circles" as Tab,
      sectionId: "curated-circles"
    }
  ];

  return (
    <div className="space-y-24 pb-12">
      {/* Shopper Value Proposition Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-black/5 p-8 md:p-12 lg:p-16">
        <div className="absolute top-0 right-0 w-96 h-96 bg-terracotta/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-charcoal/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />
        
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium text-charcoal mb-6 leading-tight">
            Shop the best, <br />
            <span className="italic text-terracotta">curated by the best.</span>
          </h1>
          <p className="text-lg text-charcoal/70 mb-12 max-w-2xl leading-relaxed">
            Discover products you'll love through the lens of your favorite creators. Creators are curators, ensuring authentic quality. Shop their exact looks, home decor, and daily essentials, all in one seamless experience.
          </p>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  if (feature.sectionId) {
                    const el = document.getElementById(feature.sectionId);
                    if (el) {
                      const y = el.getBoundingClientRect().top + window.scrollY - 160;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  } else {
                    setActiveTab(feature.tab);
                  }
                }}
                className="flex items-start gap-4 p-4 rounded-2xl hover:bg-alabaster transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-charcoal mb-1 flex items-center gap-1">
                    {feature.title}
                    <ChevronRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-terracotta" />
                  </h3>
                  <p className="text-xs text-charcoal/60 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="trending-products">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-serif font-medium text-charcoal mb-1">Trending Products</h2>
            <p className="text-charcoal/60 text-sm">Discover what's popular right now</p>
          </div>
          <button 
            onClick={() => {
              setActiveTab("Products");
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            className="text-sm font-medium text-terracotta hover:text-terracotta/80 flex items-center gap-1 transition-colors"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <ProductFeed limit={8} products={products} />
      </section>

      <section id="shop-by-creator">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-serif font-medium text-charcoal mb-1">Shop by Creator</h2>
            <p className="text-charcoal/60 text-sm">Find tastemakers that match your aesthetic</p>
          </div>
          <button 
            onClick={() => {
              setActiveTab("Creators");
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            className="text-sm font-medium text-terracotta hover:text-terracotta/80 flex items-center gap-1 transition-colors"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <CuratorGrid limit={4} products={products} curators={curators} />
      </section>

      <section id="shop-by-brand">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-serif font-medium text-charcoal mb-1">Shop by Brand</h2>
            <p className="text-charcoal/60 text-sm">Explore premium brands</p>
          </div>
          <button 
            onClick={() => {
              setActiveTab("Brands");
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            className="text-sm font-medium text-terracotta hover:text-terracotta/80 flex items-center gap-1 transition-colors"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <BrandGrid limit={6} brands={brands} />
      </section>

      <section id="shop-by-category">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-serif font-medium text-charcoal mb-1">Shop by Category</h2>
            <p className="text-charcoal/60 text-sm">Browse by department</p>
          </div>
          <button 
            onClick={() => {
              setActiveTab("Categories");
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            className="text-sm font-medium text-terracotta hover:text-terracotta/80 flex items-center gap-1 transition-colors"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <CategoryGrid limit={3} categories={categories} />
      </section>

      <section id="curated-circles">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-serif font-medium text-charcoal mb-1">Shop by Circles</h2>
            <p className="text-charcoal/60 text-sm">Curated thematic collections</p>
          </div>
          <button 
            onClick={() => {
              setActiveTab("Circles");
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            className="text-sm font-medium text-terracotta hover:text-terracotta/80 flex items-center gap-1 transition-colors"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <CircleGrid limit={2} />
      </section>
    </div>
  );
}

function ProductFeed({ limit, products = [] }: { limit?: number, products?: Product[] }) {
  let displayProducts = products;
  
  if (displayProducts.length === 0) {
    // Mock data for products if none exist
    displayProducts = Array.from({ length: 12 }).map((_, i) => ({
      id: i.toString(),
      name: `Premium Item ${i + 1}`,
      brand: i % 2 === 0 ? "Acne Studios" : "Aesop",
      price: `$${(Math.random() * 200 + 50).toFixed(0)}`,
      image: `https://picsum.photos/seed/product${i}/600/800`,
      curator: i % 3 === 0 ? "Sarah Jane" : undefined
    }));
  }

  if (limit) {
    displayProducts = displayProducts.slice(0, limit);
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
      {displayProducts.map((product) => {
        const Wrapper = product.spaceId && product.curator ? Link : 'div';
        const wrapperProps = product.spaceId && product.curator ? { to: `/${product.curator}#${product.spaceId}` } : {};
        
        return (
          <Wrapper key={product.id} {...wrapperProps} className="break-inside-avoid group cursor-pointer block">
            <div className="relative rounded-2xl overflow-hidden bg-white border border-black/5 mb-3">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full aspect-[3/4] bg-alabaster flex items-center justify-center text-charcoal/20">
                  <ShoppingBag className="w-12 h-12" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              <button className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-charcoal" onClick={(e) => e.preventDefault()}>
                <Bookmark className="w-4 h-4" />
              </button>
              {product.curator && (
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-charcoal flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-4 h-4 rounded-full bg-terracotta/20 flex items-center justify-center text-[10px] text-terracotta">
                    {product.curator.charAt(0)}
                  </div>
                  Via {product.curator}
                </div>
              )}
            </div>
            <div>
              <div className="text-xs font-medium text-charcoal/50 mb-1">{product.brand || "Unknown Brand"}</div>
              <div className="flex items-center justify-between gap-4 mb-1">
                <h3 className="text-sm font-medium text-charcoal truncate">{product.name}</h3>
                <span className="text-sm text-charcoal/70">{product.price || "N/A"}</span>
              </div>
              {product.description && (
                <p className="text-xs text-charcoal/60 line-clamp-2">{product.description}</p>
              )}
            </div>
          </Wrapper>
        );
      })}
    </div>
  );
}

function CuratorGrid({ limit, products = [], curators = [] }: { limit?: number, products?: Product[], curators?: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Map actual curators
  const actualCurators = curators.map((c, i) => {
    // Find products by this curator
    const curatorProducts = products.filter(p => p.curatorId === c.id);
    // Extract unique brands
    const brands = Array.from(new Set(curatorProducts.map(p => p.brand).filter(Boolean))).slice(0, 3);
    
    return {
      id: c.id,
      name: c.displayName || c.name || `Curator ${i + 1}`,
      niche: c.bio || "Content Creator",
      avatar: c.photoURL || c.avatarUrl || `https://picsum.photos/seed/avatar${i}/200/200`,
      cover: c.theme === 'luxury' ? `https://picsum.photos/seed/luxury${i}/800/400` : `https://picsum.photos/seed/cover${i}/800/400`,
      brands: brands.length > 0 ? brands : ["Various"],
      username: c.username || c.id
    };
  });

  // Mock curators to fill the grid if needed
  const mockCurators = Array.from({ length: 8 }).map((_, i) => ({
    id: `mock-${i}`,
    name: `Curator ${i + 1}`,
    niche: i % 2 === 0 ? "Minimalist Fashion" : "Home & Living",
    avatar: `https://picsum.photos/seed/avatar${i}/200/200`,
    cover: `https://picsum.photos/seed/cover${i}/800/400`,
    brands: ["SSENSE", "Aesop", "Byredo"],
    username: `curator${i}`
  }));

  // Combine actual and mock curators
  let displayCurators = [...actualCurators, ...mockCurators];

  // Remove duplicates by ID just in case
  const uniqueIds = new Set();
  displayCurators = displayCurators.filter(c => {
    if (uniqueIds.has(c.id)) return false;
    uniqueIds.add(c.id);
    return true;
  });

  if (limit) {
    displayCurators = displayCurators.slice(0, limit);
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    displayCurators = displayCurators.filter(c => 
      c.name.toLowerCase().includes(query) || 
      c.niche.toLowerCase().includes(query) ||
      c.brands.some((b: string) => b.toLowerCase().includes(query))
    );
  }

  return (
    <div className="space-y-6">
      {!limit && (
        <div className="relative max-w-md mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-charcoal/40" />
          </div>
          <input
            type="text"
            placeholder="Search creators by name, niche, or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-11 pr-4 py-3 bg-white border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-colors"
          />
        </div>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayCurators.map((curator) => (
          <Link to={`/${curator.username}`} key={curator.id} className="bg-white rounded-2xl border border-black/5 overflow-hidden group hover:shadow-md transition-all cursor-pointer block">
            <div className="h-32 relative overflow-hidden">
              <img 
                src={curator.cover} 
                alt="Cover" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
            <div className="px-6 pb-6 relative">
              <div className="w-16 h-16 rounded-full border-4 border-white overflow-hidden -mt-8 mb-3 relative z-10 bg-alabaster">
                <img src={curator.avatar} alt={curator.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <h3 className="text-lg font-medium text-charcoal mb-1">{curator.name}</h3>
              <p className="text-sm text-charcoal/60 mb-4 line-clamp-2">{curator.niche}</p>
              
              <div className="space-y-2">
                <div className="text-xs font-medium text-charcoal/40 uppercase tracking-wider">Top Brands</div>
                <div className="flex flex-wrap gap-2">
                  {curator.brands.map((brand: string) => (
                    <span key={brand} className="px-2 py-1 bg-alabaster text-charcoal/70 text-xs rounded-md">
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {displayCurators.length === 0 && (
        <div className="text-center py-12 text-charcoal/60">
          No creators found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}

function BrandGrid({ limit, brands = [] }: { limit?: number, brands?: string[] }) {
  let displayBrands = brands.map((b, i) => ({
    id: i.toString(),
    name: b,
    logo: `https://picsum.photos/seed/brand${i}/200/200`,
    category: "Various"
  }));

  if (displayBrands.length === 0) {
    displayBrands = Array.from({ length: 12 }).map((_, i) => ({
      id: i.toString(),
      name: `Brand ${i + 1}`,
      logo: `https://picsum.photos/seed/brand${i}/200/200`,
      category: i % 2 === 0 ? "Fashion" : "Beauty"
    }));
  }

  if (limit) {
    displayBrands = displayBrands.slice(0, limit);
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {displayBrands.map((brand) => (
        <div key={brand.id} className="group cursor-pointer">
          <div className="aspect-square bg-white rounded-2xl border border-black/5 flex items-center justify-center p-6 mb-3 group-hover:border-terracotta/30 transition-colors">
            <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" referrerPolicy="no-referrer" />
          </div>
          <div className="text-center">
            <h3 className="text-sm font-medium text-charcoal">{brand.name}</h3>
            <p className="text-xs text-charcoal/50">{brand.category}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function CategoryGrid({ limit, categories = [] }: { limit?: number, categories?: string[] }) {
  let displayCategories = categories.map((c, i) => ({
    name: c,
    image: `https://picsum.photos/seed/${c.toLowerCase().replace(/[^a-z0-9]/g, '')}/800/800`
  }));

  if (displayCategories.length === 0) {
    displayCategories = [
      { name: "Fashion", image: "https://picsum.photos/seed/fashion/800/800" },
      { name: "Home & Living", image: "https://picsum.photos/seed/home/800/800" },
      { name: "Beauty", image: "https://picsum.photos/seed/beauty/800/800" },
      { name: "Wellness", image: "https://picsum.photos/seed/wellness/800/800" },
      { name: "Travel", image: "https://picsum.photos/seed/travel/800/800" },
      { name: "Tech", image: "https://picsum.photos/seed/tech/800/800" },
    ];
  }

  if (limit) {
    displayCategories = displayCategories.slice(0, limit);
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayCategories.map((category) => (
        <div key={category.name} className="relative aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer">
          <img 
            src={category.image} 
            alt={category.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center">
            <h3 className="text-2xl font-serif font-medium text-white tracking-wide">{category.name}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}

function CircleGrid({ limit }: { limit?: number }) {
  let circles = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    name: i % 2 === 0 ? "Minimalist Fall Wardrobe" : "Skincare Essentials",
    curatorsCount: Math.floor(Math.random() * 10) + 3,
    image: `https://picsum.photos/seed/circle${i}/800/600`
  }));

  if (limit) {
    circles = circles.slice(0, limit);
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {circles.map((circle) => (
        <div key={circle.id} className="group cursor-pointer">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-4">
            <img 
              src={circle.image} 
              alt={circle.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 text-white/80 text-sm font-medium mb-2">
                  <UsersIcon className="w-4 h-4" />
                  {circle.curatorsCount} Creators
                </div>
                <h3 className="text-2xl font-serif font-medium text-white">{circle.name}</h3>
              </div>
              <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-charcoal transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MyCirclesGrid({ setActiveTab }: { setActiveTab: (tab: Tab) => void }) {
  return (
    <div className="text-center py-24">
      <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Bookmark className="w-8 h-8 text-terracotta" />
      </div>
      <h2 className="text-2xl font-serif font-medium text-charcoal mb-4">No saved Circles yet</h2>
      <p className="text-charcoal/60 max-w-md mx-auto mb-8">
        Explore the Circles tab to find curated collections of products and save them here for easy access.
      </p>
      <button 
        onClick={() => setActiveTab("Circles")}
        className="px-8 py-3 bg-charcoal text-alabaster font-medium rounded-full hover:bg-charcoal/90 transition-colors"
      >
        Explore Circles
      </button>
    </div>
  );
}

// Helper icon for CircleGrid
function UsersIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
