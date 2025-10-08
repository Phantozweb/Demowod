
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Wand2, Sparkles, FilePlus, History, Book, Heart, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FrameCard } from '@/components/frame-card';
import { Frame, FrameVariation } from '@/lib/types';
import { useFavorites } from '@/hooks/use-favorites';

const FAKE_DEMO_CASE = {
  patientName: 'Alex Ray',
  age: '38',
  occupation: 'Software Engineer',
  stylePreferences: 'Prefers modern, lightweight, and professional frames.',
};

const scenes = [
  { name: 'form-fill', duration: 8000 },
  { name: 'analysis', duration: 5000 },
  { name: 'results', duration: 10000 },
];

export default function ShowcasePage() {
  const [scene, setScene] = useState(0);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [recommendedFrames, setRecommendedFrames] = useState<(Frame & { reasoning: string })[]>([]);
  const [isLoadingFrames, setIsLoadingFrames] = useState(true);

  useEffect(() => {
    const fetchFrames = async () => {
      const dataSources = [
        '/fullrim-frames.json',
        '/halfrim-frames.json',
        '/rimless-frames.json',
      ];

      try {
        const responses = await Promise.all(
          dataSources.map(url => fetch(url).then(res => res.ok ? res.json() : []))
        );
        const allFrames: Frame[] = responses.flat();
        
        if (allFrames.length >= 2) {
          const frame1 = allFrames.find(f => f.id === 13782) || allFrames[0];
          const frame2 = allFrames.find(f => f.id === 13520) || allFrames[1];

          setRecommendedFrames([
            {
              ...frame1,
              price: { currency: '₹', lkPrice: 1500, symbol: '₹' , basePrice: 2000 },
              reasoning: 'The rectangular shape of this frame provides a professional look that complements an oval face shape. Its lightweight construction is ideal for all-day wear, matching your need for comfort as a software engineer.',
            },
            {
              ...frame2,
              price: { currency: '₹', lkPrice: 3000, symbol: '₹' , basePrice: 4000 },
              reasoning: 'For a modern and stylish alternative, this frame offers a sleek, metallic finish. This highly-rated frame aligns with your preference for a professional yet contemporary aesthetic.',
            },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch frames for demo:', error);
      } finally {
        setIsLoadingFrames(false);
      }
    };

    fetchFrames();
  }, []);

  useEffect(() => {
    if (isLoadingFrames) return;

    const interval = setInterval(() => {
      setScene(prevScene => (prevScene + 1) % scenes.length);
    }, scenes[scene].duration);

    return () => clearInterval(interval);
  }, [scene, isLoadingFrames]);

  const currentSceneName = scenes[scene].name;

  return (
    <div className="flex h-screen w-full items-center justify-center bg-secondary p-8">
      <Card className="w-full max-w-6xl h-[85vh] flex overflow-hidden shadow-2xl">
        {/* Fake Sidebar */}
        <div className="w-64 bg-background p-4 flex flex-col justify-between border-r">
            <div>
                <div className='flex items-center gap-2 mb-8 p-2'>
                    <FileText className="h-8 w-8 shrink-0 text-primary" />
                    <h1 className='text-lg font-bold text-white'>Focus CaseX</h1>
                </div>
                <div className='space-y-2'>
                    <Button variant='ghost' className='w-full justify-start text-primary bg-primary/10' data-active={true}><FilePlus className='mr-2'/> New Patient</Button>
                    <Button variant='ghost' className='w-full justify-start text-muted-foreground'><History className='mr-2'/> View Cases</Button>
                    <Button variant='ghost' className='w-full justify-start text-muted-foreground'><Book className='mr-2'/> Catalog</Button>
                    <Button variant='ghost' className='w-full justify-start text-muted-foreground'><Heart className='mr-2'/> Favorites</Button>
                </div>
            </div>
            <p className='text-xs text-center text-muted-foreground/50'>Demonstration Mode</p>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-secondary/50 p-8 relative overflow-y-auto">
          <AnimatePresence mode="wait">
            {currentSceneName === 'form-fill' && <FormFillScene key="form-fill" />}
            {currentSceneName === 'analysis' && <AnalysisScene key="analysis" />}
            {currentSceneName === 'results' && <ResultsScene key="results" isFavorite={isFavorite} toggleFavorite={toggleFavorite} recommendedFrames={recommendedFrames} isLoading={isLoadingFrames} />}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}

const AnimatedText = ({ text, delay = 0 }: { text: string, delay?: number }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <AnimatePresence>
            {visible && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
                    {text}
                </motion.span>
            )}
        </AnimatePresence>
    );
};

const FormFillScene = () => {
    return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <header>
            <h2 className="text-2xl font-bold">New Patient Analysis</h2>
            <p className="text-muted-foreground">Simulating data entry for a new patient...</p>
          </header>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div><Label>Full Name</Label><Input value={FAKE_DEMO_CASE.patientName} readOnly className='text-white' /></div>
                <div><Label>Age</Label><Input value={FAKE_DEMO_CASE.age} readOnly className='text-white' /></div>
            </div>
            <div><Label>Occupation</Label><Input value={FAKE_DEMO_CASE.occupation} readOnly className='text-white' /></div>
            <div><Label>Style Preferences</Label><Textarea value={FAKE_DEMO_CASE.stylePreferences} readOnly className="h-24 text-white"/></div>
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


const ResultsScene = ({ isFavorite, toggleFavorite, recommendedFrames, isLoading }: { isFavorite: (id: number) => boolean, toggleFavorite: (id: number) => void, recommendedFrames: (Frame & { reasoning: string })[], isLoading: boolean }) => {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
        );
    }
    
    return (
        <motion.div
          key="results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <header className="mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2"><Sparkles className='text-primary'/> AI Recommendations for Alex Ray</h2>
            <p className="text-muted-foreground">Top 2 frame suggestions based on patient profile.</p>
          </header>
          <div className="space-y-6">
            {recommendedFrames.map((frame, index) => (
              <motion.div
                key={frame.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start bg-card p-4 rounded-lg border"
              >
                <div className="md:col-span-1">
                  <FrameCard frame={frame} isFavorite={isFavorite} toggleFavorite={() => {}} onPreview={() => {}} />
                </div>
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-lg mb-2">AI Reasoning</h3>
                  <p className="text-muted-foreground text-sm bg-background p-3 rounded-md border">
                    <AnimatedText text={frame.reasoning} delay={index * 300 + 500} />
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      );
}

    
