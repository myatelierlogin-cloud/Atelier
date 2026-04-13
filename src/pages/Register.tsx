import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, Role } from '../contexts/AuthContext';
import { ShoppingBag, Star, Briefcase, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function Register() {
  const { registerWithEmail, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    niche: '',
    bio: '',
    website: '',
    industry: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleRoleSelect = async (role: Role) => {
    setSelectedRole(role);
    if (role === 'shopper') {
      // Shoppers don't need extra info, submit immediately
      await submitRegistration(role);
    } else {
      setStep(3);
    }
  };

  const submitRegistration = async (roleToSubmit: Role) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      const additionalData: any = { name: formData.name };
      if (roleToSubmit === 'creator') {
        additionalData.niche = formData.niche;
        additionalData.bio = formData.bio;
      } else if (roleToSubmit === 'brand') {
        additionalData.website = formData.website;
        additionalData.industry = formData.industry;
      }

      await registerWithEmail(formData.email, formData.password, roleToSubmit, additionalData);
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Registration error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please log in instead.');
      } else {
        setError(err.message || 'Failed to register. Please try again.');
      }
      setIsSubmitting(false);
      // If error, go back to step 1 to let them fix email/password
      setStep(1);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    await submitRegistration(selectedRole);
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with Google.');
    }
  };

  return (
    <div className="min-h-screen bg-alabaster pt-24 pb-16 px-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-medium text-charcoal mb-4">
            {step === 1 ? "Create an Account" : 
             step === 2 ? "How do you want to use the platform?" : 
             "Complete your profile"}
          </h1>
          <p className="text-lg text-charcoal/60">
            {step === 1 
              ? "Enter your details to get started." 
              : step === 2 
              ? "Select your role to continue."
              : "Tell us a bit more about yourself."}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm text-center max-w-xl mx-auto">
            {error}
          </div>
        )}

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 md:p-12 rounded-3xl border border-black/5 shadow-sm max-w-xl mx-auto"
          >
            <form onSubmit={handleBasicInfoSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-colors"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-terracotta focus:ring-1 focus:ring-terracotta outline-none transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-alabaster bg-terracotta hover:bg-terracotta-dark transition-colors rounded-full"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="h-px bg-black/10 flex-1"></div>
              <span className="text-sm text-charcoal/40">OR</span>
              <div className="h-px bg-black/10 flex-1"></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full mt-6 inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-charcoal bg-white border border-black/10 hover:bg-black/5 transition-colors rounded-full"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign up with Google
            </button>

            <p className="text-center text-sm text-charcoal/60 mt-8">
              Already have an account? <Link to="/login" className="text-terracotta hover:underline">Log in</Link>
            </p>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <motion.button
              whileHover={{ y: -4 }}
              onClick={() => handleRoleSelect('shopper')}
              disabled={isSubmitting}
              className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm text-left hover:shadow-md transition-all group disabled:opacity-50"
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
              disabled={isSubmitting}
              className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm text-left hover:shadow-md transition-all group disabled:opacity-50"
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
              disabled={isSubmitting}
              className="bg-white p-8 rounded-3xl border border-black/5 shadow-sm text-left hover:shadow-md transition-all group disabled:opacity-50"
            >
              <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center mb-6 text-terracotta group-hover:bg-terracotta group-hover:text-white transition-colors">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-medium text-charcoal mb-2">Brand</h3>
              <p className="text-charcoal/60 text-sm">Find influencers, manage campaigns, and drive sales through affiliates.</p>
            </motion.button>
            
            <div className="md:col-span-3 text-center mt-4">
              <button
                onClick={() => setStep(1)}
                className="text-sm font-medium text-charcoal/60 hover:text-charcoal transition-colors"
              >
                Back to details
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 md:p-12 rounded-3xl border border-black/5 shadow-sm max-w-xl mx-auto"
          >
            <form onSubmit={handleFinalSubmit} className="space-y-6">
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
                  onClick={() => setStep(2)}
                  className="text-sm font-medium text-charcoal/60 hover:text-charcoal transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-alabaster bg-terracotta hover:bg-terracotta-dark transition-colors rounded-full disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
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
