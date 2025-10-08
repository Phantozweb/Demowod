
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { FrameCard } from '@/components/frame-card';
import { useFavorites } from '@/hooks/use-favorites';
import { Frame, FrameVariation, Lens } from '@/lib/types';
import { ProductPreviewCard } from '@/components/product-preview-card';
import { LensCard } from '@/components/lens-card';


export default function CatalogPage() {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [lenses, setLenses] = useState<Lens[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [frameType, setFrameType] = useState('all');
  const [frameShape, setFrameShape] = useState('all');
  const [lensSearchTerm, setLensSearchTerm] = useState('');
  const [lensTargetUser, setLensTargetUser] = useState('all');

  const { isFavorite, toggleFavorite } = useFavorites();
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);

  useEffect(() => {
    const fetchFrames = async () => {
      const dataSources = [
        { url: '/fullrim-frames.json', property: 'frameType', value: 'full rim' },
        { url: '/halfrim-frames.json', property: 'frameType', value: 'half rim' },
        { url: '/rimless-frames.json', property: 'frameType', value: 'rimless' },
        { url: '/square-frames.json', property: 'frameShape', value: 'square' },
        { url: '/rectangle-frames.json', property: 'frameShape', value: 'rectangle' },
        { url: '/round-frames.json', property: 'frameShape', value: 'round' },
        { url: '/cateye-frames.json', property: 'frameShape', value: 'cat eye' },
        { url: '/aviator-frames.json', property: 'frameShape', value: 'aviator' },
        { url: '/geometric-frames.json', property: 'frameShape', value: 'geometric' },
      ];

      try {
        const responses = await Promise.all(
          dataSources.map(source => fetch(source.url).catch(e => {
            console.error(`Failed to fetch ${source.url}`, e);
            return null;
          }))
        );

        const framesMap = new Map<number, Frame>();

        for (let i = 0; i < responses.length; i++) {
          const res = responses[i];
          const source = dataSources[i];
          
          if (res && res.ok) {
            try {
              const data = await res.json();
              if (Array.isArray(data)) {
                data.forEach((frame: Frame) => {
                  const existingFrame = framesMap.get(frame.id) || frame;
                  framesMap.set(frame.id, {
                    ...existingFrame,
                    [source.property]: source.value,
                  });
                });
              }
            } catch (e) {
               console.error(`Failed to parse JSON for ${source.url}`, e);
            }
          } else {
            console.error(`Failed to fetch ${source.url}:`, res ? res.statusText : 'Network Error');
          }
        }
        
        const uniqueFrames = Array.from(framesMap.values());
        setFrames(uniqueFrames);

      } catch (error) {
        console.error('Failed to fetch frames data:', error);
      } 
    };

    const fetchLenses = async () => {
        try {
            const res = await fetch('/single-vision-lenses.json');
            if(res.ok) {
                const data = await res.json();
                setLenses(data);
            }
        } catch (error) {
            console.error('Failed to fetch lenses data:', error);
        }
    }

    const fetchAllData = async () => {
        setIsLoading(true);
        await Promise.all([fetchFrames(), fetchLenses()]);
        setIsLoading(false);
    }


    fetchAllData();
  }, []);
  
  const allFrames = frames.flatMap(frame => 
    (frame.variations && frame.variations.length > 0 ? frame.variations : [{...frame}]).map((variation: Frame | FrameVariation) => ({...frame, ...variation}))
  );

  const filteredFrames = allFrames.filter(frame => {
    const nameMatch = frame.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const typeMatch = frameType === 'all' || (frame.frameType && frame.frameType.toLowerCase() === frameType);
    const shapeMatch = frameShape === 'all' || (frame.frameShape && frame.frameShape.toLowerCase() === frameShape);
    
    return nameMatch && (typeMatch && shapeMatch);
  });

  const filteredLenses = lenses.filter(lens => {
    const searchTermLower = lensSearchTerm.toLowerCase();
    const nameMatch = lens.name.toLowerCase().includes(searchTermLower);
    const descriptionMatch = lens.description.toLowerCase().includes(searchTermLower);
    const targetUserMatch = lensTargetUser === 'all' || lens.targetUser.toLowerCase().includes(lensTargetUser.toLowerCase());
    return (nameMatch || descriptionMatch) && targetUserMatch;
  });

  const uniqueTargetUsers = Array.from(new Set(lenses.map(l => l.targetUser.split('(')[0].trim())));

  const handleFrameTypeChange = (value: string) => {
    setFrameType(value);
    setFrameShape('all');
  };

  const handleFrameShapeChange = (value: string) => {
    setFrameShape(value);
    setFrameType('all');
  };

  const handlePreview = (frame: Frame) => {
    setSelectedFrame(frame);
  }

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
    
    if (filteredFrames.length === 0) {
      return <div className="text-center py-20 text-muted-foreground">No frames found matching your criteria.</div>
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {filteredFrames.map(frame => (
                <FrameCard key={frame.id} frame={frame} isFavorite={isFavorite} toggleFavorite={toggleFavorite} onPreview={handlePreview} />
            ))}
        </div>
    )
  }

  const renderLenses = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                    <div className="h-6 w-3/4 bg-muted rounded mb-2"></div>
                    <div className="h-4 w-1/2 bg-muted rounded mb-4"></div>
                    <div className="h-4 w-full bg-muted rounded"></div>
                    <div className="h-4 w-5/6 bg-muted rounded mt-2"></div>
                    <div className="h-4 w-4/6 bg-muted rounded mt-2"></div>
                </CardContent>
            </Card>
          ))}
        </div>
      );
    }
    
    if (filteredLenses.length === 0) {
      return <div className="text-center py-20 text-muted-foreground">No lenses found matching your criteria.</div>
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredLenses.map(lens => (
                <LensCard key={lens.id} lens={lens} />
            ))}
        </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <div className="flex items-baseline justify-between">
            <div>
                <h1 className="text-3xl md:text-4xl font-headline font-bold">
                Product Catalog
                </h1>
                <p className="mt-2 text-muted-foreground">
                Explore our comprehensive range of frames and lenses.
                </p>
            </div>
            {!isLoading && (
            <p className='text-sm text-muted-foreground'>
                Showing {filteredFrames.length} frames and {filteredLenses.length} lenses
            </p>
            )}
        </div>
      </header>
      <Tabs defaultValue="frames" className="w-full">
        <TabsList className='mb-4'>
          <TabsTrigger value="frames">Frames</TabsTrigger>
          <TabsTrigger value="lenses">Lenses</TabsTrigger>
        </TabsList>
        <TabsContent value="frames">
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
                    <Select value={frameType} onValueChange={handleFrameTypeChange}>
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
                    <Select value={frameShape} onValueChange={handleFrameShapeChange}>
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
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {renderFrames()}
        </TabsContent>
        <TabsContent value="lenses">
            <div className="mb-8 p-4 border rounded-lg bg-card">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                            placeholder="Search by lens name or description..."
                            className="pl-10"
                            value={lensSearchTerm}
                            onChange={(e) => setLensSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={lensTargetUser} onValueChange={setLensTargetUser}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by Target User" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Target Users</SelectItem>
                            {uniqueTargetUsers.map(user => (
                                <SelectItem key={user} value={user}>{user}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {renderLenses()}
        </TabsContent>
      </Tabs>
      
      {selectedFrame && (
        <ProductPreviewCard
          frame={selectedFrame}
          isOpen={!!selectedFrame}
          onClose={() => setSelectedFrame(null)}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
        />
      )}
    </div>
  );
}

    