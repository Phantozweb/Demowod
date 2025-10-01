'use client';

import Image from 'next/image';
import { frames } from '@/lib/frames';
import { useFavorites } from '@/hooks/use-favorites';
import { FrameCard } from '@/components/frame-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function CatalogPage() {
  const { isFavorite, toggleFavorite, isInitialized } = useFavorites();
  const [heroFrame, ...otherFrames] = frames;
  const heroImage = PlaceHolderImages.find((img) => img.id === heroFrame.imageId);

  return (
    <div className="grid h-svh grid-cols-1 lg:grid-cols-2">
      <div className="relative flex flex-col justify-end p-8 text-white bg-secondary">
        {heroImage && (
           <Image
              src={heroImage.imageUrl}
              alt={heroFrame.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              data-ai-hint={heroImage.imageHint}
              priority
            />
        )}
        <div className="relative z-10 bg-gradient-to-t from-black/80 via-black/50 to-transparent -mx-8 -mb-8 px-8 pb-8 pt-20">
          <h1 className="text-4xl md:text-5xl font-headline font-bold drop-shadow-md">
            {heroFrame.name}
          </h1>
          <p className="text-xl text-white/90 mt-2 drop-shadow-sm">{heroFrame.brand}</p>
          <p className="mt-4 max-w-lg text-white/80">
            Discover our curated collection of high-quality frames, designed to fit your unique style and personality.
          </p>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="p-4 md:p-8 border-b">
          <h2 className="text-2xl font-headline font-bold">Our Collection</h2>
          <p className="text-muted-foreground mt-1">Browse all {frames.length} available styles.</p>
        </header>
        <ScrollArea className="flex-1">
          <div className="p-4 md:p-8">
            {isInitialized ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
                {otherFrames.map((frame) => (
                  <FrameCard
                    key={frame.id}
                    frame={frame}
                    isFavorite={isFavorite}
                    toggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
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
        </ScrollArea>
      </div>
    </div>
  );
}
