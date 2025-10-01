'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';

const prescriptionSchema = z.object({
  odSph: z.string().optional(),
  odCyl: z.string().optional(),
  odAxis: z.string().optional(),
  osSph: z.string().optional(),
  osCyl: z.string().optional(),
  osAxis: z.string().optional(),
  pd: z.string().min(1, "Pupillary Distance is required"),
});

type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;

export function PrescriptionForm() {
  const { toast } = useToast();
  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      odSph: '', odCyl: '', odAxis: '',
      osSph: '', osCyl: '', osAxis: '',
      pd: ''
    }
  });

  function onSubmit(data: PrescriptionFormValues) {
    console.log(data);
    toast({
      title: 'Prescription Saved',
      description: 'Your prescription details have been successfully saved.',
    });
    form.reset();
  }

  return (
    <Card className="shadow-lg max-w-3xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="font-headline">Enter Your Prescription</CardTitle>
            <CardDescription>
              Please enter the details exactly as they appear on your prescription.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Eye</TableHead>
                  <TableHead>Sphere (SPH)</TableHead>
                  <TableHead>Cylinder (CYL)</TableHead>
                  <TableHead>Axis</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">OD (Right)</TableCell>
                  <TableCell>
                    <FormField control={form.control} name="odSph" render={({ field }) => (
                      <FormItem><FormControl><Input placeholder="+/- X.XX" {...field} /></FormControl></FormItem>
                    )}/>
                  </TableCell>
                  <TableCell>
                    <FormField control={form.control} name="odCyl" render={({ field }) => (
                      <FormItem><FormControl><Input placeholder="+/- X.XX" {...field} /></FormControl></FormItem>
                    )}/>
                  </TableCell>
                  <TableCell>
                    <FormField control={form.control} name="odAxis" render={({ field }) => (
                      <FormItem><FormControl><Input placeholder="0-180" {...field} /></FormControl></FormItem>
                    )}/>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">OS (Left)</TableCell>
                  <TableCell>
                    <FormField control={form.control} name="osSph" render={({ field }) => (
                      <FormItem><FormControl><Input placeholder="+/- X.XX" {...field} /></FormControl></FormItem>
                    )}/>
                  </TableCell>
                  <TableCell>
                    <FormField control={form.control} name="osCyl" render={({ field }) => (
                      <FormItem><FormControl><Input placeholder="+/- X.XX" {...field} /></FormControl></FormItem>
                    )}/>
                  </TableCell>
                   <TableCell>
                    <FormField control={form.control} name="osAxis" render={({ field }) => (
                      <FormItem><FormControl><Input placeholder="0-180" {...field} /></FormControl></FormItem>
                    )}/>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Separator className="my-6" />
             <div className="space-y-2 max-w-xs">
                <FormField
                  control={form.control}
                  name="pd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pupillary Distance (PD)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 63" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="ml-auto">Save Prescription</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
