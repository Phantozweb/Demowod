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
         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
        <p>Loading frames...</p>
      )}
    </div>
  );
}
