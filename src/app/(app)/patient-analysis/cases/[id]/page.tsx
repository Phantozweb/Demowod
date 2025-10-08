
'use client';

import { useParams } from 'next/navigation';
import { useCases, type PatientCase } from '@/hooks/use-cases';
import { useEffect, useState } from 'react';
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
} from 'lucide-react';
import Image from 'next/image';
import {
  suggestFramesBasedOnPreference,
  type SuggestFramesBasedOnPreferenceOutput,
} from '@/ai/flows/suggest-frames-based-preference';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function CaseDetailPage() {
  const params = useParams();
  const { getCase, updateCase } = useCases();
  const { toast } = useToast();
  const [caseItem, setCaseItem] =
    useState<PatientCase | undefined>(undefined);
  const [analysisResult, setAnalysisResult] =
    useState<SuggestFramesBasedOnPreferenceOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof params.id === 'string') {
      const foundCase = getCase(params.id);
      setCaseItem(foundCase);
      if (foundCase?.analysis) {
        setAnalysisResult(foundCase.analysis);
      }
    }
  }, [params.id, getCase]);

  const handleStartAnalysis = async () => {
    if (!caseItem) return;

    setIsLoading(true);
    try {
      const result = await suggestFramesBasedOnPreference({
        faceShape: caseItem.faceShape || 'oval',
        stylePreferences: caseItem.stylePreferences || 'not specified',
        pastPurchases: caseItem.pastPurchases || 'not specified',
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
        description:
          'There was an error generating the AI recommendations. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(caseItem && caseItem.status === 'Pending' && !caseItem.analysis) {
        handleStartAnalysis();
    }
  }, [caseItem]);


  if (!caseItem) {
    return (
      <div className="flex justify-center items-center min-h-svh">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
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
              {caseItem.image && (
                <div className="relative aspect-square w-full rounded-lg overflow-hidden border">
                  <Image
                    src={caseItem.image}
                    alt={caseItem.patientName}
                    fill
                    className="object-cover"
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
                <p>
                  <span className="font-semibold">Occupation:</span>{' '}
                  {caseItem.occupation || 'N/A'}
                </p>
                <p>
                  <span className="font-semibold">Lifestyle:</span>{' '}
                  {caseItem.lifestyle || 'N/A'}
                </p>
                <p>
                  <span className="font-semibold">Visual Needs:</span>{' '}
                  {caseItem.visualNeeds || 'N/A'}
                </p>
                <p>
                  <span className="font-semibold">Style Prefs:</span>{' '}
                  {caseItem.stylePreferences || 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye /> Prescription
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div className="flex justify-between">
                <span>OD (Right):</span>
                <span>
                  {caseItem.distSphOd} / {caseItem.distCyl} x{' '}
                  {caseItem.distAxis}
                </span>
              </div>
              <div className="flex justify-between">
                <span>OS (Left):</span>
                <span>
                  {caseItem.distSphOs} / {caseItem.distCyl} x{' '}
                  {caseItem.distAxis}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Near ADD:</span>
                <span>
                  {caseItem.nearAddOd} / {caseItem.nearAddOs}
                </span>
              </div>
              <div className="flex justify-between">
                <span>PD:</span>
                <span>{caseItem.pdDist}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-secondary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Wand2 /> AI Analysis & Recommendations
              </CardTitle>
              <CardDescription>
                Powered by Gemini AI to provide personalized suggestions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!analysisResult && isLoading && (
                <div className="text-center py-10">
                   <Loader className="mx-auto h-8 w-8 animate-spin mb-4" /> 
                  <p className="text-muted-foreground mb-4">
                    Running AI analysis to get frame recommendations...
                  </p>
                </div>
              )}
              {analysisResult && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <FlaskConical className="text-primary" /> Recommended Frames
                    </h3>
                    <ul className="list-disc list-inside space-y-2 pl-2">
                      {analysisResult.frameSuggestions.map((suggestion) => (
                        <li key={suggestion}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      <Info className="text-primary" /> Reasoning
                    </h3>
                    <p className="text-muted-foreground bg-background/50 p-4 rounded-md border">
                      {analysisResult.reasoning}
                    </p>
                  </div>
                </div>
              )}
               {caseItem.status === 'Completed' && analysisResult && !isLoading &&(
                 <Button onClick={handleStartAnalysis} disabled={isLoading} size="sm" className="mt-4">
                    {isLoading ? 'Re-running...' : 'Re-run Analysis'}
                </Button>
               )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
