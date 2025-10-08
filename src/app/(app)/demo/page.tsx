
'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCases } from '@/hooks/use-cases';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const DEMO_STEPS = [
  { path: '/patient-analysis/new', duration: 3000, message: 'Starting a new patient analysis...' },
  { path: `/patient-analysis/cases/DEMO-CASE`, duration: 8000, message: 'Viewing saved patient case and running AI analysis...' },
  { path: '/catalog', duration: 5000, message: 'Browsing the product catalog...' },
  { path: '/favorites', duration: 4000, message: 'Checking saved favorite frames...' },
];

const DEMO_CASE_ID = 'DEMO-CASE';

export default function DemoPage() {
  const router = useRouter();
  const { addCase, removeCase, getCase } = useCases();
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const isMounted = useRef(false);

  // This function sets up the data needed for the demo.
  const setupDemo = useCallback(() => {
    // Clear any previous demo case to ensure a clean run.
    if (getCase(DEMO_CASE_ID)) {
      removeCase(DEMO_CASE_ID);
    }
    
    // Create a fresh demo case for this session.
    addCase({
      id: DEMO_CASE_ID,
      patientName: 'Alex Ray',
      age: 38,
      gender: 'male',
      occupation: 'Software Engineer',
      lifestyle: 'Spends >8 hours on the computer daily, enjoys reading on a tablet.',
      visualNeeds: 'Experiences eye strain and occasional headaches after work.',
      stylePreferences: 'Prefers modern, lightweight, and professional frames.',
      pastPurchases: 'Has a pair of classic metal frames, looking for an upgrade.',
      distSphOd: '-2.50',
      distSphOs: '-2.75',
      distCyl: '-0.75',
      distAxis: '175',
      nearAddOd: '+1.25',
      nearAddOs: '+1.25',
      pdDist: '64',
      image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxwb3J0cmFpdCUyMG1hbGV8ZW58MHx8fHwxNzYwMzU2NDIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
      faceShape: 'Oval',
      date: new Date().toISOString(),
      // The 'Pending' status is crucial as it triggers the AI analysis on the case details page.
      status: 'Pending', 
    });
  }, [addCase, removeCase, getCase]);

  // Setup the demo only once when the component mounts.
  useEffect(() => {
    if (!isMounted.current) {
      setupDemo();
      isMounted.current = true;
    }
  }, [setupDemo]);

  // This effect handles the demo's step-by-step progression.
  useEffect(() => {
    const currentStep = DEMO_STEPS[stepIndex];
    
    // Navigate to the current step's page.
    router.push(currentStep.path);

    const interval = 100; // Update progress every 100ms
    const totalIncrements = currentStep.duration / interval;
    let currentProgress = 0;

    // Animate the progress bar over the step's duration.
    const progressInterval = setInterval(() => {
      currentProgress += 1;
      setProgress((currentProgress / totalIncrements) * 100);
    }, interval);

    // After the duration, move to the next step.
    const stepTimeout = setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(0);
      setStepIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % DEMO_STEPS.length;
        // If we've looped back to the start, reset the demo data.
        if (nextIndex === 0) {
          setupDemo();
        }
        return nextIndex;
      });
    }, currentStep.duration);

    // Cleanup timers when the step changes or component unmounts.
    return () => {
      clearTimeout(stepTimeout);
      clearInterval(progressInterval);
    };
  }, [stepIndex, router, setupDemo]);


  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm">
        <div className="w-full max-w-md p-8 text-center">
            <Loader2 className="mx-auto h-16 w-16 animate-spin text-primary mb-6" />
            <h1 className="text-2xl font-bold mb-2">Live Demo in Progress</h1>
            <p className="text-muted-foreground mb-6">
                {DEMO_STEPS[stepIndex].message} Please wait...
            </p>
            <Progress value={progress} className="w-full h-2" />
            <p className="text-sm text-muted-foreground mt-3">Navigating to: <span className='font-mono'>{DEMO_STEPS[stepIndex].path}</span></p>
        </div>
    </div>
  );
}
