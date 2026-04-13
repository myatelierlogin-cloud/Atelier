import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, ShoppingBag, MousePointerClick, X, Undo2, Save, Link as LinkIcon, Plus, Sparkles, Upload, Image as ImageIcon, Check, Trash2, Eye, EyeOff, Edit, ArrowUp, ArrowDown, Settings, ArrowLeft, BarChart2, CheckSquare, MessageSquare, Calendar, LayoutDashboard, Star, Tag, DollarSign, Instagram, Twitter, Youtube, Facebook, Linkedin, Github, RefreshCw, TrendingUp, Activity, Lightbulb, Info, Flame, PlusCircle, Copy, Share2, QrCode } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../lib/api";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { DEMO_SPACES } from "./ConsumerSpace";
import { CategoryCombobox } from "../components/CategoryCombobox";

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

function ProfileSettingsModal({ isOpen, onClose, profileData, user }: any) {
  const [displayName, setDisplayName] = useState(profileData?.displayName || "");
  const [bio, setBio] = useState(profileData?.bio || "");
  const [photoURL, setPhotoURL] = useState(profileData?.photoURL || "");
  const [theme, setTheme] = useState(profileData?.theme || "luxury");
  const [externalLinks, setExternalLinks] = useState<any[]>(profileData?.externalLinks || []);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setDisplayName(profileData?.displayName || "");
      setBio(profileData?.bio || "");
      setPhotoURL(profileData?.photoURL || "");
      setTheme(profileData?.theme || "luxury");
      setExternalLinks(profileData?.externalLinks || []);
    }
  }, [isOpen, profileData]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const compressedBase64 = await compressImage(file, 400, 0.8);
      setPhotoURL(compressedBase64);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to process image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await api.profile.update({
        displayName: displayName || "",
        bio: bio || "",
        photoURL: photoURL || "",
        avatarUrl: photoURL || "",
        theme: theme || "luxury",
        externalLinks,
      });
      onClose();
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile settings.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-black/5 p-6 flex justify-between items-center z-10">
          <h2 className="text-xl font-serif font-medium text-charcoal">Profile Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-alabaster rounded-full transition-colors">
            <X className="w-5 h-5 text-charcoal/60" />
          </button>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Basic Info Section */}
          <div>
            <h3 className="text-sm font-medium text-charcoal uppercase tracking-wider mb-4">Basic Info</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-alabaster border border-black/10 overflow-hidden flex items-center justify-center shrink-0">
                  {uploadingImage ? (
                    <Loader2 className="w-6 h-6 animate-spin text-terracotta" />
                  ) : photoURL ? (
                    <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-charcoal/20" />
                  )}
                </div>
                <div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-4 py-2 bg-white border border-black/10 text-charcoal rounded-lg text-sm font-medium hover:bg-alabaster transition-colors"
                  >
                    Change Picture
                  </button>
                  <p className="text-xs text-charcoal/40 mt-2">Recommended: Square image, at least 400x400px.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Display Name</label>
                  <input 
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2 bg-alabaster border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-terracotta"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Bio</label>
                  <textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-2 bg-alabaster border border-black/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-terracotta resize-none h-24"
                    placeholder="Curating spaces, objects, and ideas. Welcome to my digital atelier."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Theme Selection Section */}
          <div>
            <h3 className="text-sm font-medium text-charcoal uppercase tracking-wider mb-4">Storefront Theme</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'luxury', label: 'Luxury (Default)', desc: 'Editorial, minimal, serif' },
                { id: 'tech', label: 'Tech Savvy', desc: 'Dark mode, neon, monospace' },
                { id: 'creative', label: 'Creative', desc: 'Warm, playful, rounded' },
                { id: 'fashion', label: 'Fashion', desc: 'Brutalist, high contrast, bold' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-4 text-left border rounded-xl transition-all ${theme === t.id ? 'border-terracotta bg-terracotta/5 ring-1 ring-terracotta' : 'border-black/10 hover:border-black/30'}`}
                >
                  <div className="font-medium text-charcoal mb-1">{t.label}</div>
                  <div className="text-xs text-charcoal/60">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm border-t border-black/5 p-6 flex justify-end gap-3 z-10">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-charcoal hover:bg-alabaster rounded-full transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-charcoal text-white text-sm font-medium rounded-full hover:bg-charcoal/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function HoverableObject({ spaceType, marker, containerRef, isHovered, onMouseEnter, onMouseLeave }: any) {
  const box = marker.details!.boundingBox;
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setHoverPos({ x, y });
  };

  return (
    <>
      <div
        className="absolute z-10 cursor-crosshair"
        style={{
          left: `${box.x}%`,
          top: `${box.y}%`,
          width: `${box.width}%`,
          height: `${box.height}%`,
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={() => {
          onMouseLeave();
          setHoverPos(null);
        }}
        onMouseMove={handleMouseMove}
      />

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="absolute z-20 w-3 h-3 md:w-4 md:h-4 bg-white rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.2)] pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
        style={{
          left: `${isHovered && hoverPos ? hoverPos.x : marker.x}%`,
          top: `${isHovered && hoverPos ? hoverPos.y : marker.y}%`,
        }}
      >
        <div className="absolute w-full h-full rounded-full bg-white animate-ping opacity-75"></div>
      </motion.div>

      <AnimatePresence>
        {isHovered && (
          <div
            className="absolute z-30 pointer-events-none"
            style={{
              left: `${box.x + box.width / 2}%`,
              top: `${box.y}%`,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 bg-white/95 backdrop-blur-md p-5 rounded-xl shadow-2xl border border-white/40 pointer-events-auto"
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-3 gap-4">
                <h3 className="font-serif font-medium text-sm leading-tight text-charcoal">{marker.details!.title}</h3>
                <span className="font-mono text-xs text-terracotta whitespace-nowrap">{marker.details!.currency || "$"}{marker.details!.price}</span>
              </div>
              <p className="text-xs text-charcoal/70 font-sans mb-4 leading-relaxed">
                {marker.details!.description}
              </p>
              {spaceType === 'digital' && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {marker.details!.fileSize && (
                    <span className="px-2 py-1 bg-charcoal/5 text-charcoal text-[10px] rounded font-medium uppercase tracking-wider">
                      {marker.details!.fileSize}
                    </span>
                  )}
                  {marker.details!.format && (
                    <span className="px-2 py-1 bg-charcoal/5 text-charcoal text-[10px] rounded font-medium uppercase tracking-wider">
                      {marker.details!.format}
                    </span>
                  )}
                  {marker.details!.accessDuration && (
                    <span className="px-2 py-1 bg-charcoal/5 text-charcoal text-[10px] rounded font-medium uppercase tracking-wider">
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
                  className="w-full py-2.5 bg-charcoal text-alabaster text-xs font-medium rounded-lg flex items-center justify-center gap-2 shadow-sm hover:bg-charcoal/90 transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  {spaceType === 'digital' ? 'Download' : 'Buy Now'}
                </a>
              ) : (
                <button className="w-full py-2.5 bg-charcoal text-alabaster text-xs font-medium rounded-lg flex items-center justify-center gap-2 shadow-sm hover:bg-charcoal/90 transition-colors">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  {spaceType === 'digital' ? 'Download' : 'Buy Now'}
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

const compressImage = (file: File, maxWidth = 1024, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

function StorefrontPreviewModal({ isOpen, onClose, profileData, currentSpace }: any) {
  if (!isOpen) return null;

  const theme = profileData?.theme || "luxury";
  
  const themeStyles: Record<string, any> = {
    luxury: {
      bg: "bg-[#f5f5f0]",
      text: "text-charcoal",
      font: "font-serif",
      card: "bg-white",
      accent: "bg-terracotta",
      accentText: "text-terracotta"
    },
    tech: {
      bg: "bg-[#0a0a0a]",
      text: "text-white",
      font: "font-mono",
      card: "bg-[#151515]",
      accent: "bg-[#00ff00]",
      accentText: "text-[#00ff00]"
    },
    creative: {
      bg: "bg-[#fdfcf8]",
      text: "text-[#4a4a40]",
      font: "font-sans",
      card: "bg-white",
      accent: "bg-[#8c7851]",
      accentText: "text-[#8c7851]"
    },
    fashion: {
      bg: "bg-[#ffffff]",
      text: "text-black",
      font: "font-sans",
      card: "bg-[#f0f0f0]",
      accent: "bg-black",
      accentText: "text-black"
    }
  };

  const style = themeStyles[theme] || themeStyles.luxury;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-charcoal/80 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`relative w-full max-w-5xl max-h-[90vh] ${style.bg} rounded-3xl shadow-2xl overflow-hidden flex flex-col`}
      >
        <div className="p-4 border-b border-black/5 flex justify-between items-center bg-white/50 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-terracotta" />
            <span className="font-medium text-charcoal">Storefront Preview</span>
            <span className="text-xs text-charcoal/40 bg-alabaster px-2 py-1 rounded-full uppercase tracking-wider ml-2">Theme: {theme}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-charcoal/50" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center mb-16">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden mb-6 border-4 border-white shadow-lg">
                <img 
                  src={profileData?.photoURL || "https://picsum.photos/seed/profile/200/200"} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className={`text-3xl md:text-5xl ${style.font} ${style.text} mb-4`}>
                {profileData?.displayName || profileData?.name || "Your Name"}
              </h1>
              <p className={`text-lg opacity-70 max-w-lg ${style.text}`}>
                {profileData?.bio || "Your bio will appear here."}
              </p>
            </div>

            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl md:text-2xl ${style.font} ${style.text}`}>
                  {currentSpace.title || "Untitled Space"}
                </h2>
              </div>
              
              <div className={`rounded-3xl overflow-hidden shadow-xl ${style.card} border border-black/5 relative`}>
                <img 
                  src={currentSpace.imageUrl} 
                  alt={currentSpace.title} 
                  className="w-full h-auto aspect-[16/10] object-cover"
                />
                
                {currentSpace.markers.map((marker: any) => (
                  <div
                    key={marker.id}
                    className="absolute w-5 h-5 md:w-6 md:h-6 bg-white rounded-full shadow-lg cursor-pointer -translate-x-1/2 -translate-y-1/2 flex items-center justify-center border-2 border-white"
                    style={{
                      left: `${marker.x}%`,
                      top: `${marker.y}%`,
                    }}
                  >
                    <div className={`w-2 h-2 rounded-full ${style.accent}`}></div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <p className={`text-base opacity-70 ${style.text}`}>
                  {currentSpace.description || "No description provided."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 opacity-30 pointer-events-none mb-12">
              <div className={`rounded-2xl h-64 ${style.card} border border-black/5 flex items-center justify-center`}>
                <span className="text-xs uppercase tracking-widest opacity-50">Other Space Placeholder</span>
              </div>
              <div className={`rounded-2xl h-64 ${style.card} border border-black/5 flex items-center justify-center`}>
                <span className="text-xs uppercase tracking-widest opacity-50">Other Space Placeholder</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const StorefrontLivePreview = ({ profileData, spaces }: { profileData: any, spaces: any[] }) => {
  const theme = profileData?.theme || "luxury";
  const socialLinks = profileData?.socialLinks || [];
  const externalLinks = profileData?.externalLinks || [];
  const customSpaceOrder = profileData?.customSpaceOrder || [];
  
  const orderedSpaces = [...spaces].sort((a, b) => {
    if (customSpaceOrder.length > 0) {
      const indexA = customSpaceOrder.indexOf(a.id);
      const indexB = customSpaceOrder.indexOf(b.id);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
    }
    return 0;
  });

  const themeStyles: Record<string, any> = {
    luxury: { bg: "bg-[#f5f5f0]", text: "text-charcoal", font: "font-serif", card: "bg-white", accent: "bg-terracotta" },
    tech: { bg: "bg-[#0a0a0a]", text: "text-white", font: "font-mono", card: "bg-[#151515]", accent: "bg-[#00ff00]" },
    creative: { bg: "bg-[#fdfcf8]", text: "text-[#4a4a40]", font: "font-sans", card: "bg-white", accent: "bg-[#8c7851]" },
    fashion: { bg: "bg-[#ffffff]", text: "text-black", font: "font-sans", card: "bg-[#f0f0f0]", accent: "bg-black" }
  };

  const style = themeStyles[theme] || themeStyles.luxury;

  return (
    <div className="sticky top-32 flex justify-center w-full">
      {/* Phone Mockup */}
      <div className="w-[320px] h-[650px] bg-black rounded-[3rem] p-3 shadow-2xl relative overflow-hidden ring-1 ring-black/10">
        {/* Notch */}
        <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50">
          <div className="w-32 h-6 bg-black rounded-b-3xl"></div>
        </div>
        
        {/* Screen Content */}
        <div className={`w-full h-full rounded-[2.25rem] overflow-y-auto overflow-x-hidden ${style.bg} ${style.text} scrollbar-hide`}>
          <div className="p-6 pt-12 pb-12 flex flex-col items-center">
            
            {/* Profile */}
            <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-white/10 shadow-sm shrink-0">
              {profileData?.photoURL ? (
                <img src={profileData.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-black/5 flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 opacity-20" />
                </div>
              )}
            </div>
            <h2 className={`text-xl ${style.font} font-medium mb-2 text-center`}>{profileData?.displayName || profileData?.name || "Your Name"}</h2>
            <p className="text-xs opacity-70 text-center mb-6 max-w-[240px] leading-relaxed">{profileData?.bio || "Your bio will appear here."}</p>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {socialLinks.map((link: any, idx: number) => {
                  let Icon = LinkIcon;
                  if (link.platform === 'Instagram') Icon = Instagram;
                  if (link.platform === 'TikTok') Icon = LinkIcon;
                  if (link.platform === 'Pinterest') Icon = LinkIcon;
                  if (link.platform === 'YouTube') Icon = Youtube;
                  if (link.platform === 'X') Icon = Twitter;

                  return (
                    <div key={idx} className={`p-2 rounded-full border border-current/10 ${style.card} hover:opacity-80 transition-opacity`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  );
                })}
              </div>
            )}

            {/* External Links */}
            {externalLinks.length > 0 && (
              <div className="w-full space-y-3 mb-8">
                {externalLinks.map((link: any, idx: number) => (
                  <div key={idx} className={`w-full py-3 px-4 text-xs font-medium text-center border border-current/10 rounded-xl ${style.card} shadow-sm truncate`}>
                    {link.title || "Link Title"}
                  </div>
                ))}
              </div>
            )}

            {/* Spaces Grid */}
            <div className="w-full grid grid-cols-2 gap-3">
              {orderedSpaces.map((space) => (
                <div key={space.id} className={`aspect-[4/5] rounded-xl overflow-hidden relative border border-current/10 ${style.card}`}>
                  <img src={space.imageUrl} alt={space.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                    <span className="text-white text-xs font-medium truncate drop-shadow-md">{space.title}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default function CreatorSpaces() {
  const { user, profile, loading: authLoading } = useAuth();
  const username = profile?.name?.toLowerCase().replace(/\s+/g, '') || profile?.uid || '';
  const [spaces, setSpaces] = useState<SpaceData[]>([]);
  const [spacesLoading, setSpacesLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  // New Space Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [isAcknowledged, setIsAcknowledged] = useState(false);
  const [editingSpaceId, setEditingSpaceId] = useState<string | null>(null);
  const [spaceToDelete, setSpaceToDelete] = useState<string | null>(null);
  const [spaceType, setSpaceType] = useState<string>("gallery");
  
  const [uploading, setUploading] = useState(false);
  const [isTaggingModalOpen, setIsTaggingModalOpen] = useState(false);
  const [isStorefrontPreviewOpen, setIsStorefrontPreviewOpen] = useState(false);
  const [showTaggingPrompt, setShowTaggingPrompt] = useState(false);
  const [isEditingTags, setIsEditingTags] = useState(false);
  const [draggingMarkerId, setDraggingMarkerId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<ProductDetails[]>([]);
  const [analyzingSuggestions, setAnalyzingSuggestions] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState<Record<string, boolean>>({});
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('settings') === 'true') {
      setIsProfileModalOpen(true);
    }
  }, [searchParams]);

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
    const returnTo = searchParams.get('returnTo');
    if (returnTo) {
      navigate(returnTo);
    } else {
      setSearchParams({});
    }
  };

  const [tasks, setTasks] = useState<any[]>([]);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshingAnalytics, setIsRefreshingAnalytics] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const refreshAnalytics = async () => {
    if (!profile?.uid) return;
    setIsRefreshingAnalytics(true);
    try {
      const res = await api.interactions.list({ creatorId: profile.uid });
      setInteractions(res.interactions || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsRefreshingAnalytics(false);
    }
  };

  const handleGenerateDescription = async (markerId: string) => {
    const marker = markers.find(m => m.id === markerId);
    const title = marker?.details?.title;

    if (!title) {
      alert("Please enter a product title first.");
      return;
    }

    setIsGeneratingAI(prev => ({ ...prev, [markerId]: true }));

    try {
      const { description } = await api.ai.generateDescription(title);
      setMarkers(prev => prev.map(m =>
        m.id === markerId && m.details
          ? { ...m, details: { ...m.details, description: (description || "").trim() } }
          : m
      ));
    } catch (error) {
      console.error("Error generating description:", error);
      alert("Failed to generate description. Please try again.");
    } finally {
      setIsGeneratingAI(prev => ({ ...prev, [markerId]: false }));
    }
  };

  useEffect(() => {
    if (user) {
      api.auth.me()
        .then(({ user: u }) => { if (u) setProfileData(u); })
        .catch(console.error);
    }
  }, [user]);

  useEffect(() => {
    if (!profile?.uid) return;
    Promise.all([
      api.tasks.list({ creatorId: profile.uid }),
      api.interactions.list({ creatorId: profile.uid }),
    ])
      .then(([tasksRes, interactionsRes]) => {
        setTasks(tasksRes.tasks || []);
        setInteractions(interactionsRes.interactions || []);
        setLastUpdated(new Date());
      })
      .catch(console.error);
  }, [profile]);

  const handleStatusUpdate = async (taskId: string, newStatus: string) => {
    try {
      await api.tasks.update(taskId, { status: newStatus });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const [imageContainerEl, setImageContainerEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isTaggingModalOpen && imageContainerEl) {
      const observer = new ResizeObserver((entries) => {
        if (entries[0]) {
          setImageSize({
            width: entries[0].contentRect.width,
            height: entries[0].contentRect.height
          });
        }
      });
      observer.observe(imageContainerEl);
      return () => observer.disconnect();
    }
  }, [isTaggingModalOpen, imageContainerEl]);

  const loadSpaces = () => {
    if (!user) return;
    api.spaces.list({ userId: user.uid })
      .then(res => {
        const fetchedSpaces: SpaceData[] = (res.spaces || []) as SpaceData[];
        fetchedSpaces.sort((a, b) => {
          if (a.isStarred && !b.isStarred) return -1;
          if (!a.isStarred && b.isStarred) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setSpaces(fetchedSpaces);
      })
      .catch(console.error)
      .finally(() => setSpacesLoading(false));
  };

  useEffect(() => {
    loadSpaces();
  }, [user]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    setUploading(true);
    try {
      setImageFile(file);
      setIsAcknowledged(false);
      const compressedBase64 = await compressImage(file);
      setImageUrl(compressedBase64);
      if (spaceType === 'digital' || spaceType === 'singular') {
        const newMarkerId = Date.now().toString();
        setMarkers([{
          id: newMarkerId,
          x: 50,
          y: 50,
          loading: false,
          details: {
            title: "",
            price: "",
            currency: "$",
            description: "",
            buyLink: "",
            boundingBox: { x: 45, y: 45, width: 10, height: 10 }
          }
        }]);
        setSelectedMarkerId(newMarkerId);
        setIsTaggingModalOpen(true);
      } else {
        setShowTaggingPrompt(true);
        analyzeImageForSuggestions(file);
      }
    } catch (error) {
      console.error("Error processing image:", error);
      alert("Failed to process image.");
    } finally {
      setUploading(false);
    }
  };

  const toBase64 = (fileOrUrl: string | File): Promise<string> => {
    if (typeof fileOrUrl === 'string') {
      return fetch(fileOrUrl).then(r => r.blob()).then(blob => new Promise((res, rej) => {
        const reader = new FileReader(); reader.readAsDataURL(blob);
        reader.onload = () => res(reader.result as string); reader.onerror = rej;
      }));
    }
    return new Promise((res, rej) => {
      const reader = new FileReader(); reader.readAsDataURL(fileOrUrl);
      reader.onload = () => res(reader.result as string); reader.onerror = rej;
    });
  };

  const analyzeImageForSuggestions = async (fileOrUrl: string | File) => {
    setAnalyzingSuggestions(true);
    try {
      const imageBase64 = await toBase64(fileOrUrl);
      const result = await api.ai.analyzeImage({ imageBase64 });
      const products: ProductDetails[] = (result.products || []).map((p: any) => ({
        ...p,
        boundingBoxes: p.boundingBoxes || []
      }));
      setSuggestions(products);
    } catch (error) {
      console.error("Error getting suggestions:", error);
    } finally {
      setAnalyzingSuggestions(false);
    }
  };

  const addSuggestion = (suggestion: ProductDetails) => {
    const newMarker: MarkerData = {
      id: Math.random().toString(36).substring(7),
      x: suggestion.boundingBoxes && suggestion.boundingBoxes.length > 0 ? suggestion.boundingBoxes[0].x + suggestion.boundingBoxes[0].width / 2 : 50,
      y: suggestion.boundingBoxes && suggestion.boundingBoxes.length > 0 ? suggestion.boundingBoxes[0].y + suggestion.boundingBoxes[0].height / 2 : 50,
      loading: false,
      details: { ...suggestion, buyLink: "" }
    };
    setMarkers(prev => [...prev, newMarker]);
    setSelectedMarkerId(newMarker.id);
  };

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (draggingMarkerId && imageContainerRef.current) {
        const rect = imageContainerRef.current.getBoundingClientRect();
        let x = ((e.clientX - rect.left) / rect.width) * 100;
        let y = ((e.clientY - rect.top) / rect.height) * 100;
        x = Math.max(0, Math.min(100, x));
        y = Math.max(0, Math.min(100, y));
        
        setMarkers(prev => prev.map(m => m.id === draggingMarkerId ? { ...m, x, y } : m));
      }
    };

    const handleGlobalMouseUp = () => {
      setDraggingMarkerId(null);
    };

    if (draggingMarkerId) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [draggingMarkerId]);

  const handleImageClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageUrl || !imageContainerRef.current || isEditingTags) return;
    if (spaceType === 'singular' && markers.length >= 1) {
      alert("Singular Item Space only allows one primary tag.");
      return;
    }
    
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newMarker: MarkerData = {
      id: Math.random().toString(36).substring(7),
      x,
      y,
      loading: true,
      details: null
    };

    setMarkers(prev => [...prev, newMarker]);
    setSelectedMarkerId(newMarker.id);
    await processObject(imageUrl, x, y, newMarker.id);
  };

  const processObject = async (url: string, x: number, y: number, markerId: string) => {
    try {
      const imageBase64 = await toBase64(imageFile || url);
      const result = await api.ai.analyzeImage({ imageBase64, x, y });
      const parsed = result.product as any;
      if (parsed) {
        const formatted: ProductDetails = {
          ...parsed,
          buyLink: "",
          category: parsed.category || "",
          brand: parsed.brand || "",
          boundingBoxes: parsed.boundingBoxes || []
        };
        setMarkers(prev => prev.map(m => m.id === markerId ? { ...m, loading: false, details: formatted } : m));
      }
    } catch (error) {
      console.error("Error processing object:", error);
      setMarkers(prev => prev.filter(m => m.id !== markerId));
      alert("Failed to identify object. Ensure the image URL is publicly accessible.");
    }
  };

  const saveSpace = async () => {
    if (!user || !title || !imageUrl) return;
    if (!username && (!editingSpaceId || !editingSpaceId.startsWith('demo-'))) {
      alert("Please set up your profile and username first.");
      return;
    }
    
    setSaving(true);
    try {
      const spaceData = {
        userId: user.uid,
        username: username || '',
        title,
        description,
        imageUrl,
        isPublic,
        spaceType,
        markers: markers.filter(m => !m.loading && m.details), // Only save completed markers
        updatedAt: new Date().toISOString()
      };

      if (editingSpaceId && editingSpaceId.startsWith('demo-')) {
        const savedDemos = JSON.parse(localStorage.getItem('demo_spaces') || '{}');
        const demoSpace = (savedDemos[editingSpaceId] || DEMO_SPACES[editingSpaceId])[0];
        savedDemos[editingSpaceId] = [{
          ...demoSpace,
          title,
          description,
          imageUrl,
          markers: spaceData.markers,
          updatedAt: spaceData.updatedAt
        }];
        localStorage.setItem('demo_spaces', JSON.stringify(savedDemos));
      } else if (editingSpaceId) {
        await api.spaces.update(editingSpaceId, spaceData);
      } else {
        await api.spaces.create({
          ...spaceData,
          order: spaces.length,
          createdAt: new Date().toISOString(),
        });
      }
      loadSpaces();
      
      setIsCreating(false);
      setEditingSpaceId(null);
      setTitle("");
      setDescription("");
      setImageUrl("");
      setImageFile(null);
      setMarkers([]);
      setIsPublic(true);
    } catch (error) {
      console.error("Error saving space:", error);
      alert("Failed to save space. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteSpace = async () => {
    if (!spaceToDelete) return;
    try {
      await api.spaces.remove(spaceToDelete);
      setSpaces(prev => prev.filter(s => s.id !== spaceToDelete));
      setSpaceToDelete(null);
    } catch (error) {
      console.error("Error deleting space:", error);
    }
  };

  const toggleSpaceVisibility = async (id: string, currentIsPublic: boolean | undefined) => {
    try {
      const newVal = currentIsPublic === false ? true : false;
      await api.spaces.update(id, { isPublic: newVal });
      setSpaces(prev => prev.map(s => s.id === id ? { ...s, isPublic: newVal } : s));
    } catch (error) {
      console.error("Error updating space visibility:", error);
    }
  };

  const toggleSpaceStar = async (id: string, currentIsStarred: boolean | undefined) => {
    try {
      const newVal = !currentIsStarred;
      await api.spaces.update(id, { isStarred: newVal });
      setSpaces(prev => prev.map(s => s.id === id ? { ...s, isStarred: newVal } : s));
    } catch (error) {
      console.error("Error updating space star:", error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-alabaster">
        <Loader2 className="w-8 h-8 animate-spin text-terracotta" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-alabaster">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-8">
        
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-serif font-medium text-charcoal mb-2">Creator Dashboard</h1>
              <p className="text-charcoal/60">Manage your interactive spaces, tasks, and analytics.</p>
            </div>
            {username && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-black/5 shadow-sm">
                  <span className="text-sm text-charcoal/60 pl-1">Your Link:</span>
                  <a href={`/${username}`} target="_blank" rel="noreferrer" className="text-sm font-medium text-terracotta hover:underline flex items-center gap-1 px-2">
                    atelier.com/{username}
                  </a>
                  <div className="w-px h-4 bg-black/10 mx-1"></div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(`https://atelier.com/${username}`);
                      setIsLinkCopied(true);
                      setTimeout(() => setIsLinkCopied(false), 2000);
                    }} 
                    className="p-1.5 text-charcoal/60 hover:text-charcoal hover:bg-alabaster rounded-md transition-colors" 
                    title="Copy Link"
                  >
                    {isLinkCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <div className="relative">
                    <button 
                      onClick={() => setShowShareMenu(!showShareMenu)} 
                      className="p-1.5 text-charcoal/60 hover:text-charcoal hover:bg-alabaster rounded-md transition-colors" 
                      title="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <AnimatePresence>
                      {showShareMenu && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-black/5 py-2 z-50"
                        >
                          <button 
                            onClick={() => {
                              window.open(`https://twitter.com/intent/tweet?url=https://atelier.com/${username}&text=Check out my storefront!`);
                              setShowShareMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-charcoal hover:bg-alabaster flex items-center gap-2"
                          >
                            <Twitter className="w-4 h-4" /> X (Twitter)
                          </button>
                          <button 
                            onClick={() => {
                              window.open(`https://www.facebook.com/sharer/sharer.php?u=https://atelier.com/${username}`);
                              setShowShareMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-charcoal hover:bg-alabaster flex items-center gap-2"
                          >
                            <Facebook className="w-4 h-4" /> Facebook
                          </button>
                          <button 
                            onClick={() => {
                              // Instagram doesn't have a direct share URL, usually you copy the link or use a specific app intent
                              navigator.clipboard.writeText(`https://atelier.com/${username}`);
                              setIsLinkCopied(true);
                              setTimeout(() => setIsLinkCopied(false), 2000);
                              setShowShareMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-charcoal hover:bg-alabaster flex items-center gap-2"
                          >
                            <Instagram className="w-4 h-4" /> Instagram (Copy Link)
                          </button>
                          <button 
                            onClick={() => {
                              // TikTok doesn't have a direct web share URL either
                              navigator.clipboard.writeText(`https://atelier.com/${username}`);
                              setIsLinkCopied(true);
                              setTimeout(() => setIsLinkCopied(false), 2000);
                              setShowShareMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-charcoal hover:bg-alabaster flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.23-1.13 4.45-2.91 5.8-1.78 1.34-4.14 1.81-6.32 1.34-2.18-.47-4.12-1.85-5.26-3.75-1.14-1.9-1.35-4.32-.55-6.37.8-2.05 2.5-3.66 4.54-4.35 2.04-.69 4.34-.46 6.19.63l.01-4.27c-2.82-1.04-6.07-.65-8.58 1.05-2.51 1.7-4.08 4.67-4.15 7.74-.07 3.07 1.35 6.1 3.75 7.91 2.4 1.81 5.6 2.33 8.44 1.37 2.84-.96 5.12-3.15 6.01-6.04.89-2.89.46-6.14-1.14-8.68-.01-4.48.01-8.96-.02-13.44z"/>
                            </svg>
                            TikTok (Copy Link)
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <button onClick={() => setShowQrModal(true)} className="p-1.5 text-charcoal/60 hover:text-charcoal hover:bg-alabaster rounded-md transition-colors" title="Generate QR">
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>
                <Link
                  to="/creator-dashboard/storefront"
                  className="flex items-center gap-2 px-4 py-2 bg-charcoal text-white rounded-xl shadow-sm hover:bg-charcoal/90 transition-colors text-sm font-medium"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Customize Storefront
                </Link>
                <button
                  onClick={() => setIsProfileModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-charcoal rounded-xl border border-black/5 shadow-sm hover:bg-alabaster transition-colors text-sm font-medium"
                >
                  <Settings className="w-4 h-4" />
                  Profile Settings
                </button>
              </div>
            )}
          </div>
        </div>

        <ProfileSettingsModal 
          isOpen={isProfileModalOpen} 
          onClose={handleCloseProfileModal} 
          profileData={profileData} 
          user={user} 
        />

        <AnimatePresence>
          {showQrModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm"
                onClick={() => setShowQrModal(false)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
              >
                <button onClick={() => setShowQrModal(false)} className="absolute top-4 right-4 p-2 text-charcoal/40 hover:text-charcoal hover:bg-alabaster rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-xl font-serif font-medium text-charcoal mb-2">Your QR Code</h3>
                <p className="text-sm text-charcoal/60 mb-6">Scan this code to visit your storefront</p>
                <div className="bg-alabaster p-4 rounded-2xl inline-block mb-6">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`https://atelier.com/${username}`)}`} alt="QR Code" className="w-48 h-48" />
                </div>
                <button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(`https://atelier.com/${username}`)}`;
                    link.download = `atelier-${username}-qr.png`;
                    link.click();
                  }}
                  className="w-full py-3 bg-charcoal text-white rounded-xl font-medium hover:bg-charcoal/90 transition-colors"
                >
                  Download QR Code
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side: Storefront Preview */}
          <div className="w-full lg:w-[360px] xl:w-[400px] shrink-0 order-2 lg:order-1">
            <StorefrontLivePreview profileData={profileData} spaces={spaces} />
          </div>
          
          {/* Right Side: Dashboard Content */}
          <div className="flex-1 order-1 lg:order-2 min-w-0">
            {!isCreating && (
              <div className="mb-12">
                {/* Analytics */}
            <div className="bg-white p-8 rounded-2xl border border-black/5 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-serif font-medium text-charcoal flex items-center gap-2">
                    <BarChart2 className="w-6 h-6 text-terracotta" /> Analytics
                  </h2>
                  <span className="text-xs text-charcoal/50 bg-alabaster px-2 py-1 rounded-md">
                    Updated {
                      (() => {
                        const diff = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 60000);
                        if (diff === 0) return 'just now';
                        if (diff < 60) return `${diff}m ago`;
                        const hours = Math.floor(diff / 60);
                        if (hours < 24) return `${hours}h ago`;
                        return `${Math.floor(hours / 24)}d ago`;
                      })()
                    }
                  </span>
                </div>
                <button 
                  onClick={refreshAnalytics}
                  disabled={isRefreshingAnalytics}
                  className="px-4 py-2 bg-alabaster text-charcoal rounded-full text-sm font-medium hover:bg-black/5 transition-colors flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshingAnalytics ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-alabaster/50 rounded-xl border border-black/5 hover:border-terracotta/30 transition-colors">
                  <h3 className="text-sm font-medium text-charcoal/70 mb-1">Profile Views</h3>
                  <p className="text-2xl font-serif">{interactions.filter(i => i.type === 'profile_view').length}</p>
                </div>
                <div className="p-4 bg-alabaster/50 rounded-xl border border-black/5 hover:border-terracotta/30 transition-colors">
                  <h3 className="text-sm font-medium text-charcoal/70 mb-1">Spaces Opened</h3>
                  <p className="text-2xl font-serif">{spaces.reduce((sum, space) => sum + (space.views || 0), 0)}</p>
                </div>
                <div className="p-4 bg-alabaster/50 rounded-xl border border-black/5 hover:border-terracotta/30 transition-colors">
                  <h3 className="text-sm font-medium text-charcoal/70 mb-1">External Links Clicked</h3>
                  <p className="text-2xl font-serif">{interactions.filter(i => i.type === 'external_link_click').length}</p>
                </div>
                <div className="p-4 bg-alabaster/50 rounded-xl border border-black/5 hover:border-terracotta/30 transition-colors">
                  <h3 className="text-sm font-medium text-charcoal/70 mb-1">Social Links Clicked</h3>
                  <p className="text-2xl font-serif">{interactions.filter(i => i.type === 'social_link_click').length}</p>
                </div>
                <div className="p-4 bg-alabaster/50 rounded-xl border border-black/5 hover:border-terracotta/30 transition-colors">
                  <h3 className="text-sm font-medium text-charcoal/70 mb-1">Buy Now Clicks</h3>
                  <p className="text-2xl font-serif">{spaces.reduce((sum, space) => sum + (space.clicks || 0), 0)}</p>
                </div>
              </div>

              {/* Buying Intent Scale */}
              <div className="p-6 bg-terracotta/5 rounded-xl border border-terracotta/10">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-charcoal flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-terracotta" /> Buying Intent Scale
                  </h3>
                  <span className="text-sm font-bold text-terracotta">
                    {spaces.reduce((sum, space) => sum + (space.clicks || 0), 0)} Buy Clicks
                  </span>
                </div>
                
                {(() => {
                  const totalViews = spaces.reduce((sum, space) => sum + (space.views || 0), 0);
                  const totalBuyClicks = spaces.reduce((sum, space) => sum + (space.clicks || 0), 0);
                  const intentScore = totalViews > 0 ? (totalBuyClicks / totalViews) * 100 : 0;
                  
                  let intentLabel = "Low purchase intent";
                  let intentColor = "bg-charcoal/20";
                  let intentWidth = "w-1/3";
                  
                  if (intentScore > 10 || totalBuyClicks > 10) {
                    intentLabel = "High purchase intent 🔥";
                    intentColor = "bg-green-500";
                    intentWidth = "w-full";
                  } else if (intentScore > 5 || totalBuyClicks > 0) {
                    intentLabel = "Medium purchase intent";
                    intentColor = "bg-yellow-500";
                    intentWidth = "w-2/3";
                  }

                  return (
                    <div>
                      <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden mb-2">
                        <div className={`h-full ${intentColor} transition-all duration-1000`} style={{ width: intentScore > 0 ? `${Math.min(100, intentScore * 5)}%` : intentWidth }} />
                      </div>
                      <p className="text-xs text-charcoal/60">→ {intentLabel}</p>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Performance & Growth Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Performance Section */}
              <div className="bg-white p-6 rounded-2xl border border-black/5">
                <h3 className="text-lg font-serif font-medium text-charcoal mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-terracotta" /> Performance
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-alabaster rounded-xl">
                    <span className="text-sm text-charcoal/70">Top Space</span>
                    <span className="text-sm font-medium text-charcoal truncate max-w-[150px]">
                      {spaces.length > 0 ? [...spaces].sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0].title : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-alabaster rounded-xl">
                    <span className="text-sm text-charcoal/70">Recent Activity</span>
                    <span className="text-sm font-medium text-green-600">
                      {(() => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const viewsToday = interactions.filter(i => (i.type === 'profile_view' || i.type === 'space_view') && new Date(i.timestamp) >= today).length;
                        return `+${viewsToday} views today`;
                      })()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-terracotta/5 rounded-xl border border-terracotta/10">
                    <span className="text-sm text-charcoal/70">Weekly Growth</span>
                    <span className="text-sm font-medium text-terracotta">
                      {(() => {
                        const oneWeekAgo = new Date();
                        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                        const twoWeeksAgo = new Date();
                        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
                        
                        const viewsThisWeek = interactions.filter(i => (i.type === 'profile_view' || i.type === 'space_view') && new Date(i.timestamp) >= oneWeekAgo).length;
                        const viewsLastWeek = interactions.filter(i => (i.type === 'profile_view' || i.type === 'space_view') && new Date(i.timestamp) >= twoWeeksAgo && new Date(i.timestamp) < oneWeekAgo).length;
                        
                        if (viewsLastWeek === 0) return viewsThisWeek > 0 ? `+100% this week` : `0% this week`;
                        const growth = Math.round(((viewsThisWeek - viewsLastWeek) / viewsLastWeek) * 100);
                        return `${growth > 0 ? '+' : ''}${growth}% this week`;
                      })()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Growth Insights Section */}
              <div className="bg-white p-6 rounded-2xl border border-black/5">
                <h3 className="text-lg font-serif font-medium text-charcoal mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-terracotta" /> Growth Insights
                </h3>
                <div className="space-y-3">
                  {spaces.length === 0 ? (
                    <div className="p-3 bg-blue-50 text-blue-800 rounded-xl text-sm flex items-start gap-2">
                      <Info className="w-4 h-4 mt-0.5 shrink-0" />
                      <p>Create your first space to start earning.</p>
                    </div>
                  ) : spaces.reduce((sum, space) => sum + (space.clicks || 0), 0) === 0 ? (
                    <div className="p-3 bg-yellow-50 text-yellow-800 rounded-xl text-sm flex items-start gap-2">
                      <Info className="w-4 h-4 mt-0.5 shrink-0" />
                      <p>Add product links to your spaces to monetize your content.</p>
                    </div>
                  ) : (
                    <div className="p-3 bg-green-50 text-green-800 rounded-xl text-sm flex items-start gap-2">
                      <Flame className="w-4 h-4 mt-0.5 shrink-0" />
                      <p>Your "{[...spaces].sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0].title}" space is trending 🔥</p>
                    </div>
                  )}
                  
                  {spaces.length > 0 && spaces.length < 4 && (
                    <div className="p-3 bg-alabaster rounded-xl text-sm text-charcoal/70 flex items-start gap-2">
                      <PlusCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      <p>Add {4 - spaces.length} more spaces to increase engagement.</p>
                    </div>
                  )}

                  {(!profileData?.socialLinks || profileData.socialLinks.length === 0) && (
                    <div className="p-3 bg-alabaster rounded-xl text-sm text-charcoal/70 flex items-start gap-2">
                      <Instagram className="w-4 h-4 mt-0.5 shrink-0" />
                      <p>Connect Instagram to boost traffic to your storefront.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Task Management */}
            {/* Brand Connections */}
          </div>
        )}

        {!isCreating ? (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif font-medium text-charcoal">Your Spaces</h2>
              <div className="flex flex-col items-end">
                <button 
                  onClick={() => {
                    setEditingSpaceId(null);
                    setTitle("");
                    setDescription("");
                    setImageUrl("");
                    setImageFile(null);
                    setMarkers([]);
                    setIsPublic(true);
                    setSpaceType("gallery");
                    setIsAcknowledged(false);
                    setIsCreating(true);
                  }}
                  className="relative group flex items-center gap-2 px-6 py-3 bg-charcoal text-white rounded-full text-base font-medium hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <div className="absolute inset-0 rounded-full border border-white/20 group-hover:border-terracotta/50 transition-colors"></div>
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-terracotta to-orange-400 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
                  <Plus className="w-5 h-5 relative z-10" /> 
                  <span className="relative z-10">Create Space</span>
                </button>
                <span className="text-xs text-charcoal/50 mt-2 mr-2">Create your first space to start earning</span>
              </div>
            </div>

            {spacesLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-terracotta" />
              </div>
            ) : spaces.length === 0 ? (
              <div className="bg-white rounded-2xl border border-black/5 p-12 text-center">
                <div className="w-16 h-16 bg-alabaster rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-terracotta" />
                </div>
                <h3 className="text-lg font-medium text-charcoal mb-2">No spaces yet</h3>
                <p className="text-charcoal/60 mb-6 max-w-md mx-auto">Create your first interactive space by uploading an image and tagging your products.</p>
                <button 
                  onClick={() => {
                    setEditingSpaceId(null);
                    setTitle("");
                    setDescription("");
                    setImageUrl("");
                    setImageFile(null);
                    setMarkers([]);
                    setIsPublic(true);
                    setSpaceType("gallery");
                    setIsAcknowledged(false);
                    setIsCreating(true);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-terracotta text-white rounded-full text-sm font-medium hover:bg-terracotta-dark transition-colors"
                >
                  Create Your First Space
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {spaces.map((space, idx) => (
                  <div key={space.id} className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm group">
                    <div className="aspect-video relative overflow-hidden bg-alabaster">
                      <img src={space.imageUrl} alt={space.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {space.isStarred && (
                        <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md text-yellow-400 text-xs font-medium rounded-full flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </div>
                      )}
                      {space.isPublic === false && (
                        <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-medium rounded-full flex items-center gap-1.5">
                          <EyeOff className="w-3.5 h-3.5" />
                          Private
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <Link to={`/${username}#space-${space.id}`} target="_blank" className="px-4 py-2 bg-white text-charcoal rounded-full text-sm font-medium shadow-lg hover:bg-alabaster transition-colors">
                          View
                        </Link>
                        <button 
                          onClick={(e) => { e.preventDefault(); toggleSpaceStar(space.id, space.isStarred); }} 
                          className="p-2 bg-white text-charcoal rounded-full shadow-lg hover:bg-alabaster transition-colors"
                          title={space.isStarred ? "Unstar" : "Star"}
                        >
                          <Star className={`w-5 h-5 ${space.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                        </button>
                        <button 
                          onClick={(e) => { e.preventDefault(); toggleSpaceVisibility(space.id, space.isPublic); }} 
                          className="p-2 bg-white text-charcoal rounded-full shadow-lg hover:bg-alabaster transition-colors"
                          title={space.isPublic !== false ? "Make Private" : "Make Public"}
                        >
                          {space.isPublic !== false ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                        </button>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            setEditingSpaceId(space.id);
                            setTitle(space.title);
                            setDescription(space.description);
                            setImageUrl(space.imageUrl);
                            setMarkers(space.markers);
                            setIsPublic(space.isPublic !== false);
                            setSpaceType(space.spaceType || "gallery");
                            setIsAcknowledged(true); // Pre-acknowledge for existing spaces
                            setIsCreating(true);
                          }} 
                          className="p-2 bg-white text-charcoal rounded-full shadow-lg hover:bg-alabaster transition-colors"
                          title="Edit Space"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={(e) => { e.preventDefault(); setSpaceToDelete(space.id); }} className="p-2 bg-white text-red-500 rounded-full shadow-lg hover:bg-red-50 transition-colors" title="Delete Space">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-charcoal flex items-center gap-2">
                          {space.title}
                        </h3>
                      </div>
                      <p className="text-sm text-charcoal/60 line-clamp-2 mb-4">{space.description}</p>
                      
                      {space.markers && space.markers.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-xs font-medium text-charcoal/50 uppercase tracking-wider mb-2">Tagged Items</h4>
                          <div className="flex flex-wrap gap-2">
                            {space.markers.slice(0, 3).map(marker => marker.details && (
                              <span key={marker.id} className="inline-flex items-center gap-1 px-2 py-1 bg-alabaster border border-black/5 rounded-md text-xs text-charcoal/80">
                                <ShoppingBag className="w-3 h-3" />
                                <span className="truncate max-w-[100px]">{marker.details.title}</span>
                              </span>
                            ))}
                            {space.markers.length > 3 && (
                              <span className="inline-flex items-center px-2 py-1 bg-alabaster border border-black/5 rounded-md text-xs text-charcoal/60">
                                +{space.markers.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-charcoal/50 pt-4 border-t border-black/5">
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-center" title="Views">
                            <span className="font-medium text-charcoal">{space.views || 0}</span>
                            <span className="text-[10px] uppercase tracking-wider">Views</span>
                          </div>
                          <div className="flex flex-col items-center" title="Clicks">
                            <span className="font-medium text-charcoal">{space.clicks || 0}</span>
                            <span className="text-[10px] uppercase tracking-wider">Clicks</span>
                          </div>
                          <div className="flex flex-col items-center" title="Buy Now Clicks">
                            <span className="font-medium text-terracotta">{space.clicks || 0}</span>
                            <span className="text-[10px] uppercase tracking-wider text-terracotta/70">Buy Clicks</span>
                          </div>
                        </div>
                        <span className="self-end">{new Date(space.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Theme Previews Section */}
            <div className="mt-16 pt-12 border-t border-black/5">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-serif font-medium text-charcoal mb-2">Theme Previews</h2>
                <p className="text-charcoal/60 max-w-lg mx-auto">
                  Click these artificial profile links to see how the creator storefront looks with different themes applied.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { id: 'demo-luxury', name: 'Luxury Theme', desc: 'Minimalist & Editorial', icon: '✨' },
                  { id: 'demo-tech', name: 'Tech Savvy', desc: 'Dark Mode & Neon', icon: '💻' },
                  { id: 'demo-creative', name: 'Pottery Collection', desc: 'Earthy & Organic', icon: '🏺' },
                  { id: 'demo-fashion', name: 'Fashion', desc: 'Brutalist & Bold', icon: '🕶️' }
                ].map((demo) => (
                  <div 
                    key={demo.id}
                    className="p-6 bg-white border border-black/5 rounded-2xl hover:border-terracotta/30 hover:shadow-md transition-all group flex flex-col items-center text-center relative"
                  >
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">{demo.icon}</div>
                    <h3 className="font-medium text-charcoal mb-1">{demo.name}</h3>
                    <p className="text-xs text-charcoal/50 mb-4">{demo.desc}</p>
                    <div className="flex gap-2 w-full mt-auto">
                      <Link 
                        to={`/${demo.id}`}
                        target="_blank"
                        className="flex-1 py-2 bg-alabaster hover:bg-black/5 text-charcoal text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        View <LinkIcon className="w-3 h-3" />
                      </Link>
                      <button 
                        onClick={() => {
                          const savedDemos = JSON.parse(localStorage.getItem('demo_spaces') || '{}');
                          const demoSpace = (savedDemos[demo.id] || DEMO_SPACES[demo.id])[0];
                          if (demoSpace) {
                            setEditingSpaceId(demo.id);
                            setTitle(demoSpace.title);
                            setDescription(demoSpace.description);
                            setImageUrl(demoSpace.imageUrl);
                            setMarkers(demoSpace.markers);
                            setIsPublic(true);
                            setSpaceType(demoSpace.spaceType || "gallery");
                            setIsAcknowledged(true); // Pre-acknowledge for demo spaces
                            setIsCreating(true);
                          }
                        }}
                        className="flex-1 py-2 bg-terracotta/10 hover:bg-terracotta/20 text-terracotta text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        Edit Tags <Edit className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-black/5 p-6 md:p-10 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-serif font-medium text-charcoal">{editingSpaceId ? "Edit Space" : "Create New Space"}</h2>
              <button 
                onClick={() => setIsCreating(false)}
                className="p-2 text-charcoal/50 hover:text-charcoal hover:bg-alabaster rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-1 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Space Type</label>
                  <div className="space-y-2">
                    {[
                      { id: 'gallery', label: 'Taggable Gallery Space', desc: 'Tag multiple physical products in a scene.' },
                      { id: 'digital', label: 'Digital Product Space', desc: 'Digital hotspots for software, PDFs, courses, etc.' },
                      { id: 'singular', label: 'Singular Item Space', desc: 'Minimalist space focused on one hero product.' }
                    ].map(type => (
                      <div 
                        key={type.id}
                        onClick={() => setSpaceType(type.id)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${spaceType === type.id ? 'border-terracotta bg-terracotta/5' : 'border-black/5 hover:border-black/20'}`}
                      >
                        <div className="font-medium text-sm text-charcoal">{type.label}</div>
                        <div className="text-xs text-charcoal/60 mt-1">{type.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Space Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    maxLength={200}
                    placeholder="e.g. My Summer Outfits"
                    className="w-full px-4 py-3 bg-alabaster border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Description</label>
                  <textarea 
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    maxLength={1000}
                    placeholder="Tell your audience about this collection..."
                    rows={3}
                    className="w-full px-4 py-3 bg-alabaster border border-black/5 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-all resize-none"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-alabaster border border-black/5 rounded-xl">
                  <div>
                    <h3 className="text-sm font-medium text-charcoal">Public Visibility</h3>
                    <p className="text-xs text-charcoal/60 mt-0.5">Allow others to see this space on your profile.</p>
                  </div>
                  <button
                    onClick={() => setIsPublic(!isPublic)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isPublic ? 'bg-terracotta' : 'bg-charcoal/20'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPublic ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>

                <div className="flex items-start gap-3 p-4 bg-alabaster border border-black/5 rounded-xl">
                  <input 
                    type="checkbox" 
                    id="tos-acknowledge"
                    checked={isAcknowledged}
                    onChange={e => setIsAcknowledged(e.target.checked)}
                    className="mt-1 w-4 h-4 text-terracotta border-black/10 rounded focus:ring-terracotta/20"
                  />
                  <label htmlFor="tos-acknowledge" className="text-xs text-charcoal/70 leading-relaxed cursor-pointer">
                    I acknowledge that I own the rights to this photo or have permission to use it, and it complies with the Terms of Service.
                  </label>
                </div>

                <div className="pt-6 border-t border-black/5 space-y-3">
                  <button 
                    onClick={() => setIsStorefrontPreviewOpen(true)}
                    disabled={!imageUrl}
                    className="w-full py-3 bg-alabaster text-charcoal border border-black/5 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-black/5 transition-colors disabled:opacity-50"
                  >
                    <Eye className="w-5 h-5" />
                    Preview Storefront
                  </button>
                  <button 
                    onClick={saveSpace}
                    disabled={saving || !title || !imageUrl || !isAcknowledged}
                    className="w-full py-3 bg-charcoal text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-charcoal/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {editingSpaceId ? "Save Changes" : "Save Space"}
                  </button>
                </div>
              </div>

              <div className="lg:col-span-2">
                {imageUrl ? (
                  <div className="relative flex flex-col items-center">
                    <AnimatePresence>
                      {showTaggingPrompt && (
                        <motion.div 
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="absolute -top-16 left-0 right-0 z-20 flex justify-center"
                        >
                          <div className="bg-white border border-black/5 shadow-xl rounded-2xl p-4 flex items-center gap-4 max-w-md">
                            <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center shrink-0">
                              <Sparkles className="w-5 h-5 text-terracotta" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-charcoal">Image uploaded!</p>
                              <p className="text-xs text-charcoal/60">Would you like to tag products now or save and tag later?</p>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setShowTaggingPrompt(false)}
                                className="px-3 py-1.5 text-xs font-medium text-charcoal/50 hover:text-charcoal transition-colors"
                              >
                                Tag Later
                              </button>
                              <button 
                                onClick={() => {
                                  setShowTaggingPrompt(false);
                                  setIsTaggingModalOpen(true);
                                }}
                                className="px-3 py-1.5 text-xs font-medium bg-terracotta text-white rounded-lg hover:bg-terracotta-dark transition-colors"
                              >
                                Tag Now
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="w-full flex justify-between items-center mb-4 px-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-charcoal/70 bg-alabaster px-4 py-2 rounded-full border border-black/5">
                        <Check className="w-4 h-4 text-emerald-500" />
                        Image uploaded ({markers.length} tags)
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setImageUrl("");
                            setImageFile(null);
                            setMarkers([]);
                          }}
                          className="flex items-center gap-2 text-sm font-medium text-charcoal/70 hover:text-charcoal bg-alabaster hover:bg-black/5 transition-colors px-4 py-2 rounded-full border border-black/5"
                        >
                          <Trash2 className="w-4 h-4" /> Change Image
                        </button>
                        <button 
                          onClick={() => setIsTaggingModalOpen(true)}
                          className="flex items-center gap-2 text-sm font-medium text-white bg-charcoal hover:bg-charcoal/90 transition-colors px-4 py-2 rounded-full"
                        >
                          <Sparkles className="w-4 h-4" /> Open Tagging Editor
                        </button>
                      </div>
                    </div>
                    
                    <div className="relative w-full rounded-2xl overflow-hidden shadow-sm border border-black/5 bg-alabaster">
                      <img 
                        src={imageUrl} 
                        alt="Preview" 
                        className="w-full h-auto max-h-[60vh] object-contain opacity-50"
                        draggable={false}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button 
                          onClick={() => setIsTaggingModalOpen(true)}
                          className="px-6 py-3 bg-white text-charcoal rounded-full font-medium shadow-lg hover:scale-105 transition-transform"
                        >
                          Edit Tags & Links
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full min-h-[400px] rounded-2xl border-2 border-dashed border-black/10 bg-alabaster flex flex-col items-center justify-center p-8 text-center">
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
                      {uploading ? <Loader2 className="w-6 h-6 text-terracotta animate-spin" /> : <Upload className="w-6 h-6 text-terracotta" />}
                    </div>
                    <h3 className="font-serif font-medium text-lg text-charcoal mb-2">Upload an Image</h3>
                    <p className="text-sm text-charcoal/50 font-sans max-w-[300px] mb-6">
                      Upload a photo from your device to start tagging your space.
                    </p>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="px-6 py-2.5 bg-charcoal text-white rounded-full text-sm font-medium hover:bg-charcoal/90 transition-colors disabled:opacity-50"
                    >
                      {uploading ? "Uploading..." : "Choose File"}
                    </button>
                    
                    <div className="mt-8 flex items-center gap-4 w-full max-w-xs">
                      <div className="h-px bg-black/10 flex-1"></div>
                      <span className="text-xs text-charcoal/40 font-medium uppercase tracking-wider">or</span>
                      <div className="h-px bg-black/10 flex-1"></div>
                    </div>
                    
                    <div className="mt-6 w-full max-w-xs text-left">
                      <label className="block text-xs font-medium text-charcoal/70 mb-2">Paste Image URL</label>
                      <div className="flex gap-2">
                        <input 
                          type="url" 
                          value={imageUrl}
                          onChange={e => setImageUrl(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="flex-1 px-3 py-2 text-sm bg-white border border-black/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-all"
                        />
                        <button 
                          onClick={() => {
                            if (imageUrl) {
                              if (spaceType === 'digital' || spaceType === 'singular') {
                                const newMarkerId = Date.now().toString();
                                setMarkers([{
                                  id: newMarkerId,
                                  x: 50,
                                  y: 50,
                                  loading: false,
                                  details: {
                                    title: "",
                                    price: "",
                                    currency: "$",
                                    description: "",
                                    buyLink: "",
                                    boundingBox: { x: 45, y: 45, width: 10, height: 10 }
                                  }
                                }]);
                                setSelectedMarkerId(newMarkerId);
                                setIsTaggingModalOpen(true);
                              } else {
                                setShowTaggingPrompt(true);
                                analyzeImageForSuggestions(imageUrl);
                              }
                            }
                          }}
                          className="px-3 py-2 bg-terracotta text-white rounded-lg text-sm font-medium hover:bg-terracotta-dark transition-colors"
                        >
                          Load
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Storefront Preview Modal */}
        <AnimatePresence>
          {isStorefrontPreviewOpen && (
            <StorefrontPreviewModal 
              isOpen={isStorefrontPreviewOpen}
              onClose={() => setIsStorefrontPreviewOpen(false)}
              profileData={profileData}
              currentSpace={{
                title,
                description,
                imageUrl,
                markers
              }}
            />
          )}
        </AnimatePresence>

        {/* Tagging Modal */}
        <AnimatePresence>
          {isTaggingModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm"
                onClick={() => setIsTaggingModalOpen(false)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
              >
                {/* Left: Image Area */}
                {spaceType !== 'digital' && spaceType !== 'singular' && (
                  <div className="flex-1 bg-alabaster relative overflow-hidden flex flex-col">
                    {!(spaceType === 'singular' && markers.length >= 1) && (
                      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-sm font-medium text-charcoal/70 bg-white/90 backdrop-blur px-4 py-2 rounded-full border border-black/5 shadow-sm">
                        <MousePointerClick className="w-4 h-4 text-terracotta" />
                        Click anywhere to tag an item
                      </div>
                    )}
                    
                    <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
                      <div 
                        ref={(el) => {
                          imageContainerRef.current = el;
                          setImageContainerEl(el);
                        }}
                        className={`relative rounded-xl shadow-sm border border-black/5 group ${isEditingTags ? 'cursor-default' : 'cursor-crosshair'}`}
                        onClick={handleImageClick}
                      >
                        <img 
                          src={imageUrl} 
                          alt="Tagging" 
                          className="max-w-full h-auto max-h-[75vh] object-contain rounded-xl"
                          draggable={false}
                          onLoad={(e) => {
                            setImageSize({
                              width: e.currentTarget.clientWidth,
                              height: e.currentTarget.clientHeight
                            });
                          }}
                        />
                        
                        {markers.map((marker) => (
                          <div key={marker.id}>
                            {marker.loading ? (
                              <div 
                                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                              >
                                <div className="w-6 h-6 rounded-full bg-white/80 backdrop-blur shadow-sm flex items-center justify-center border border-black/5">
                                  <Loader2 className="w-3 h-3 text-charcoal animate-spin" />
                                </div>
                              </div>
                            ) : marker.details ? (
                              <>
                                <div
                                  className={`absolute z-20 w-4 h-4 rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.2)] -translate-x-1/2 -translate-y-1/2 bg-white flex items-center justify-center ${isEditingTags ? 'cursor-move' : 'cursor-pointer'}`}
                                  style={{
                                    left: `${marker.x}%`,
                                    top: `${marker.y}%`,
                                  }}
                                  onMouseDown={(e) => {
                                    if (!isEditingTags) return;
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setDraggingMarkerId(marker.id);
                                    setSelectedMarkerId(marker.id);
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedMarkerId(marker.id);
                                  }}
                                >
                                  <div className="absolute w-full h-full rounded-full bg-white animate-ping opacity-75"></div>
                                </div>
                              </>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Right: Sidebar */}
                <div className={`w-full ${spaceType === 'digital' || spaceType === 'singular' ? 'flex-1' : 'md:w-96'} bg-white border-l border-black/5 flex flex-col max-h-[50vh] md:max-h-none overflow-y-auto`}>
                  <div className="p-6 border-b border-black/5 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-10">
                    <h3 className="font-serif font-medium text-lg text-charcoal">
                      {spaceType === 'digital' || spaceType === 'singular' ? 'Product Details' : 'Tag Editor'}
                    </h3>
                    <div className="flex items-center gap-2">
                      {spaceType !== 'digital' && spaceType !== 'singular' && (
                        <button
                          onClick={() => setIsEditingTags(!isEditingTags)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${isEditingTags ? 'bg-terracotta text-white' : 'bg-alabaster text-charcoal hover:bg-black/5'}`}
                        >
                          {isEditingTags ? 'Done Editing' : 'Edit Hovering Tags'}
                        </button>
                      )}
                      <button 
                        onClick={() => setIsTaggingModalOpen(false)}
                        className="p-2 text-charcoal/50 hover:text-charcoal hover:bg-alabaster rounded-full transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 flex-1">
                    {selectedMarkerId ? (
                      <div className="space-y-5">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-sm text-charcoal uppercase tracking-wider">
                            {spaceType === 'digital' || spaceType === 'singular' ? 'Details' : 'Edit Tag'}
                          </h4>
                          {spaceType !== 'digital' && spaceType !== 'singular' && (
                            <button 
                              onClick={() => {
                                setMarkers(prev => prev.filter(m => m.id !== selectedMarkerId));
                                setSelectedMarkerId(null);
                              }}
                              className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                              title="Delete Tag"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        
                        {markers.find(m => m.id === selectedMarkerId)?.loading ? (
                          <div className="py-12 flex flex-col items-center justify-center text-charcoal/50">
                            <Loader2 className="w-6 h-6 animate-spin mb-3 text-terracotta" />
                            <p className="text-sm">Analyzing item...</p>
                          </div>
                        ) : (
                          <>
                            <div>
                              <label className="block text-xs font-medium text-charcoal/70 mb-1.5">Product Title</label>
                              <input 
                                type="text" 
                                value={markers.find(m => m.id === selectedMarkerId)?.details?.title || ""}
                                onChange={e => {
                                  setMarkers(prev => prev.map(m => m.id === selectedMarkerId && m.details ? { ...m, details: { ...m.details, title: e.target.value } } : m));
                                }}
                                className="w-full px-3 py-2 bg-alabaster border border-black/5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-charcoal/70 mb-1.5">Price</label>
                              <div className="flex gap-2">
                                <select
                                  value={markers.find(m => m.id === selectedMarkerId)?.details?.currency || "$"}
                                  onChange={e => {
                                    setMarkers(prev => prev.map(m => m.id === selectedMarkerId && m.details ? { ...m, details: { ...m.details, currency: e.target.value } } : m));
                                  }}
                                  className="px-3 py-2 bg-alabaster border border-black/5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta cursor-pointer"
                                >
                                  <option value="$">$</option>
                                  <option value="€">€</option>
                                  <option value="£">£</option>
                                  <option value="¥">¥</option>
                                </select>
                                <input 
                                  type="text" 
                                  value={markers.find(m => m.id === selectedMarkerId)?.details?.price || ""}
                                  onChange={e => {
                                    setMarkers(prev => prev.map(m => m.id === selectedMarkerId && m.details ? { ...m, details: { ...m.details, price: e.target.value } } : m));
                                  }}
                                  className="w-full px-3 py-2 bg-alabaster border border-black/5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta"
                                />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-xs font-medium text-charcoal/70">Description</label>
                                <button
                                  onClick={() => handleGenerateDescription(selectedMarkerId)}
                                  disabled={isGeneratingAI[selectedMarkerId]}
                                  className="text-xs font-medium text-terracotta hover:text-terracotta-dark flex items-center gap-1 disabled:opacity-50 transition-colors"
                                >
                                  {isGeneratingAI[selectedMarkerId] ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                  Generate with AI
                                </button>
                              </div>
                              <textarea 
                                value={markers.find(m => m.id === selectedMarkerId)?.details?.description || ""}
                                onChange={e => {
                                  setMarkers(prev => prev.map(m => m.id === selectedMarkerId && m.details ? { ...m, details: { ...m.details, description: e.target.value } } : m));
                                }}
                                rows={3}
                                className="w-full px-3 py-2 bg-alabaster border border-black/5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta resize-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-charcoal/70 mb-1.5">
                                {spaceType === 'digital' ? 'Download / Access Link' : 'Buy Link (URL)'}
                              </label>
                              <div className="relative">
                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
                                <input 
                                  type="url" 
                                  placeholder="https://..."
                                  value={markers.find(m => m.id === selectedMarkerId)?.details?.buyLink || ""}
                                  onChange={e => {
                                    setMarkers(prev => prev.map(m => m.id === selectedMarkerId && m.details ? { ...m, details: { ...m.details, buyLink: e.target.value } } : m));
                                  }}
                                  className="w-full pl-9 pr-3 py-2 bg-alabaster border border-black/5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta"
                                />
                              </div>
                            </div>
                            
                            {spaceType === 'digital' && (
                              <>
                                <div>
                                  <label className="block text-xs font-medium text-charcoal/70 mb-1.5">File Size</label>
                                  <input 
                                    type="text" 
                                    placeholder="e.g. 15MB"
                                    value={markers.find(m => m.id === selectedMarkerId)?.details?.fileSize || ""}
                                    onChange={e => {
                                      setMarkers(prev => prev.map(m => m.id === selectedMarkerId && m.details ? { ...m, details: { ...m.details, fileSize: e.target.value } } : m));
                                    }}
                                    className="w-full px-3 py-2 bg-alabaster border border-black/5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-charcoal/70 mb-1.5">Format</label>
                                  <input 
                                    type="text" 
                                    placeholder="e.g. PDF, MP4, ZIP"
                                    value={markers.find(m => m.id === selectedMarkerId)?.details?.format || ""}
                                    onChange={e => {
                                      setMarkers(prev => prev.map(m => m.id === selectedMarkerId && m.details ? { ...m, details: { ...m.details, format: e.target.value } } : m));
                                    }}
                                    className="w-full px-3 py-2 bg-alabaster border border-black/5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-charcoal/70 mb-1.5">Access Duration</label>
                                  <input 
                                    type="text" 
                                    placeholder="e.g. Lifetime, 1 Year"
                                    value={markers.find(m => m.id === selectedMarkerId)?.details?.accessDuration || ""}
                                    onChange={e => {
                                      setMarkers(prev => prev.map(m => m.id === selectedMarkerId && m.details ? { ...m, details: { ...m.details, accessDuration: e.target.value } } : m));
                                    }}
                                    className="w-full px-3 py-2 bg-alabaster border border-black/5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta"
                                  />
                                </div>
                              </>
                            )}
                            
                            <div>
                              <label className="block text-xs font-medium text-charcoal/70 mb-1.5">Category</label>
                              <CategoryCombobox
                                value={markers.find(m => m.id === selectedMarkerId)?.details?.category || ""}
                                onChange={(value) => {
                                  setMarkers(prev => prev.map(m => m.id === selectedMarkerId && m.details ? { ...m, details: { ...m.details, category: value } } : m));
                                }}
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-medium text-charcoal/70 mb-1.5">Brand</label>
                              <input 
                                type="text" 
                                placeholder="e.g. Sony, Nike, IKEA"
                                value={markers.find(m => m.id === selectedMarkerId)?.details?.brand || ""}
                                onChange={e => {
                                  setMarkers(prev => prev.map(m => m.id === selectedMarkerId && m.details ? { ...m, details: { ...m.details, brand: e.target.value } } : m));
                                }}
                                className="w-full px-3 py-2 bg-alabaster border border-black/5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta"
                              />
                            </div>
                            
                            <div className="flex gap-2 mt-4">
                              <button 
                                onClick={() => setSelectedMarkerId(null)}
                                className="w-full py-2.5 bg-charcoal text-white rounded-lg text-sm font-medium hover:bg-charcoal/90 transition-colors"
                              >
                                Done Editing
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl border border-black/10 shadow-sm text-center">
                          <div className="w-12 h-12 bg-alabaster rounded-full flex items-center justify-center mx-auto mb-3">
                            <Tag className="w-5 h-5 text-terracotta" />
                          </div>
                          <h4 className="font-medium text-charcoal mb-2">Tag Products</h4>
                          <p className="text-sm text-charcoal/60">
                            Click anywhere on the image to add a product tag. You can then add details and links for your audience.
                          </p>
                        </div>
                        
                        {markers.length > 0 && (
                          <div>
                            <h4 className="font-medium text-sm text-charcoal uppercase tracking-wider mb-3">
                              Current Tags ({markers.length})
                            </h4>
                            <div className="space-y-2">
                              {markers.map(m => (
                                <div 
                                  key={m.id} 
                                  onClick={() => setSelectedMarkerId(m.id)}
                                  className="flex items-center justify-between p-2.5 bg-alabaster rounded-lg border border-black/5 cursor-pointer hover:border-terracotta/30 transition-colors"
                                >
                                  <div className="flex items-center gap-2 overflow-hidden">
                                    <div className="w-2 h-2 rounded-full bg-terracotta shrink-0" />
                                    <span className="text-xs font-medium text-charcoal truncate">
                                      {m.loading ? "Analyzing..." : m.details?.title || "Unknown Item"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    {m.details?.buyLink && <LinkIcon className="w-3 h-3 text-emerald-500" />}
                                    <span className="text-[10px] text-charcoal/40 uppercase font-medium">Edit</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 border-t border-black/5 bg-alabaster mt-auto sticky bottom-0 z-10">
                    <button 
                      onClick={() => setIsTaggingModalOpen(false)}
                      className="w-full py-3 bg-terracotta text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-terracotta-dark transition-colors"
                    >
                      <Check className="w-5 h-5" />
                      Done Tagging
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {spaceToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-black/5 p-6 max-w-sm w-full"
            >
              <h3 className="text-xl font-serif font-medium text-charcoal mb-2">Delete Space?</h3>
              <p className="text-charcoal/70 text-sm mb-6">
                Are you sure you want to delete this space? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setSpaceToDelete(null)}
                  className="flex-1 py-2.5 bg-alabaster text-charcoal rounded-xl font-medium hover:bg-black/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteSpace}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
