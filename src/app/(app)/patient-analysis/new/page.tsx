
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UploadCloud, TestTube2, ArrowRight, Menu, FileText, ScanFace } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCases } from '@/hooks/use-cases';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { analyzeFaceShape } from '@/ai/flows/analyze-face-shape';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useSidebar } from '@/components/ui/sidebar';

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
    const [isApiKeyMissing, setIsApiKeyMissing] = useState(false);
    const { toggleSidebar } = useSidebar();
    
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

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    useEffect(() => {
        setIsApiKeyMissing(process.env.NEXT_PUBLIC_GEMINI_API_KEY_CONFIGURED !== 'true');
    }, []);


    const runAnalysis = async (dataUrl: string) => {
        if (isApiKeyMissing) {
            toast({
                variant: 'destructive',
                title: 'AI Analysis Skipped',
                description: 'GEMINI_API_KEY is not set. Please configure it in your environment.',
            });
            form.setValue('faceShape', 'Not available');
            form.setValue('skinTone', 'Not available');
            return;
        }
        setIsAnalyzing(true);
        try {
            const result = await analyzeFaceShape({ photoDataUri: dataUrl });
            if (result && result.faceShape) {
                form.setValue('faceShape', result.faceShape);
                form.setValue('skinTone', result.skinTone);
                toast({
                    title: 'Analysis Complete',
                    description: `Detected Face Shape: ${result.faceShape}, Skin Tone: ${result.skinTone}`,
                });
            } else {
                throw new Error("AI response was empty or invalid.");
            }
        } catch (error) {
            console.error('Face shape analysis failed:', error);
            toast({
                variant: 'destructive',
                title: 'Analysis Failed',
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
                runAnalysis(dataUrl);
            };
            reader.readAsDataURL(file);
        }
    };

    const fillWithDemoData = () => {
        setIsAnalyzing(false); // Ensure analysis state is reset
        const randomFromArray = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
        
        const names = ['Alex Ray', 'Maria Garcia', 'Chen Wei', 'Fatima Al-Fassi', 'Kenji Tanaka'];
        const genders = ['male', 'female', 'other'];
        const occupations = ['Teacher', 'Software Engineer', 'Graphic Designer', 'Nurse', 'Marketing Manager'];
        const visualNeeds = ['Difficulty with night driving', 'Experiences eye strain from computer use', 'Needs glasses for reading fine print', 'Sensitive to bright lights and glare'];
        const stylePrefs = ['Prefers modern, minimalist frames', 'Likes bold, statement pieces', 'Enjoys a classic, retro look', 'Looks for something professional and understated'];
        const randomStepValue = (min: number, max: number, step: number) => {
            const range = (max - min) / step;
            return (Math.floor(Math.random() * (range + 1)) * step + min).toFixed(2);
        };

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
        form.setValue('faceShape', '');
        form.setValue('skinTone', '');

        toast({
            title: "Demo Data Loaded",
            description: "The form has been filled with random data.",
          });
    }

    function onSubmit(data: PatientCaseFormValues) {
        if (!data.patientName) {
            return;
        }
        
        const fullCase = addCase({
            ...data,
            date: new Date().toISOString(),
            status: 'Pending',
            patientImage: imagePreview
        });
        toast({
            title: 'Case Saved',
            description: `Patient case for ${fullCase.patientName} has been created.`,
        });

        router.push(`/patient-analysis/cases/${fullCase.id}`);
    }
  
  return (
    <div>
        <header className="sticky top-0 z-20 border-b border-border/50 bg-background/80 backdrop-blur-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={toggleSidebar}
                  >
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

            <Card className="p-8">
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-12">
                        {/* Patient Information Section */}
                        <div>
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

                                <div className="grid grid-cols-2 gap-4">
                                  <FormField control={form.control} name="faceShape" render={({ field }) => (
                                      <FormItem><FormLabel>Detected Face Shape</FormLabel><FormControl><Input placeholder="Auto-detected..." {...field} readOnly /></FormControl></FormItem>
                                  )}/>
                                   <FormField control={form.control} name="skinTone" render={({ field }) => (
                                      <FormItem><FormLabel>Detected Skin Tone</FormLabel><FormControl><Input placeholder="Auto-detected..." {...field} readOnly /></FormControl></FormItem>
                                  )}/>
                                </div>
                            </div>
                        </div>

                        {/* Spectacle Parameters Section */}
                        <div>
                            <h3 className="text-2xl font-semibold text-primary mb-8 border-b pb-4">Spectacle Parameters</h3>
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
                        </div>

                        {/* Image Analysis Section */}
                        <div>
                            <h3 className="text-2xl font-semibold text-primary mb-8 border-b pb-4">Image for AI Analysis</h3>
                             {isApiKeyMissing && (
                                <Alert variant="destructive" className="mb-4">
                                    <AlertTitle>API Key Missing</AlertTitle>
                                    <AlertDescription>
                                        The `GEMINI_API_KEY` is not configured in your environment. AI analysis features will be disabled. Please set it up in your hosting provider's settings.
                                    </AlertDescription>
                                </Alert>
                            )}
                            <div className="flex justify-center items-center w-full mt-4">
                                <Label htmlFor="image-upload" className={`relative flex flex-col justify-center items-center w-full h-80 bg-background rounded-lg border-2 border-dashed border-input hover:border-primary transition-all duration-300 overflow-hidden ${imagePreview ? 'border-primary' : ''} ${isAnalyzing || isApiKeyMissing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                                    {imagePreview ? (
                                        <>
                                            <img src={imagePreview} alt="Patient preview" className="w-full h-full object-contain rounded-lg" />
                                            <AnimatePresence>
                                            {isAnalyzing && (
                                                <motion.div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                    <div className='scanline'/>
                                                    <ScanFace className="w-16 h-16 text-primary" />
                                                    <p className="text-white font-medium">Analyzing face shape & skin tone...</p>
                                                </motion.div>
                                            )}
                                            </AnimatePresence>
                                        </>
                                    ) : (
                                        <div className="flex flex-col justify-center items-center pt-5 pb-6">
                                            <UploadCloud className="w-16 h-16 text-muted-foreground mb-4" />
                                            <p className="mb-2 text-lg text-muted-foreground"><span className="font-semibold text-primary">Click to upload</span> or drag and drop</p>
                                            <p className="text-sm text-muted-foreground">PNG, JPG, or JPEG (MAX. 5MB)</p>
                                        </div>
                                    )}
                                </Label>
                                <Input id="image-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={handleImageChange} disabled={isAnalyzing || isApiKeyMissing}/>
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 mt-8 border-t">
                        <Button className="w-full" size="lg" type="submit" disabled={form.formState.isSubmitting || isAnalyzing}>
                            Create Case & Proceed to Analysis
                            <ArrowRight className="ml-2"/>
                        </Button>
                    </div>
                </form>
                </Form>
            </Card>
        </div>
    </div>
  );
}
