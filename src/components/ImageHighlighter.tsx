import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Upload, Sparkles } from 'lucide-react';

interface Vertex {
  x: number;
  y: number;
}

interface DetectedObject {
  id: string;
  name: string;
  confidence: number;
  boundingBox: {
    vertices: Vertex[];
  };
}

export default function ImageHighlighter() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const [activeObjectId, setActiveObjectId] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
    setDetectedObjects([]);
    setIsProcessing(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/detect-objects', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to detect objects');
      }

      const data = await response.json() as any;
      setDetectedObjects(data.objects || []);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleObjectClick = (objectId: string, objectName: string, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation(); // Prevent container click from clearing active state
    setActiveObjectId(objectId);
    console.log(`Clicked on object: ${objectId} (${objectName})`);
    // Placeholder for opening a modal to attach an affiliate link
    // alert(`Selected: ${objectName}. You can now attach an affiliate link.`);
  };

  // Helper to convert normalized coordinates (0-1) to SVG percentages (0-100)
  const getPolygonPoints = (vertices: Vertex[]) => {
    return vertices.map(v => `${v.x * 100},${v.y * 100}`).join(' ');
  };

  // Clear active object when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveObjectId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-6">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-serif font-medium text-gray-900 mb-2">Interactive Storefront</h2>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          Upload a lifestyle photo. We'll automatically detect items so you can tag them with affiliate links.
        </p>
      </div>

      {!imageUrl ? (
        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center hover:bg-gray-50 transition-colors cursor-pointer relative group">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
              <Upload className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Click or drag to upload</p>
              <p className="text-xs text-gray-500 mt-1">High-quality JPEG or PNG</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div 
            ref={containerRef}
            className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-gray-100 border border-black/5"
            onClick={() => setActiveObjectId(null)} // Click background to clear selection
          >
            {/* Base Image */}
            <img
              src={imageUrl}
              alt="Uploaded lifestyle"
              className="w-full h-auto object-contain block"
            />

            {/* Processing Overlay */}
            {isProcessing && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                <Loader2 className="w-8 h-8 text-gray-900 animate-spin mb-3" />
                <p className="text-sm font-medium text-gray-900">Analyzing image...</p>
                <p className="text-xs text-gray-500 mt-1">Detecting objects and garments</p>
              </div>
            )}

            {/* SVG Overlay for Interactive Highlights */}
            {!isProcessing && detectedObjects.length > 0 && (
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-10"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{ overflow: 'visible' }}
              >
                <defs>
                  {/* Premium Soft Glow Filter */}
                  <filter id="premium-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {detectedObjects.map((obj) => {
                  const isActive = activeObjectId === obj.id;
                  
                  // Calculate center for tooltip
                  const minX = Math.min(...obj.boundingBox.vertices.map(v => v.x));
                  const maxX = Math.max(...obj.boundingBox.vertices.map(v => v.x));
                  const minY = Math.min(...obj.boundingBox.vertices.map(v => v.y));
                  const centerX = (minX + maxX) / 2;
                  
                  return (
                    <g key={obj.id} className="pointer-events-auto">
                      <polygon
                        points={getPolygonPoints(obj.boundingBox.vertices)}
                        className={`
                          transition-all duration-300 ease-out cursor-pointer
                          hover:fill-white/20 hover:stroke-white/90 hover:stroke-[0.8]
                          ${isActive 
                            ? 'fill-white/25 stroke-white stroke-[1]' 
                            : 'fill-transparent stroke-transparent stroke-[0.5]'
                          }
                        `}
                        style={{
                          filter: isActive ? 'url(#premium-glow)' : 'none',
                          vectorEffect: 'non-scaling-stroke'
                        }}
                        onMouseEnter={() => !activeObjectId && setActiveObjectId(obj.id)}
                        onMouseLeave={() => !activeObjectId && setActiveObjectId(null)}
                        onClick={(e) => handleObjectClick(obj.id, obj.name, e)}
                        onTouchStart={(e) => handleObjectClick(obj.id, obj.name, e)}
                      />
                      
                      {/* Premium Tooltip/Label */}
                      {isActive && (
                        <foreignObject
                          x={`${centerX * 100 - 15}`} // Center horizontally (approx 30 width)
                          y={`${minY * 100 - 12}`} // Position above the object
                          width="30"
                          height="15"
                          className="overflow-visible pointer-events-none"
                        >
                          <div className="flex flex-col items-center transform -translate-y-full">
                            <div className="bg-white/90 backdrop-blur-md text-gray-900 text-[10px] md:text-xs px-3 py-1.5 rounded-full shadow-xl border border-white/20 flex items-center gap-1.5 whitespace-nowrap font-medium">
                              <Sparkles className="w-3 h-3 text-gray-500" />
                              {obj.name}
                            </div>
                            {/* Tooltip pointer */}
                            <div className="w-2 h-2 bg-white/90 rotate-45 -mt-1 shadow-sm border-r border-b border-white/20"></div>
                          </div>
                        </foreignObject>
                      )}
                    </g>
                  );
                })}
              </svg>
            )}
          </div>

          <div className="flex justify-between items-center px-2">
            <p className="text-xs text-gray-500">
              {detectedObjects.length > 0 
                ? `Detected ${detectedObjects.length} items. Tap to tag.` 
                : 'Ready to analyze.'}
            </p>
            <button
              onClick={() => {
                setImageFile(null);
                setImageUrl(null);
                setDetectedObjects([]);
                setActiveObjectId(null);
              }}
              className="text-xs font-medium text-gray-900 hover:text-gray-600 transition-colors"
            >
              Upload New Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
