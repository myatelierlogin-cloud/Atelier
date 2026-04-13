import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingBag, Star, Clock } from 'lucide-react';

export default function ShopperDashboard() {
  const { profile, loading } = useAuth();

  if (loading) {
    return <div className="p-24 text-center">Loading shopper dashboard...</div>;
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-alabaster">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-medium text-charcoal mb-8">Shopper Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
            <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-6 h-6 text-terracotta" />
            </div>
            <h3 className="text-xl font-medium text-charcoal mb-2">Saved Products</h3>
            <p className="text-charcoal/60">You have 0 saved products.</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
            <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-terracotta" />
            </div>
            <h3 className="text-xl font-medium text-charcoal mb-2">Followed Creators</h3>
            <p className="text-charcoal/60">You are following 0 creators.</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm">
            <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-terracotta" />
            </div>
            <h3 className="text-xl font-medium text-charcoal mb-2">Recent Activity</h3>
            <p className="text-charcoal/60">No recent activity.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
