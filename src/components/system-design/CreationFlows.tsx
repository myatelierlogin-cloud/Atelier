import React, { useState } from 'react';
import { Package, Image as ImageIcon, FileDown, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export function CreationFlows() {
  const [activeFlow, setActiveFlow] = useState<'single' | 'multi' | 'digital'>('single');

  const flows = {
    single: {
      title: 'Single Product Flow',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      steps: [
        { title: 'Upload Image', desc: 'User uploads a single, high-quality image of the product.' },
        { title: 'Product Details', desc: 'Enter Title, Description, and Brand.' },
        { title: 'Pricing & Link', desc: 'Input the price and the external affiliate/store link.' },
        { title: 'Categorization', desc: 'Select Category from the unified taxonomy and add Tags.' },
        { title: 'Publish', desc: 'Item is saved as a SingleProduct and added to the Feed.' }
      ]
    },
    multi: {
      title: 'Taggable Multi-item Flow',
      icon: ImageIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      steps: [
        { title: 'Upload Base Image', desc: 'User uploads the main lookbook or room photo.' },
        { title: 'Details & Category', desc: 'Enter Title, Description, Category, and Tags for the overall image.' },
        { title: 'Hotspot Tagging UI', desc: 'User clicks on the image to drop pins (X/Y coordinates).' },
        { title: 'Link Products', desc: 'For each pin, user searches existing Single Products or adds a quick external link/price.' },
        { title: 'Publish', desc: 'Item is saved as a MultiItem with associated Hotspots.' }
      ]
    },
    digital: {
      title: 'Digital Product Flow',
      icon: FileDown,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      steps: [
        { title: 'Upload Digital File', desc: 'User uploads the PDF, ZIP, or enters a secure access link.' },
        { title: 'Upload Cover Image', desc: 'Upload a visual representation of the digital good.' },
        { title: 'Details & Category', desc: 'Enter Title, Description, Category, and Tags.' },
        { title: 'Pricing & Stripe', desc: 'Set the price. Connect/verify Stripe account for direct payouts.' },
        { title: 'Publish', desc: 'Item is saved as a DigitalProduct. File is secured behind a paywall.' }
      ]
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">3. Creation Flows (UX/UI Logic)</h2>
        <p className="mt-2 text-gray-600">
          Each content type has a distinct, optimized creation journey. By separating them, we remove the confusion of the legacy "catch-all" Space model and ensure strict data validation at each step.
        </p>
      </div>

      <div className="flex space-x-4 border-b border-gray-200 pb-4">
        {(Object.keys(flows) as Array<keyof typeof flows>).map((key) => {
          const flow = flows[key];
          const Icon = flow.icon;
          const isActive = activeFlow === key;
          return (
            <button
              key={key}
              onClick={() => setActiveFlow(key)}
              className={cn(
                "flex items-center px-4 py-2 rounded-lg font-medium transition-all",
                isActive ? `${flow.bgColor} ${flow.color} border ${flow.borderColor}` : "text-gray-500 hover:bg-gray-100 border border-transparent"
              )}
            >
              <Icon className="w-4 h-4 mr-2" />
              {flow.title}
            </button>
          );
        })}
      </div>

      <div className="relative">
        <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-gray-200" />
        <div className="space-y-6 relative">
          {flows[activeFlow].steps.map((step, index) => (
            <div key={index} className="flex items-start">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-white relative z-10",
                flows[activeFlow].bgColor, flows[activeFlow].color
              )}>
                {index === flows[activeFlow].steps.length - 1 ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span className="font-bold">{index + 1}</span>
                )}
              </div>
              <div className="ml-6 pt-2">
                <h4 className="text-lg font-semibold text-gray-900">{step.title}</h4>
                <p className="text-gray-600 mt-1">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
