'use client';

import { frames } from '@/lib/frames';
import { useFavorites } from '@/hooks/use-favorites';
import { FrameCard } from '@/components/frame-card';

export default function CatalogPage() {
  const { isFavorite, toggleFavorite, isInitialized } = useFavorites();

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-headline font-bold">Product Catalog</h1>
        <p className="text-muted-foreground mt-2">Browse our collection of stylish frames.</p>
      </header>

      {isInitialized ? (
         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {frames.map((frame) => (
            <FrameCard
              key={frame.id}
              frame={frame}
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
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
      )}
    </div>
  );
}
