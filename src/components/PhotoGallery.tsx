import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PhotoGalleryProps {
  images: string[];
  name: string;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ images, name }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const fallbackImage = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop";
  
  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
  };
  
  const getImageSrc = (index: number) => {
    return imageErrors.has(index) ? fallbackImage : images[index];
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'Escape' && lightboxOpen) setLightboxOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, currentIndex]);

  const visibleThumbs = 8;
  const startThumb = Math.max(0, Math.min(currentIndex - Math.floor(visibleThumbs / 2), images.length - visibleThumbs));

  return (
    <>
      <div className="w-full space-y-2">
        {/* Main Image */}
        <div className="relative aspect-[24/9] w-full overflow-hidden rounded-lg bg-muted">
          <img
            src={getImageSrc(currentIndex)}
            alt={`${name} - Image ${currentIndex + 1}`}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setLightboxOpen(true)}
            loading={currentIndex === 0 ? 'eager' : 'lazy'}
            onError={() => handleImageError(currentIndex)}
          />
          
          {/* Navigation Arrows */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
            onClick={goToNext}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Image Counter */}
          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
            Image {currentIndex + 1} of {images.length}
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="flex gap-1.5 overflow-x-auto snap-x snap-mandatory pb-1">
          {images.slice(startThumb, startThumb + visibleThumbs).map((img, idx) => {
            const actualIndex = startThumb + idx;
            return (
              <button
                key={actualIndex}
                onClick={() => setCurrentIndex(actualIndex)}
                className={`flex-shrink-0 w-16 h-10 rounded overflow-hidden snap-start transition-all ${
                  actualIndex === currentIndex
                    ? 'ring-2 ring-primary opacity-100'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={getImageSrc(actualIndex)}
                  alt={`Thumbnail ${actualIndex + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={() => handleImageError(actualIndex)}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Lightbox with accessibility */}
      {lightboxOpen && (
        <div 
          role="dialog" 
          aria-modal="true" 
          aria-label={`Photo gallery for ${name}`}
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close gallery"
          >
            <X className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <img
            src={getImageSrc(currentIndex)}
            alt={`${name} - Image ${currentIndex + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onError={() => handleImageError(currentIndex)}
          />

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
            onClick={goToNext}
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-3 py-1.5 rounded">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
};
