import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Loader2, Sparkles, Instagram, Twitter, Youtube, Link as LinkIcon, Star, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { api } from "../lib/api";

const TikTokIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const PinterestIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.367 18.624 0 12.017 0z"/>
  </svg>
);

const socialLinks = [
  { name: 'Instagram', icon: Instagram, url: '#' },
  { name: 'TikTok', icon: TikTokIcon, url: '#' },
  { name: 'Pinterest', icon: PinterestIcon, url: '#' },
  { name: 'YouTube', icon: Youtube, url: '#' },
  { name: 'X', icon: Twitter, url: '#' },
];

const externalLinks = [
  { title: 'Read my latest blog post', url: '#' },
  { title: 'Book a 1-on-1 Consultation', url: '#' },
  { title: 'Shop my Amazon Storefront', url: '#' },
];

interface ProductDetails {
  title: string;
  price: string;
  currency?: string;
  description: string;
  buyLink?: string;
  category?: string;
  brand?: string;
  fileSize?: string;
  format?: string;
  accessDuration?: string;
  boundingBoxes: {
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
}

interface MarkerData {
  id: string;
  x: number;
  y: number;
  loading: boolean;
  details: ProductDetails | null;
}

interface SpaceData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  markers: MarkerData[];
  createdAt: string;
  updatedAt: string;
  isPublic?: boolean;
  isStarred?: boolean;
  order?: number;
  spaceType?: string;
}

function HoverableObject({ spaceId, spaceType, marker, containerRef, isHovered, onMouseEnter, onMouseLeave, trackInteraction }: any) {
  const handleBuyClick = () => {
    if (spaceId && !spaceId.startsWith('demo-')) {
      api.spaces.interact(spaceId, { type: 'buy_button_click', markerId: marker.id, productTitle: marker.details?.title }).catch(console.error);
    }
  };

  return (
    <>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="absolute z-20 w-4 h-4 md:w-5 md:h-5 bg-white rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.2)] cursor-pointer -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
        style={{
          left: `${marker.x}%`,
          top: `${marker.y}%`,
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="absolute w-full h-full rounded-full bg-white animate-ping opacity-75"></div>
      </motion.div>

      <AnimatePresence>
        {isHovered && (
          <div
            className="absolute z-30 pointer-events-none"
            style={{
              left: `${marker.x}%`,
              top: `${marker.y}%`,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 bg-[var(--bg-color)] p-5 rounded-xl shadow-2xl border border-[var(--border-color)] opacity-95 pointer-events-auto"
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-3 gap-4">
                <h3 className="font-serif font-medium text-sm leading-tight text-[var(--text-color)]">{marker.details!.title}</h3>
                <span className="font-mono text-xs text-[var(--accent-color)] whitespace-nowrap">{marker.details!.currency || "$"}{marker.details!.price}</span>
              </div>
              <p className="text-xs text-[var(--text-color)] opacity-70 font-sans mb-4 leading-relaxed">
                {marker.details!.description}
              </p>
              {spaceType === 'digital' && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {marker.details!.fileSize && (
                    <span className="px-2 py-1 theme-tag-bg text-[var(--text-color)] text-[10px] rounded font-medium uppercase tracking-wider">
                      {marker.details!.fileSize}
                    </span>
                  )}
                  {marker.details!.format && (
                    <span className="px-2 py-1 theme-tag-bg text-[var(--text-color)] text-[10px] rounded font-medium uppercase tracking-wider">
                      {marker.details!.format}
                    </span>
                  )}
                  {marker.details!.accessDuration && (
                    <span className="px-2 py-1 theme-tag-bg text-[var(--text-color)] text-[10px] rounded font-medium uppercase tracking-wider">
                      {marker.details!.accessDuration}
                    </span>
                  )}
                </div>
              )}
              {marker.details!.buyLink ? (
                <a 
                  href={marker.details!.buyLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={handleBuyClick}
                  className="w-full py-2.5 bg-[var(--text-color)] text-[var(--bg-color)] text-xs font-medium rounded-lg flex items-center justify-center gap-2 shadow-sm hover:opacity-90 transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  {spaceType === 'digital' ? 'Buy here' : 'Buy Now'}
                </a>
              ) : (
                <button onClick={handleBuyClick} className="w-full py-2.5 bg-[var(--text-color)] text-[var(--bg-color)] text-xs font-medium rounded-lg flex items-center justify-center gap-2 shadow-sm hover:opacity-90 transition-colors">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  {spaceType === 'digital' ? 'Buy here' : 'Buy Now'}
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function SpaceView({ space, hoveredMarkerId, setHoveredMarkerId, hoverTimeoutRef, trackInteraction }: any) {
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  useEffect(() => {
    if (space.id && !space.id.startsWith('demo-')) {
      api.spaces.interact(space.id, { type: 'view' }).catch(console.error);
    }
  }, [space.id]);

  const handleBuyClick = (marker: any) => {
    if (space.id && !space.id.startsWith('demo-')) {
      api.spaces.interact(space.id, { type: 'buy_button_click', markerId: marker.id, productTitle: marker.details?.title }).catch(console.error);
    }
  };

  return (
    <div id={space.id} className="flex flex-col items-center">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-serif font-medium text-[var(--text-color)] mb-2 flex items-center justify-center gap-2">
          {space.title}
          {space.isStarred && <Star className="w-5 h-5 text-yellow-400 fill-current" />}
        </h2>
        <p className="text-[var(--text-color)] opacity-60 max-w-xl mx-auto">{space.description}</p>
      </div>
      
      <div className="w-full max-w-4xl mx-auto">
        <div 
          ref={imageContainerRef}
          className="relative w-full rounded-2xl shadow-2xl border border-[var(--border-color)] border-opacity-10 bg-[var(--bg-color)] overflow-hidden"
        >
          <img 
            src={space.imageUrl} 
            alt={space.title} 
            className="w-full h-auto max-h-[80vh] object-contain"
            draggable={false}
          />
          
          {space.spaceType !== 'digital' && space.spaceType !== 'singular' && space.markers.map((marker: any) => (
            <div key={marker.id}>
              {marker.details && (
                <HoverableObject
                  spaceId={space.id}
                  spaceType={space.spaceType}
                  marker={marker}
                  containerRef={imageContainerRef}
                  isHovered={hoveredMarkerId === marker.id}
                  onMouseEnter={() => {
                    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                    setHoveredMarkerId(marker.id);
                  }}
                  onMouseLeave={() => {
                    hoverTimeoutRef.current = setTimeout(() => setHoveredMarkerId(null), 100);
                  }}
                  trackInteraction={trackInteraction}
                />
              )}
            </div>
          ))}
        </div>

        {/* Accordion for tagged items */}
        {space.markers && space.markers.length > 0 && (
          <div className="mt-4 border border-[var(--border-color)] border-opacity-10 rounded-xl overflow-hidden bg-[var(--bg-color)] shadow-sm">
            <button
              onClick={() => setIsAccordionOpen(!isAccordionOpen)}
              className="w-full px-6 py-4 flex items-center justify-between text-[var(--text-color)] theme-accordion-hover"
            >
              <span className="font-medium flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                {space.spaceType === 'digital' 
                  ? 'Digital Product Details' 
                  : space.spaceType === 'singular' 
                    ? 'Product Details' 
                    : `See tagged items (${space.markers.length})`}
              </span>
              {isAccordionOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            <AnimatePresence>
              {isAccordionOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-[var(--border-color)] border-opacity-10"
                >
                  <div className="p-4 flex flex-col gap-3">
                    {space.markers.map((marker: any) => marker.details && (
                      <div key={marker.id} className="flex items-center justify-between p-3 rounded-lg theme-accordion-hover">
                        <div>
                          <h4 className="font-medium text-[var(--text-color)] text-sm">{marker.details.title}</h4>
                          <p className="text-[var(--text-color)] opacity-60 text-xs mt-0.5">{marker.details.currency || '$'}{marker.details.price}</p>
                        </div>
                        {marker.details.buyLink ? (
                          <a
                            href={marker.details.buyLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => handleBuyClick(marker)}
                            className="px-4 py-2 bg-[var(--text-color)] text-[var(--bg-color)] text-xs font-medium rounded-lg flex items-center gap-2 shadow-sm hover:opacity-90 transition-colors shrink-0"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            {space.spaceType === 'digital' ? 'Buy here' : 'Buy Now'}
                          </a>
                        ) : (
                          <button 
                            onClick={() => handleBuyClick(marker)} 
                            className="px-4 py-2 bg-[var(--text-color)] text-[var(--bg-color)] text-xs font-medium rounded-lg flex items-center gap-2 shadow-sm hover:opacity-90 transition-colors shrink-0"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            {space.spaceType === 'digital' ? 'Buy here' : 'Buy Now'}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

export const DEMO_PROFILES: Record<string, any> = {
  'demo-luxury': {
    displayName: 'Elena V.',
    bio: 'Curating minimalist luxury and timeless pieces.',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400',
    theme: 'luxury',
    socialLinks: [{ platform: 'instagram', url: '#' }, { platform: 'pinterest', url: '#' }],
    externalLinks: [{ title: 'Shop my collection', url: '#' }, { title: 'Read the blog', url: '#' }]
  },
  'demo-tech': {
    displayName: 'Alex.Dev',
    bio: 'Building the future. Workspace setups & gear.',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400',
    theme: 'tech',
    socialLinks: [{ platform: 'x', url: '#' }, { platform: 'youtube', url: '#' }],
    externalLinks: [{ title: 'My Desk Setup', url: '#' }, { title: 'Latest Video', url: '#' }]
  },
  'demo-creative': {
    displayName: 'Studio Bloom',
    bio: 'Colors, shapes, and everyday inspiration.',
    photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=400',
    theme: 'creative',
    socialLinks: [{ platform: 'pinterest', url: '#' }, { platform: 'instagram', url: '#' }],
    externalLinks: [{ title: 'Art Prints', url: '#' }, { title: 'Commission Info', url: '#' }]
  },
  'demo-fashion': {
    displayName: 'NOIR',
    bio: 'Avant-garde streetwear and editorial looks.',
    photoURL: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400&h=400',
    theme: 'fashion',
    socialLinks: [{ platform: 'tiktok', url: '#' }, { platform: 'instagram', url: '#' }],
    externalLinks: [{ title: 'Latest Drop', url: '#' }, { title: 'Lookbook', url: '#' }]
  }
};

export const DEMO_SPACES: Record<string, SpaceData[]> = {
  'demo-luxury': [
    {
      id: 'luxury-1',
      title: 'Living Room Essentials',
      description: 'A collection of my favorite living room pieces.',
      imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1200&h=800',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      markers: [
        {
          id: 'm1',
          x: 45,
          y: 60,
          loading: false,
          details: {
            title: 'Lounge Chair',
            price: '1,200',
            currency: '$',
            description: 'Mid-century modern lounge chair in premium leather.',
            boundingBoxes: [{ x: 35, y: 45, width: 20, height: 30 }]
          }
        }
      ]
    }
  ],
  'demo-tech': [
    {
      id: 'tech-1',
      title: 'Developer Setup',
      description: 'Everything I use to code.',
      imageUrl: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=1200&h=800',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      markers: [
        {
          id: 'm1',
          x: 50,
          y: 70,
          loading: false,
          details: {
            title: 'Mechanical Keyboard',
            price: '150',
            currency: '$',
            description: 'Custom mechanical keyboard with tactile switches.',
            boundingBoxes: [{ x: 40, y: 65, width: 20, height: 10 }]
          }
        }
      ]
    }
  ],
  'demo-creative': [
    {
      id: 'creative-1',
      title: 'Handcrafted Pottery',
      description: 'Earthy tones and organic shapes for your home.',
      imageUrl: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=1200&h=800',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      markers: [
        {
          id: 'm1',
          x: 45,
          y: 60,
          loading: false,
          details: {
            title: 'Ceramic Vase',
            price: '120',
            currency: '$',
            description: 'Hand-thrown ceramic vase with a matte finish.',
            boundingBoxes: [{ x: 35, y: 40, width: 20, height: 40 }]
          }
        }
      ]
    }
  ],
  'demo-fashion': [
    {
      id: 'fashion-1',
      title: 'Fall Collection',
      description: 'My favorite looks for the season.',
      imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200&h=800',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      markers: [
        {
          id: 'm1',
          x: 50,
          y: 40,
          loading: false,
          details: {
            title: 'Leather Jacket',
            price: '300',
            currency: '$',
            description: 'Classic black leather jacket.',
            boundingBoxes: [{ x: 40, y: 30, width: 20, height: 30 }]
          }
        }
      ]
    }
  ]
};

export default function ConsumerSpace() {
  const { username } = useParams<{ username: string }>();
  const location = useLocation();
  const fromDiscover = location.state?.fromDiscover;
  const [spaces, setSpaces] = useState<SpaceData[]>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const trackInteraction = (type: string, details: any = {}) => {
    // Profile-level interactions (social_link_click, external_link_click) are tracked
    // when they also have a spaceId context via api.spaces.interact
    if (details.spaceId && !details.spaceId.startsWith('demo-')) {
      api.spaces.interact(details.spaceId, { type, ...details }).catch(console.error);
    }
  };

  const categories = useMemo(() => {
    const cats = new Set<string>();
    spaces.forEach(space => {
      space.markers?.forEach(marker => {
        if (marker.details?.category) {
          cats.add(marker.details.category.trim());
        }
      });
    });
    return Array.from(cats).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  }, [spaces]);

  const filteredSpaces = useMemo(() => {
    if (!selectedCategory) return spaces;
    return spaces.map(space => {
      // Filter markers within the space
      const filteredMarkers = space.markers?.filter(marker => 
        marker.details?.category?.trim() === selectedCategory
      ) || [];
      
      // Return a new space object with only the filtered markers
      return {
        ...space,
        markers: filteredMarkers
      };
    }).filter(space => space.markers.length > 0); // Only keep spaces that still have markers
  }, [spaces, selectedCategory]);

  useEffect(() => {
    if (username) {
      fetchData();
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'demo_spaces' && username && DEMO_PROFILES[username]) {
        const savedDemos = JSON.parse(e.newValue || '{}');
        setSpaces(savedDemos[username] || DEMO_SPACES[username] || []);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [username]);

  const fetchData = async () => {
    if (username && DEMO_PROFILES[username]) {
      setProfileData(DEMO_PROFILES[username]);
      const savedDemos = JSON.parse(localStorage.getItem('demo_spaces') || '{}');
      setSpaces(savedDemos[username] || DEMO_SPACES[username] || []);
      setLoading(false);
      return;
    }

    try {
      const [profileRes, spacesRes] = await Promise.all([
        api.profile.byUsername(username!).catch(() => null),
        api.spaces.public(username!).catch(() => ({ spaces: [] }))
      ]);

      if (profileRes?.profile) {
        setProfileData(profileRes.profile);
      } else {
        setProfileData({
          name: username,
          displayName: username,
          bio: "Curating spaces, objects, and ideas.",
          theme: "luxury",
          socialLinks: [],
          externalLinks: []
        });
      }

      const fetchedSpaces: SpaceData[] = (spacesRes?.spaces || []) as SpaceData[];
      const customOrder: string[] = profileRes?.profile?.customSpaceOrder || [];

      fetchedSpaces.sort((a, b) => {
        if (customOrder.length > 0) {
          const indexA = customOrder.indexOf(a.id);
          const indexB = customOrder.indexOf(b.id);
          if (indexA !== -1 && indexB !== -1) return indexA - indexB;
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;
        }
        if (a.isStarred && !b.isStarred) return -1;
        if (!a.isStarred && b.isStarred) return 1;
        const orderA = (a as any).order ?? Number.MAX_SAFE_INTEGER;
        const orderB = (b as any).order ?? Number.MAX_SAFE_INTEGER;
        if (orderA !== orderB) return orderA - orderB;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setSpaces(fetchedSpaces);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [loading, spaces, location.hash]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-color)]" />
      </div>
    );
  }

  if (spaces.length === 0 && !profileData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-color)] px-6 text-center">
        <div className="w-16 h-16 bg-[var(--bg-color)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-[var(--border-color)] border-opacity-20">
          <Sparkles className="w-6 h-6 text-[var(--accent-color)]" />
        </div>
        <h1 className="text-2xl font-serif font-medium text-[var(--text-color)] mb-2">No spaces found</h1>
        <p className="text-[var(--text-color)] opacity-60 mb-8 max-w-md mx-auto">It looks like @{username} hasn't created any interactive spaces yet.</p>
        <Link to="/" className="px-6 py-2.5 bg-[var(--text-color)] text-[var(--bg-color)] rounded-full text-sm font-medium hover:opacity-90 transition-colors">
          Create Your Own
        </Link>
      </div>
    );
  }

  const displaySocialLinks = profileData?.socialLinks || socialLinks;
  const displayExternalLinks = profileData?.externalLinks || externalLinks;
  const displayTheme = profileData?.theme || "luxury";

  const getSocialIcon = (platformName: string) => {
    switch (platformName.toLowerCase()) {
      case 'instagram': return Instagram;
      case 'tiktok': return TikTokIcon;
      case 'pinterest': return PinterestIcon;
      case 'youtube': return Youtube;
      case 'x': return Twitter;
      default: return LinkIcon;
    }
  };

  return (
    <div data-theme={displayTheme} className="min-h-screen pt-24 pb-24 bg-[var(--bg-color)] transition-colors duration-300">
      {fromDiscover && (
        <Link 
          to="/discover-creators" 
          className="fixed top-24 left-6 md:left-8 z-50 flex items-center gap-2 px-4 py-2 bg-[var(--bg-color)] border border-[var(--border-color)] border-opacity-20 rounded-full shadow-md hover:shadow-lg transition-all text-sm font-medium text-[var(--text-color)]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Discover
        </Link>
      )}
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center mb-16">
          <div className="w-24 h-24 bg-[var(--bg-color)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-[var(--border-color)] border-opacity-20 text-3xl font-serif text-[var(--text-color)] overflow-hidden">
            {profileData?.avatarUrl || profileData?.photoURL ? (
              <img src={profileData.avatarUrl || profileData.photoURL} alt={username} className="w-full h-full object-cover" />
            ) : (
              username?.charAt(0).toUpperCase()
            )}
          </div>
          <h1 className="text-2xl font-serif font-medium text-[var(--text-color)] mb-2">
            {profileData?.name || profileData?.displayName || username}
          </h1>
          <p className="text-sm text-[var(--text-color)] opacity-60 font-sans mb-8">
            {profileData?.bio || "Curating spaces, objects, and ideas. Welcome to my digital atelier."}
          </p>

          {/* Social Icons */}
          {displaySocialLinks.length > 0 && (
            <div className="flex items-center justify-center gap-6 mb-10 group">
              {displaySocialLinks.map((social: any, idx: number) => {
                const Icon = getSocialIcon(social.platform || social.name);
                return (
                  <a 
                    key={idx} 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="theme-social opacity-100 group-hover:opacity-40 hover:!opacity-100"
                    aria-label={social.platform || social.name}
                    onClick={() => trackInteraction('social_link_click', { platform: social.platform || social.name, url: social.url })}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          )}

          {/* Classic External Links */}
          {displayExternalLinks.length > 0 && (
            <div className="flex flex-col gap-3 mb-12">
              {displayExternalLinks.map((link: any, idx: number) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="theme-link w-full py-4 px-6 text-sm font-sans font-medium flex items-center justify-center"
                  onClick={() => trackInteraction('external_link_click', { title: link.title, url: link.url })}
                >
                  {link.title}
                </a>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="w-full h-px bg-[var(--border-color)] opacity-10 mb-12" />
        </div>

        {/* Category Filters */}
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === null 
                  ? 'bg-[var(--text-color)] text-[var(--bg-color)]' 
                  : 'bg-[var(--bg-color)] text-[var(--text-color)] border border-[var(--border-color)] border-opacity-20 hover:border-opacity-40'
              }`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category 
                    ? 'bg-[var(--text-color)] text-[var(--bg-color)]' 
                    : 'bg-[var(--bg-color)] text-[var(--text-color)] border border-[var(--border-color)] border-opacity-20 hover:border-opacity-40'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-24">
          {filteredSpaces.length > 0 ? (
            filteredSpaces.map((space) => (
              <SpaceView 
                key={space.id} 
                space={space} 
                hoveredMarkerId={hoveredMarkerId} 
                setHoveredMarkerId={setHoveredMarkerId} 
                hoverTimeoutRef={hoverTimeoutRef} 
                trackInteraction={trackInteraction}
              />
            ))
          ) : (
            <div className="text-center py-12 text-[var(--text-color)] opacity-60">
              No spaces found in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
