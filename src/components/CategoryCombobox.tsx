import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export const CATEGORIES = [
  {
    group: "Fashion",
    items: ["Womenswear", "Menswear", "Shoes", "Accessories", "Jewelry", "Bags", "Activewear"].map(i => `Fashion - ${i}`)
  },
  {
    group: "Beauty",
    items: ["Makeup", "Skincare", "Haircare", "Fragrance", "Bath & Body", "Tools & Devices"].map(i => `Beauty - ${i}`)
  },
  {
    group: "Home",
    items: ["Furniture", "Home Decor", "Kitchen & Dining", "Bed & Bath", "Outdoor", "Art"].map(i => `Home - ${i}`)
  },
  {
    group: "Tech & Desk",
    items: ["Audio & Vinyl", "Desk Accessories", "Computers", "Photography", "Smart Home"].map(i => `Tech & Desk - ${i}`)
  },
  {
    group: "Lifestyle",
    items: ["Fitness & Wellness", "Books", "Travel", "Pets", "Food & Drink"].map(i => `Lifestyle - ${i}`)
  }
];

const ALL_CATEGORIES = CATEGORIES.flatMap(g => g.items);

interface CategoryComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

export function CategoryCombobox({ value, onChange }: CategoryComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        if (!ALL_CATEGORIES.includes(inputValue)) {
          setInputValue(value || "");
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inputValue, value]);

  const filteredCategories = CATEGORIES.map(group => ({
    group: group.group,
    items: group.items.filter(item => item.toLowerCase().includes(inputValue.toLowerCase()))
  })).filter(group => group.items.length > 0);

  const flatFilteredItems = filteredCategories.flatMap(g => g.items);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      setHighlightedIndex(prev => (prev < flatFilteredItems.length - 1 ? prev + 1 : prev));
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
      e.preventDefault();
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < flatFilteredItems.length) {
        const selected = flatFilteredItems[highlightedIndex];
        setInputValue(selected);
        onChange(selected);
        setIsOpen(false);
      } else if (flatFilteredItems.length === 1) {
        setInputValue(flatFilteredItems[0]);
        onChange(flatFilteredItems[0]);
        setIsOpen(false);
      } else if (!ALL_CATEGORIES.includes(inputValue)) {
        setInputValue(value || "");
        setIsOpen(false);
      }
      e.preventDefault();
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setInputValue(value || "");
      e.preventDefault();
    }
  };

  const handleSelect = (item: string) => {
    setInputValue(item);
    onChange(item);
    setIsOpen(false);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // If the new focus target is inside the container (like the button), ignore
    if (containerRef.current && containerRef.current.contains(e.relatedTarget as Node)) {
      return;
    }
    
    // We handle blur mostly in click outside to allow clicking dropdown items
    // But if they tab away, we should validate
    setTimeout(() => {
      if (containerRef.current && !containerRef.current.contains(document.activeElement)) {
        // Use the current input value from the DOM to avoid stale state
        const currentVal = inputRef.current?.value || "";
        if (!ALL_CATEGORIES.includes(currentVal)) {
          setInputValue(value || "");
        }
      }
    }, 0);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder="Select a category..."
          className="w-full px-3 py-2 bg-alabaster border border-black/5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta pr-10 text-charcoal"
        />
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) inputRef.current?.focus();
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-charcoal/50 hover:text-charcoal"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-black/5 rounded-lg shadow-lg max-h-60 overflow-y-auto py-1">
          {filteredCategories.length === 0 ? (
            <div className="px-3 py-2 text-sm text-charcoal/50">No categories found</div>
          ) : (
            filteredCategories.map((group) => (
              <div key={group.group}>
                <div className="px-3 py-1.5 text-xs font-semibold text-charcoal/40 uppercase tracking-wider bg-alabaster/50">
                  {group.group}
                </div>
                {group.items.map((item) => {
                  const index = flatFilteredItems.indexOf(item);
                  const isHighlighted = index === highlightedIndex;
                  const isSelected = item === value;

                  return (
                    <div
                      key={item}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between ${
                        isHighlighted ? 'bg-terracotta/10 text-terracotta' : 'text-charcoal hover:bg-alabaster'
                      }`}
                    >
                      <span>{item.split(' - ')[1]}</span>
                      {isSelected && <Check className="w-4 h-4 text-terracotta" />}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
