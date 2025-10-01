'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { getFrameRecommendations } from '@/app/(app)/recommendations/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Bot } from 'lucide-react';

const initialState = {
  success: false,
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90">
      {pending ? 'Thinking...' : 'Get Recommendations'}
      <Sparkles className="ml-2 h-4 w-4" />
    </Button>
  );
}

export function RecommendationForm() {
  const [state, formAction] = useFormState(getFrameRecommendations, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (!state.success && state.message) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="shadow-lg">
        <form action={formAction}>
          <CardHeader>
            <CardTitle className="font-headline">Find Your Perfect Fit</CardTitle>
            <CardDescription>Tell us about yourself, and our AI will do the rest.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="faceShape">Face Shape</Label>
              <Select name="faceShape" required>
                <SelectTrigger id="faceShape">
                  <SelectValue placeholder="Select your face shape" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Round">Round</SelectItem>
                  <SelectItem value="Oval">Oval</SelectItem>
                  <SelectItem value="Square">Square</SelectItem>
                  <SelectItem value="Heart">Heart</SelectItem>
                  <SelectItem value="Diamond">Diamond</SelectItem>
                </SelectContent>
              </Select>
              {state.errors?.faceShape && <p className="text-sm text-destructive">{state.errors.faceShape[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="stylePreferences">Style Preferences</Label>
              <Textarea
                id="stylePreferences"
                name="stylePreferences"
                placeholder="e.g., modern, minimalist, bold, colorful, professional"
                required
                className="min-h-24"
              />
              {state.errors?.stylePreferences && <p className="text-sm text-destructive">{state.errors.stylePreferences[0]}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="pastPurchases">Past Purchases</Label>
              <Textarea
                id="pastPurchases"
                name="pastPurchases"
                placeholder="e.g., I usually wear thin metal frames, but I once had a pair of chunky black glasses."
                required
                className="min-h-24"
              />
              {state.errors?.pastPurchases && <p className="text-sm text-destructive">{state.errors.pastPurchases[0]}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
      <div className="lg:mt-0">
        <Card className="h-full shadow-lg bg-secondary">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <Bot className="mr-2 text-primary" />
              AI Suggestions
            </CardTitle>
            <CardDescription>
              Your personalized frame recommendations will appear here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {state.success && state.data ? (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div>
                  <h3 className="font-semibold mb-2">Suggested Frame Styles:</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {state.data.frameSuggestions.map((suggestion, index) => (
                      <li key={index} className="text-foreground">{suggestion}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Reasoning:</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{state.data.reasoning}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
                <Sparkles className="h-12 w-12 mb-4" />
                <p>Waiting for your preferences...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
