import React from 'react';
import { Package, Image as ImageIcon, FileDown, ExternalLink, ShoppingCart, Tag } from 'lucide-react';

export function UnifiedFeed() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">4. Unified Feed Architecture</h2>
        <p className="mt-2 text-gray-600">
          The frontend queries the `FeedItem` table, returning a chronological list of mixed content types. The UI uses a shared Base Card component, but renders specific overlays, icons, and Call-to-Action (CTA) buttons based on the `type` field.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">Creator Profile Feed (Mockup)</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Single Product Card */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 group cursor-pointer hover:shadow-md transition-shadow">
            <div className="aspect-[4/5] bg-gray-100 relative">
              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80" alt="Watch" className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-md shadow-sm">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900 line-clamp-1">Minimalist Watch</h4>
                <span className="font-medium text-gray-900">$129</span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4">Classic timepiece with a leather strap.</p>
              <button className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium flex items-center justify-center hover:bg-gray-800">
                Shop Now <ExternalLink className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

          {/* Multi-Item Card */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 group cursor-pointer hover:shadow-md transition-shadow">
            <div className="aspect-[4/5] bg-gray-100 relative">
              <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80" alt="Living Room" className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-md shadow-sm">
                <ImageIcon className="w-4 h-4 text-purple-600" />
              </div>
              {/* Mock Hotspots */}
              <div className="absolute top-1/3 left-1/4 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 bg-purple-600 rounded-full" />
              </div>
              <div className="absolute bottom-1/3 right-1/3 w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 bg-purple-600 rounded-full" />
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900 line-clamp-1">Cozy Reading Nook</h4>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4">My favorite corner of the house. Tap to shop the look.</p>
              <button className="w-full py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium flex items-center justify-center hover:bg-purple-100">
                View 4 Items <Tag className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

          {/* Digital Product Card */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 group cursor-pointer hover:shadow-md transition-shadow">
            <div className="aspect-[4/5] bg-gray-100 relative">
              <img src="https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80" alt="Preset" className="w-full h-full object-cover" />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-md shadow-sm">
                <FileDown className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-900 line-clamp-1">Moody Film Presets</h4>
                <span className="font-medium text-gray-900">$25</span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mb-4">10 Lightroom presets for that cinematic look.</p>
              <button className="w-full py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium flex items-center justify-center hover:bg-emerald-700">
                Buy & Download <ShoppingCart className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>

        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Frontend Architecture Checklist</h3>
        <ul className="space-y-3 text-sm text-gray-600">
          <li className="flex items-start">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 flex-shrink-0" />
            <strong>Shared BaseComponent:</strong> Handles rendering the outer card, cover image, title, and routing to the detail page.
          </li>
          <li className="flex items-start">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 flex-shrink-0" />
            <strong>Type-Specific Overlays:</strong> A switch statement on `item.type` determines which top-right icon to render.
          </li>
          <li className="flex items-start">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-1.5 mr-2 flex-shrink-0" />
            <strong>Dynamic CTAs:</strong> Single Products link out (`ExternalLink`), Multi-items open a modal or detail page (`Tag`), Digital Products trigger a checkout flow (`ShoppingCart`).
          </li>
        </ul>
      </div>
    </div>
  );
}
