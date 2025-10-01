
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

const savedCases = [
  {
    id: 'CASE-001',
    patientName: 'John Doe',
    date: '2024-07-29',
    faceShape: 'Oval',
    status: 'Completed',
  },
  {
    id: 'CASE-002',
    patientName: 'Jane Smith',
    date: '2024-07-28',
    faceShape: 'Round',
    status: 'Pending',
  },
  {
    id: 'CASE-003',
    patientName: 'Peter Jones',
    date: '2024-07-27',
    faceShape: 'Square',
    status: 'Completed',
  },
];

export default function ViewCasesPage() {
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
              {savedCases.map((caseItem) => (
                <TableRow key={caseItem.id}>
                  <TableCell className="font-medium">{caseItem.id}</TableCell>
                  <TableCell>{caseItem.patientName}</TableCell>
                  <TableCell>{caseItem.date}</TableCell>
                  <TableCell>{caseItem.faceShape}</TableCell>
                  <TableCell>
                    <Badge variant={caseItem.status === 'Completed' ? 'default' : 'secondary'}>
                      {caseItem.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" aria-label="View case">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" aria-label="Delete case">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
       {savedCases.length === 0 && (
          <div className="text-center py-20">
              <h2 className="text-xl font-semibold">No saved cases found.</h2>
              <p className="mt-2 text-muted-foreground">Start a new patient analysis to see it here.</p>
          </div>
        )}
    </div>
  );
}
