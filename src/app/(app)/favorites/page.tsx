
'use client';

import { useState, useEffect } from 'react';
import { useFavorites } from '@/hooks/use-favorites';
import { FrameCard } from '@/components/frame-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Frame, FrameVariation } from '@/lib/types';

export default function FavoritesPage() {
  const { favorites, isFavorite, toggleFavorite, isInitialized } = useFavorites();
  const [allFrames, setAllFrames] = useState<Frame[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFrames = async () => {
      try {
        const [fullRimRes, halfRimRes, rimlessRes, squareRes, rectangleRes, roundRes] = await Promise.all([
          fetch('/fullrim-frames.json'),
          fetch('/halfrim-frames.json'),
          fetch('/rimless-frames.json'),
          fetch('/square-frames.json'),
          fetch('/rectangle-frames.json'),
          fetch('/round-frames.json'),
        ]);
        const fullRimData = (await fullRimRes.json()).map((frame: Frame) => ({ ...frame, frameType: 'full rim' }));
        const halfRimData = (await halfRimRes.json()).map((frame: Frame) => ({ ...frame, frameType: 'half rim' }));
        const rimlessData = (await rimlessRes.json()).map((frame: Frame) => ({ ...frame, frameType: 'rimless' }));
        const squareData = (await squareRes.json()).map((frame: Frame) => ({ ...frame, frameShape: 'square' }));
        const rectangleData = (await rectangleRes.json()).map((frame: Frame) => ({ ...frame, frameShape: 'rectangle' }));
        const roundData = (await roundRes.json()).map((frame: Frame) => ({ ...frame, frameShape: 'round' }));
        
        setAllFrames([...fullRimData, ...halfRimData, ...rimlessData, ...squareData, ...rectangleData, ...roundData]);
      } catch (error) {
        console.error('Failed to fetch frames data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFrames();
  }, []);

  const flatFrames = allFrames.flatMap(frame => 
    (frame.variations && frame.variations.length > 0 ? frame.variations : [{...frame}]).map((variation: Frame | FrameVariation) => ({...frame, ...variation}))
  );

  const favoriteFrames = flatFrames.filter((frame) => favorites.includes(frame.id));

  const renderContent = () => {
     if (isLoading || !isInitialized) {
      return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 3 }).map((_, i) => (
             <div key={i} className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="relative aspect-[16/10] w-full bg-muted animate-pulse"></div>
                <div className="flex-1 p-4">
                    <div className="mb-1 text-lg font-headline h-6 w-3/4 bg-muted animate-pulse rounded"></div>
                    <div className="h-4 w-1/2 bg-muted animate-pulse rounded mt-2"></div>
                    <div className="h-4 w-1/3 bg-muted animate-pulse rounded mt-2"></div>
                </div>
                <div className="flex items-center justify-between p-4 pt-0">
                  <div className="h-7 w-16 bg-muted animate-pulse rounded"></div>
                  <div className="h-10 w-10 bg-muted animate-pulse rounded-full"></div>
                </div>
            </div>
          ))}
        </div>
      );
    }
    
    if (favoriteFrames.length > 0) {
        return (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {favoriteFrames.map((frame) => (
                <FrameCard
                    key={frame.id}
                    frame={frame}
                    isFavorite={isFavorite}
                    toggleFavorite={toggleFavorite}
                />
                ))}
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold">Your favorites list is empty.</h2>
            <p className="mt-2 text-muted-foreground">Browse our catalog to find frames you love!</p>
            <Button asChild className="mt-6" variant="default">
                <Link href="/catalog">Explore Catalog</Link>
            </Button>
        </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-headline font-bold">Your Favorites</h1>
        <p className="text-muted-foreground mt-2">
          A collection of your most-loved frames.
        </p>
      </header>
      {renderContent()}
    </div>
  );
}
