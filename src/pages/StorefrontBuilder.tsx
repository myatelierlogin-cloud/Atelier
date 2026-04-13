import React, { useState, useEffect } from "react";
import { motion, Reorder } from "motion/react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../lib/api";
import { Link } from "react-router-dom";
import { Loader2, GripVertical, Plus, Trash2, Link as LinkIcon, Edit, Image as ImageIcon, Save, Copy, Share, Check, Settings, Instagram, Twitter, Youtube, Facebook, Linkedin, Github, ShoppingBag, Sparkles } from "lucide-react";

interface ProfileData {
  uid: string;
  name?: string;
  displayName: string;
  bio: string;
  photoURL: string;
  avatarUrl?: string;
  theme: string;
  socialLinks: any[];
  externalLinks: any[];
  customSpaceOrder?: string[];
  [key: string]: any;
}

interface SpaceData {
  id: string;
  title: string;
  imageUrl: string;
  isPublic?: boolean;
  isStarred?: boolean;
}

export default function StorefrontBuilder() {
  const { user, profile } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [spaces, setSpaces] = useState<SpaceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form State
  const [theme, setTheme] = useState("luxury");
  const [externalLinks, setExternalLinks] = useState<any[]>([]);
  const [socialLinks, setSocialLinks] = useState<any[]>([]);
  const [customSpaceOrder, setCustomSpaceOrder] = useState<string[]>([]);
  const [orderedSpaces, setOrderedSpaces] = useState<SpaceData[]>([]);

  const username = profile?.name?.toLowerCase().replace(/\s+/g, '') || profile?.uid || '';
  const publicUrl = `${window.location.origin}/${username}`;

  useEffect(() => {
    if (!user) return;

    Promise.all([
      api.auth.me(),
      api.spaces.list({ userId: user.uid }),
    ])
      .then(([meRes, spacesRes]) => {
        const data = meRes.user as ProfileData;
        if (data) {
          setProfileData(data);
          setTheme(data.theme || "luxury");
          setExternalLinks(data.externalLinks || []);
          setSocialLinks(data.socialLinks || []);
          setCustomSpaceOrder(data.customSpaceOrder || []);
        }
        const fetchedSpaces: SpaceData[] = (spacesRes.spaces || [])
          .filter((s: any) => s.isPublic !== false)
          .map((s: any) => ({ id: s.id, title: s.title, imageUrl: s.imageUrl, isPublic: s.isPublic, isStarred: s.isStarred }));
        setSpaces(fetchedSpaces);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    // Sort spaces based on customSpaceOrder
    const sorted = [...spaces].sort((a, b) => {
      if (customSpaceOrder.length > 0) {
        const indexA = customSpaceOrder.indexOf(a.id);
        const indexB = customSpaceOrder.indexOf(b.id);
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
      }
      return 0;
    });
    setOrderedSpaces(sorted);
  }, [spaces, customSpaceOrder]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await api.profile.update({
        theme,
        externalLinks,
        socialLinks,
        customSpaceOrder: orderedSpaces.map(s => s.id),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-alabaster">
        <Loader2 className="w-8 h-8 animate-spin text-terracotta" />
      </div>
    );
  }

  const themeStyles: Record<string, any> = {
    luxury: { bg: "bg-[#f5f5f0]", text: "text-charcoal", font: "font-serif", card: "bg-white", accent: "bg-terracotta" },
    tech: { bg: "bg-[#0a0a0a]", text: "text-white", font: "font-mono", card: "bg-[#151515]", accent: "bg-[#00ff00]" },
    creative: { bg: "bg-[#fdfcf8]", text: "text-[#4a4a40]", font: "font-sans", card: "bg-white", accent: "bg-[#8c7851]" },
    fashion: { bg: "bg-[#ffffff]", text: "text-black", font: "font-sans", card: "bg-[#f0f0f0]", accent: "bg-black" }
  };

  const style = themeStyles[theme] || themeStyles.luxury;

  return (
    <div className="min-h-screen pt-24 pb-24 bg-alabaster">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-4 rounded-2xl border border-black/5 shadow-sm">
          <div>
            <h1 className="text-2xl font-serif font-medium text-charcoal">Link-in-bio & Storefront editor</h1>
            <p className="text-sm text-charcoal/60">Customize the way you are seen and arrange your spaces.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-alabaster px-4 py-2 rounded-xl border border-black/5">
              <span className="text-sm text-charcoal/60 truncate max-w-[200px]">{publicUrl}</span>
            </div>
            <button onClick={copyToClipboard} className="flex items-center gap-2 px-4 py-2 bg-white text-charcoal rounded-xl border border-black/5 shadow-sm hover:bg-alabaster transition-colors text-sm font-medium">
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />} 
              {copied ? "Copied!" : "Copy Link"}
            </button>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-charcoal text-white rounded-xl shadow-sm hover:bg-charcoal/90 transition-colors text-sm font-medium disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4 text-green-400" /> : <Save className="w-4 h-4" />} 
              {saved ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Editor */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Section A: Profile Info */}
            <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-serif font-medium text-charcoal">Profile Info</h2>
              </div>
              <p className="text-sm text-charcoal/60 mb-4">
                Manage your display name, bio, and profile picture in your main profile settings.
              </p>
              <Link 
                to="/creator-dashboard?settings=true&returnTo=/creator-dashboard/storefront"
                className="inline-flex items-center gap-2 px-4 py-2 bg-alabaster text-charcoal rounded-xl border border-black/5 shadow-sm hover:bg-black/5 transition-colors text-sm font-medium"
              >
                <Settings className="w-4 h-4" /> Main Profile Settings
              </Link>
            </div>

            {/* Section B: Social Links */}
            <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-serif font-medium text-charcoal">Social Media Links</h2>
                <button 
                  onClick={() => setSocialLinks([...socialLinks, { platform: 'Instagram', url: '', id: Math.random().toString(36).substring(7) }])}
                  className="text-sm font-medium text-terracotta hover:underline flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Link
                </button>
              </div>
              
              <Reorder.Group axis="y" values={socialLinks} onReorder={setSocialLinks} className="space-y-3">
                {socialLinks.map((link, index) => (
                  <Reorder.Item key={link.id || index} value={link} className="flex gap-3 items-center bg-alabaster p-3 rounded-xl border border-black/5 cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-5 h-5 text-charcoal/40 shrink-0" />
                    <div className="flex-1 flex gap-3">
                      <select 
                        value={link.platform}
                        onChange={(e) => {
                          const newLinks = socialLinks.map(l => l === link ? { ...l, platform: e.target.value } : l);
                          setSocialLinks(newLinks);
                        }}
                        className="w-1/3 px-3 py-2 bg-white border border-black/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-terracotta"
                      >
                        <option value="Instagram">Instagram</option>
                        <option value="TikTok">TikTok</option>
                        <option value="Pinterest">Pinterest</option>
                        <option value="YouTube">YouTube</option>
                        <option value="X">X (Twitter)</option>
                      </select>
                      <input 
                        type="url"
                        placeholder="https://"
                        value={link.url}
                        onChange={(e) => {
                          const newLinks = socialLinks.map(l => l === link ? { ...l, url: e.target.value } : l);
                          setSocialLinks(newLinks);
                        }}
                        className="flex-1 px-3 py-2 bg-white border border-black/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-terracotta"
                      />
                    </div>
                    <button 
                      onClick={() => setSocialLinks(socialLinks.filter(l => l !== link))}
                      className="p-2 text-charcoal/40 hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </Reorder.Item>
                ))}
                {socialLinks.length === 0 && (
                  <p className="text-sm text-charcoal/40 italic text-center py-4">No social links added.</p>
                )}
              </Reorder.Group>
            </div>

            {/* Section C: Standard Links */}
            <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-serif font-medium text-charcoal">Standard Links</h2>
                <button 
                  onClick={() => setExternalLinks([...externalLinks, { title: '', url: '', id: Math.random().toString(36).substring(7) }])}
                  className="text-sm font-medium text-terracotta hover:underline flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Add Link
                </button>
              </div>
              
              <Reorder.Group axis="y" values={externalLinks} onReorder={setExternalLinks} className="space-y-3">
                {externalLinks.map((link) => (
                  <Reorder.Item key={link.id || link.url || link.title} value={link} className="flex gap-3 items-center bg-alabaster p-3 rounded-xl border border-black/5 cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-5 h-5 text-charcoal/40 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <input 
                        type="text"
                        placeholder="Link Title"
                        value={link.title}
                        onChange={(e) => {
                          const newLinks = externalLinks.map(l => l === link ? { ...l, title: e.target.value } : l);
                          setExternalLinks(newLinks);
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-black/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-terracotta"
                      />
                      <input 
                        type="url"
                        placeholder="https://"
                        value={link.url}
                        onChange={(e) => {
                          const newLinks = externalLinks.map(l => l === link ? { ...l, url: e.target.value } : l);
                          setExternalLinks(newLinks);
                        }}
                        className="w-full px-3 py-1.5 bg-white border border-black/10 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-terracotta"
                      />
                    </div>
                    <button 
                      onClick={() => setExternalLinks(externalLinks.filter(l => l !== link))}
                      className="p-2 text-charcoal/40 hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </Reorder.Item>
                ))}
                {externalLinks.length === 0 && (
                  <p className="text-sm text-charcoal/40 italic text-center py-4">No external links added.</p>
                )}
              </Reorder.Group>
            </div>

            {/* Section C: Spaces Layout Manager */}
            <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
              <h2 className="text-lg font-serif font-medium text-charcoal mb-1">Spaces Layout Manager</h2>
              <p className="text-sm text-charcoal/60 mb-4">Drag and drop to reorder how your spaces appear on your public profile.</p>
              
              <Reorder.Group axis="y" values={orderedSpaces} onReorder={setOrderedSpaces} className="space-y-3">
                {orderedSpaces.map((space) => (
                  <Reorder.Item key={space.id} value={space} className="flex items-center gap-4 bg-alabaster p-3 rounded-xl border border-black/5 cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-5 h-5 text-charcoal/40 shrink-0" />
                    <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-white border border-black/5 flex items-center justify-center">
                      {space.type === "SINGLE_ITEM_SPACE" ? (
                        <ShoppingBag className="w-5 h-5 text-charcoal/40" />
                      ) : space.type === "DIGITAL_ITEM_SPACE" ? (
                        space.content?.thumbnailUrl ? (
                          <img src={space.content.thumbnailUrl} alt={space.title} className="w-full h-full object-cover" />
                        ) : (
                          <Sparkles className="w-5 h-5 text-charcoal/40" />
                        )
                      ) : (
                        <img src={space.imageUrl || space.content?.imageUrl} alt={space.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-charcoal truncate">{space.title}</h3>
                    </div>
                    <Link to="/creator-dashboard" className="p-2 text-charcoal/50 hover:text-terracotta hover:bg-white rounded-lg transition-colors shrink-0" title="Edit Space">
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Reorder.Item>
                ))}
                {orderedSpaces.length === 0 && (
                  <p className="text-sm text-charcoal/40 italic text-center py-4">No visible spaces found. Create one in your dashboard.</p>
                )}
              </Reorder.Group>
            </div>

            {/* Section D: Appearance */}
            <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
              <h2 className="text-lg font-serif font-medium text-charcoal mb-4">Appearance</h2>
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

          {/* Right Column: Live Preview */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 flex justify-center">
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
                    <h2 className={`text-xl ${style.font} font-medium mb-2 text-center`}>{profileData?.displayName || "Your Name"}</h2>
                    <p className="text-xs opacity-70 text-center mb-6 max-w-[240px] leading-relaxed">{profileData?.bio || "Your bio will appear here."}</p>

                    {/* Social Links */}
                    {socialLinks.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-3 mb-6">
                        {socialLinks.map((link, idx) => {
                          let Icon = LinkIcon;
                          if (link.platform === 'Instagram') Icon = Instagram;
                          if (link.platform === 'TikTok') Icon = LinkIcon; // No TikTok icon in lucide-react yet
                          if (link.platform === 'Pinterest') Icon = LinkIcon; // No Pinterest icon in lucide-react yet
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
                        {externalLinks.map((link, idx) => (
                          <div key={idx} className={`w-full py-3 px-4 text-xs font-medium text-center border border-current/10 rounded-xl ${style.card} shadow-sm truncate`}>
                            {link.title || "Link Title"}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Spaces Grid */}
                    <div className="w-full grid grid-cols-2 gap-3">
                      {orderedSpaces.map((space) => (
                        <div key={space.id} className={`aspect-[4/5] rounded-xl overflow-hidden relative border border-current/10 ${style.card} flex flex-col items-center justify-center`}>
                          {space.type === "SINGLE_ITEM_SPACE" ? (
                            <ShoppingBag className="w-8 h-8 opacity-20 mb-4" />
                          ) : space.type === "DIGITAL_ITEM_SPACE" ? (
                            space.content?.thumbnailUrl ? (
                              <img src={space.content.thumbnailUrl} alt={space.title} className="absolute inset-0 w-full h-full object-cover" />
                            ) : (
                              <Sparkles className="w-8 h-8 opacity-20 mb-4" />
                            )
                          ) : (
                            <img src={space.imageUrl || space.content?.imageUrl} alt={space.title} className="absolute inset-0 w-full h-full object-cover" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-3">
                            <span className="text-white text-xs font-medium truncate drop-shadow-md z-10">{space.title}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
