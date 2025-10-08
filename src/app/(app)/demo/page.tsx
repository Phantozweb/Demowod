
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCases } from '@/hooks/use-cases';
import { Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const DEMO_STEPS = [
  { path: '/patient-analysis/new', duration: 8000, message: 'Starting a new patient analysis...' },
  { path: '/patient-analysis/cases', duration: 5000, message: 'Viewing saved patient cases...' },
  { path: '/catalog', duration: 7000, message: 'Browsing the product catalog...' },
  { path: '/favorites', duration: 5000, message: 'Checking saved favorite frames...' },
];

const DEMO_CASE_ID = 'DEMO-001';

export default function DemoPage() {
  const router = useRouter();
  const { addCase, removeCase, getCase } = useCases();
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const setupDemo = useCallback(() => {
    // Clear any previous demo case
    if (getCase(DEMO_CASE_ID)) {
      removeCase(DEMO_CASE_ID);
    }
    
    // Create a fresh demo case for this session
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
      status: 'Pending', // This will trigger the analysis on the case page
    });
  }, [addCase, removeCase, getCase]);

  useEffect(() => {
    setupDemo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const currentStep = DEMO_STEPS[stepIndex];
    let stepPath = currentStep.path;

    // For the case detail view, we need the specific demo case ID
    if (stepPath.includes('/patient-analysis/cases') && stepIndex === 1) {
        stepPath = `/patient-analysis/cases/${DEMO_CASE_ID}`;
    }

    // Navigate to the next step's path
    router.push(stepPath);

    const interval = 100; // ms
    const totalIncrements = currentStep.duration / interval;
    let currentProgress = 0;

    // Animate the progress bar
    const progressInterval = setInterval(() => {
      currentProgress += 1;
      setProgress((currentProgress / totalIncrements) * 100);
    }, interval);

    // Set a timeout to move to the next step
    const stepTimeout = setTimeout(() => {
      clearInterval(progressInterval);
      setStepIndex((prevIndex) => (prevIndex + 1) % DEMO_STEPS.length);
    }, currentStep.duration);

    // Cleanup function to clear timeouts and intervals
    return () => {
      clearTimeout(stepTimeout);
      clearInterval(progressInterval);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, router]);


  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="w-full max-w-md p-8 text-center">
            <Loader2 className="mx-auto h-16 w-16 animate-spin text-primary mb-6" />
            <h1 className="text-2xl font-bold mb-2">Live Demo in Progress</h1>
            <p className="text-muted-foreground mb-6">
                {DEMO_STEPS[stepIndex].message} Please wait...
            </p>
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">Navigating to: {DEMO_STEPS[stepIndex].path}</p>
        </div>
    </div>
  );
}
