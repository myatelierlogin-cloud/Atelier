import React from 'react';
import { DatabaseZap, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

export function Migration() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">5. Migration Strategy</h2>
        <p className="mt-2 text-gray-600">
          Migrating from the legacy "Space" model to the new polymorphic architecture requires a careful, phased approach to ensure zero data loss and minimal downtime.
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-start">
          <AlertTriangle className="w-6 h-6 text-amber-600 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-amber-900 font-semibold">The Challenge</h3>
            <p className="text-amber-800 text-sm mt-1">
              Legacy "Spaces" are unstructured. A single Space might have been used as a product link, a lookbook, or just a text post. We must heuristically determine the new type for each existing record.
            </p>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gray-200" />
        <div className="space-y-8 relative">
          
          {/* Phase 1 */}
          <div className="flex items-start">
            <div className="w-16 h-16 rounded-full bg-white border-4 border-gray-100 flex items-center justify-center flex-shrink-0 relative z-10 shadow-sm">
              <span className="text-gray-500 font-bold">Ph 1</span>
            </div>
            <div className="ml-6 pt-3">
              <h4 className="text-lg font-semibold text-gray-900">Schema Deployment & Dual Writing</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><ArrowRight className="w-4 h-4 mr-2 text-gray-400" /> Deploy the new Prisma schema alongside the old `Space` table.</li>
                <li className="flex items-center"><ArrowRight className="w-4 h-4 mr-2 text-gray-400" /> Update the backend to write to BOTH the old `Space` table and the new `FeedItem` tables for any new creations.</li>
                <li className="flex items-center"><ArrowRight className="w-4 h-4 mr-2 text-gray-400" /> This ensures no data is lost during the migration window.</li>
              </ul>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="flex items-start">
            <div className="w-16 h-16 rounded-full bg-white border-4 border-indigo-100 flex items-center justify-center flex-shrink-0 relative z-10 shadow-sm">
              <span className="text-indigo-600 font-bold">Ph 2</span>
            </div>
            <div className="ml-6 pt-3">
              <h4 className="text-lg font-semibold text-gray-900">Heuristic Data Backfill (Script)</h4>
              <p className="text-sm text-gray-600 mt-2 mb-3">Run a background worker to process historical `Space` records:</p>
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs text-gray-300">
                <p>IF space.hasCoordinates == true THEN</p>
                <p className="pl-4 text-purple-400">Migrate to MultiItem</p>
                <p>ELSE IF space.hasFileAttachment == true THEN</p>
                <p className="pl-4 text-emerald-400">Migrate to DigitalProduct</p>
                <p>ELSE IF space.externalLink != null THEN</p>
                <p className="pl-4 text-blue-400">Migrate to SingleProduct</p>
                <p>ELSE</p>
                <p className="pl-4 text-gray-400">Migrate to SingleProduct (Default Fallback)</p>
              </div>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="flex items-start">
            <div className="w-16 h-16 rounded-full bg-white border-4 border-gray-100 flex items-center justify-center flex-shrink-0 relative z-10 shadow-sm">
              <span className="text-gray-500 font-bold">Ph 3</span>
            </div>
            <div className="ml-6 pt-3">
              <h4 className="text-lg font-semibold text-gray-900">Frontend Switch & Validation</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li className="flex items-center"><ArrowRight className="w-4 h-4 mr-2 text-gray-400" /> Switch the frontend to read exclusively from the new `FeedItem` tables.</li>
                <li className="flex items-center"><ArrowRight className="w-4 h-4 mr-2 text-gray-400" /> Monitor error rates and user reports.</li>
                <li className="flex items-center"><ArrowRight className="w-4 h-4 mr-2 text-gray-400" /> Provide a UI for creators to "Fix" any incorrectly migrated items.</li>
              </ul>
            </div>
          </div>

          {/* Phase 4 */}
          <div className="flex items-start">
            <div className="w-16 h-16 rounded-full bg-green-50 border-4 border-green-100 flex items-center justify-center flex-shrink-0 relative z-10 shadow-sm">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-6 pt-3">
              <h4 className="text-lg font-semibold text-gray-900">Deprecation</h4>
              <p className="text-sm text-gray-600 mt-2">
                Once validation is complete (e.g., 30 days post-switch), drop the legacy `Space` table and remove dual-writing logic from the codebase.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
