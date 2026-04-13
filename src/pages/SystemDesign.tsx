import React, { useState } from 'react';
import { Database, FolderTree, PenTool, LayoutGrid, ArrowRightLeft } from 'lucide-react';
import { Architecture } from '../components/system-design/Architecture';
import { Taxonomy } from '../components/system-design/Taxonomy';
import { CreationFlows } from '../components/system-design/CreationFlows';
import { UnifiedFeed } from '../components/system-design/UnifiedFeed';
import { Migration } from '../components/system-design/Migration';
import { cn } from '../lib/utils';

type Tab = 'architecture' | 'taxonomy' | 'creation' | 'feed' | 'migration';

export default function SystemDesign() {
  const [activeTab, setActiveTab] = useState<Tab>('architecture');

  const tabs = [
    { id: 'architecture', label: '1. Architecture', icon: Database },
    { id: 'taxonomy', label: '2. Taxonomy', icon: FolderTree },
    { id: 'creation', label: '3. Creation Flows', icon: PenTool },
    { id: 'feed', label: '4. Unified Feed', icon: LayoutGrid },
    { id: 'migration', label: '5. Migration', icon: ArrowRightLeft },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-900 pt-16">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-tight text-gray-900">System Design</h1>
          <p className="text-sm text-gray-500 mt-1">Content Architecture Refactor</p>
        </div>
        <nav className="px-4 pb-6 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-indigo-50 text-indigo-700" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-indigo-700" : "text-gray-400")} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-6 md:p-10">
          {activeTab === 'architecture' && <Architecture />}
          {activeTab === 'taxonomy' && <Taxonomy />}
          {activeTab === 'creation' && <CreationFlows />}
          {activeTab === 'feed' && <UnifiedFeed />}
          {activeTab === 'migration' && <Migration />}
        </div>
      </main>
    </div>
  );
}
