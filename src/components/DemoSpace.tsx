import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Upload, ShoppingBag, Sparkles, MousePointerClick, X, Undo2 } from "lucide-react";

interface ProductDetails {
  title: string;
  description: string;
  category?: string;
  brand?: string;
}

interface MarkerData {
  id: string;
  x: number;
  y: number;
  details: ProductDetails;
}

interface HoverableObjectProps {
  marker: MarkerData;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const HoverableObject: React.FC<HoverableObjectProps> = ({ marker, isHovered, onMouseEnter, onMouseLeave }) => {
  return (
    <>
      {/* Invisible Hover Area */}
      <div
        className="absolute z-10 cursor-pointer -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${marker.x}%`,
          top: `${marker.y}%`,
          width: '40px',
          height: '40px',
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />

      {/* Round Bubble */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="absolute z-20 w-4 h-4 bg-white rounded-full shadow-[0_0_0_1px_rgba(0,0,0,0.1),0_2px_8px_rgba(0,0,0,0.2)] pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
        style={{
          left: `${marker.x}%`,
          top: `${marker.y}%`,
        }}
      >
        <div className="w-2 h-2 bg-charcoal rounded-full" />
      </motion.div>

      {/* Tooltip positioned at the marker */}
      <AnimatePresence>
        {isHovered && (
          <div
            className="absolute z-30 pointer-events-none"
            style={{
              left: `${marker.x}%`,
              top: `${marker.y}%`,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 bg-white/95 backdrop-blur-md p-5 rounded-xl shadow-2xl border border-white/40 pointer-events-auto"
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-2">
                <h3 className="font-serif font-medium text-sm leading-tight text-charcoal">{marker.details.title}</h3>
              </div>
              <p className="text-xs text-charcoal/70 font-sans mb-4 leading-relaxed">
                {marker.details.description}
              </p>
              <button className="w-full py-2.5 bg-charcoal text-alabaster text-xs font-medium rounded-lg flex items-center justify-center gap-2 shadow-sm hover:bg-charcoal/90 transition-colors">
                <ShoppingBag className="w-3.5 h-3.5" />
                Buy here
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export function DemoSpace() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (id: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredMarkerId(id);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredMarkerId(null);
    }, 100);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    setMarkers([]);
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewUrl || !file || !imageContainerRef.current) return;
    if (markers.length >= 3) return;
    
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newMarker: MarkerData = {
      id: Math.random().toString(36).substring(7),
      x,
      y,
      details: {
        title: "Your heading",
        description: "Your description"
      }
    };

    setMarkers(prev => [...prev, newMarker]);
    setHoveredMarkerId(newMarker.id);
  };

  const resetDemo = () => {
    setFile(null);
    setPreviewUrl(null);
    setMarkers([]);
  };

  const handleUndo = () => {
    setMarkers(prev => prev.slice(0, -1));
  };

  return (
    <section className="py-24 bg-white border-y border-black/5" id="demo">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Interactive Demo
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-charcoal mb-4">
            Tag Any Object
          </h2>
          <p className="text-lg text-charcoal/60 font-sans">
            Upload any photo. Click on any object, piece of clothing, or product to instantly generate an aesthetic description and shoppable link.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {!previewUrl ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-video md:aspect-[21/9] rounded-2xl border-2 border-dashed border-black/10 hover:border-terracotta/50 bg-alabaster transition-colors cursor-pointer flex flex-col items-center justify-center p-8 text-center"
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-terracotta" />
              </div>
              <h3 className="font-serif font-medium text-lg text-charcoal mb-2">Upload a Photo</h3>
              <p className="text-sm text-charcoal/50 font-sans max-w-[300px]">
                Drop a photo of a room, outfit, or product here or click to browse.
              </p>
            </div>
          ) : (
            <div className="relative flex flex-col items-center">
              <div className="w-full flex justify-between items-center mb-4 px-2">
                <div className="flex items-center gap-2 text-sm font-medium text-charcoal/70 bg-alabaster px-4 py-2 rounded-full border border-black/5">
                  <MousePointerClick className="w-4 h-4 text-terracotta" />
                  {markers.length === 0 
                    ? "Click anywhere on the image to tag an item" 
                    : markers.length >= 3 
                      ? "Maximum 3 tags reached. Try hovering over them!"
                      : `Click to tag more items (${3 - markers.length} left). Try hovering over the tags!`}
                </div>
                <div className="flex items-center gap-2">
                  {markers.length > 0 && (
                    <button 
                      onClick={handleUndo}
                      className="flex items-center gap-2 text-sm font-medium text-charcoal/70 hover:text-charcoal transition-colors px-4 py-2 rounded-full hover:bg-black/5"
                    >
                      <Undo2 className="w-4 h-4" />
                      Undo
                    </button>
                  )}
                  <button 
                    onClick={resetDemo}
                    className="flex items-center gap-2 text-sm font-medium text-charcoal/70 hover:text-charcoal transition-colors px-4 py-2 rounded-full hover:bg-black/5"
                  >
                    <X className="w-4 h-4" />
                    Start Over
                  </button>
                </div>
              </div>
              
              <div 
                ref={imageContainerRef}
                className="relative w-full rounded-2xl shadow-2xl border border-black/5 cursor-crosshair group"
                onClick={handleImageClick}
              >
                <img 
                  src={previewUrl} 
                  alt="Uploaded image" 
                  className="w-full h-auto max-h-[70vh] object-contain bg-[#F5F5F0] rounded-2xl"
                  draggable={false}
                />
                
                {/* Render Markers */}
                {markers.map((marker) => (
                  <HoverableObject
                    key={marker.id}
                    marker={marker}
                    isHovered={hoveredMarkerId === marker.id}
                    onMouseEnter={() => handleMouseEnter(marker.id)}
                    onMouseLeave={handleMouseLeave}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
