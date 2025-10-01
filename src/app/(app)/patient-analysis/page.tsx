
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FilePlus, History } from 'lucide-react';
import Link from 'next/link';

export default function PatientAnalysisPage() {
  return (
    <div className="p-4 md:p-8">
       <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-headline font-bold">Patient Analysis</h1>
        <p className="mt-2 text-muted-foreground">
          Create a new patient analysis or view saved cases.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 max-w-4xl mx-auto mt-12">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FilePlus className="text-primary" />
              New Patient
            </CardTitle>
            <CardDescription>
              Start a new analysis for a patient, including face shape analysis and frame recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/patient-analysis/new">Create New Analysis</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="text-primary" />
              View Saved Cases
            </CardTitle>
            <CardDescription>
              Browse, review, and manage previously saved patient analysis cases.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/patient-analysis/cases">View Cases</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
