
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader, Sparkles, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Frame, Lens, FrameVariation } from '@/lib/types';
import { suggestFrameLensCombos } from '@/ai/flows/suggest-frame-lens-combos';
import { FrameCard } from '@/components/frame-card';
import { LensCard } from '@/components/lens-card';
import { useFavorites } from '@/hooks/use-favorites';
import { ProductPreviewCard } from '@/components/product-preview-card';

type ComboRecommendation = {
    frameId: number;
    lensId: number;
    reasoning: string;
};

export default function AiStylistPage() {
    const [visualNeeds, setVisualNeeds] = useState('');
    const [stylePreferences, setStylePreferences] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingData, setIsFetchingData] = useState(true);
    const [recommendations, setRecommendations] = useState<ComboRecommendation[]>([]);

    const [frames, setFrames] = useState<Frame[]>([]);
    const [lenses, setLenses] = useState<Lens[]>([]);
    const { toast } = useToast();
    const { isFavorite, toggleFavorite } = useFavorites();
    const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);


    useEffect(() => {
        const fetchCatalogData = async () => {
            setIsFetchingData(true);
            try {
                // Fetch frames
                const frameSources = [
                    { url: '/fullrim-frames.json', property: 'frameType', value: 'full rim' },
                    { url: '/halfrim-frames.json', property: 'frameType', value: 'half rim' },
                    // ... other frame files
                ];
                const frameResponses = await Promise.all(frameSources.map(s => fetch(s.url).catch(() => null)));
                const framesMap = new Map<number, Frame>();
                frameResponses.forEach((res, i) => {
                    if (res && res.ok) {
                        res.json().then(data => {
                            if (Array.isArray(data)) {
                                data.forEach((frame: Frame) => {
                                    const existing = framesMap.get(frame.id) || frame;
                                    framesMap.set(frame.id, { ...existing, [frameSources[i].property]: frameSources[i].value });
                                });
                            }
                        });
                    }
                });
                setFrames(Array.from(framesMap.values()));

                // Fetch lenses
                const lensSources = [
                    '/single-vision-lenses.json',
                    '/progressive-lenses.json',
                    '/computer-work-lenses.json',
                    '/lens-coatings.json',
                    '/sun-lenses.json',
                ];
                const lensResponses = await Promise.all(lensSources.map(url => fetch(url).catch(() => null)));
                let allLenses: Lens[] = [];
                let lensIdCounter = 0;
                for (const res of lensResponses) {
                    if (res && res.ok) {
                        const data = await res.json();
                        if(Array.isArray(data)) {
                            allLenses.push(...data.map((lens: Lens) => ({ ...lens, id: lensIdCounter++ })));
                        }
                    }
                }
                setLenses(allLenses);

            } catch (error) {
                console.error("Failed to fetch catalog data:", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Could not load product catalogs for the AI stylist.",
                });
            } finally {
                setIsFetchingData(false);
            }
        };

        fetchCatalogData();
    }, [toast]);

    const handleGenerateRecommendations = async () => {
        if (!visualNeeds || !stylePreferences) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please describe your visual needs and style preferences.',
            });
            return;
        }
        if (isFetchingData || frames.length === 0 || lenses.length === 0) {
            toast({
                variant: 'destructive',
                title: 'Catalog Not Ready',
                description: 'The product catalog is still loading. Please wait a moment and try again.',
            });
            return;
        }

        setIsLoading(true);
        setRecommendations([]);
        try {
            const simplifiedFrames = frames.map(f => ({ 
                id: f.id, 
                productName: f.productName,
                frameType: f.frameType,
                frameShape: f.frameShape,
                brand: f.brand,
                size: f.size,
                price: {
                    salesPrice: f.price?.salesPrice,
                    lkPrice: f.price?.lkPrice,
                },
                purchaseCount: f.purchaseCount,
                productRating: f.productRating,
              }));

            const result = await suggestFrameLensCombos({
                visualNeeds,
                stylePreferences,
                frames: simplifiedFrames,
                lenses,
            });
            setRecommendations(result.recommendations);
            toast({
                title: 'Recommendations Ready!',
                description: 'The AI Stylist has generated your personalized combos.',
            });
        } catch (error) {
            console.error('AI Stylist failed:', error);
            toast({
                variant: 'destructive',
                title: 'Analysis Failed',
                description: 'There was an error generating recommendations. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const flatFrames = frames.flatMap(frame =>
        (frame.variations && frame.variations.length > 0 ? frame.variations : [{ ...frame }]).map((variation: Frame | FrameVariation) => ({ ...frame, ...variation }))
    );

    const getFrameById = (id: number) => flatFrames.find(f => f.id === id);
    const getLensById = (id: number) => lenses.find(l => l.id === id);

    const handlePreview = (frame: Frame) => {
        setSelectedFrame(frame);
    };

    return (
        <>
            <div className="p-4 md:p-8">
                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-headline font-bold flex items-center gap-3">
                        <Sparkles className="text-primary" /> AI Stylist
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Get personalized frame and lens recommendations powered by AI.
                    </p>
                </header>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Your Preferences</CardTitle>
                        <CardDescription>Tell us what you're looking for so we can find the perfect match.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="visual-needs">Visual Needs & Lifestyle</Label>
                                <Textarea
                                    id="visual-needs"
                                    placeholder="e.g., 'I work on a computer 8 hours a day and get eye strain.' or 'I need sunglasses for driving in bright conditions.'"
                                    value={visualNeeds}
                                    onChange={(e) => setVisualNeeds(e.target.value)}
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="style-prefs">Frame Style Preferences</Label>
                                <Textarea
                                    id="style-prefs"
                                    placeholder="e.g., 'I like modern, minimalist designs.' or 'I want something bold and retro.'"
                                    value={stylePreferences}
                                    onChange={(e) => setStylePreferences(e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>
                        <Button onClick={handleGenerateRecommendations} disabled={isLoading || isFetchingData}>
                            {isLoading ? <Loader className="animate-spin mr-2" /> : <Wand2 className="mr-2" />}
                            {isLoading ? 'Generating Combos...' : 'Generate Recommendations'}
                        </Button>
                    </CardContent>
                </Card>

                {isLoading && (
                    <div className="text-center py-20">
                        <Loader className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
                        <p className="text-lg text-muted-foreground">Our AI is curating the perfect combinations for you...</p>
                    </div>
                )}

                {recommendations.length > 0 && (
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-center">Your Personalized Recommendations</h2>
                        {recommendations.map((rec, index) => {
                            const frame = getFrameById(rec.frameId);
                            const lens = getLensById(rec.lensId);

                            if (!frame || !lens) return null;

                            return (
                                <Card key={index} className="overflow-hidden">
                                    <CardHeader>
                                        <CardTitle>Recommendation #{index + 1}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        <div className="lg:col-span-1">
                                            <FrameCard frame={frame} isFavorite={isFavorite} toggleFavorite={toggleFavorite} onPreview={handlePreview} />
                                        </div>
                                        <div className="lg:col-span-1">
                                            <LensCard lens={lens} />
                                        </div>
                                        <div className="lg:col-span-1 bg-secondary/50 p-4 rounded-lg">
                                            <h3 className="font-semibold text-lg flex items-center gap-2 mb-2 text-primary">
                                                <Sparkles className="h-5 w-5" /> AI Reasoning
                                            </h3>
                                            <p className="text-sm text-muted-foreground">{rec.reasoning}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
            {selectedFrame && (
                <ProductPreviewCard
                frame={selectedFrame}
                isOpen={!!selectedFrame}
                onClose={() => setSelectedFrame(null)}
                isFavorite={isFavorite}
                toggleFavorite={toggleFavorite}
                />
            )}
        </>
    );
}
