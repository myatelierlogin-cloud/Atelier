import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft, Search, CheckCircle, Plus, Target, Link as LinkIcon, DollarSign, FileText, Calendar, Instagram, Youtube, Twitter, Check, Users } from 'lucide-react';
import { api } from '../lib/api';

interface CampaignCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  creators: any[];
  brandId: string;
  onCampaignCreated: () => void;
  initialSelectedCreators?: string[];
}

export default function CampaignCreationModal({ isOpen, onClose, creators, brandId, onCampaignCreated, initialSelectedCreators = [] }: CampaignCreationModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [campaignName, setCampaignName] = useState('');
  const [goal, setGoal] = useState('');
  const [productLink, setProductLink] = useState('');
  const [budget, setBudget] = useState('');
  const [category, setCategory] = useState('');
  
  const [selectedCreators, setSelectedCreators] = useState<string[]>(initialSelectedCreators);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [collabType, setCollabType] = useState('');
  
  const [instructions, setInstructions] = useState('');
  const [deadline, setDeadline] = useState('');
  const [platform, setPlatform] = useState('');

  // Update selected creators when modal opens with initial values
  React.useEffect(() => {
    if (isOpen) {
      setSelectedCreators(initialSelectedCreators);
    }
  }, [isOpen, initialSelectedCreators]);

  const handleNext = () => setStep(s => Math.min(s + 1, 5));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const toggleCreator = (creatorId: string) => {
    setSelectedCreators(prev => 
      prev.includes(creatorId) ? prev.filter(id => id !== creatorId) : [...prev, creatorId]
    );
  };

  const handleLaunch = async () => {
    setLoading(true);
    try {
      const { campaign } = await api.campaigns.create({
        brandId,
        name: campaignName,
        goal,
        productLink,
        budget,
        category,
        collabType,
        instructions,
        deadline: deadline || null,
        platform,
        status: 'active'
      });

      for (const creatorId of selectedCreators) {
        await api.tasks.create({
          brandId,
          creatorId,
          campaignId: campaign.id,
          title: campaignName,
          description: instructions || 'Please review the campaign details.',
          status: 'pending',
          deadline: deadline || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        });
      }

      onCampaignCreated();
      onClose();
      setStep(1);
      setCampaignName('');
      setGoal('');
      setProductLink('');
      setBudget('');
      setCategory('');
      setSelectedCreators([]);
      setCollabType('');
      setInstructions('');
      setDeadline('');
      setPlatform('');
    } catch (error) {
      console.error("Error launching campaign:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCreators = creators.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.niche?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Suggested creators (top 3 by engagement or random if no metrics)
  const suggestedCreators = [...creators]
    .sort((a, b) => (parseFloat(b.engagementRate) || 0) - (parseFloat(a.engagementRate) || 0))
    .slice(0, 3);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-3xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        >
          {/* Header & Stepper */}
          <div className="shrink-0 p-6 sm:p-8 border-b border-black/5">
            <button onClick={onClose} className="absolute top-6 right-6 p-2 text-charcoal/40 hover:text-charcoal hover:bg-alabaster rounded-full transition-colors z-10">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-serif font-medium text-charcoal mb-6">Launch New Campaign</h2>
            
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-alabaster -z-10"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-terracotta -z-10 transition-all duration-300" style={{ width: `${((step - 1) / 4) * 100}%` }}></div>
              
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step >= i ? 'bg-terracotta text-white' : 'bg-white border-2 border-alabaster text-charcoal/40'}`}>
                  {step > i ? <Check className="w-4 h-4" /> : i}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-medium text-charcoal/40 px-1">
              <span>Basics</span>
              <span>Creators</span>
              <span>Type</span>
              <span>Brief</span>
              <span>Confirm</span>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8">
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Campaign Name</label>
                  <input type="text" value={campaignName} onChange={e => setCampaignName(e.target.value)} placeholder="e.g. Summer Terrace Setup" className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-all" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Campaign Category / Focus</label>
                  <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Home Decor, Tech, Fashion" className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-all" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Campaign Goal</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {['Drive traffic', 'Generate purchases', 'Brand awareness'].map(g => (
                      <button key={g} onClick={() => setGoal(g)} className={`p-4 rounded-xl border text-left transition-all ${goal === g ? 'border-terracotta bg-terracotta/5 text-terracotta' : 'border-black/10 hover:border-black/20 text-charcoal'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <Target className="w-5 h-5" />
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${goal === g ? 'border-terracotta' : 'border-black/20'}`}>
                            {goal === g && <div className="w-2 h-2 rounded-full bg-terracotta" />}
                          </div>
                        </div>
                        <span className="text-sm font-medium">{g}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Product / Landing Page Link</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                    <input type="url" value={productLink} onChange={e => setProductLink(e.target.value)} placeholder="https://..." className="w-full pl-12 pr-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Budget (Optional)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                    <input type="number" value={budget} onChange={e => setBudget(e.target.value)} placeholder="0.00" className="w-full pl-12 pr-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-all" />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-charcoal mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-terracotta" /> Suggested Creators</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                    {suggestedCreators.map(creator => (
                      <div key={`sug-${creator.id}`} className={`p-3 rounded-xl border transition-all cursor-pointer ${selectedCreators.includes(creator.id) ? 'border-terracotta bg-terracotta/5' : 'border-black/5 hover:border-black/10'}`} onClick={() => toggleCreator(creator.id)}>
                        <div className="flex items-center gap-3 mb-2">
                          {creator.avatarUrl ? (
                            <img src={creator.avatarUrl} alt={creator.name} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta font-medium">{creator.name?.charAt(0) || '?'}</div>
                          )}
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-charcoal text-sm truncate">{creator.name}</h4>
                            <p className="text-[10px] text-charcoal/60 truncate">{creator.niche || 'Lifestyle'}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-[10px] font-medium bg-white px-2 py-1 rounded-md border border-black/5">{creator.engagementRate || '2.4%'} eng.</span>
                          <button className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${selectedCreators.includes(creator.id) ? 'bg-terracotta text-white' : 'bg-charcoal text-white'}`}>
                            {selectedCreators.includes(creator.id) ? 'Invited' : 'Invite'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-charcoal">All Creators</h3>
                    <div className="relative w-48">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-charcoal/40" />
                      <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..." className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-black/10 focus:outline-none focus:border-terracotta" />
                    </div>
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {filteredCreators.map(creator => (
                      <div key={creator.id} className="flex items-center justify-between p-3 rounded-xl border border-black/5 hover:border-black/10 transition-colors">
                        <div className="flex items-center gap-3">
                          {creator.avatarUrl ? (
                            <img src={creator.avatarUrl} alt={creator.name} className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta font-medium text-xs">{creator.name?.charAt(0) || '?'}</div>
                          )}
                          <div>
                            <h4 className="font-medium text-charcoal text-sm">{creator.name}</h4>
                            <p className="text-[10px] text-charcoal/60">{creator.niche || 'Lifestyle'} • {creator.followers || '10k'} followers</p>
                          </div>
                        </div>
                        <button onClick={() => toggleCreator(creator.id)} className={`text-xs font-medium px-4 py-1.5 rounded-full transition-colors ${selectedCreators.includes(creator.id) ? 'bg-terracotta/10 text-terracotta' : 'bg-alabaster text-charcoal hover:bg-charcoal hover:text-white'}`}>
                          {selectedCreators.includes(creator.id) ? 'Selected' : 'Invite'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h3 className="text-sm font-medium text-charcoal mb-4">Select Collaboration Type</h3>
                {[
                  { id: 'affiliate', title: 'Affiliate / Commission', desc: 'Pay creators a percentage of sales generated through their links.' },
                  { id: 'fixed', title: 'Fixed Payment', desc: 'Pay a flat fee for specific deliverables (e.g., 1 Reel, 2 Stories).' },
                  { id: 'gifting', title: 'Product Gifting', desc: 'Send free products in exchange for honest reviews or content.' }
                ].map(type => (
                  <button key={type.id} onClick={() => setCollabType(type.id)} className={`w-full p-5 rounded-xl border text-left transition-all flex items-start gap-4 ${collabType === type.id ? 'border-terracotta bg-terracotta/5' : 'border-black/10 hover:border-black/20'}`}>
                    <div className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${collabType === type.id ? 'border-terracotta' : 'border-black/20'}`}>
                      {collabType === type.id && <div className="w-2.5 h-2.5 rounded-full bg-terracotta" />}
                    </div>
                    <div>
                      <h4 className={`font-medium mb-1 ${collabType === type.id ? 'text-terracotta' : 'text-charcoal'}`}>{type.title}</h4>
                      <p className="text-sm text-charcoal/60">{type.desc}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Campaign Brief / Instructions (Optional)</label>
                  <textarea value={instructions} onChange={e => setInstructions(e.target.value)} placeholder="Describe what you're looking for, key talking points, do's and don'ts..." rows={4} className="w-full px-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-all resize-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Content Deadline (Optional)</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                    <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Preferred Platform (Optional)</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'instagram', icon: <Instagram className="w-5 h-5" />, label: 'Instagram' },
                      { id: 'tiktok', icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>, label: 'TikTok' },
                      { id: 'youtube', icon: <Youtube className="w-5 h-5" />, label: 'YouTube' }
                    ].map(p => (
                      <button key={p.id} onClick={() => setPlatform(p.id)} className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${platform === p.id ? 'border-terracotta bg-terracotta/5 text-terracotta' : 'border-black/10 hover:border-black/20 text-charcoal/60'}`}>
                        {p.icon}
                        <span className="text-xs font-medium">{p.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 text-center py-8">
                <div className="w-20 h-20 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-10 h-10 text-terracotta" />
                </div>
                <h3 className="text-2xl font-serif font-medium text-charcoal mb-2">Ready to Launch!</h3>
                <p className="text-charcoal/60 mb-8 max-w-md mx-auto">
                  You're about to launch <strong className="text-charcoal">{campaignName || 'your new campaign'}</strong> and invite <strong className="text-terracotta">{selectedCreators.length} creators</strong> to collaborate.
                </p>
                
                <div className="bg-alabaster rounded-xl p-6 text-left max-w-sm mx-auto space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal/60">Goal:</span>
                    <span className="font-medium text-charcoal">{goal || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal/60">Type:</span>
                    <span className="font-medium text-charcoal capitalize">{collabType || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal/60">Budget:</span>
                    <span className="font-medium text-charcoal">{budget ? `$${budget}` : 'Unspecified'}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="shrink-0 p-6 sm:p-8 border-t border-black/5 bg-alabaster/30 flex items-center justify-between">
            {step > 1 ? (
              <button onClick={handleBack} className="px-6 py-2.5 rounded-full font-medium text-charcoal hover:bg-black/5 transition-colors flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : <div></div>}
            
            {step < 5 ? (
              <button 
                onClick={handleNext} 
                disabled={step === 1 && (!campaignName || !goal || !productLink)}
                className="px-8 py-2.5 bg-charcoal text-white rounded-full font-medium hover:bg-charcoal/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={handleLaunch}
                disabled={loading}
                className="px-8 py-2.5 bg-terracotta text-white rounded-full font-medium hover:bg-terracotta/90 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Launching...' : 'Launch Campaign'}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
