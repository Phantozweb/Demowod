'use client';

import Image from 'next/image';
import { Eye, Heart } from 'lucide-react';
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
  onPreview: (frame: Frame) => void;
}

export function FrameCard({ frame, isFavorite, toggleFavorite, onPreview }: FrameCardProps) {
  const favorite = isFavorite(frame.id);
  const imageUrl = frame.productImage?.url;
  const price = frame.price ? `${frame.price.symbol}${frame.price.lkPrice ?? frame.price.salesPrice}` : 'N/A';

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl group">
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
           <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button variant="secondary" onClick={() => onPreview(frame)}>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <CardTitle className="mb-1 text-lg font-headline">{frame.productName}</CardTitle>
        <CardDescription>{frame.brand || frame.productModelName}</CardDescription>
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
