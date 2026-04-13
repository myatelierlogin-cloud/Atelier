import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, X, User, ShoppingBag, Star, Briefcase, Shield } from 'lucide-react';
import { useAuth, Role } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function AdminRoleSwitcher() {
  const { profile, simulatedRole, setSimulatedRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  if (profile?.role !== 'admin') {
    return null;
  }

  const roles: { id: Role | null; label: string; icon: React.ElementType }[] = [
    { id: null, label: 'Admin (Default)', icon: Shield },
    { id: 'shopper', label: 'Shopper', icon: ShoppingBag },
    { id: 'creator', label: 'Creator', icon: Star },
    { id: 'brand', label: 'Brand', icon: Briefcase },
  ];

  const handleRoleSwitch = (role: Role | null) => {
    setSimulatedRole(role);
    setIsOpen(false);
    navigate('/dashboard');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-16 right-0 bg-white rounded-2xl shadow-xl border border-black/10 p-4 w-64 mb-2"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-charcoal">Test as Role</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-charcoal/40 hover:text-charcoal transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {roles.map((role) => {
                const Icon = role.icon;
                const isActive = simulatedRole === role.id || (role.id === null && simulatedRole === null);
                return (
                  <button
                    key={role.id || 'admin'}
                    onClick={() => handleRoleSwitch(role.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${
                      isActive 
                        ? 'bg-terracotta text-white' 
                        : 'hover:bg-black/5 text-charcoal/80'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {role.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-charcoal text-white rounded-full shadow-lg flex items-center justify-center hover:bg-charcoal/90 transition-colors"
      >
        <Settings className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
