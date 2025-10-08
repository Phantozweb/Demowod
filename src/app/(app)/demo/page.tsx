
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, User, Eye, UploadCloud, FlaskConical, Wand2, FilePlus, History, Sparkles, Book, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FrameCard } from '@/components/frame-card';
import { Frame } from '@/lib/types';
import { useFavorites } from '@/hooks/use-favorites';

const FAKE_DEMO_CASE = {
  patientName: 'Alex Ray',
  age: '38',
  occupation: 'Software Engineer',
  stylePreferences: 'Prefers modern, lightweight, and professional frames.',
};

const FAKE_RECOMMENDED_FRAMES: (Frame & { reasoning: string })[] = [
  {
    id: 101,
    productName: 'Vincent Chase',
    brand: 'Air Classic',
    size: 'Medium',
    price: { currency: '$', lkPrice: 79, symbol: '$' , basePrice: 100 },
    productImage: { url: 'https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/371x178/9df78eab33525d08d6e5fb8d27136e95//v/i/vincent-chase-vc-e13782-c1-eyeglasses_g_2515.jpg' },
    reasoning: 'The rectangular shape of the "VC E13782" provides a professional look that complements your oval face shape. Its lightweight construction is ideal for all-day wear, matching your need for comfort as a software engineer.',
    productModelName: 'VC E13782',
    classification: 'eyeglass'
  },
  {
    id: 102,
    productName: 'John Jacobs',
    brand: 'Supreme Steel',
    size: 'Wide',
    price: { currency: '$', lkPrice: 95, symbol: '$' , basePrice: 120 },
    productImage: { url: 'https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/371x178/9df78eab33525d08d6e5fb8d27136e95//j/o/john-jacobs-jj-e13520-c2-eyeglasses_g_2381.jpg' },
    reasoning: 'For a modern and stylish alternative, the "JJ E13520" offers a sleek, metallic finish. This highly-rated frame aligns with your preference for a professional yet contemporary aesthetic.',
    productModelName: 'JJ E13520',
    classification: 'eyeglass'
  },
];

const scenes = [
  { name: 'form-fill', duration: 8000 },
  { name: 'analysis', duration: 5000 },
  { name: 'results', duration: 10000 },
];

export default function ShowcasePage() {
  const [scene, setScene] = useState(0);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    const totalDuration = scenes.reduce((acc, s) => acc + s.duration, 0);
    const interval = setInterval(() => {
      setScene(prevScene => (prevScene + 1) % scenes.length);
    }, scenes[scene].duration);

    return () => clearInterval(interval);
  }, [scene]);

  const currentSceneName = scenes[scene].name;

  return (
    <div className="flex h-svh w-full items-center justify-center bg-secondary p-8">
      <Card className="w-full max-w-6xl h-[80vh] flex overflow-hidden shadow-2xl">
        {/* Fake Sidebar */}
        <div className="w-64 bg-background p-4 flex flex-col justify-between">
            <div>
                <div className='flex items-center gap-2 mb-8'>
                    <Sparkles className="h-8 w-8 text-primary" />
                    <h1 className='text-lg font-bold'>Focus CaseX</h1>
                </div>
                <div className='space-y-2'>
                    <Button variant='ghost' className='w-full justify-start text-muted-foreground data-[active=true]:bg-primary/10 data-[active=true]:text-primary' data-active={true}><FilePlus className='mr-2'/> New Patient</Button>
                    <Button variant='ghost' className='w-full justify-start text-muted-foreground'><History className='mr-2'/> View Cases</Button>
                    <Button variant='ghost' className='w-full justify-start text-muted-foreground'><Book className='mr-2'/> Catalog</Button>
                    <Button variant='ghost' className='w-full justify-start text-muted-foreground'><Heart className='mr-2'/> Favorites</Button>
                </div>
            </div>
            <p className='text-xs text-center text-muted-foreground/50'>Demonstration Mode</p>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-background/90 backdrop-blur-sm p-8 relative overflow-y-auto">
          <AnimatePresence mode="wait">
            {currentSceneName === 'form-fill' && <FormFillScene key="form-fill" />}
            {currentSceneName === 'analysis' && <AnalysisScene key="analysis" />}
            {currentSceneName === 'results' && <ResultsScene key="results" isFavorite={isFavorite} toggleFavorite={toggleFavorite} />}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}

// Typing Effect Hook
const useTypingEffect = (text: string, duration: number) => {
    const [typedText, setTypedText] = useState('');
    useEffect(() => {
        if (text) {
            const delay = duration / text.length;
            let index = 0;
            const intervalId = setInterval(() => {
                setTypedText(prev => prev + text.charAt(index));
                index++;
                if (index >= text.length - 1) {
                    clearInterval(intervalId);
                    setTypedText(text); // Ensure full text is displayed
                }
            }, delay);
            return () => clearInterval(intervalId);
        }
    }, [text, duration]);
    return typedText;
};


const FormFillScene = () => {
    const name = useTypingEffect(FAKE_DEMO_CASE.patientName, 2000);
    const age = useTypingEffect(FAKE_DEMO_CASE.age, 500);
    const occupation = useTypingEffect(FAKE_DEMO_CASE.occupation, 3000);
    const style = useTypingEffect(FAKE_DEMO_CASE.stylePreferences, 4000);

    return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <header>
            <h2 className="text-2xl font-bold text-white">New Patient Analysis</h2>
            <p className="text-muted-foreground">Simulating data entry for a new patient...</p>
          </header>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div><Label>Full Name</Label><Input value={name} readOnly /></div>
                <div><Label>Age</Label><Input value={age} readOnly /></div>
            </div>
            <div><Label>Occupation</Label><Input value={occupation} readOnly /></div>
            <div><Label>Style Preferences</Label><Textarea value={style} readOnly className="h-24"/></div>
          </div>
        </motion.div>
      );
}

const AnalysisScene = () => {
  return (
    <motion.div
      key="analysis"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full text-center"
    >
      <div className="relative w-64 h-64 mb-6">
        <AnimatePresence>
            <motion.div 
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{delay: 0.5}}
                className='h-full w-full'
            >
                <Image src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxwb3J0cmFpdCUyMG1hbGV8ZW58MHx8fHwxNzYwMzU2NDIyfDA&ixlib=rb-4.1.0&q=80&w=1080" alt="Patient" layout="fill" objectFit="cover" className="rounded-full" />
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ delay: 1, duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full border-4 border-primary/50"
                />
            </motion.div>
        </AnimatePresence>
      </div>
      <motion.div
         initial={{opacity: 0, y: 20}}
         animate={{opacity: 1, y: 0}}
         transition={{delay: 1.5, duration: 0.5}}
      >
        <h2 className="text-2xl font-bold flex items-center gap-2"><Wand2 className='text-primary'/> Running AI Analysis</h2>
        <p className="text-muted-foreground mt-2">Analyzing face shape and patient data...</p>
        <Loader2 className="animate-spin h-6 w-6 mx-auto mt-4 text-primary" />
      </motion.div>
    </motion.div>
  );
};


const ResultsScene = ({ isFavorite, toggleFavorite }: { isFavorite: (id: number) => boolean, toggleFavorite: (id: number) => void }) => {
    return (
        <motion.div
          key="results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <header className="mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Sparkles className='text-primary'/> AI Recommendations for Alex Ray</h2>
            <p className="text-muted-foreground">Top 2 frame suggestions based on patient profile.</p>
          </header>
          <div className="space-y-6">
            {FAKE_RECOMMENDED_FRAMES.map((frame, index) => (
              <motion.div
                key={frame.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start bg-card/50 p-4 rounded-lg border"
              >
                <div className="md:col-span-1">
                  <FrameCard frame={frame} isFavorite={isFavorite} toggleFavorite={() => {}} onPreview={() => {}} />
                </div>
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-lg mb-2">AI Reasoning</h3>
                  <p className="text-muted-foreground text-sm bg-background/50 p-3 rounded-md border">
                    {frame.reasoning}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );
}
