
'use client';

import { useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FrameCard } from '@/components/frame-card';
import { Frame, FrameVariation } from '@/lib/types';
import { ProductPreviewCard } from './product-preview-card';

interface FrameShapeGalleryDialogProps {
  shape: string;
  allFrames: Frame[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function FrameShapeGalleryDialog({
  shape,
  allFrames,
  isFavorite,
  toggleFavorite,
  isOpen,
  onClose,
}: FrameShapeGalleryDialogProps) {
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);

  const filteredFrames = useMemo(() => {
    if (!shape || !allFrames) return [];
    
    const flatFrames = allFrames.flatMap(frame => 
        (frame.variations && frame.variations.length > 0 ? frame.variations : [{...frame}]).map((variation: Frame | FrameVariation) => ({...frame, ...variation}))
    );

    return flatFrames.filter(frame => {
      const frameShape = frame.frameShape;
      if (Array.isArray(frameShape)) {
        return frameShape.some(s => s.toLowerCase() === shape.toLowerCase());
      }
      return frameShape?.toLowerCase() === shape.toLowerCase();
    });
  }, [shape, allFrames]);

  const handlePreview = (frame: Frame) => {
    setSelectedFrame(frame);
  }
  
  const handleClosePreview = () => {
    setSelectedFrame(null);
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl capitalize">
              '{shape}' Frames
            </DialogTitle>
            <DialogDescription>
              Showing {filteredFrames.length} frames from the catalog.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-full pr-6">
              {filteredFrames.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-4">
                      {filteredFrames.map((frame) => (
                      <FrameCard
                          key={frame.id}
                          frame={frame}
                          isFavorite={isFavorite}
                          toggleFavorite={toggleFavorite}
                          onPreview={handlePreview}
                      />
                      ))}
                  </div>
              ): (
                  <div className="flex flex-col items-center justify-center text-center py-20">
                      <h2 className="text-xl font-semibold">No '{shape}' frames found.</h2>
                      <p className="mt-2 text-muted-foreground">Please try another shape or update the catalog.</p>
                  </div>
              )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
      {selectedFrame && (
        <ProductPreviewCard
          frame={selectedFrame}
          isOpen={!!selectedFrame}
          onClose={handleClosePreview}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
        />
      )}
    </>
  );
}

    