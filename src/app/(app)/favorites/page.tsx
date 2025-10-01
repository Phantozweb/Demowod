'use client';

import { frames } from '@/lib/frames';
import { useFavorites } from '@/hooks/use-favorites';
import { FrameCard } from '@/components/frame-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function FavoritesPage() {
  const { favorites, isFavorite, toggleFavorite, isInitialized } = useFavorites();
  const favoriteFrames = frames.filter((frame) => favorites.includes(frame.id));

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-headline font-bold">Your Favorites</h1>
        <p className="text-muted-foreground mt-2">The frames you love, all in one place.</p>
      </header>
      
      {isInitialized && favoriteFrames.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favoriteFrames.map((frame) => (
            <FrameCard
              key={frame.id}
              frame={frame}
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}

      {isInitialized && favoriteFrames.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold">Your favorites list is empty.</h2>
            <p className="mt-2 text-muted-foreground">Browse our catalog to find frames you love!</p>
            <Button asChild className="mt-6" variant="default">
                <Link href="/catalog">Explore Catalog</Link>
            </Button>
        </div>
      )}

      {!isInitialized && <p>Loading favorites...</p>}
    </div>
  );
}
