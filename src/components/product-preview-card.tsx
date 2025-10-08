'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Frame } from '@/lib/types';
import { Badge } from './ui/badge';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ProductPreviewCardProps {
  frame: Frame;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
}

export function ProductPreviewCard({
  frame,
  isOpen,
  onClose,
  isFavorite,
  toggleFavorite,
}: ProductPreviewCardProps) {
  if (!frame) return null;

  const favorite = isFavorite(frame.id);
  const imageUrl = frame.productImage?.url;
  const price = frame.price
    ? `${frame.price.symbol}${frame.price.lkPrice ?? frame.price.salesPrice}`
    : 'N/A';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative aspect-video rounded-md overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={frame.productName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-secondary">
                <span className="text-sm text-muted-foreground">No Image</span>
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold mb-2">
                {frame.productName}
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                {frame.brand || frame.productModelName}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary">
                  {frame.frameType?.toUpperCase()}
                </Badge>
                <Badge variant="secondary">
                  {frame.frameShape?.toUpperCase()}
                </Badge>
                <Badge variant="secondary">
                  {frame.size?.toUpperCase()}
                </Badge>
              </div>
              <p className="text-3xl font-bold text-primary mb-4">{price}</p>
              <p className="text-sm text-muted-foreground">
                Purchase Count: {frame.purchaseCount?.toLocaleString()}
              </p>
              {frame.productRating && (
                 <p className="text-sm text-muted-foreground">
                    Rating: {frame.productRating} ({frame.totalNoOfRatings} reviews)
                </p>
              )}
            </div>
            <DialogFooter className="mt-4 sm:justify-start gap-2">
              <Button asChild size="lg">
                <Link href={frame.productURL || '#'} target="_blank">
                  Buy Now
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => toggleFavorite(frame.id)}
              >
                <Heart
                  className={cn(
                    'mr-2 h-5 w-5 transition-colors',
                    favorite
                      ? 'fill-accent text-accent'
                      : 'text-muted-foreground'
                  )}
                />
                {favorite ? 'Favorited' : 'Favorite'}
              </Button>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
