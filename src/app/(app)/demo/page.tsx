
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Wand2, Sparkles, FilePlus, History, Book, Heart } from 'lucide-react';
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
                    <svg
                        className="h-8 w-8 shrink-0 text-primary"
                        fill="none"
                        viewBox="0 0 48 48"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                        d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z"
                        fill="currentColor"
                        ></path>
                        <path
                        clipRule="evenodd"
                        d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.261 8 12.2607 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM4.95178 15.2312L21.4543 41.6973C22.6288 43.5809 25.3712 43.5809 26.5457 41.6973L43.0534 15.223C43.0709 15.1948 43.0878 15.1662 43.104 15.1371L41.3563 14.1648C43.104 15.1371 43.1038 15.1374 43.104 15.1371L43.1051 15.135L43.1065 15.1325L43.1101 15.1261L43.1199 15.1082C43.1276 15.094 43.1377 15.0754 43.1497 15.0527C43.1738 15.0075 43.2062 14.9455 43.244 14.8701C43.319 14.7208 43.4196 14.511 43.5217 14.2683C43.6901 13.8679 44 13.0689 44 12.2609C44 10.5573 43.003 9.22254 41.8558 8.2791C40.6947 7.32427 39.1354 6.55361 37.385 5.94477C33.8654 4.72057 29.133 4 24 4C18.867 4 14.1346 4.72057 10.615 5.94478C8.86463 6.55361 7.30529 7.32428 6.14419 8.27911C4.99695 9.22255 3.99999 10.5573 3.99999 12.2609C3.99999 13.1275 4.29264 13.9078 4.49321 14.3607C4.60375 14.6102 4.71348 14.8196 4.79687 14.9689C4.83898 15.0444 4.87547 15.1065 4.9035 15.1529C4.91754 15.1762 4.92954 15.1957 4.93916 15.2111L4.94662 15.223L4.95178 15.2312ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        ></path>
                    </svg>
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

    