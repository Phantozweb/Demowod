
'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useCases, type PatientCase } from '@/hooks/use-cases';
import { useEffect, useState, useRef, useMemo } from 'react';
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
  FlaskConical,
  Wand2,
  Loader,
  Info,
  Heart,
  Sparkles,
} from 'lucide-react';
import Image from 'next/image';
import {
  selectFramesFromCatalog,
  type SelectFramesFromCatalogOutput
} from '@/ai/flows/select-frames-from-catalog';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Frame, FrameVariation } from '@/lib/types';
import { useFavorites } from '@/hooks/use-favorites';
import { ProductPreviewCard } from '@/components/product-preview-card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { FrameShapeGalleryDialog } from '@/components/frame-shape-gallery-dialog';
import { type SuggestFrameShapesOutput } from '@/ai/flows/suggest-frame-shapes';

function FormattedReasoning({ text }: { text: string }) {
  if (!text) return null;
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
      )}
    </>
  );
}

export default function CaseDetailPage() {
  const params = useParams();
  const { getCase, updateCase } = useCases();
  const { toast } = useToast();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [caseItem, setCaseItem] = useState<PatientCase | undefined>(undefined);
  const [analysisResult, setAnalysisResult] = useState<SelectFramesFromCatalogOutput | null>(null);
  const [shapeAnalysis, setShapeAnalysis] = useState<SuggestFrameShapesOutput | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [allFrames, setAllFrames] = useState<Frame[]>([]);
  const [isFetchingFrames, setIsFetchingFrames] = useState(true);
  
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [patientImage, setPatientImage] = useState<string | null>(null);

  const analysisRun = useRef(false);

  useEffect(() => {
    const fetchFrames = async () => {
      setIsFetchingFrames(true);
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
                    const existingFrame = framesMap.get(frame.id) || { ...frame };

                    const handleProperty = (prop: 'frameType' | 'frameShape') => {
                        if (source.property === prop) {
                            if (!existingFrame[prop]) {
                                existingFrame[prop] = source.value;
                            } else if (Array.isArray(existingFrame[prop]) && !existingFrame[prop].includes(source.value)) {
                                (existingFrame[prop] as string[]).push(source.value);
                            } else if (typeof existingFrame[prop] === 'string' && existingFrame[prop] !== source.value) {
                                existingFrame[prop] = [existingFrame[prop] as string, source.value];
                            }
                        }
                    };

                    handleProperty('frameType');
                    handleProperty('frameShape');
                    
                    framesMap.set(frame.id, existingFrame);
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
        setAllFrames(uniqueFrames);

      } catch (error) {
        console.error('Failed to fetch frames data:', error);
      } finally {
        setIsFetchingFrames(false);
      }
    };

    fetchFrames();
  }, []);

  useEffect(() => {
    if (typeof params.id === 'string') {
      const foundCase = getCase(params.id);
      setCaseItem(foundCase);

      if (foundCase?.patientImage) {
          setPatientImage(foundCase.patientImage);
      }

      if (foundCase?.analysis) {
        setAnalysisResult(foundCase.analysis as SelectFramesFromCatalogOutput);
        analysisRun.current = true;
      }
      if (foundCase?.shapeAnalysis) {
        setShapeAnalysis(foundCase.shapeAnalysis as SuggestFrameShapesOutput);
      }
    }
  }, [params.id, getCase]);

  const handleStartAnalysis = async () => {
    if (!caseItem) return;
  
    setIsLoading(true);
    analysisRun.current = true;
  
    await new Promise(resolve => setTimeout(resolve, 500)); 

    if (allFrames.length === 0) {
      console.error("Frame catalog is empty. Cannot run analysis.");
      toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: 'The product catalog is empty. Please check the data sources.',
      });
      setIsLoading(false);
      analysisRun.current = false;
      return;
    }
  
    try {
        const simplifiedFrames = allFrames.map(f => {
            const frame = { ...f };
            if (Array.isArray(frame.frameShape)) {
                frame.frameShape = frame.frameShape[0];
            }
            return { 
                id: frame.id, 
                productName: frame.productName,
                frameType: Array.isArray(frame.frameType) ? frame.frameType[0] : frame.frameType,
                frameShape: frame.frameShape,
                brand: frame.brand,
                size: frame.size,
                price: {
                    salesPrice: frame.price?.salesPrice,
                    lkPrice: frame.price?.lkPrice,
                },
                purchaseCount: frame.purchaseCount,
                productRating: frame.productRating,
            };
        });

        const result = await selectFramesFromCatalog({
            faceShape: caseItem.faceShape || 'oval',
            stylePreferences: caseItem.stylePreferences || 'not specified',
            pastPurchases: caseItem.pastPurchases || 'not specified',
            frames: simplifiedFrames,
        });

        setAnalysisResult(result);
        updateCase(caseItem.id, { analysis: result, status: 'Completed' });
        toast({
            title: 'Analysis Complete',
            description: 'AI recommendations have been generated.',
        });
    } catch (error) {
        console.error('Analysis failed:', error);
        toast({
            variant: 'destructive',
            title: 'Analysis Failed',
            description: 'There was an error generating the AI recommendations. Please try again.',
        });
        analysisRun.current = false;
    } finally {
        setIsLoading(false);
    }
  };

  const flatFrames = allFrames.flatMap(frame => 
    (frame.variations && frame.variations.length > 0 ? frame.variations : [{...frame}]).map((variation: Frame | FrameVariation) => ({...frame, ...variation}))
  );

  const recommendedFrames = useMemo(() => {
    return analysisResult?.recommendations?.map(rec => {
      const frame = flatFrames.find(f => f.id === rec.id);
      return frame ? { ...frame, reasoning: rec.reasoning } : null;
    }).filter((f): f is Frame & { reasoning: string } => f !== null) || [];
  }, [analysisResult, flatFrames]);

  const handlePreview = (frame: Frame) => {
    setSelectedFrame(frame);
  }

  if (isFetchingFrames && !caseItem) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center min-h-svh">
        <Loader className="animate-spin h-8 w-8 text-primary" />
        <p className='text-muted-foreground'>Loading case details...</p>
      </div>
    );
  }

  if (!caseItem) {
     return (
      <div className="flex flex-col gap-4 justify-center items-center min-h-svh">
        <p className='text-muted-foreground'>Case not found.</p>
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
                <p><span className="font-semibold">Lifestyle:</span> {caseItem.lifestyle || 'N/A'}</p>
                <p><span className="font-semibold">Visual Needs:</span> {caseItem.visualNeeds || 'N/A'}</p>
                <p><span className="font-semibold">Style Prefs:</span> {caseItem.stylePreferences || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Eye /> Prescription</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex justify-between"><span>OD (Right):</span><span>{caseItem.distSphOd} / {caseItem.distCyl} x {caseItem.distAxis}</span></div>
              <div className="flex justify-between"><span>OS (Left):</span><span>{caseItem.distSphOs} / {caseItem.distCyl} x {caseItem.distAxis}</span></div>
              <div className="flex justify-between"><span>Near ADD:</span><span>{caseItem.nearAddOd} / {caseItem.nearAddOs}</span></div>
              <div className="flex justify-between"><span>PD:</span><span>{caseItem.pdDist}</span></div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
            {shapeAnalysis && shapeAnalysis.recommendations && shapeAnalysis.recommendations.length > 0 && (
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2"><Sparkles /> Recommended Frame Shapes</CardTitle>
                    <CardDescription>{shapeAnalysis.reasoning}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {shapeAnalysis.recommendations.map(rec => (
                            <Button
                            type="button"
                            key={rec.shape}
                            variant="outline"
                            className="h-auto py-4 flex flex-col gap-2 items-center"
                            onClick={() => setSelectedShape(rec.shape)}
                            >
                                <span className="text-base font-semibold">{rec.shape}</span>
                                <p className="text-xs text-muted-foreground font-normal whitespace-normal">{rec.reasoning}</p>
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
            )}

          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary"><Wand2 /> AI Frame Recommendations</CardTitle>
              <CardDescription>Powered by Focus.Ai to provide personalized suggestions from your catalog.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="text-center py-10 flex flex-col items-center gap-4">
                   <Loader className="mx-auto h-8 w-8 animate-spin" /> 
                  <p className="text-muted-foreground">{isFetchingFrames ? "Loading product catalog..." : "Running AI analysis on patient data..."}</p>
                </div>
              )}

              {!isLoading && analysisResult && recommendedFrames.length > 0 && (
                 <div className="space-y-6">
                 {recommendedFrames.map((frame) => {
                   const favorite = isFavorite(frame.id);
                   const price = frame.price ? `${frame.price.symbol}${frame.price.lkPrice ?? frame.price.salesPrice}` : 'N/A';
                   
                   return (
                     <div key={frame.id} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start bg-background/50 p-4 rounded-lg border">
                       <div className="md:col-span-1 relative aspect-[16/10] w-full rounded-md overflow-hidden">
                           {frame.productImage?.url && (
                             <Image src={frame.productImage.url} alt={frame.productName} fill className="object-cover"/>
                           )}
                       </div>
                       <div className="md:col-span-2 flex flex-col h-full">
                         <div className='flex-1'>
                            <div className='flex justify-between items-start'>
                              <h3 className="font-semibold text-lg leading-tight text-white mb-1">{frame.productName}</h3>
                              <Button variant="ghost" size="icon" aria-label="Toggle Favorite" onClick={() => toggleFavorite(frame.id)}>
                                <Heart className={cn('transition-colors h-5 w-5', favorite ? 'fill-accent text-accent' : 'text-muted-foreground hover:text-accent')}/>
                              </Button>
                            </div>
                            
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xl font-bold text-primary">{price}</p>
                                <Button variant="secondary" size="sm" onClick={() => handlePreview(frame)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View
                                </Button>
                            </div>

                            <Separator className='my-3' />
                           
                            <h4 className="font-semibold text-base flex items-center gap-2 mb-2"><Info className="text-primary h-5 w-5" /> AI Reasoning</h4>
                            <p className="text-muted-foreground text-sm">
                                <FormattedReasoning text={frame.reasoning} />
                            </p>
                         </div>
                       </div>
                     </div>
                   );
                 })}
               </div>
              )}
               
               {!isLoading && analysisResult && (
                 <Button onClick={() => { handleStartAnalysis(); }} disabled={isLoading || isFetchingFrames} size="sm" className="mt-6">
                    {isLoading ? 'Re-running...' : 'Re-run Analysis'}
                </Button>
               )}

              {!isLoading && !analysisResult && (
                <div className="text-center py-10 flex flex-col items-center gap-4 border-2 border-dashed rounded-lg">
                  <FlaskConical className="h-8 w-8 text-muted-foreground" />
                  <p className="text-muted-foreground max-w-sm">No analysis has been run for this case yet. Click the button below to generate AI-powered frame recommendations.</p>
                  <Button onClick={handleStartAnalysis} disabled={isLoading || isFetchingFrames}>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Start AI Analysis
                  </Button>
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
    </>
  );
}
