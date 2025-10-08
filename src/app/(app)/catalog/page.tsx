
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { FrameCard } from '@/components/frame-card';
import { useFavorites } from '@/hooks/use-favorites';
import { Frame } from '@/lib/types';


export default function CatalogPage() {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [frameType, setFrameType] = useState('all');
  const [frameShape, setFrameShape] = useState('all');
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const fetchFrames = async () => {
      try {
        const res = await fetch('/lenskartdata.json');
        const data = await res.json();
        setFrames(data);
      } catch (error) {
        console.error('Failed to fetch frames data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFrames();
  }, []);

  const renderFrames = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
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
    
    const allFrames = frames;

    const filteredFrames = allFrames.filter(frame => {
        const nameMatch = frame.productName.toLowerCase().includes(searchTerm.toLowerCase());
        const typeMatch = frameType === 'all' || (frame.frameType && frame.frameType.toLowerCase() === frameType);
        const shapeMatch = frameShape === 'all' || (frame.frameShape && frame.frameShape.toLowerCase() === frameShape);
        return nameMatch && typeMatch && shapeMatch;
    });

    if (filteredFrames.length === 0) {
      return <div className="text-center py-20 text-muted-foreground">No frames found matching your criteria.</div>
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {filteredFrames.map(frame => (
                <FrameCard key={frame.id} frame={frame} isFavorite={isFavorite} toggleFavorite={toggleFavorite} />
            ))}
        </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-headline font-bold">
          Product Catalog
        </h1>
        <p className="mt-2 text-muted-foreground">
          Explore our comprehensive range of frames.
        </p>
      </header>

      <div className="mb-8 p-4 border rounded-lg bg-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    placeholder="Search by product name..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Select value={frameType} onValueChange={setFrameType}>
                <SelectTrigger>
                    <SelectValue placeholder="Frame Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Frame Types</SelectItem>
                    <SelectItem value="full rim">Full Rim</SelectItem>
                    <SelectItem value="half rim">Half Rim</SelectItem>
                    <SelectItem value="rimless">Rimless</SelectItem>
                </SelectContent>
            </Select>
             <Select value={frameShape} onValueChange={setFrameShape}>
                <SelectTrigger>
                    <SelectValue placeholder="Frame Shape" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Frame Shapes</SelectItem>
                    <SelectItem value="rectangle">Rectangle</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="round">Round</SelectItem>
                    <SelectItem value="aviator">Aviator</SelectItem>
                    <SelectItem value="cat eye">Cat Eye</SelectItem>
                    <SelectItem value="geometric">Geometric</SelectItem>
                    <SelectItem value="wayfarer">Wayfarer</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      {renderFrames()}
    </div>
  );
}
