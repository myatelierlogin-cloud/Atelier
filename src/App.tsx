/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import { Navbar } from "./components/Navbar";
import CreatorSpaces from "./pages/CreatorSpaces";
import StorefrontBuilder from "./pages/StorefrontBuilder";
import ShopperDashboard from "./pages/ShopperDashboard";
import ConsumerSpace from "./pages/ConsumerSpace";
import ForShoppers from "./pages/ForShoppers";
import ForCreators from "./pages/ForCreators";
import ForBrands from "./pages/ForBrands";
import ShopByCategory from "./pages/ShopByCategory";
import CreatorMonetization from "./pages/CreatorMonetization";
import CreatorLinkInBio from "./pages/CreatorLinkInBio";
import CreatorPortfolios from "./pages/CreatorPortfolios";
import CreatorAnalytics from "./pages/CreatorAnalytics";
import CreatorBrandPartnerships from "./pages/CreatorBrandPartnerships";
import BrandDiscovery from "./pages/BrandDiscovery";
import BrandCampaigns from "./pages/BrandCampaigns";
import BrandAffiliate from "./pages/BrandAffiliate";
import BrandGifting from "./pages/BrandGifting";
import BrandReporting from "./pages/BrandReporting";
import AdminDashboard from "./pages/AdminDashboard";
import BrandDashboard from "./pages/BrandDashboard";
import DashboardRouter from "./components/DashboardRouter";
import { AdminRoleSwitcher } from "./components/AdminRoleSwitcher";
import Onboarding from "./pages/Onboarding";
import TrendingProducts from "./pages/TrendingProducts";
import DiscoverCreators from "./pages/DiscoverCreators";
import GiftGuides from "./pages/GiftGuides";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForYouLanding from "./pages/ForYouLanding";
import ShopHub from "./pages/ShopHub";
import SystemDesign from "./pages/SystemDesign";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-alabaster text-charcoal selection:bg-terracotta/20 selection:text-terracotta-dark">
          <Navbar />
          <Routes>
            <Route path="/" element={<ShopHub />} />
            <Route path="/shop" element={<ShopHub />} />
            <Route path="/for-you" element={<ForYouLanding />} />
            <Route path="/for-shoppers" element={<ForShoppers />} />
            <Route path="/shop-by-category" element={<ShopByCategory />} />
            <Route path="/trending-products" element={<TrendingProducts />} />
            <Route path="/discover-creators" element={<DiscoverCreators />} />
            <Route path="/gift-guides" element={<GiftGuides />} />
            <Route path="/for-creators" element={<ForCreators />} />
            <Route path="/for-creators/monetization" element={<CreatorMonetization />} />
            <Route path="/for-creators/link-in-bio" element={<CreatorLinkInBio />} />
            <Route path="/for-creators/portfolios" element={<CreatorPortfolios />} />
            <Route path="/for-creators/analytics" element={<CreatorAnalytics />} />
            <Route path="/for-creators/brand-partnerships" element={<CreatorBrandPartnerships />} />
            <Route path="/for-brands" element={<ForBrands />} />
            <Route path="/for-brands/discovery" element={<BrandDiscovery />} />
            <Route path="/for-brands/campaigns" element={<BrandCampaigns />} />
            <Route path="/for-brands/affiliate" element={<BrandAffiliate />} />
            <Route path="/for-brands/gifting" element={<BrandGifting />} />
            <Route path="/for-brands/reporting" element={<BrandReporting />} />
            <Route path="/dashboard" element={<DashboardRouter />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/shopper-dashboard" element={<ShopperDashboard />} />
            <Route path="/creator-dashboard" element={<CreatorSpaces />} />
            <Route path="/creator-dashboard/storefront" element={<StorefrontBuilder />} />
            <Route path="/brand-dashboard" element={<BrandDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/system-design" element={<SystemDesign />} />
            <Route path="/:username" element={<ConsumerSpace />} />
          </Routes>
          <AdminRoleSwitcher />
        </div>
      </Router>
    </AuthProvider>
  );
}
