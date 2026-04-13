import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Users, Activity, ShoppingBag, Shield, Plus, Trash2, X } from 'lucide-react';

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [interactions, setInteractions] = useState<any[]>([]);
  const [adminEmails, setAdminEmails] = useState<any[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [addingAdmin, setAddingAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminToRemove, setAdminToRemove] = useState<string | null>(null);
  const [removingAdmin, setRemovingAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.profile.all(),
      api.admin.stats(),
      api.admin.emails(),
    ])
      .then(([usersRes, statsRes, emailsRes]) => {
        setUsers(usersRes.users || []);
        setInteractions(Array.from({ length: statsRes.totalInteractions || 0 }, (_, i) => ({ id: i, type: i < (statsRes.totalPurchases || 0) ? 'purchase' : 'view' })));
        setAdminEmails((emailsRes.emails || []).map((e: any) => ({ id: e.email || e })));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [profile]);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail) return;
    setAddingAdmin(true);
    setError(null);
    try {
      await api.admin.addEmail(newAdminEmail.toLowerCase().trim());
      setAdminEmails(prev => [...prev, { id: newAdminEmail.toLowerCase().trim() }]);
      setNewAdminEmail('');
    } catch (err: any) {
      console.error("Error adding admin:", err);
      setError("Failed to add admin. Make sure you have permission.");
    } finally {
      setAddingAdmin(false);
    }
  };

  const confirmRemoveAdmin = async () => {
    if (!adminToRemove) return;
    setRemovingAdmin(true);
    setError(null);
    try {
      await api.admin.removeEmail(adminToRemove);
      setAdminEmails(prev => prev.filter(a => a.id !== adminToRemove));
      setAdminToRemove(null);
    } catch (err: any) {
      console.error("Error removing admin:", err);
      setError("Failed to remove admin. Make sure you have permission.");
    } finally {
      setRemovingAdmin(false);
    }
  };

  const handleRemoveAdmin = (email: string) => {
    setAdminToRemove(email);
  };

  if (loading) {
    return <div className="p-24 text-center">Loading admin dashboard...</div>;
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-alabaster">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-medium text-charcoal mb-8">Admin Panel</h1>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-black/5">
            <Users className="w-8 h-8 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">Total Users</h3>
            <p className="text-3xl font-serif">{users.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-black/5">
            <Activity className="w-8 h-8 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">Total Interactions</h3>
            <p className="text-3xl font-serif">{interactions.length}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-black/5">
            <ShoppingBag className="w-8 h-8 text-terracotta mb-4" />
            <h3 className="text-xl font-medium text-charcoal mb-2">Total Purchases</h3>
            <p className="text-3xl font-serif">{interactions.filter(i => i.type === 'purchase').length}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
            <div className="p-6 border-b border-black/5">
              <h2 className="text-xl font-medium text-charcoal flex items-center gap-2">
                <Shield className="w-5 h-5 text-terracotta" />
                Admin Access Management
              </h2>
            </div>
            <div className="p-6">
              {error && !adminToRemove && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm flex justify-between items-center">
                  <span>{error}</span>
                  <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <form onSubmit={handleAddAdmin} className="flex gap-3 mb-6">
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="flex-1 px-4 py-2 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-terracotta/20"
                  required
                />
                <button
                  type="submit"
                  disabled={addingAdmin}
                  className="px-4 py-2 bg-terracotta text-white rounded-xl font-medium hover:bg-terracotta/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {addingAdmin ? 'Adding...' : 'Add Admin'}
                </button>
              </form>
              
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-charcoal/70 uppercase tracking-wider">Designated Admins</h3>
                <div className="bg-alabaster/50 rounded-xl border border-black/5 divide-y divide-black/5">
                  {adminEmails.map((admin, index) => (
                    <div key={index} className="p-3 flex items-center justify-between group">
                      <span className="text-charcoal font-medium">{admin.id}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs bg-terracotta/10 text-terracotta px-2 py-1 rounded-full">Added</span>
                        <button
                          onClick={() => handleRemoveAdmin(admin.id)}
                          className="text-charcoal/40 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50 opacity-0 group-hover:opacity-100"
                          title="Remove Admin"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-black/5 overflow-hidden">
            <div className="p-6 border-b border-black/5">
              <h2 className="text-xl font-medium text-charcoal">Registered Users</h2>
            </div>
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-alabaster/50 text-sm text-charcoal/70 sticky top-0">
                  <tr>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-alabaster/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta font-medium">
                              {user.name?.charAt(0) || '?'}
                            </div>
                          )}
                          <span className="font-medium text-charcoal">{user.name || 'Unnamed User'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-terracotta/10 text-terracotta">
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Remove Admin Modal */}
      {adminToRemove && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-serif text-charcoal">Remove Admin</h3>
              <button 
                onClick={() => setAdminToRemove(null)}
                className="text-charcoal/40 hover:text-charcoal transition-colors p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-charcoal/70 mb-8">
              Are you sure you want to remove <span className="font-medium text-charcoal">{adminToRemove}</span> from the admin list? They will lose access to the admin dashboard.
            </p>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm">
                {error}
              </div>
            )}
            
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setAdminToRemove(null)}
                className="px-6 py-2.5 rounded-xl font-medium text-charcoal/70 hover:bg-black/5 transition-colors"
                disabled={removingAdmin}
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveAdmin}
                disabled={removingAdmin}
                className="px-6 py-2.5 rounded-xl font-medium bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {removingAdmin ? 'Removing...' : 'Remove Admin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
