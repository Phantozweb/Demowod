
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  UploadCloud,
  TestTube2,
  ArrowRight,
  Menu,
  FileText,
  ScanFace,
  Sparkles,
  Loader,
  Eye,
  Info,
  CheckCircle,
  Wand2
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useCases } from '@/hooks/use-cases';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { analyzeFaceShape } from '@/ai/flows/analyze-face-shape';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useSidebar } from '@/components/ui/sidebar';
import { suggestInitialFrames } from '@/ai/flows/suggest-initial-frames';
import { Frame, FrameVariation, Lens, type SuggestInitialFramesOutput } from '@/lib/types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { FrameCard } from '@/components/frame-card';
import { useFavorites } from '@/hooks/use-favorites';
import { ProductPreviewCard } from '@/components/product-preview-card';
import { FrameShapeGalleryDialog } from '@/components/frame-shape-gallery-dialog';
import { FrameTypeGalleryDialog } from '@/components/frame-type-gallery-dialog';


const patientCaseSchema = z.object({
  patientName: z.string().min(1, 'Patient name is required'),
  age: z.coerce.number().optional(),
  gender: z.string().optional(),
  contactInfo: z.string().optional(),
  occupation: z.string().optional(),
  lifestyle: z.string().optional(),
  visualNeeds: z.string().optional(),
  stylePreferences: z.string().optional(),
  pastPurchases: z.string().optional(),
  distSphOd: z.string().optional(),
  distSphOs: z.string().optional(),
  distCyl: z.string().optional(),
  distAxis: z.string().optional(),
  nearAddOd: z.string().optional(),
  nearAddOs: z.string().optional(),
  pdDist: z.string().optional(),
  pdNear: z.string().optional(),
  image: z.any().optional(),
  faceShape: z.string().optional(),
  skinTone: z.string().optional(),
});

type PatientCaseFormValues = z.infer<typeof patientCaseSchema>;

export default function NewPatientPage() {
  const router = useRouter();
  const { addCase } = useCases();
  const { toast } = useToast();
  const { toggleSidebar } = useSidebar();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SuggestInitialFramesOutput | null>(null);

  const [allFrames, setAllFrames] = useState<Frame[]>([]);
  const [allLenses, setAllLenses] = useState<Lens[]>([]);
  const [isFetchingData, setIsFetchingData] = useState(true);

  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const form = useForm<PatientCaseFormValues>({
    resolver: zodResolver(patientCaseSchema),
    defaultValues: {
      patientName: '',
      age: undefined,
      gender: '',
      contactInfo: '',
      occupation: '',
      lifestyle: '',
      visualNeeds: '',
      stylePreferences: '',
      pastPurchases: '',
      distSphOd: '',
      distSphOs: '',
      distCyl: '',
      distAxis: '',
      nearAddOd: '',
      nearAddOs: '',
      pdDist: '',
      pdNear: '',
      faceShape: '',
      skinTone: '',
    },
  });
  
  useEffect(() => {
    setIsApiKeyMissing(process.env.NEXT_PUBLIC_GEMINI_API_KEY_CONFIGURED !== 'true');
  }, []);

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

  const runFaceAnalysis = async (dataUrl: string) => {
    if (isApiKeyMissing) {
      toast({
        variant: 'destructive',
        title: 'AI Analysis Skipped',
        description:
          'GEMINI_API_KEY is not set. Face shape analysis will be disabled.',
      });
      form.setValue('faceShape', 'Not available');
      form.setValue('skinTone', 'Not available');
      return;
    }
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeFaceShape({ photoDataUri: dataUrl });
      if (result && result.faceShape) {
        form.setValue('faceShape', result.faceShape);
        form.setValue('skinTone', result.skinTone);
        toast({
          title: 'Face Analysis Complete',
          description: `Detected Face Shape: ${result.faceShape}, Skin Tone: ${result.skinTone}`,
        });
      } else {
        throw new Error('AI response for face analysis was empty or invalid.');
      }
    } catch (error) {
      console.error('Face shape analysis failed:', error);
      toast({
        variant: 'destructive',
        title: 'Face Analysis Failed',
        description: 'Could not determine face shape from the image.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImagePreview(dataUrl);
        runFaceAnalysis(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleGenerateRecommendations = async () => {
    const formData = form.getValues();
    if (!formData.faceShape || !formData.skinTone) {
        toast({
            variant: 'destructive',
            title: 'Missing Information',
            description: 'Face shape and skin tone must be determined before generating recommendations.',
        });
        return;
    }

    setIsGenerating(true);
    try {
        const result = await suggestInitialFrames({
            faceShape: formData.faceShape,
            skinTone: formData.skinTone,
            age: formData.age,
            visualNeeds: formData.visualNeeds || 'general use',
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
        setAnalysisResult(result);
        toast({
            title: 'Analysis Complete',
            description: 'AI recommendations have been generated below.',
        });
    } catch (error) {
        console.error('Full analysis failed:', error);
        toast({
            variant: 'destructive',
            title: 'Analysis Failed',
            description: 'There was an error generating AI recommendations. Please try again.',
        });
    } finally {
        setIsGenerating(false);
    }
  };

  const fillWithDemoData = () => {
    const randomFromArray = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    
    const names = ['Alex Ray', 'Maria Garcia', 'Chen Wei', 'Fatima Al-Fassi', 'Kenji Tanaka'];
    const genders = ['male', 'female', 'other'];
    const occupations = ['Teacher', 'Software Engineer', 'Graphic Designer', 'Nurse', 'Marketing Manager'];
    const visualNeeds = ['Difficulty with night driving', 'Experiences eye strain from computer use', 'Needs glasses for reading fine print', 'Sensitive to bright lights and glare'];
    const stylePrefs = ['Prefers modern, minimalist frames', 'Likes bold, statement pieces', 'Enjoys a classic, retro look', 'Looks for something professional and understated'];
    const randomStepValue = (min: number, max: number, step: number) => (Math.floor(Math.random() * ((max - min) / step + 1)) * step + min).toFixed(2);
    const randomAxis = () => Math.floor(Math.random() * 180) + 1;
    const randomPd = () => Math.floor(Math.random() * 12) + 58;

    form.reset({
        patientName: randomFromArray(names),
        age: Math.floor(Math.random() * 50) + 20,
        gender: randomFromArray(genders),
        occupation: randomFromArray(occupations),
        visualNeeds: randomFromArray(visualNeeds),
        stylePreferences: randomFromArray(stylePrefs),
        distSphOd: randomStepValue(-4, 4, 0.25),
        distSphOs: randomStepValue(-4, 4, 0.25),
        distCyl: randomStepValue(-2, 0, 0.25),
        distAxis: randomAxis().toString(),
        nearAddOd: `+${randomStepValue(1, 2.5, 0.25)}`,
        nearAddOs: `+${randomStepValue(1, 2.5, 0.25)}`,
        pdDist: randomPd().toString(),
    });
    
    setImagePreview(null);
    setAnalysisResult(null);
    form.setValue('faceShape', '');
    form.setValue('skinTone', '');

    toast({
        title: "Demo Data Loaded",
        description: "The form has been filled with random data.",
      });
  }

  function onSaveCase(data: PatientCaseFormValues) {
    if (!data.patientName) {
        toast({
            variant: 'destructive',
            title: 'Cannot Save Case',
            description: 'A patient name is required to save a case.',
        });
        return;
    }
    
    const fullCase = addCase({
        ...data,
        date: new Date().toISOString(),
        status: analysisResult ? 'Completed' : 'Pending',
        patientImage: imagePreview,
        analysis: analysisResult || undefined,
    });
    toast({
        title: 'Case Saved',
        description: `Patient case for ${fullCase.patientName} has been created.`,
    });

    router.push(`/patient-analysis/cases/${fullCase.id}`);
  }
  
  const flatFrames = useMemo(() => allFrames.flatMap(frame => 
    (frame.variations && frame.variations.length > 0 ? frame.variations : [{...frame}]).map((variation: Frame | FrameVariation) => ({...frame, ...variation}))
  ), [allFrames]);

  const recommendedFrames = useMemo(() => {
    return analysisResult?.topFrames?.map(rec => {
      const frame = flatFrames.find(f => f.id === rec.id);
      return frame ? { ...frame, reasoning: rec.reasoning } : null;
    }).filter((f): f is Frame & { reasoning: string } => f !== null) || [];
  }, [analysisResult, flatFrames]);

  return (
    <>
    <div>
        <header className="sticky top-0 z-20 border-b border-border/50 bg-background/80 backdrop-blur-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
                    <Menu />
                    <span className="sr-only">Toggle Sidebar</span>
                  </Button>
                  <FileText className="h-8 w-8 text-primary hidden sm:block" />
                  <h1 className="text-xl font-bold text-white">Focus CaseX</h1>
                </div>
            </div>
        </header>

        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12'>
            <header className="mb-12 flex justify-between items-start">
                <div>
                    <h2 className="text-4xl font-extrabold tracking-tight text-white mb-2">New Patient Analysis</h2>
                    <p className="text-lg text-muted-foreground">Enter patient data for analysis and recommendations.</p>
                </div>
                <Button onClick={fillWithDemoData} variant="outline">
                    <TestTube2 className="mr-2 h-4 w-4" />
                    Fill with Demo Data
                </Button>
            </header>

            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSaveCase)}>
                <div className="space-y-12">
                    <Card className="p-8">
                        <h3 className="text-2xl font-semibold text-primary mb-8 border-b pb-4">Patient Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <FormField control={form.control} name="patientName" render={({ field }) => (
                                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="age" render={({ field }) => (
                                    <FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" placeholder="e.g., 42" {...field} value={field.value ?? ''} /></FormControl></FormItem>
                                )}/>
                                <FormField control={form.control} name="gender" render={({ field }) => (
                                    <FormItem><FormLabel>Gender</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                                            <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent>
                                        </Select>
                                    </FormItem>
                                )}/>
                            </div>
                            <div className="md:col-span-2">
                            <FormField control={form.control} name="occupation" render={({ field }) => (
                                <FormItem><FormLabel>Occupation</FormLabel><FormControl><Input placeholder="e.g., Software Engineer" {...field} /></FormControl></FormItem>
                            )}/>
                            </div>
                                <FormField control={form.control} name="visualNeeds" render={({ field }) => (
                                <FormItem><FormLabel>Specific Visual Needs or Challenges</FormLabel><FormControl><Textarea placeholder="e.g., Difficulty with glare, wants thinner lenses" {...field} /></FormControl></FormItem>
                            )}/>
                            <FormField control={form.control} name="stylePreferences" render={({ field }) => (
                                <FormItem><FormLabel>Frame Style Preferences</FormLabel><FormControl><Textarea placeholder="e.g., modern, classic, retro, minimalist" {...field} /></FormControl></FormItem>
                            )}/>
                        </div>
                    </Card>

                    <Card className="p-8">
                      <h3 className="text-2xl font-semibold text-primary mb-8 border-b pb-4">Spectacle Parameters (Optional)</h3>
                      <div className="space-y-8">
                          <div>
                          <h4 className="text-lg font-medium text-white mb-4">Distance Vision</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                              <FormField control={form.control} name="distSphOd" render={({ field }) => (<FormItem><FormLabel>SPH (OD)</FormLabel><FormControl><Input placeholder="-1.25" {...field} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name="distSphOs" render={({ field }) => (<FormItem><FormLabel>SPH (OS)</FormLabel><FormControl><Input placeholder="-1.50" {...field} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name="distCyl" render={({ field }) => (<FormItem><FormLabel>CYL</FormLabel><FormControl><Input placeholder="-0.50" {...field} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name="distAxis" render={({ field }) => (<FormItem><FormLabel>Axis</FormLabel><FormControl><Input placeholder="180" {...field} /></FormControl></FormItem>)} />
                          </div>
                          </div>
                          <div>
                          <h4 className="text-lg font-medium text-white mb-4">Near Vision (ADD)</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                              <FormField control={form.control} name="nearAddOd" render={({ field }) => (<FormItem><FormLabel>ADD (OD)</FormLabel><FormControl><Input placeholder="+2.00" {...field} /></FormControl></FormItem>)} />
                              <FormField control={form.control} name="nearAddOs" render={({ field }) => (<FormItem><FormLabel>ADD (OS)</FormLabel><FormControl><Input placeholder="+2.00" {...field} /></FormControl></FormItem>)} />
                          </div>
                          </div>
                          <div>
                          <h4 className="text-lg font-medium text-white mb-4">Pupillary Distance (PD)</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                              <FormField control={form.control} name="pdDist" render={({ field }) => (<FormItem><FormLabel>Distance PD</FormLabel><FormControl><Input placeholder="63" {...field} /></FormControl></FormItem>)} />
                          </div>
                          </div>
                      </div>
                    </Card>

                    <Card className="p-8">
                        <h3 className="text-2xl font-semibold text-primary mb-8 border-b pb-4">Image & AI Analysis</h3>
                        {isApiKeyMissing && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertTitle>API Key Missing</AlertTitle>
                                <AlertDescription>
                                    The `GEMINI_API_KEY` is not configured. AI analysis features will be disabled.
                                </AlertDescription>
                            </Alert>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                            <div className="flex flex-col items-center w-full">
                                <Label htmlFor="image-upload" className={`relative flex flex-col justify-center items-center w-full h-80 bg-background rounded-lg border-2 border-dashed border-input hover:border-primary transition-all duration-300 overflow-hidden ${imagePreview ? 'border-primary' : ''} ${isAnalyzing || isApiKeyMissing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                                    {imagePreview ? (
                                        <>
                                            <img src={imagePreview} alt="Patient preview" className="w-full h-full object-contain rounded-lg" />
                                            <AnimatePresence>
                                            {isAnalyzing && (
                                                <motion.div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                    <div className='scanline'/>
                                                    <ScanFace className="w-16 h-16 text-primary" />
                                                    <p className="text-white font-medium">Analyzing face...</p>
                                                </motion.div>
                                            )}
                                            </AnimatePresence>
                                        </>
                                    ) : (
                                        <div className="flex flex-col justify-center items-center pt-5 pb-6 text-center">
                                            <UploadCloud className="w-16 h-16 text-muted-foreground mb-4" />
                                            <p className="mb-2 text-lg text-muted-foreground"><span className="font-semibold text-primary">Click to upload image</span></p>
                                            <p className="text-sm text-muted-foreground">PNG, JPG, or JPEG (MAX. 5MB)</p>
                                        </div>
                                    )}
                                </Label>
                                <Input id="image-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={handleImageChange} disabled={isAnalyzing || isApiKeyMissing}/>
                            </div>
                             <div className="grid grid-cols-1 gap-4">
                                  <FormField control={form.control} name="faceShape" render={({ field }) => (
                                      <FormItem><FormLabel>Detected Face Shape</FormLabel><FormControl><Input placeholder="Auto-detected..." {...field} readOnly className="bg-secondary" /></FormControl></FormItem>
                                  )}/>
                                   <FormField control={form.control} name="skinTone" render={({ field }) => (
                                      <FormItem><FormLabel>Detected Skin Tone</FormLabel><FormControl><Input placeholder="Auto-detected..." {...field} readOnly className="bg-secondary"/></FormControl></FormItem>
                                  )}/>

                                <div className="pt-4">
                                     <Button type="button" onClick={handleGenerateRecommendations} disabled={isGenerating || isAnalyzing || !form.getValues('faceShape') || isFetchingData} className='w-full' size="lg">
                                        {isGenerating ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                                        Generate Full Recommendations
                                    </Button>
                                    <p className='text-xs text-muted-foreground mt-2 text-center'>Requires a detected face shape to generate recommendations.</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {isGenerating && (
                        <div className="text-center py-10 flex flex-col items-center gap-4">
                            <Loader className="mx-auto h-8 w-8 animate-spin text-primary" /> 
                            <p className="text-muted-foreground">Running full AI analysis... please wait.</p>
                        </div>
                    )}

                    <AnimatePresence>
                    {analysisResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                        <Card className="p-8 mt-12 bg-card/80 backdrop-blur-sm">
                            <CardTitle className="text-2xl font-bold text-white mb-8 border-b pb-4 flex items-center gap-2"><Sparkles className='text-primary'/> AI-Powered Recommendations</CardTitle>
                            <div className='space-y-12'>
                            {/* Frame Shapes */}
                            {analysisResult.recommendedShapes && (
                                <section>
                                <h3 className="text-xl font-semibold text-primary flex items-center gap-2 mb-2">Recommended Frame Shapes</h3>
                                <p className='text-muted-foreground mb-4'>{analysisResult.recommendedShapes.reasoning}</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {analysisResult.recommendedShapes.recommendations.map(rec => (
                                        <Button type="button" key={rec.shape} variant="outline" className="h-auto py-3 flex flex-col gap-1 items-center" onClick={() => setSelectedShape(rec.shape)}>
                                            <span className="text-base font-semibold">{rec.shape}</span>
                                            <p className="text-xs text-muted-foreground font-normal whitespace-normal text-center">{rec.reasoning}</p>
                                        </Button>
                                    ))}
                                </div>
                                </section>
                            )}
                            {/* Frame Types */}
                            {analysisResult.recommendedTypes && (
                                <section>
                                <h3 className="text-xl font-semibold text-primary flex items-center gap-2 mb-2">Suitable Frame Types</h3>
                                <p className='text-muted-foreground mb-4'>{analysisResult.recommendedTypes.reasoning}</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {analysisResult.recommendedTypes.recommendations.map(rec => (
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
                                <h3 className="text-xl font-semibold text-primary flex items-center gap-2 mb-4">Top Frames for {form.getValues('patientName')}</h3>
                                <Carousel opts={{ align: "start" }} className="w-full">
                                    <CarouselContent>
                                    {recommendedFrames.map((frame) => (
                                        <CarouselItem key={frame.id} className="md:basis-1/2 lg:basis-1/3">
                                        <div className="p-1">
                                            <FrameCard frame={frame} isFavorite={isFavorite} toggleFavorite={toggleFavorite} onPreview={(f) => setSelectedFrame(f)} />
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
                            {analysisResult.recommendedLenses && (
                                <section>
                                <h3 className="text-xl font-semibold text-primary flex items-center gap-2 mb-2"><Eye /> Recommended Lens & Coatings</h3>
                                <p className='text-muted-foreground mb-4'>{analysisResult.recommendedLenses.reasoning}</p>
                                <div className='space-y-4'>
                                    {analysisResult.recommendedLenses.recommendations.map(rec => {
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
                            </div>
                        </Card>
                        </motion.div>
                    )}
                    </AnimatePresence>

                    <div className="pt-10 mt-8 border-t">
                        <Button className="w-full" size="lg" type="submit" disabled={form.formState.isSubmitting || isAnalyzing || isGenerating}>
                            Save Full Case
                            <ArrowRight className="ml-2"/>
                        </Button>
                        <p className='text-xs text-muted-foreground text-center mt-2'>This will save patient info and all generated AI recommendations.</p>
                    </div>
                </div>
            </form>
            </Form>
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

    