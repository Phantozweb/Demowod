
'use client';

import { useParams } from 'next/navigation';
import { useCases, type PatientCase } from '@/hooks/use-cases';
import { useEffect, useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  User,
  Eye,
  Wand2,
  Loader,
  Info,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import Image from 'next/image';
import {
  suggestInitialFrames,
} from '@/ai/flows/suggest-initial-frames';
import { useToast } from '@/hooks/use-toast';
import { Frame, FrameVariation, Lens } from '@/lib/types';
import { useFavorites } from '@/hooks/use-favorites';
import { ProductPreviewCard } from '@/components/product-preview-card';
import { FrameShapeGalleryDialog } from '@/components/frame-shape-gallery-dialog';
import { FrameTypeGalleryDialog } from '@/components/frame-type-gallery-dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { FrameCard } from '@/components/frame-card';

export default function CaseDetailPage() {
  const params = useParams();
  const { getCase, updateCase } = useCases();
  const { toast } = useToast();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [caseItem, setCaseItem] = useState<PatientCase | undefined>(undefined);

  const [isLoading, setIsLoading] = useState(false);
  const [allFrames, setAllFrames] = useState<Frame[]>([]);
  const [allLenses, setAllLenses] = useState<Lens[]>([]);
  const [isFetchingData, setIsFetchingData] = useState(true);
  
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [patientImage, setPatientImage] = useState<string | null>(null);

   useEffect(() => {
    const fetchCatalogData = async () => {
      setIsFetchingData(true);
      
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
          const responses = await Promise.all(dataSources.map(source => fetch(source.url).catch(() => null)));
          const framesMap = new Map<number, Frame>();
          
          await Promise.all(responses.map(async (res, i) => {
            if (res && res.ok) {
              try {
                const data = await res.json();
                if (Array.isArray(data)) {
                  data.forEach((frame: Frame) => {
                    const existingFrame = framesMap.get(frame.id) || { ...frame, frameType: [], frameShape: [] };
                    const prop = dataSources[i].property as 'frameType' | 'frameShape';
                    const value = dataSources[i].value;

                    if (prop === 'frameType' && Array.isArray(existingFrame.frameType) && !existingFrame.frameType.includes(value)) {
                        (existingFrame.frameType as string[]).push(value);
                    }
                    if (prop === 'frameShape' && Array.isArray(existingFrame.frameShape) && !existingFrame.frameShape.includes(value)) {
                        (existingFrame.frameShape as string[]).push(value);
                    }
                    
                    framesMap.set(frame.id, existingFrame);
                  });
                }
              } catch (e) {
                console.error(`Failed to parse JSON for ${dataSources[i].url}`, e);
              }
            }
          }));
          
          setAllFrames(Array.from(framesMap.values()).map(frame => ({
            ...frame,
            frameType: Array.isArray(frame.frameType) && frame.frameType.length === 1 ? frame.frameType[0] : frame.frameType,
            frameShape: Array.isArray(frame.frameShape) && frame.frameShape.length === 1 ? frame.frameShape[0] : frame.frameShape,
          })));

        } catch (error) {
          console.error('Failed to fetch frames data:', error);
        }
      };

      const fetchLenses = async () => {
         try {
            const [singleVisionRes, progressiveRes, computerWorkRes, coatingsRes, sunRes] = await Promise.all([
                fetch('/single-vision-lenses.json'),
                fetch('/progressive-lenses.json'),
                fetch('/computer-work-lenses.json'),
                fetch('/lens-coatings.json'),
                fetch('/sun-lenses.json')
            ]);
            
            const singleVisionLenses = singleVisionRes.ok ? await singleVisionRes.json() : [];
            const progressiveLenses = progressiveRes.ok ? await progressiveRes.json() : [];
            const computerWorkLenses = computerWorkRes.ok ? await computerWorkRes.json() : [];
            const coatings = coatingsRes.ok ? await coatingsRes.json() : [];
            const sunLenses = sunRes.ok ? await sunRes.json() : [];

            let idCounter = 0;
            const allLenses = [
                ...singleVisionLenses, 
                ...progressiveLenses, 
                ...computerWorkLenses, 
                ...coatings, 
                ...sunLenses
            ].map(lens => ({ ...lens, id: idCounter++ }));

            setAllLenses(allLenses);

        } catch (error) {
            console.error('Failed to fetch lenses data:', error);
        }
      };

      await Promise.all([fetchFrames(), fetchLenses()]);
      setIsFetchingData(false);
    };

    fetchCatalogData();
  }, []);

  useEffect(() => {
    if (typeof params.id === 'string' && !isFetchingData) {
      const foundCase = getCase(params.id);
      setCaseItem(foundCase);

      if (foundCase?.patientImage) {
          setPatientImage(foundCase.patientImage);
      }
    }
  }, [params.id, getCase, isFetchingData]);

  const handleRerunAnalysis = async () => {
    if (!caseItem) return;
  
    setIsLoading(true);
  
    if (allFrames.length === 0 || allLenses.length === 0) {
      toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: 'The product or lens catalog is empty. Please check the data sources.',
      });
      setIsLoading(false);
      return;
    }
  
    try {
        const result = await suggestInitialFrames({
            faceShape: caseItem.faceShape || 'oval',
            skinTone: caseItem.skinTone || 'neutral',
            age: caseItem.age,
            visualNeeds: caseItem.visualNeeds || 'general use',
            frames: allFrames.map(f => ({
              id: f.id,
              productName: f.productName,
              frameShape: Array.isArray(f.frameShape) ? f.frameShape.join(', ') : f.frameShape,
              frameType: Array.isArray(f.frameType) ? f.frameType.join(', ') : f.frameType,
              price: f.price,
              purchaseCount: f.purchaseCount,
              productRating: f.productRating,
            })),
            lenses: allLenses.map(l => ({
              id: l.id,
              name: l.name,
              category: l.category
            }))
        });
        
        updateCase(caseItem.id, { analysis: result, status: 'Completed' });
        setCaseItem(prev => prev ? {...prev, analysis: result, status: 'Completed'} : undefined);

        toast({
            title: 'Analysis Complete',
            description: 'AI recommendations have been re-generated.',
        });
    } catch (error) {
        console.error('Analysis failed:', error);
        toast({
            variant: 'destructive',
            title: 'Analysis Failed',
            description: 'There was an error generating AI recommendations. Please try again.',
        });
    } finally {
        setIsLoading(false);
    }
  };

  const flatFrames = useMemo(() => allFrames.flatMap(frame => 
    (frame.variations && frame.variations.length > 0 ? frame.variations : [{...frame}]).map((variation: Frame | FrameVariation) => ({...frame, ...variation}))
  ), [allFrames]);

  const recommendedFrames = useMemo(() => {
    return caseItem?.analysis?.topFrames?.map(rec => {
      const frame = flatFrames.find(f => f.id === rec.id);
      return frame ? { ...frame, reasoning: rec.reasoning } : null;
    }).filter((f): f is Frame & { reasoning: string } => f !== null) || [];
  }, [caseItem?.analysis, flatFrames]);

  const handlePreview = (frame: Frame) => setSelectedFrame(frame);
  
  if (isFetchingData || !caseItem) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center min-h-svh">
        <Loader className="animate-spin h-8 w-8 text-primary" />
        <p className='text-muted-foreground'>Loading case details...</p>
      </div>
    );
  }

  return (
    <>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
          Patient Analysis Details
        </h1>
        <p className="text-lg text-muted-foreground">
          Case ID: {caseItem.id}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User /> Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {patientImage && (
                <div className="relative aspect-square w-full rounded-lg overflow-hidden border">
                  <Image
                    src={patientImage}
                    alt={caseItem.patientName || 'Patient'}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
              <div>
                <p className="font-semibold text-lg">{caseItem.patientName}</p>
                <p className="text-muted-foreground">
                  {caseItem.age} years old, {caseItem.gender}
                </p>
              </div>
              <div className="text-sm space-y-1">
                <p><span className="font-semibold">Face Shape:</span> {caseItem.faceShape || 'N/A'}</p>
                 <p><span className="font-semibold">Skin Tone:</span> {caseItem.skinTone || 'N/A'}</p>
                <p><span className="font-semibold">Occupation:</span> {caseItem.occupation || 'N/A'}</p>
                <p><span className="font-semibold">Visual Needs:</span> {caseItem.visualNeeds || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary"><Wand2 /> AI Recommendations</CardTitle>
              <CardDescription>Powered by Focus.Ai to provide personalized suggestions from your catalog.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="text-center py-10 flex flex-col items-center gap-4">
                   <Loader className="mx-auto h-8 w-8 animate-spin" /> 
                  <p className="text-muted-foreground">Re-running AI analysis on patient data...</p>
                </div>
              )}

              {!isLoading && !caseItem.analysis && (
                <div className="text-center py-10 flex flex-col items-center gap-4 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground max-w-sm">This case was saved without generating AI recommendations. You can run the analysis now.</p>
                  <Button onClick={handleRerunAnalysis} disabled={isLoading || isFetchingData}>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate AI Recommendations
                  </Button>
                </div>
              )}

              {caseItem.analysis && (
                <div className='space-y-8'>
                  {/* Frame Shapes */}
                  {caseItem.analysis.recommendedShapes && (
                    <section>
                      <h3 className="text-xl font-semibold text-primary flex items-center gap-2 mb-2"><Sparkles /> Recommended Frame Shapes</h3>
                      <p className='text-muted-foreground mb-4'>{caseItem.analysis.recommendedShapes.reasoning}</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {caseItem.analysis.recommendedShapes.recommendations.map(rec => (
                              <Button type="button" key={rec.shape} variant="outline" className="h-auto py-3 flex flex-col gap-1 items-center" onClick={() => setSelectedShape(rec.shape)}>
                                  <span className="text-base font-semibold">{rec.shape}</span>
                                  <p className="text-xs text-muted-foreground font-normal whitespace-normal text-center">{rec.reasoning}</p>
                              </Button>
                          ))}
                      </div>
                    </section>
                  )}
                  {/* Frame Types */}
                  {caseItem.analysis.recommendedTypes && (
                     <section>
                      <h3 className="text-xl font-semibold text-primary flex items-center gap-2 mb-2"><Sparkles /> Suitable Frame Types</h3>
                      <p className='text-muted-foreground mb-4'>{caseItem.analysis.recommendedTypes.reasoning}</p>
                       <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {caseItem.analysis.recommendedTypes.recommendations.map(rec => (
                              <Button type="button" key={rec.type} variant="outline" className="h-auto py-3 flex flex-col gap-1 items-center" onClick={() => setSelectedType(rec.type)}>
                                  <span className="text-base font-semibold">{rec.type}</span>
                                  <p className="text-xs text-muted-foreground font-normal whitespace-normal text-center">{rec.reasoning}</p>
                              </Button>
                          ))}
                      </div>
                    </section>
                  )}
                   {/* Top Frames Carousel */}
                   {recommendedFrames.length > 0 && (
                      <section>
                        <h3 className="text-xl font-semibold text-primary flex items-center gap-2 mb-4"><Sparkles /> Top Frames for {caseItem.patientName}</h3>
                         <Carousel
                          opts={{
                            align: "start",
                          }}
                          className="w-full"
                        >
                          <CarouselContent>
                            {recommendedFrames.map((frame) => (
                              <CarouselItem key={frame.id} className="md:basis-1/2 lg:basis-1/2">
                                <div className="p-1">
                                  <FrameCard frame={frame} isFavorite={isFavorite} toggleFavorite={toggleFavorite} onPreview={handlePreview} />
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious />
                          <CarouselNext />
                        </Carousel>
                      </section>
                   )}
                   {/* Lens Recommendations */}
                   {caseItem.analysis.recommendedLenses && (
                     <section>
                      <h3 className="text-xl font-semibold text-primary flex items-center gap-2 mb-2"><Eye /> Recommended Lens & Coatings</h3>
                      <p className='text-muted-foreground mb-4'>{caseItem.analysis.recommendedLenses.reasoning}</p>
                      <div className='space-y-4'>
                        {caseItem.analysis.recommendedLenses.recommendations.map(rec => {
                           const lens = allLenses.find(l => l.id === rec.id);
                           if (!lens) return null;
                           return (
                              <Card key={rec.id} className="bg-background/50">
                                <CardHeader>
                                  <CardTitle className='text-lg'>{lens.name} <span className='text-sm text-muted-foreground font-normal'>({lens.category})</span></CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm text-muted-foreground flex items-start gap-2">
                                    <Info className="h-4 w-4 shrink-0 mt-1" />
                                    <span><span className='font-semibold text-foreground'>Reasoning:</span> {rec.reasoning}</span>
                                  </p>
                                  {lens.features && lens.features.length > 0 && (
                                    <div className="mt-4 space-y-1">
                                        {lens.features.map((feature, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <CheckCircle className="h-3 w-3 text-primary" />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                           )
                        })}
                      </div>
                    </section>
                   )}

                   <div className='pt-8 mt-8 border-t'>
                      <Button onClick={handleRerunAnalysis} disabled={isLoading || isFetchingData} size="sm" variant="outline">
                          {isLoading ? (<><Loader className="mr-2 h-4 w-4 animate-spin"/> Re-running...</>) : 'Re-run Full Analysis'}
                      </Button>
                   </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    {selectedFrame && (
      <ProductPreviewCard frame={selectedFrame} isOpen={!!selectedFrame} onClose={() => setSelectedFrame(null)} isFavorite={isFavorite} toggleFavorite={toggleFavorite} />
    )}
    {selectedShape && (
        <FrameShapeGalleryDialog 
            shape={selectedShape}
            allFrames={allFrames}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
            isOpen={!!selectedShape}
            onClose={() => setSelectedShape(null)}
        />
    )}
    {selectedType && (
        <FrameTypeGalleryDialog 
            type={selectedType}
            allFrames={allFrames}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
            isOpen={!!selectedType}
            onClose={() => setSelectedType(null)}
        />
    )}
    </>
  );
}
