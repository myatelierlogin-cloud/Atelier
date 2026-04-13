import React from 'react';
import { Database, Table, Key, Link as LinkIcon } from 'lucide-react';

export function Architecture() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">1. Database Schema & Architecture</h2>
        <p className="mt-2 text-gray-600">
          We use a <strong>Base Table + Child Tables (Polymorphic)</strong> approach. The `FeedItem` table acts as the base, holding all shared attributes (title, cover image, creator, timestamps, category). The specialized tables (`SingleProduct`, `MultiItem`, `DigitalProduct`) hold type-specific data and link back to the `FeedItem` via a 1:1 relationship.
        </p>
      </div>

      <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg">
        <div className="flex items-center px-4 py-3 bg-gray-800 border-b border-gray-700">
          <Database className="w-5 h-5 text-indigo-400 mr-2" />
          <span className="text-sm font-medium text-gray-200">Prisma Schema (PostgreSQL)</span>
        </div>
        <div className="p-4 overflow-x-auto">
          <pre className="text-sm text-gray-300 font-mono leading-relaxed">
            <code dangerouslySetInnerHTML={{ __html: prismaSchema }} />
          </pre>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
            <Table className="w-5 h-5 mr-2 text-indigo-600" />
            Why this approach?
          </h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 mr-2 flex-shrink-0" />
              <strong>Unified Querying:</strong> Fetching the creator's feed is a single query on the `FeedItem` table, optionally including the specific child relations.
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 mr-2 flex-shrink-0" />
              <strong>Strict Validation:</strong> Each child table enforces its own required fields at the database level (e.g., DigitalProduct must have a fileUrl).
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 mr-2 flex-shrink-0" />
              <strong>Scalability:</strong> Adding a 4th type in the future just requires a new child table, without polluting a massive catch-all table.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const prismaSchema = `
<span class="text-purple-400">model</span> <span class="text-blue-300">FeedItem</span> {
  id          <span class="text-green-300">String</span>   <span class="text-gray-400">@id @default(cuid())</span>
  creatorId   <span class="text-green-300">String</span>
  type        <span class="text-green-300">SpaceType</span> <span class="text-gray-500">// SINGLE_PRODUCT, MULTI_ITEM, DIGITAL_PRODUCT</span>
  title       <span class="text-green-300">String</span>
  description <span class="text-green-300">String?</span>
  coverImage  <span class="text-green-300">String</span>
  createdAt   <span class="text-green-300">DateTime</span> <span class="text-gray-400">@default(now())</span>
  updatedAt   <span class="text-green-300">DateTime</span> <span class="text-gray-400">@updatedAt</span>

  <span class="text-gray-500">// Taxonomy</span>
  categoryId  <span class="text-green-300">String</span>
  category    <span class="text-blue-300">Category</span> <span class="text-gray-400">@relation(fields: [categoryId], references: [id])</span>
  tags        <span class="text-blue-300">Tag[]</span>

  <span class="text-gray-500">// Relations to specific types</span>
  singleProduct  <span class="text-blue-300">SingleProduct?</span>
  multiItem      <span class="text-blue-300">MultiItem?</span>
  digitalProduct <span class="text-blue-300">DigitalProduct?</span>
}

<span class="text-purple-400">enum</span> <span class="text-blue-300">SpaceType</span> {
  SINGLE_PRODUCT
  MULTI_ITEM
  DIGITAL_PRODUCT
}

<span class="text-purple-400">model</span> <span class="text-blue-300">SingleProduct</span> {
  id          <span class="text-green-300">String</span>   <span class="text-gray-400">@id @default(cuid())</span>
  feedItemId  <span class="text-green-300">String</span>   <span class="text-gray-400">@unique</span>
  feedItem    <span class="text-blue-300">FeedItem</span> <span class="text-gray-400">@relation(fields: [feedItemId], references: [id], onDelete: Cascade)</span>
  
  price       <span class="text-green-300">Float?</span>
  currency    <span class="text-green-300">String?</span>
  externalUrl <span class="text-green-300">String?</span>
  brand       <span class="text-green-300">String?</span>
}

<span class="text-purple-400">model</span> <span class="text-blue-300">MultiItem</span> {
  id          <span class="text-green-300">String</span>   <span class="text-gray-400">@id @default(cuid())</span>
  feedItemId  <span class="text-green-300">String</span>   <span class="text-gray-400">@unique</span>
  feedItem    <span class="text-blue-300">FeedItem</span> <span class="text-gray-400">@relation(fields: [feedItemId], references: [id], onDelete: Cascade)</span>
  
  hotspots    <span class="text-blue-300">Hotspot[]</span>
}

<span class="text-purple-400">model</span> <span class="text-blue-300">Hotspot</span> {
  id          <span class="text-green-300">String</span>   <span class="text-gray-400">@id @default(cuid())</span>
  multiItemId <span class="text-green-300">String</span>
  multiItem   <span class="text-blue-300">MultiItem</span> <span class="text-gray-400">@relation(fields: [multiItemId], references: [id], onDelete: Cascade)</span>
  
  xCoordinate <span class="text-green-300">Float</span>
  yCoordinate <span class="text-green-300">Float</span>
  
  <span class="text-gray-500">// Link to a product</span>
  productId   <span class="text-green-300">String?</span>
  externalUrl <span class="text-green-300">String?</span>
  title       <span class="text-green-300">String</span>
  price       <span class="text-green-300">Float?</span>
}

<span class="text-purple-400">model</span> <span class="text-blue-300">DigitalProduct</span> {
  id          <span class="text-green-300">String</span>   <span class="text-gray-400">@id @default(cuid())</span>
  feedItemId  <span class="text-green-300">String</span>   <span class="text-gray-400">@unique</span>
  feedItem    <span class="text-blue-300">FeedItem</span> <span class="text-gray-400">@relation(fields: [feedItemId], references: [id], onDelete: Cascade)</span>
  
  price       <span class="text-green-300">Float</span>
  currency    <span class="text-green-300">String</span>   <span class="text-gray-400">@default("USD")</span>
  fileUrl     <span class="text-green-300">String</span>
  fileType    <span class="text-green-300">String</span>   <span class="text-gray-500">// e.g., "application/pdf"</span>
  fileSize    <span class="text-green-300">Int</span>      <span class="text-gray-500">// in bytes</span>
}
`.trim();
