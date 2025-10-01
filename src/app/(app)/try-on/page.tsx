'use client';

import { useState, ChangeEvent } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { tryOnFrames } from '@/lib/frames';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Upload } from 'lucide-react';

export default function TryOnPage() {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);

  const userPlaceholder = PlaceHolderImages.find(img => img.id === 'user-placeholder');

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setUserImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-headline font-bold">Virtual Try-On</h1>
        <p className="text-muted-foreground mt-2">
          Upload your photo and see how our frames look on you.
        </p>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <Card className="lg:col-span-2 shadow-lg">
          <CardContent className="p-6">
            <div className="relative aspect-square w-full max-w-xl mx-auto bg-secondary rounded-lg flex items-center justify-center">
              <Image
                src={userImage || userPlaceholder?.imageUrl || ''}
                alt="User face"
                fill
                className="object-cover rounded-lg"
                data-ai-hint={userPlaceholder?.imageHint}
              />
              {selectedFrame && (
                <Image
                  src={selectedFrame}
                  alt="Selected frame"
                  width={300}
                  height={150}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain pointer-events-none"
                />
              )}
              {!userImage && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-lg">
                    <p className="text-primary-foreground text-center p-4">Upload a photo to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <div className="space-y-8">
          <Card>
            <CardContent className="p-6">
              <Label htmlFor="picture" className="text-lg font-semibold font-headline">
                1. Upload Your Photo
              </Label>
              <p className="text-sm text-muted-foreground mb-4">
                For best results, use a well-lit, front-facing photo.
              </p>
              <div className="flex items-center gap-2">
                <Input id="picture" type="file" accept="image/*" onChange={handleImageUpload} className="cursor-pointer file:cursor-pointer"/>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold font-headline mb-4">2. Select Frames</h3>
              <Carousel opts={{ align: 'start' }} className="w-full">
                <CarouselContent>
                  {tryOnFrames.map((frame) => {
                    const image = PlaceHolderImages.find(img => img.id === frame.imageId);
                    return image ? (
                      <CarouselItem key={frame.id} className="basis-1/2">
                        <div
                          className="p-1 cursor-pointer"
                          onClick={() => setSelectedFrame(image.imageUrl)}
                        >
                          <Card className="overflow-hidden hover:border-primary">
                            <Image
                              src={image.imageUrl}
                              alt={frame.name}
                              width={300}
                              height={150}
                              className="object-contain aspect-video"
                            />
                          </Card>
                        </div>
                      </CarouselItem>
                    ) : null;
                  })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
              {selectedFrame && (
                <Button variant="outline" className="w-full mt-4" onClick={() => setSelectedFrame(null)}>
                  Clear Frame
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
