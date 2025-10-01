
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Trash2 } from 'lucide-react';
import { useCases } from '@/hooks/use-cases';
import Link from 'next/link';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"

export default function ViewCasesPage() {
  const { cases, isInitialized, removeCase } = useCases();

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-headline font-bold">
          Saved Patient Cases
        </h1>
        <p className="mt-2 text-muted-foreground">
          Review and manage all saved patient analyses.
        </p>
      </header>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Patient Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Face Shape</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isInitialized && cases.map((caseItem) => (
                <TableRow key={caseItem.id}>
                  <TableCell className="font-medium">{caseItem.id}</TableCell>
                  <TableCell>{caseItem.patientName}</TableCell>
                  <TableCell>{new Date(caseItem.date).toLocaleDateString()}</TableCell>
                  <TableCell>{caseItem.faceShape || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={caseItem.status === 'Completed' ? 'default' : 'secondary'}>
                      {caseItem.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild aria-label="View case">
                        <Link href={`/patient-analysis/cases/${caseItem.id}`}>
                            <Eye className="h-4 w-4" />
                        </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive" aria-label="Delete case">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this patient case.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => removeCase(caseItem.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
         {isInitialized && cases.length === 0 && (
          <div className="text-center py-20 border-t">
              <h2 className="text-xl font-semibold">No saved cases found.</h2>
              <p className="mt-2 text-muted-foreground">Start a new patient analysis to see it here.</p>
               <Button asChild className="mt-6" variant="default">
                  <Link href="/patient-analysis/new">Create New Analysis</Link>
              </Button>
          </div>
        )}
         {!isInitialized && (
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Case ID</TableHead>
                        <TableHead>Patient Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Face Shape</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded"></div></TableCell>
                        <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded"></div></TableCell>
                        <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded"></div></TableCell>
                        <TableCell><div className="h-4 w-16 bg-muted animate-pulse rounded"></div></TableCell>
                        <TableCell><div className="h-6 w-24 bg-muted animate-pulse rounded-full"></div></TableCell>
                        <TableCell className="text-right flex justify-end gap-2">
                           <div className="h-8 w-8 bg-muted animate-pulse rounded-full"></div>
                           <div className="h-8 w-8 bg-muted animate-pulse rounded-full"></div>
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
         )}
      </Card>

    </div>
  );
}
