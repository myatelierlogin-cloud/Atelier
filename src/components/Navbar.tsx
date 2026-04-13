import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth, Role } from "../contexts/AuthContext";
import { Menu, X, ChevronDown, Search } from "lucide-react";

export function Navbar() {
  const { user, profile, simulatedRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);
  const [isShopSidebarOpen, setIsShopSidebarOpen] = useState(false);

  const isShopRoute = location.pathname === '/';
  const isPlatformRoute = ['/for-brands', '/for-creators', '/for-shoppers'].includes(location.pathname);
  const isDashboardRoute = ['/shopper-dashboard', '/creator-dashboard', '/brand-dashboard', '/dashboard'].includes(location.pathname);
  const hideNavItems = isPlatformRoute || isDashboardRoute;

  let howItWorksPath = '/for-creators';
  if (['/for-shoppers', '/shopper-dashboard'].includes(location.pathname)) howItWorksPath = '/for-shoppers';
  if (['/for-brands', '/brand-dashboard'].includes(location.pathname)) howItWorksPath = '/for-brands';
  if (['/for-creators', '/creator-dashboard'].includes(location.pathname)) howItWorksPath = '/for-creators';

  let pricingPath = '/for-creators#pricing';
  if (['/for-brands', '/brand-dashboard'].includes(location.pathname)) pricingPath = '/for-brands#pricing';

  const hidePricing = ['/for-shoppers', '/shopper-dashboard'].includes(location.pathname);

  const handleHashLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetPath: string, hash: string) => {
    const [path] = targetPath.split('#');
    if (location.pathname === path) {
      e.preventDefault();
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', targetPath);
      }
    }
  };

  useEffect(() => {
    if (isMobileMenuOpen || isShopSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen, isShopSidebarOpen]);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    setExpandedMobileItem(null);
    setIsShopSidebarOpen(false);
  };

  const toggleMobileItem = (title: string) => {
    setExpandedMobileItem(expandedMobileItem === title ? null : title);
  };

  const allNavItems = [
    {
      title: "For Shoppers",
      role: "shopper",
      path: "/for-shoppers",
      subItems: [
        { title: "Shop by Category", path: "/shop-by-category" },
        { title: "Discover Creators", path: "/discover-creators" },
        { title: "Trending Products", path: "/trending-products" },
        { title: "Gift Guides", path: "/gift-guides" }
      ]
    },
    {
      title: "For Creators",
      role: "creator",
      path: "/for-creators",
      subItems: [
        { title: "Monetization", path: "/for-creators/monetization" },
        { title: "Link in Bio", path: "/for-creators/link-in-bio" },
        { title: "Portfolios", path: "/for-creators/portfolios" },
        { title: "Analytics", path: "/for-creators/analytics" },
        { title: "Brand Partnerships", path: "/for-creators/brand-partnerships" }
      ]
    },
    {
      title: "For Brands",
      role: "brand",
      path: "/for-brands",
      subItems: [
        { title: "Influencer Discovery", path: "/for-brands/discovery" },
        { title: "Campaign Management", path: "/for-brands/campaigns" },
        { title: "Affiliate Marketing", path: "/for-brands/affiliate" },
        { title: "Gifting", path: "/for-brands/gifting" },
        { title: "Reporting", path: "/for-brands/reporting" }
      ]
    }
  ];

  const effectiveRole = simulatedRole || profile?.role;
  
  const navItems = user && effectiveRole && effectiveRole !== 'admin' && effectiveRole !== 'pending'
    ? [{ ...allNavItems.find(item => item.role === effectiveRole)!, title: "For You" }]
    : [{
        title: "For You",
        path: "/for-you",
        subItems: [
          { title: "For Shoppers", path: "/for-shoppers" },
          { title: "For Creators", path: "/for-creators" },
          { title: "For Brands", path: "/for-brands" }
        ]
      }];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-alabaster/80 backdrop-blur-md border-b border-black/5"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2" 
          onClick={(e) => {
            if (isShopRoute) {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent('reset-shop-tab'));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            closeMenu();
          }}
        >
          <div className="w-8 h-8 rounded-full bg-terracotta flex items-center justify-center shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-alabaster" />
          </div>
          <span className="font-serif font-medium text-xl tracking-tight text-charcoal">Atelier</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center gap-6">
          {isShopRoute ? (
            <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-md hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products, brands, creators..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-black/10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-all shadow-sm"
                />
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-charcoal/40" />
              </div>
            </div>
          ) : (
            <>
              {!hideNavItems && navItems.map((item) => (
                <div 
                  key={item.title}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(item.title)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link 
                    to={item.path} 
                    className="flex items-center gap-1 text-sm font-medium text-charcoal/70 hover:text-charcoal transition-colors py-2"
                  >
                    {item.title}
                    <ChevronDown className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  
                  <AnimatePresence>
                    {activeDropdown === item.title && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 w-56 bg-white border border-black/5 rounded-xl shadow-lg py-2 z-50"
                      >
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.title}
                            to={subItem.path}
                            onClick={closeMenu}
                            className="block px-4 py-2 text-sm text-charcoal/70 hover:text-charcoal hover:bg-alabaster transition-colors"
                          >
                            {subItem.title}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              <Link 
                to={howItWorksPath} 
                onClick={closeMenu}
                className="text-sm font-medium text-charcoal/70 hover:text-charcoal transition-colors"
              >
                How it works
              </Link>
              
              {!hidePricing && (
                <Link 
                  to={pricingPath} 
                  onClick={(e) => handleHashLinkClick(e, pricingPath, '#pricing')}
                  className="text-sm font-medium text-charcoal/70 hover:text-charcoal transition-colors"
                >
                  Pricing
                </Link>
              )}
            </>
          )}

          {user ? (
            <div className="flex items-center gap-4">
              {!isShopRoute && (
                <Link 
                  to="/dashboard"
                  className="text-sm font-medium text-charcoal/70 hover:text-charcoal transition-colors py-2"
                >
                  Dashboard
                </Link>
              )}
              <button 
                onClick={logout}
                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-alabaster bg-charcoal hover:bg-charcoal/90 transition-colors rounded-full"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {isShopRoute ? (
                <Link 
                  to="/register"
                  className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-alabaster bg-charcoal hover:bg-charcoal/90 transition-colors rounded-full"
                >
                  Sign Up
                </Link>
              ) : (
                <Link 
                  to="/login"
                  className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-alabaster bg-charcoal hover:bg-charcoal/90 transition-colors rounded-full"
                >
                  Log In
                </Link>
              )}
            </div>
          )}

          <div className="relative">
            <button 
              onClick={() => setIsShopSidebarOpen(!isShopSidebarOpen)}
              className={`p-2 rounded-full transition-colors ${isShopSidebarOpen ? 'bg-black/10 text-charcoal' : 'text-charcoal hover:bg-black/5'}`}
            >
              {isShopSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <AnimatePresence>
              {isShopSidebarOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsShopSidebarOpen(false)}
                    className="fixed inset-0 z-40"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-4 w-64 bg-white/95 backdrop-blur-md border border-black/5 rounded-2xl shadow-xl py-4 z-50 flex flex-col"
                  >
                    <div className="px-4 pb-2 mb-2 border-b border-black/5">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal/50">Platform</h3>
                    </div>
                    <Link to="/for-brands" onClick={closeMenu} className="px-4 py-2 text-sm font-medium text-charcoal hover:bg-black/5 transition-colors">For Brands</Link>
                    <Link to="/for-creators" onClick={closeMenu} className="px-4 py-2 text-sm font-medium text-charcoal hover:bg-black/5 transition-colors">For Creators</Link>
                    <Link to="/for-shoppers" onClick={closeMenu} className="px-4 py-2 text-sm font-medium text-charcoal hover:bg-black/5 transition-colors">For Shoppers</Link>
                    
                    {isShopRoute && (
                      <>
                        <div className="px-4 pb-2 pt-4 mb-2 mt-2 border-b border-t border-black/5">
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal/50">Shopper</h3>
                        </div>
                        <Link to="/shop/taste-profile" onClick={closeMenu} className="px-4 py-2 text-sm font-medium text-charcoal hover:bg-black/5 transition-colors">My Taste Profile</Link>
                        <Link to="/shop/settings" onClick={closeMenu} className="px-4 py-2 text-sm font-medium text-charcoal hover:bg-black/5 transition-colors">Settings</Link>
                      </>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="sm:hidden flex items-center">
          <button 
            onClick={toggleMenu} 
            className={`p-2 rounded-full transition-colors ${isMobileMenuOpen ? 'bg-black/10 text-charcoal' : 'text-charcoal hover:bg-black/5'}`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="sm:hidden absolute top-20 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-black/5 overflow-y-auto shadow-xl z-50"
            style={{ maxHeight: 'calc(100vh - 80px)' }}
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {isShopRoute && (
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search products, brands, creators..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-black/10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-all shadow-sm"
                  />
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-charcoal/40" />
                </div>
              )}
              {!hideNavItems && navItems.map((item) => (
                <div key={item.title} className="flex flex-col">
                  <button 
                    onClick={() => toggleMobileItem(item.title)}
                    className="flex items-center justify-between py-2 text-base font-medium text-charcoal/80 hover:text-charcoal transition-colors text-left"
                  >
                    {item.title}
                    <ChevronDown className={`w-4 h-4 transition-transform ${expandedMobileItem === item.title ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {expandedMobileItem === item.title && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 py-2 flex flex-col gap-3 border-l-2 border-black/5 mt-1 mb-2">
                          <Link
                            to={item.path}
                            onClick={closeMenu}
                            className="text-sm font-medium text-terracotta hover:text-terracotta/80 transition-colors"
                          >
                            Overview
                          </Link>
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.title}
                              to={subItem.path}
                              onClick={closeMenu}
                              className="text-sm text-charcoal/60 hover:text-charcoal transition-colors"
                            >
                              {subItem.title}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              
              {!hideNavItems && <div className="h-px bg-black/5 my-2" />}

              <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal/50">Platform</h3>
              <Link to="/for-brands" onClick={closeMenu} className="text-base font-medium text-charcoal/80 hover:text-charcoal transition-colors">For Brands</Link>
              <Link to="/for-creators" onClick={closeMenu} className="text-base font-medium text-charcoal/80 hover:text-charcoal transition-colors">For Creators</Link>
              <Link to="/for-shoppers" onClick={closeMenu} className="text-base font-medium text-charcoal/80 hover:text-charcoal transition-colors">For Shoppers</Link>
              <div className="h-px bg-black/5 my-2" />

              {isShopRoute && (
                <>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal/50">Shopper</h3>
                  <Link to="/shop/taste-profile" onClick={closeMenu} className="text-base font-medium text-charcoal/80 hover:text-charcoal transition-colors">My Taste Profile</Link>
                  <Link to="/shop/settings" onClick={closeMenu} className="text-base font-medium text-charcoal/80 hover:text-charcoal transition-colors">Settings</Link>
                  <div className="h-px bg-black/5 my-2" />
                </>
              )}

              <Link 
                to={howItWorksPath} 
                onClick={closeMenu}
                className="text-base font-medium text-charcoal/80 hover:text-charcoal transition-colors"
              >
                How it works
              </Link>
              
              {!hidePricing && (
                <Link 
                  to={pricingPath} 
                  onClick={(e) => {
                    closeMenu();
                    handleHashLinkClick(e, pricingPath, '#pricing');
                  }}
                  className="text-base font-medium text-charcoal/80 hover:text-charcoal transition-colors"
                >
                  Pricing
                </Link>
              )}
              {user ? (
                <div className="flex flex-col gap-4">
                  <Link 
                    to="/dashboard"
                    onClick={closeMenu}
                    className="text-base font-medium text-charcoal/80 hover:text-charcoal transition-colors py-2"
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={() => { logout(); closeMenu(); }}
                    className="w-full inline-flex items-center justify-center px-6 py-3 mt-2 text-sm font-medium text-alabaster bg-charcoal hover:bg-charcoal/90 transition-colors rounded-full"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  <Link 
                    to="/login"
                    onClick={closeMenu}
                    className="w-full inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-alabaster bg-charcoal hover:bg-charcoal/90 transition-colors rounded-full"
                  >
                    Log In
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
