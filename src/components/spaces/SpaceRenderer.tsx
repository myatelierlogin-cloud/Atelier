import React from "react";
import { Space, SingleItemSpace, TaggableItemSpace, DigitalItemSpace } from "../../types/spaces";

const SingleItemView = ({ space }: { space: SingleItemSpace }) => {
  const { title, description, affiliateLink } = space.content;
  
  return (
    <div className="p-6 border border-black/10 rounded-2xl bg-white shadow-sm flex flex-col h-full">
      <div className="flex-1">
        <h3 className="text-xl font-serif font-medium text-charcoal mb-2">{title}</h3>
        {description && <p className="text-sm text-charcoal/70 mb-4">{description}</p>}
      </div>
      {affiliateLink && (
        <a 
          href={affiliateLink} 
          target="_blank" 
          rel="noreferrer" 
          className="mt-4 w-full py-3 bg-charcoal text-white text-center rounded-xl font-medium hover:bg-charcoal/90 transition-colors"
        >
          Shop Now
        </a>
      )}
    </div>
  );
};

const TaggedImageView = ({ space }: { space: TaggableItemSpace }) => {
  const { title, description, imageUrl, taggedItems } = space.content;

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm border border-black/10 bg-white flex flex-col h-full">
      <div className="relative w-full aspect-[4/5] bg-black/5">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover" 
        />
        {taggedItems.map((item) => (
          <div
            key={item.itemId}
            className="absolute w-6 h-6 bg-white/90 backdrop-blur rounded-full shadow-lg cursor-pointer -translate-x-1/2 -translate-y-1/2 flex items-center justify-center border border-black/10 hover:scale-110 transition-transform group"
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
          >
            <div className="w-2 h-2 rounded-full bg-charcoal"></div>
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] bg-charcoal text-white text-xs p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <p className="font-medium truncate">{item.title}</p>
              {item.price && <p className="opacity-80">{item.price}</p>}
            </div>
          </div>
        ))}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-serif font-medium text-charcoal mb-1">{title}</h3>
        {description && <p className="text-sm text-charcoal/70 line-clamp-2">{description}</p>}
      </div>
    </div>
  );
};

const DigitalItemView = ({ space }: { space: DigitalItemSpace }) => {
  const { title, description, price, thumbnailUrl, digitalAssetUrl } = space.content;

  return (
    <div className="p-5 border border-black/10 rounded-2xl bg-white shadow-sm flex gap-5 h-full items-start">
      {thumbnailUrl ? (
        <img 
          src={thumbnailUrl} 
          alt={title} 
          className="w-24 h-24 rounded-xl object-cover shrink-0 border border-black/5" 
        />
      ) : (
        <div className="w-24 h-24 rounded-xl bg-black/5 flex items-center justify-center shrink-0 border border-black/5">
          <span className="text-xs text-charcoal/40 uppercase tracking-wider">Asset</span>
        </div>
      )}
      <div className="flex-1 min-w-0 flex flex-col h-full">
        <h3 className="text-lg font-serif font-medium text-charcoal mb-1 truncate">{title}</h3>
        {description && <p className="text-sm text-charcoal/70 line-clamp-2 mb-3">{description}</p>}
        
        <div className="mt-auto flex items-center justify-between gap-3">
          <span className="font-medium text-charcoal">{price ? `${price}` : 'Free'}</span>
          <a 
            href={digitalAssetUrl} 
            target="_blank" 
            rel="noreferrer" 
            className="px-4 py-2 bg-terracotta text-white rounded-lg text-sm font-medium hover:bg-terracotta-dark transition-colors whitespace-nowrap"
          >
            Download
          </a>
        </div>
      </div>
    </div>
  );
};

/**
 * SpaceRenderer acts as a switch-case router.
 * It reads space.type and renders the correct UI component.
 */
export const SpaceRenderer = ({ space }: { space: Space }) => {
  switch (space.type) {
    case "SINGLE_ITEM_SPACE":
      return <SingleItemView space={space} />;
    case "TAGGABLE_ITEM_SPACE":
      return <TaggedImageView space={space} />;
    case "DIGITAL_ITEM_SPACE":
      return <DigitalItemView space={space} />;
    default:
      // Fallback for unknown types (future-proofing)
      return (
        <div className="p-6 border border-red-200 bg-red-50 text-red-600 rounded-2xl text-sm">
          Unsupported Space Type. Please update your app.
        </div>
      );
  }
};
