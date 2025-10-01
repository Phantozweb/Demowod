'use client';

import Image from 'next/image';
import { Heart } from 'lucide-react';
import type { Frame } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface FrameCardProps {
  frame: Frame;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
}

export function FrameCard({ frame, isFavorite, toggleFavorite }: FrameCardProps) {
  const image = PlaceHolderImages.find((img) => img.id === frame.imageId);
  const favorite = isFavorite(frame.id);

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative aspect-[16/10] w-full">
          {image ? (
            <Image
              src={image.imageUrl}
              alt={frame.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={image.imageHint}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary">
              <span className="text-sm text-muted-foreground">No Image</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <CardTitle className="mb-1 text-lg font-headline">{frame.name}</CardTitle>
        <CardDescription>{frame.brand}</CardDescription>
        <p className="mt-2 text-sm text-muted-foreground">
          {frame.material} - {frame.size}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <p className="text-lg font-semibold text-primary">${frame.price.toFixed(2)}</p>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle Favorite"
          onClick={() => toggleFavorite(frame.id)}
        >
          <Heart
            className={cn(
              'transition-colors',
              favorite
                ? 'fill-accent text-accent'
                : 'text-muted-foreground hover:text-accent'
            )}
          />
        </Button>
      </CardFooter>
    </Card>
  );
}
