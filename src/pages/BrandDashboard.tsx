import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Search, Users, Calendar, CheckSquare, TrendingUp, Eye, ShoppingBag, MousePointerClick, ArrowUpRight, Plus, MessageSquare, CheckCircle, Clock, PlayCircle, Filter, ArrowUp, ArrowDown, ExternalLink, BarChart2, X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import CampaignCreationModal from '../components/CampaignCreationModal';

export default function BrandDashboard() {
  const { profile } = useAuth();
  const [creators, setCreators] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [influencerAnalytics, setInfluencerAnalytics] = useState<any[]>([]);
  const [allInteractions, setAllInteractions] = useState<any[]>([]);
  const [mockInfluencers, setMockInfluencers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAllCreatorsModal, setShowAllCreatorsModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [initialSelectedCreators, setInitialSelectedCreators] = useState<string[]>([]);

  const generateMockInfluencers = () => {
    const mock1 = {
      id: 'mock-1',
      creator: { name: 'Alex Rivera', niche: 'Fashion & Lifestyle', avatarUrl: 'https://picsum.photos/seed/alex/100/100' },
      views: Math.floor(Math.random() * 50000) + 10000,
      clicks: Math.floor(Math.random() * 5000) + 1000,
      buyIntentClicks: Math.floor(Math.random() * 1000) + 200,
      purchases: Math.floor(Math.random() * 500) + 50,
      revenue: Math.floor(Math.random() * 10000) + 1000,
      isMock: true
    };
    const mock2 = {
      id: 'mock-2',
      creator: { name: 'Sam Taylor', niche: 'Tech Reviews', avatarUrl: 'https://picsum.photos/seed/sam/100/100' },
      views: Math.floor(Math.random() * 80000) + 20000,
      clicks: Math.floor(Math.random() * 8000) + 2000,
      buyIntentClicks: Math.floor(Math.random() * 1500) + 300,
      purchases: Math.floor(Math.random() * 800) + 100,
      revenue: Math.floor(Math.random() * 15000) + 2000,
      isMock: true
    };
    setMockInfluencers([mock1, mock2]);
  };

  const deleteMockInfluencers = () => {
    setMockInfluencers([]);
  };

  const fetchData = async () => {
    try {
      const creatorsRes = await api.profile.creators();
      const allCreators = (creatorsRes.creators || []).map((c: any) => {
        const idHash = (c.uid || c.id || '').split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
        return {
          ...c,
          followers: c.followers || `${(idHash % 500) + 10}k`,
          engagementRate: c.engagementRate || `${((idHash % 50) / 10 + 2).toFixed(1)}%`,
          avgViews: c.avgViews || `${(idHash % 100) + 5}k`,
          niche: c.niche || ['Fashion', 'Beauty', 'Home', 'Tech'][idHash % 4]
        };
      });
      setCreators(allCreators);

      if (profile?.uid) {
        const [tasksRes, productsRes, interactionsRes] = await Promise.all([
          api.tasks.list({ brandId: profile.uid }),
          api.products.list(profile.uid),
          api.interactions.list({ brandId: profile.uid }),
        ]);
        const allTasks = tasksRes.tasks || [];
        setTasks(allTasks);
        setProducts(productsRes.products || []);

        const allInteractionsData = interactionsRes.interactions || [];
        setAllInteractions(allInteractionsData);

        const partneredCreatorIds = Array.from(new Set(allTasks.map((t: any) => t.creatorId)));
        const analyticsData = partneredCreatorIds.map(creatorId => {
          const creator = allCreators.find((c: any) => c.uid === creatorId || c.id === creatorId);
          const interactions = allInteractionsData.filter((i: any) => i.creatorId === creatorId || i.creator_id === creatorId);
          return creator ? {
            creator,
            views: interactions.filter((i: any) => i.type === 'profile_view' || i.type === 'space_view' || i.type === 'view').length,
            clicks: interactions.filter((i: any) => i.type === 'external_link_click' || i.type === 'social_link_click' || i.type === 'click').length,
            buyIntentClicks: interactions.filter((i: any) => i.type === 'buy_button_click').length,
            purchases: interactions.filter((i: any) => i.type === 'purchase').length,
            totalInteractions: interactions.length
          } : null;
        }).filter(Boolean);

        analyticsData.sort((a: any, b: any) => b.totalInteractions - a.totalInteractions);
        setInfluencerAnalytics(analyticsData);
      }
    } catch (error) {
      console.error("Error fetching brand data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [profile]);

  const handleStatusUpdate = async (taskId: string, newStatus: string) => {
    try {
      await api.tasks.update(taskId, { status: newStatus });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const filteredCreators = creators.filter(c => {
    const matchesSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || c.niche?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || c.niche === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...Array.from(new Set(creators.map(c => c.niche).filter(Boolean)))];

  const mockViews = mockInfluencers.reduce((sum, m) => sum + m.views, 0);
  const mockClicks = mockInfluencers.reduce((sum, m) => sum + m.clicks, 0);
  const mockPurchases = mockInfluencers.reduce((sum, m) => sum + m.purchases, 0);

  const totalViews = products.reduce((sum, p) => sum + (p.interactionsCount || 0), 0) + mockViews;
  const totalClicks = influencerAnalytics.reduce((sum, a) => sum + a.clicks, 0) + mockClicks;
  const totalPurchases = products.reduce((sum, p) => sum + (p.purchasesCount || 0), 0) + mockPurchases;
  
  // Estimated purchases based on CTR assumption if no real purchases
  const estimatedPurchases = totalPurchases > 0 ? totalPurchases : Math.floor(totalClicks * 0.02); 
  const conversionRate = totalClicks > 0 ? ((estimatedPurchases / totalClicks) * 100).toFixed(1) : '0.0';

  // Calculate real trends
  const calculateTrend = (typeFilter: (i: any) => boolean) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    
    const thisWeek = allInteractions.filter(i => typeFilter(i) && new Date(i.timestamp) >= oneWeekAgo).length;
    const lastWeek = allInteractions.filter(i => typeFilter(i) && new Date(i.timestamp) >= twoWeeksAgo && new Date(i.timestamp) < oneWeekAgo).length;
    
    if (lastWeek === 0) return thisWeek > 0 ? 100 : 0;
    return Math.round(((thisWeek - lastWeek) / lastWeek) * 100);
  };

  const viewsTrend = calculateTrend(i => i.type === 'profile_view' || i.type === 'space_view');
  const clicksTrend = calculateTrend(i => i.type === 'external_link_click' || i.type === 'social_link_click');
  
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const thisWeekClicks = allInteractions.filter(i => (i.type === 'external_link_click' || i.type === 'social_link_click') && new Date(i.timestamp) >= oneWeekAgo).length;
  const thisWeekPurchases = allInteractions.filter(i => i.type === 'purchase' && new Date(i.timestamp) >= oneWeekAgo).length;
  const thisWeekEstimatedPurchases = thisWeekPurchases > 0 ? thisWeekPurchases : Math.floor(thisWeekClicks * 0.02);
  const thisWeekConversion = thisWeekClicks > 0 ? (thisWeekEstimatedPurchases / thisWeekClicks) * 100 : 0;

  const lastWeekClicks = allInteractions.filter(i => (i.type === 'external_link_click' || i.type === 'social_link_click') && new Date(i.timestamp) >= twoWeeksAgo && new Date(i.timestamp) < oneWeekAgo).length;
  const lastWeekPurchases = allInteractions.filter(i => i.type === 'purchase' && new Date(i.timestamp) >= twoWeeksAgo && new Date(i.timestamp) < oneWeekAgo).length;
  const lastWeekEstimatedPurchases = lastWeekPurchases > 0 ? lastWeekPurchases : Math.floor(lastWeekClicks * 0.02);
  const lastWeekConversion = lastWeekClicks > 0 ? (lastWeekEstimatedPurchases / lastWeekClicks) * 100 : 0;

  const conversionTrend = lastWeekConversion === 0 ? (thisWeekConversion > 0 ? 100 : 0) : ((thisWeekConversion - lastWeekConversion) / lastWeekConversion) * 100;

  const combinedAnalytics = [...influencerAnalytics, ...mockInfluencers].map(data => ({
    ...data,
    performanceScore: data.views > 0 ? ((data.clicks / data.views) * 100).toFixed(1) : '0.0',
    estimatedPurchases: data.purchases > 0 ? data.purchases : Math.floor(data.clicks * 0.02)
  }));

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const sortedAnalytics = [...combinedAnalytics].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    let aValue = a[key];
    let bValue = b[key];
    
    if (key === 'creator') {
      aValue = a.creator.name;
      bValue = b.creator.name;
    }

    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Pipeline stages mapping
  const pipelineStages = [
    { id: 'invited', label: 'Invited', icon: <Users className="w-4 h-4" /> },
    { id: 'accepted', label: 'Accepted', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 'pending', label: 'Content Pending', icon: <Clock className="w-4 h-4" /> },
    { id: 'live', label: 'Live', icon: <PlayCircle className="w-4 h-4" /> },
    { id: 'completed', label: 'Completed', icon: <CheckSquare className="w-4 h-4" /> }
  ];

  // Map existing tasks to pipeline statuses for demo purposes
  const getPipelineStatus = (status: string) => {
    if (status === 'pending') return 'invited';
    if (status === 'accepted') return 'accepted';
    if (status === 'submitted') return 'pending';
    if (status === 'approved') return 'live';
    if (status === 'completed') return 'completed';
    return 'invited';
  };

  if (loading) {
    return <div className="p-24 text-center">Loading brand dashboard...</div>;
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-alabaster">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* 1. TOP METRICS BAR */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-charcoal/60">Total Views</p>
              <Eye className="w-4 h-4 text-charcoal/40" />
            </div>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-serif font-medium text-charcoal">{totalViews.toLocaleString()}</h3>
              <span className={`text-xs font-medium px-2 py-1 rounded-md ${viewsTrend >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                {viewsTrend > 0 ? '+' : ''}{viewsTrend}%
              </span>
            </div>
            <p className="text-[10px] text-charcoal/40 mt-2">vs last week</p>
          </div>
          
          <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-charcoal/60">Total Link Clicks</p>
              <MousePointerClick className="w-4 h-4 text-charcoal/40" />
            </div>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-serif font-medium text-charcoal">{totalClicks.toLocaleString()}</h3>
              <span className={`text-xs font-medium px-2 py-1 rounded-md ${clicksTrend >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                {clicksTrend > 0 ? '+' : ''}{clicksTrend}%
              </span>
            </div>
            <p className="text-[10px] text-charcoal/40 mt-2">vs last week</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-charcoal/60">Est. Purchases</p>
              <ShoppingBag className="w-4 h-4 text-charcoal/40" />
            </div>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-serif font-medium text-charcoal">{estimatedPurchases.toLocaleString()}</h3>
              <span className="text-xs font-medium text-charcoal/40 bg-alabaster px-2 py-1 rounded-md">Estimate</span>
            </div>
            <p className="text-[10px] text-charcoal/40 mt-2">Based on CTR</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-charcoal/60">Conversion Rate</p>
              <TrendingUp className="w-4 h-4 text-charcoal/40" />
            </div>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-serif font-medium text-charcoal">{conversionRate}%</h3>
              <span className={`text-xs font-medium px-2 py-1 rounded-md ${conversionTrend >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                {conversionTrend > 0 ? '+' : ''}{conversionTrend.toFixed(1)}%
              </span>
            </div>
            <p className="text-[10px] text-charcoal/40 mt-2">vs last week</p>
          </div>
        </div>

        {/* 2. PRIMARY ACTION SECTION */}
        <div className="bg-gradient-to-r from-charcoal to-charcoal/90 rounded-2xl p-8 mb-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div>
            <h2 className="text-2xl font-serif font-medium mb-2">Grow your brand with creators</h2>
            <p className="text-white/70 text-sm max-w-md">Collaborate with creators to drive traffic and sales. Launch a campaign to get started.</p>
          </div>
          <button 
            onClick={() => setShowCampaignModal(true)}
            className="px-8 py-4 bg-white text-charcoal rounded-full font-medium hover:bg-alabaster transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" /> Launch Campaign
          </button>
        </div>

        {/* 3. CREATOR PERFORMANCE TABLE */}
        <div className="bg-white p-8 rounded-2xl border border-black/5 mb-12 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-serif font-medium text-charcoal flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-terracotta" /> Creator Performance
              </h2>
              <p className="text-sm text-charcoal/50 mt-1">Track traffic and conversions generated by your partners.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={generateMockInfluencers} className="px-3 py-1.5 text-xs font-medium bg-terracotta/10 text-terracotta rounded-lg hover:bg-terracotta/20 transition-colors">
                Add Mock Data
              </button>
              {mockInfluencers.length > 0 && (
                <button onClick={deleteMockInfluencers} className="px-3 py-1.5 text-xs font-medium border border-terracotta/30 text-terracotta rounded-lg hover:bg-terracotta/10 transition-colors">
                  Clear Mock Data
                </button>
              )}
            </div>
          </div>

          {combinedAnalytics.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black/5">
                    <th className="pb-4 font-medium text-charcoal/60 text-xs uppercase tracking-wider cursor-pointer hover:text-charcoal" onClick={() => handleSort('creator')}>
                      <div className="flex items-center gap-1">Creator {sortConfig?.key === 'creator' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}</div>
                    </th>
                    <th className="pb-4 font-medium text-charcoal/60 text-xs uppercase tracking-wider cursor-pointer hover:text-charcoal" onClick={() => handleSort('views')}>
                      <div className="flex items-center gap-1">Views {sortConfig?.key === 'views' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}</div>
                    </th>
                    <th className="pb-4 font-medium text-charcoal/60 text-xs uppercase tracking-wider cursor-pointer hover:text-charcoal" onClick={() => handleSort('clicks')}>
                      <div className="flex items-center gap-1">Clicks {sortConfig?.key === 'clicks' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}</div>
                    </th>
                    <th className="pb-4 font-medium text-charcoal/60 text-xs uppercase tracking-wider cursor-pointer hover:text-charcoal" onClick={() => handleSort('buyIntentClicks')}>
                      <div className="flex items-center gap-1">Buy Intent {sortConfig?.key === 'buyIntentClicks' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}</div>
                    </th>
                    <th className="pb-4 font-medium text-charcoal/60 text-xs uppercase tracking-wider cursor-pointer hover:text-charcoal" onClick={() => handleSort('estimatedPurchases')}>
                      <div className="flex items-center gap-1">Est. Purchases {sortConfig?.key === 'estimatedPurchases' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}</div>
                    </th>
                    <th className="pb-4 font-medium text-charcoal/60 text-xs uppercase tracking-wider cursor-pointer hover:text-charcoal" onClick={() => handleSort('performanceScore')}>
                      <div className="flex items-center gap-1">Score (CTR) {sortConfig?.key === 'performanceScore' && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAnalytics.map((data, index) => (
                    <tr 
                      key={index} 
                      className="border-b border-black/5 last:border-0 hover:bg-alabaster/50 transition-colors cursor-pointer group"
                      onClick={() => window.open(`/${data.creator.username || data.creator.id}`, '_blank')}
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          {data.creator.avatarUrl ? (
                            <img src={data.creator.avatarUrl} alt={data.creator.name} className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta font-medium">
                              {data.creator.name?.charAt(0) || '?'}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-charcoal flex items-center gap-2 group-hover:text-terracotta transition-colors">
                              {data.creator.name} 
                              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </p>
                            <p className="text-xs text-charcoal/50">{data.creator.niche || 'Creator'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-charcoal">{data.views.toLocaleString()}</td>
                      <td className="py-4 text-sm text-charcoal">{data.clicks.toLocaleString()}</td>
                      <td className="py-4 text-sm text-charcoal">{data.buyIntentClicks?.toLocaleString() || 0}</td>
                      <td className="py-4 text-sm text-charcoal">{data.estimatedPurchases.toLocaleString()}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${parseFloat(data.performanceScore) > 2 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {data.performanceScore}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-alabaster/50 rounded-xl border border-dashed border-black/10">
              <Users className="w-8 h-8 text-charcoal/20 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-charcoal mb-1">No creators yet</h3>
              <p className="text-sm text-charcoal/60 mb-4">Discover creators to start your first campaign and track performance.</p>
              <button 
                onClick={() => setShowAllCreatorsModal(true)}
                className="px-4 py-2 bg-charcoal text-white rounded-full text-sm font-medium hover:bg-charcoal/90 transition-colors"
              >
                Discover Creators
              </button>
            </div>
          )}
        </div>

        <AnimatePresence>
          {showAllCreatorsModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm"
                onClick={() => setShowAllCreatorsModal(false)}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
              >
                <button onClick={() => setShowAllCreatorsModal(false)} className="absolute top-4 right-4 p-2 text-charcoal/40 hover:text-charcoal hover:bg-alabaster rounded-full transition-colors z-10">
                  <X className="w-5 h-5" />
                </button>
                <div className="shrink-0">
                  <h3 className="text-2xl font-serif font-medium text-charcoal mb-2">All Registered Creators</h3>
                  <p className="text-sm text-charcoal/60 mb-6">Discover and invite creators to your campaigns.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto overflow-x-hidden pr-2 pb-2">
                  {creators.map(creator => (
                    <div key={`modal-${creator.id}`} className="p-4 rounded-xl border border-black/5 hover:border-terracotta/30 transition-colors flex flex-col justify-between min-w-0">
                      <div className="flex items-start gap-4 mb-4 min-w-0">
                        {creator.avatarUrl ? (
                          <img src={creator.avatarUrl} alt={creator.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta font-medium text-lg shrink-0">
                            {creator.name?.charAt(0) || '?'}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-charcoal truncate">{creator.name}</h3>
                          <p className="text-xs text-charcoal/60 mb-1 truncate">{creator.niche || 'General Lifestyle'}</p>
                          <div className="flex items-center gap-2 text-[10px] font-medium text-charcoal/50 flex-wrap">
                            <span className="bg-alabaster px-2 py-0.5 rounded-md whitespace-nowrap">{creator.followers} followers</span>
                            <span className="bg-alabaster px-2 py-0.5 rounded-md whitespace-nowrap">{creator.engagementRate} eng.</span>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => {
                          setShowAllCreatorsModal(false);
                          setInitialSelectedCreators([creator.id]);
                          setShowCampaignModal(true);
                        }}
                        className="w-full py-2 text-sm font-medium text-charcoal bg-alabaster hover:bg-terracotta hover:text-white transition-colors rounded-lg flex items-center justify-center gap-2 shrink-0 mt-auto"
                      >
                        <Plus className="w-4 h-4 shrink-0" /> Invite to Campaign
                      </button>
                    </div>
                  ))}
                  {creators.length === 0 && (
                    <div className="col-span-full text-center py-12 text-charcoal/50">
                      No creators registered yet.
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <CampaignCreationModal
          isOpen={showCampaignModal}
          onClose={() => {
            setShowCampaignModal(false);
            setInitialSelectedCreators([]);
          }}
          creators={creators}
          brandId={profile?.uid || ''}
          initialSelectedCreators={initialSelectedCreators}
          onCampaignCreated={() => {
            fetchData();
            // Scroll to pipeline
            document.getElementById('campaign-pipeline')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 5. CAMPAIGN PIPELINE */}
        <div id="campaign-pipeline" className="bg-white p-8 rounded-2xl border border-black/5 mb-12 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-serif font-medium text-charcoal flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-terracotta" /> Campaign Pipeline
              </h2>
              <p className="text-sm text-charcoal/50 mt-1">Manage your active collaborations.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pipelineStages.map((stage, index) => {
              const stageTasks = tasks.filter(t => getPipelineStatus(t.status) === stage.id);
              return (
                <div key={stage.id} className="relative flex flex-col bg-alabaster/50 rounded-xl p-4 border border-black/5">
                  {/* Pipeline Connector Arrow */}
                  {index < pipelineStages.length - 1 && (
                    <div className="hidden lg:flex absolute top-7 -right-5 w-4 items-center justify-center z-10">
                      <ChevronRight className="w-6 h-6 text-charcoal/30" />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mb-4 relative z-10">
                    <h3 className="text-sm font-medium text-charcoal flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-charcoal text-white shadow-sm flex items-center justify-center text-xs font-bold shrink-0">
                        {index + 1}
                      </span>
                      {stage.label}
                    </h3>
                    <span className="text-xs font-medium text-charcoal/50 bg-white px-2 py-0.5 rounded-full border border-black/5">
                      {stageTasks.length}
                    </span>
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    {stageTasks.map(task => {
                      const creator = creators.find(c => c.id === task.creatorId);
                      return (
                        <div key={task.id} className="bg-white p-3 rounded-lg border border-black/5 shadow-sm hover:border-terracotta/30 transition-colors cursor-pointer">
                          <div className="flex items-center gap-2 mb-2">
                            {creator?.avatarUrl ? (
                              <img src={creator.avatarUrl} alt={creator.name} className="w-6 h-6 rounded-full object-cover" />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta font-medium text-xs">
                                {creator?.name?.charAt(0) || '?'}
                              </div>
                            )}
                            <span className="text-xs font-medium text-charcoal truncate">{creator?.name || 'Unknown'}</span>
                          </div>
                          <p className="text-sm text-charcoal font-medium mb-1 truncate">{task.title}</p>
                          <p className="text-[10px] text-charcoal/50 mb-3 line-clamp-2">{task.description}</p>
                          
                          <div className="flex items-center justify-between pt-2 border-t border-black/5">
                            <span className="text-[10px] text-charcoal/50 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Due {new Date(task.deadline.seconds * 1000).toLocaleDateString()}
                            </span>
                            <div className="flex gap-1">
                              <button className="p-1 text-charcoal/40 hover:text-terracotta hover:bg-terracotta/10 rounded transition-colors" title="Message">
                                <MessageSquare className="w-3.5 h-3.5" />
                              </button>
                              {stage.id === 'pending' && (
                                <button onClick={() => handleStatusUpdate(task.id, 'approved')} className="p-1 text-charcoal/40 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title="Approve">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {stageTasks.length === 0 && (
                      <div className="text-center py-6 text-charcoal/40 text-xs border border-dashed border-black/10 rounded-lg">
                        Empty
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* 4. INFLUENCER DISCOVERY */}
          <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-serif font-medium text-charcoal flex items-center gap-2">
                  <Search className="w-5 h-5 text-terracotta" /> Influencer Discovery
                </h2>
                <p className="text-sm text-charcoal/50 mt-1">Find the perfect creators for your brand.</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search creators by name or niche..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-all text-sm"
                />
                <Search className="absolute left-3 top-3 w-4 h-4 text-charcoal/40" />
              </div>
              <div className="relative min-w-[150px]">
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/10 focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-all text-sm appearance-none bg-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <Filter className="absolute left-3 top-3 w-4 h-4 text-charcoal/40" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
              {filteredCreators.map(creator => (
                <div key={creator.id} className="p-4 rounded-xl border border-black/5 hover:border-terracotta/30 transition-colors flex flex-col justify-between">
                  <div className="flex items-start gap-4 mb-4">
                    {creator.avatarUrl ? (
                      <img src={creator.avatarUrl} alt={creator.name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta font-medium text-lg">
                        {creator.name?.charAt(0) || '?'}
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-charcoal">{creator.name}</h3>
                      <p className="text-xs text-charcoal/60 mb-1">{creator.niche || 'General Lifestyle'}</p>
                      <div className="flex items-center gap-3 text-[10px] font-medium text-charcoal/50">
                        <span className="bg-alabaster px-2 py-0.5 rounded-md">{creator.followers} followers</span>
                        <span className="bg-alabaster px-2 py-0.5 rounded-md">{creator.engagementRate} eng.</span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setInitialSelectedCreators([creator.id]);
                      setShowCampaignModal(true);
                    }}
                    className="w-full py-2 text-sm font-medium text-charcoal bg-alabaster hover:bg-terracotta hover:text-white transition-colors rounded-lg flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Invite to Campaign
                  </button>
                </div>
              ))}
              {filteredCreators.length === 0 && (
                <div className="col-span-full text-center py-12 bg-alabaster/50 rounded-xl border border-dashed border-black/10">
                  <Search className="w-8 h-8 text-charcoal/20 mx-auto mb-3" />
                  <p className="text-sm text-charcoal/60 mb-2">No creators found matching your criteria.</p>
                  <p className="text-xs text-charcoal/40">Start by searching or explore suggested creators.</p>
                </div>
              )}
            </div>
          </div>

          {/* 7. SUGGESTED CREATORS */}
          <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-serif font-medium text-charcoal flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-terracotta" /> Suggested
              </h2>
              <p className="text-sm text-charcoal/50 mt-1">Trending in your category.</p>
            </div>
            
            <div className="space-y-4">
              {creators.slice(0, 4).map(creator => (
                <div key={`suggested-${creator.id}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-alabaster transition-colors group">
                  <div className="flex items-center gap-3">
                    {creator.avatarUrl ? (
                      <img src={creator.avatarUrl} alt={creator.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta font-medium text-sm">
                        {creator.name?.charAt(0) || '?'}
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-medium text-charcoal">{creator.name}</h3>
                      <p className="text-[10px] text-charcoal/50">{creator.followers} • {creator.niche}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setInitialSelectedCreators([creator.id]);
                      setShowCampaignModal(true);
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-terracotta bg-terracotta/10 hover:bg-terracotta hover:text-white transition-colors rounded-full opacity-0 group-hover:opacity-100"
                  >
                    Invite
                  </button>
                </div>
              ))}
              {creators.length === 0 && (
                <p className="text-center text-sm text-charcoal/50 py-4">No suggestions available yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* 6. CONTENT CALENDAR */}
        <div className="bg-white p-8 rounded-2xl border border-black/5 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-serif font-medium text-charcoal flex items-center gap-2">
                <Calendar className="w-5 h-5 text-terracotta" /> Content Calendar
              </h2>
              <p className="text-sm text-charcoal/50 mt-1">Scheduled creator content and deadlines.</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-charcoal bg-alabaster hover:bg-black/5 transition-colors rounded-lg flex items-center gap-2">
              Weekly View
            </button>
          </div>
          
          {tasks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-alabaster/50 text-xs uppercase tracking-wider text-charcoal/60">
                  <tr>
                    <th className="px-4 py-3 font-medium rounded-l-lg">Date</th>
                    <th className="px-4 py-3 font-medium">Creator</th>
                    <th className="px-4 py-3 font-medium">Campaign</th>
                    <th className="px-4 py-3 font-medium">Platform</th>
                    <th className="px-4 py-3 font-medium rounded-r-lg">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {tasks.sort((a, b) => a.deadline.seconds - b.deadline.seconds).map(task => {
                    const creator = creators.find(c => c.id === task.creatorId);
                    return (
                      <tr key={`cal-${task.id}`} className="hover:bg-alabaster/30 transition-colors">
                        <td className="px-4 py-4 text-sm text-charcoal font-medium">
                          {new Date(task.deadline.seconds * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            {creator?.avatarUrl ? (
                              <img src={creator.avatarUrl} alt={creator.name} className="w-6 h-6 rounded-full object-cover" />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-terracotta/10 flex items-center justify-center text-terracotta font-medium text-xs">
                                {creator?.name?.charAt(0) || '?'}
                              </div>
                            )}
                            <span className="text-sm font-medium text-charcoal">{creator?.name || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-charcoal">{task.title}</td>
                        <td className="px-4 py-4 text-sm text-charcoal/70">Instagram, TikTok</td>
                        <td className="px-4 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                            task.status === 'approved' ? 'bg-green-100 text-green-800' :
                            task.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                            task.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {task.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-alabaster/50 rounded-xl border border-dashed border-black/10">
              <Calendar className="w-8 h-8 text-charcoal/20 mx-auto mb-3" />
              <p className="text-sm text-charcoal/60 mb-2">No scheduled content.</p>
              <p className="text-xs text-charcoal/40">Launch a campaign to start planning content.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
