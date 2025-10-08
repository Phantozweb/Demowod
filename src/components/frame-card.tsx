
'use client';

import Image from 'next/image';
import { Heart } from 'lucide-react';
import type { Frame } from '@/lib/types';
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
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
}

export function FrameCard({ frame, isFavorite, toggleFavorite }: FrameCardProps) {
  const favorite = isFavorite(frame.id);
  const imageUrl = typeof frame.productImage === 'string' ? frame.productImage : frame.productImage.url;
  const price = frame.price_details ? `${frame.price_details.symbol}${frame.price_details.lkPrice}` : `$${frame.price.toFixed(2)}`;

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl">
      <CardHeader className="p-0">
        <div className="relative aspect-[16/10] w-full">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={frame.productName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary">
              <span className="text-sm text-muted-foreground">No Image</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <CardTitle className="mb-1 text-lg font-headline">{frame.productName}</CardTitle>
        <CardDescription>{frame.brand}</CardDescription>
        <p className="mt-2 text-sm text-muted-foreground">
          {frame.size}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <p className="text-lg font-semibold text-primary">{price}</p>
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
