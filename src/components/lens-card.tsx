'use client';

import { CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { type Lens } from '@/lib/types';
import { Separator } from './ui/separator';

interface LensCardProps {
  lens: Lens;
}

export function LensCard({ lens }: LensCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{lens.name}</CardTitle>
        <CardDescription>{lens.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div className="space-y-2">
            <h4 className="font-semibold">Key Features:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
                {lens.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
        </div>
        <Separator />
        <div>
            <h4 className="font-semibold">Ideal For:</h4>
            <p className='text-sm text-muted-foreground'>{lens.use_case}</p>
        </div>
      </CardContent>
      <CardFooter className='flex-col items-start'>
         <p className="text-2xl font-bold text-primary">${lens.price.toFixed(2)}</p>
         <Badge variant="outline" className="mt-2">Lens</Badge>
      </CardFooter>
    </Card>
  );
}
