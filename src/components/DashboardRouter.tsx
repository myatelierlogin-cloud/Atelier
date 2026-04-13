import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardRouter() {
  const { profile, loading, simulatedRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!profile) {
        navigate('/');
      } else {
        const effectiveRole = simulatedRole || profile.role;
        if (effectiveRole === 'pending') {
          navigate('/onboarding');
        } else if (effectiveRole === 'admin') {
          navigate('/admin-dashboard');
        } else if (effectiveRole === 'brand') {
          navigate('/brand-dashboard');
        } else if (effectiveRole === 'creator') {
          navigate('/creator-dashboard');
        } else {
          navigate('/shopper-dashboard');
        }
      }
    }
  }, [profile, loading, simulatedRole, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-alabaster">
      <div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
