'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import lensData from '@/lib/lenses.json';
import { CheckCircle } from 'lucide-react';

export default function CatalogPage() {
  const {
    singleVisionLenses,
    progressiveLenses,
    antiReflectiveCoatings,
    photochromicLenses,
    computerWorkLenses,
    keyTechnologies,
  } = lensData;

  const renderLensCard = (lens: any) => (
    <Card key={lens.id} className="flex flex-col">
      <CardHeader>
        <CardTitle>{lens.name}</CardTitle>
        {lens.targetUsers && (
          <CardDescription>{lens.targetUsers}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        <Accordion type="single" collapsible className="w-full">
          {lens.designFeatures && (
            <AccordionItem value="design">
              <AccordionTrigger>Design Features</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc space-y-2 pl-4">
                  {lens.designFeatures.map((feature: any, index: number) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}
          {lens.patientBenefits && (
            <AccordionItem value="benefits">
              <AccordionTrigger>Patient Benefits</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc space-y-2 pl-4">
                  {lens.patientBenefits.map((benefit: any, index: number) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}
          {lens.keyFeatures && (
            <AccordionItem value="key-features">
              <AccordionTrigger>Key Features</AccordionTrigger>
              <AccordionContent>
                 <ul className="list-disc space-y-2 pl-4">
                  {lens.keyFeatures.map((feature: any, index: number) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}
          {lens.overview && (
             <AccordionItem value="overview">
              <AccordionTrigger>Overview</AccordionTrigger>
              <AccordionContent>
                <p>{lens.overview}</p>
              </AccordionContent>
            </AccordionItem>
          )}
          {lens.protectionFeatures && (
             <AccordionItem value="protection">
              <AccordionTrigger>Protection Features</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-4">
                  {lens.protectionFeatures.map((feature: any, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-primary" />
                      <div>
                        <p className="font-semibold">{feature.name}</p>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );

  const renderTechnologyCard = (tech: any) => (
    <Card key={tech.id}>
      <CardHeader>
        <CardTitle className="text-lg">{tech.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{tech.description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-headline font-bold">
          Lens & Technology Catalog
        </h1>
        <p className="mt-2 text-muted-foreground">
          Explore our comprehensive range of HOYA lenses and technologies.
        </p>
      </header>

      <Tabs defaultValue="single-vision">
        <TabsList className="grid w-full grid-cols-2 h-auto sm:grid-cols-3 lg:grid-cols-6 mb-6">
          <TabsTrigger value="single-vision">Single Vision</TabsTrigger>
          <TabsTrigger value="progressive">Progressive</TabsTrigger>
          <TabsTrigger value="anti-reflective">Anti-Reflective</TabsTrigger>
          <TabsTrigger value="photochromic">Photochromic</TabsTrigger>
          <TabsTrigger value="computer-work">Computer & Work</TabsTrigger>
          <TabsTrigger value="technologies">Key Technologies</TabsTrigger>
        </TabsList>
        <TabsContent value="single-vision">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {singleVisionLenses.map(renderLensCard)}
          </div>
        </TabsContent>
        <TabsContent value="progressive">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {progressiveLenses.map(renderLensCard)}
          </div>
        </TabsContent>
        <TabsContent value="anti-reflective">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {antiReflectiveCoatings.map(renderLensCard)}
          </div>
        </TabsContent>
        <TabsContent value="photochromic">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {photochromicLenses.map(renderLensCard)}
          </div>
        </TabsContent>
        <TabsContent value="computer-work">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {computerWorkLenses.map(renderLensCard)}
          </div>
        </TabsContent>
        <TabsContent value="technologies">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {keyTechnologies.map(renderTechnologyCard)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
