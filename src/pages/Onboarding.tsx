import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, Role } from '../contexts/AuthContext';
import { ShoppingBag, Star, Briefcase, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Onboarding() {
  const { profile, updateProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    niche: '',
    bio: '',
    website: '',
    industry: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!profile) {
        navigate('/');
      } else if (profile.role !== 'pending') {
        navigate('/dashboard');
      } else if (profile.name) {
        setFormData(prev => ({ ...prev, name: profile.name }));
      }
    }
  }, [profile, loading, navigate]);

  if (loading || !profile || profile.role !== 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-alabaster">
        <div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    setIsSubmitting(true);
    
    try {
      const updateData: any = {
        role: selectedRole,
        name: formData.name,
      };
      
      if (selectedRole === 'creator') {
        updateData.niche = formData.niche;
        updateData.bio = formData.bio;
      } else if (selectedRole === 'brand') {
        updateData.website = formData.website;
        updateData.industry = formData.industry;
      }

      await updateProfile(updateData);
      // The AuthContext state update will trigger DashboardRouter via App.tsx
      // but we can also explicitly navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error("Error updating profile:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-alabaster pt-24 pb-16 px-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-medium text-charcoal mb-4">
            {step === 1 ? "Welcome to Atelier" : "Complete your profile"}
          </h1>
          <p className="text-lg text-charcoal/60">
            {step === 1 
              ? "How do you want to use the platform?" 
              : "Tell us a bit more about yourself to get started."}
          </p>
        </div>

        {step === 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.button
              whileHover={{ y: -4 }}
              onClick={() => handleRoleSelect('shopper')}
              className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm text-left hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center mb-6 text-terracotta group-hover:bg-terracotta group-hover:text-white transition-colors">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium text-charcoal mb-2">Shopper</h3>
              <p className="text-charcoal/60 text-sm">Discover products, follow creators, and shop curated collections.</p>
            </motion.button>

            <motion.button
              whileHover={{ y: -4 }}
              onClick={() => handleRoleSelect('creator')}
              className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm text-left hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center mb-6 text-terracotta group-hover:bg-terracotta group-hover:text-white transition-colors">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium text-charcoal mb-2">Creator</h3>
              <p className="text-charcoal/60 text-sm">Build your storefront, monetize your audience, and partner with brands.</p>
            </motion.button>

            <motion.button
              whileHover={{ y: -4 }}
              onClick={() => handleRoleSelect('brand')}
              className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm text-left hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center mb-6 text-terracotta group-hover:bg-terracotta group-hover:text-white transition-colors">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium text-charcoal mb-2">Brand</h3>
              <p className="text-charcoal/60 text-sm">Find influencers, manage campaigns, and drive sales through affiliates.</p>
            </motion.button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 md:p-12 rounded-3xl border border-black/5 shadow-sm max-w-xl mx-auto"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  {selectedRole === 'brand' ? 'Company Name' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-colors"
                  placeholder={selectedRole === 'brand' ? 'Acme Corp' : 'Jane Doe'}
                />
              </div>

              {selectedRole === 'creator' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Your Niche</label>
                    <input
                      type="text"
                      required
                      value={formData.niche}
                      onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-colors"
                      placeholder="e.g. Fashion, Tech, Lifestyle"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Short Bio</label>
                    <textarea
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-colors resize-none"
                      placeholder="Tell us a bit about your content..."
                    />
                  </div>
                </>
              )}

              {selectedRole === 'brand' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Website</label>
                    <input
                      type="url"
                      required
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-colors"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Industry</label>
                    <input
                      type="text"
                      required
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-colors"
                      placeholder="e.g. Beauty, Apparel, Electronics"
                    />
                  </div>
                </>
              )}

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm font-medium text-charcoal/60 hover:text-charcoal transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-alabaster bg-terracotta hover:bg-terracotta-dark transition-colors rounded-full disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Complete Setup'}
                  {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
