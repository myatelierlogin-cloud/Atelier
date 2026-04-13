import React from 'react';
import { FolderTree, Tag, ChevronRight } from 'lucide-react';

export function Taxonomy() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">2. Standardized Category System</h2>
        <p className="mt-2 text-gray-600">
          A scalable taxonomy system that works across all three product types. The taxonomy is attached to the base `FeedItem` table, ensuring that filtering by category works seamlessly across Single Products, Multi-items, and Digital Products.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Database Structure</h3>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 font-mono text-sm text-gray-800">
          <p><span className="text-purple-600 font-semibold">Category Table:</span> id, name, parentId (self-referencing), slug</p>
          <p className="mt-2"><span className="text-purple-600 font-semibold">Tag Table:</span> id, name, slug</p>
          <p className="mt-2"><span className="text-purple-600 font-semibold">FeedItem_Tag (Join Table):</span> feedItemId, tagId</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Taxonomy Mapping Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Example 1 */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
              <h4 className="font-medium text-blue-900">Single Product</h4>
              <p className="text-xs text-blue-600 mt-0.5">e.g., A specific ceramic mug</p>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Hierarchy</span>
                <div className="flex items-center mt-1 text-sm text-gray-800">
                  <span className="bg-gray-100 px-2 py-1 rounded">Home</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                  <span className="bg-gray-100 px-2 py-1 rounded">Kitchen</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">Drinkware</span>
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tags</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="inline-flex items-center text-xs text-gray-600 bg-gray-50 border border-gray-200 px-2 py-1 rounded-full"><Tag className="w-3 h-3 mr-1" /> ceramic</span>
                  <span className="inline-flex items-center text-xs text-gray-600 bg-gray-50 border border-gray-200 px-2 py-1 rounded-full"><Tag className="w-3 h-3 mr-1" /> handmade</span>
                </div>
              </div>
            </div>
          </div>

          {/* Example 2 */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-purple-50 px-4 py-3 border-b border-purple-100">
              <h4 className="font-medium text-purple-900">Multi-item Space</h4>
              <p className="text-xs text-purple-600 mt-0.5">e.g., "Spring Living Room Setup"</p>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Hierarchy</span>
                <div className="flex items-center mt-1 text-sm text-gray-800">
                  <span className="bg-gray-100 px-2 py-1 rounded">Home</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                  <span className="bg-gray-100 px-2 py-1 rounded">Decor</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded font-medium">Room Inspiration</span>
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tags</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="inline-flex items-center text-xs text-gray-600 bg-gray-50 border border-gray-200 px-2 py-1 rounded-full"><Tag className="w-3 h-3 mr-1" /> spring</span>
                  <span className="inline-flex items-center text-xs text-gray-600 bg-gray-50 border border-gray-200 px-2 py-1 rounded-full"><Tag className="w-3 h-3 mr-1" /> minimalist</span>
                </div>
              </div>
            </div>
          </div>

          {/* Example 3 */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-100">
              <h4 className="font-medium text-emerald-900">Digital Product</h4>
              <p className="text-xs text-emerald-600 mt-0.5">e.g., "Lightroom Preset Pack"</p>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Hierarchy</span>
                <div className="flex items-center mt-1 text-sm text-gray-800">
                  <span className="bg-gray-100 px-2 py-1 rounded">Digital</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                  <span className="bg-gray-100 px-2 py-1 rounded">Photography</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded font-medium">Presets</span>
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tags</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="inline-flex items-center text-xs text-gray-600 bg-gray-50 border border-gray-200 px-2 py-1 rounded-full"><Tag className="w-3 h-3 mr-1" /> lightroom</span>
                  <span className="inline-flex items-center text-xs text-gray-600 bg-gray-50 border border-gray-200 px-2 py-1 rounded-full"><Tag className="w-3 h-3 mr-1" /> editing</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
