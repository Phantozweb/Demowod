'use client';

import { useState } from 'react';
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
import lensData from '@/lib/lenses.json';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { frames } from '@/lib/frames';
import { FrameCard } from '@/components/frame-card';
import { useFavorites } from '@/hooks/use-favorites';


export default function CatalogPage() {
  const {
    singleVisionLenses,
    progressiveLenses,
    antiReflectiveCoatings,
    photochromicLenses,
    computerWorkLenses,
    sunSolutions,
  } = lensData as any;

  const [searchTerm, setSearchTerm] = useState('');
  const [frameType, setFrameType] = useState('all');
  const [frameShape, setFrameShape] = useState('all');
  const { isFavorite, toggleFavorite } = useFavorites();

  const filterLenses = (lenses: any[]) => {
    return lenses.filter((lens) => {
      const nameMatch = lens.name.toLowerCase().includes(searchTerm.toLowerCase());
      // These are placeholders for now as we don't have this data in lenses.json
      const frameTypeMatch = frameType === 'all' ? true : true;
      const frameShapeMatch = frameShape === 'all' ? true : true;
      return nameMatch && frameTypeMatch && frameShapeMatch;
    });
  };

  const renderLensCard = (lens: any) => (
    <Card key={lens.id} className="flex flex-col">
      <CardHeader>
        <CardTitle>{lens.name}</CardTitle>
        {lens.description && (
          <CardDescription>{lens.description}</CardDescription>
        )}
        {lens.targetUsers && (
          <CardDescription className="italic pt-2">{lens.targetUsers}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        <Accordion type="single" collapsible className="w-full">
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
          {lens.overview && (
             <AccordionItem value="overview">
              <AccordionTrigger>Overview</AccordionTrigger>
              <AccordionContent>
                <p>{lens.overview}</p>
              </AccordionContent>
            </AccordionItem>
          )}
           {lens.options && (
            <AccordionItem value="options">
              <AccordionTrigger>Options</AccordionTrigger>
              <AccordionContent>
                {Array.isArray(lens.options) ? (
                  <ul className="list-disc space-y-2 pl-4">
                    {lens.options.map((option: any, index: number) => (
                      <li key={index}>
                        {option.name ? (
                          <>
                            <strong>{option.name}:</strong> {option.description}
                          </>
                        ) : (
                          option
                        )}
                      </li>
                    ))}
                  </ul>
                ) : <p>{lens.options}</p>}
              </AccordionContent>
            </AccordionItem>
          )}
          {lens.availableColors && (
            <AccordionItem value="colors">
              <AccordionTrigger>Available Colors</AccordionTrigger>
              <AccordionContent>
                <p>{lens.availableColors}</p>
              </AccordionContent>
            </AccordionItem>
          )}
          {lens.technicalSpecifications && (
            <AccordionItem value="specs">
              <AccordionTrigger>Technical Specifications</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1">
                  <li><strong>Min. Fitting Height:</strong> {lens.technicalSpecifications.minFittingHeight}</li>
                  <li><strong>Corridor Lengths:</strong> {lens.technicalSpecifications.corridorLengths}</li>
                  {lens.technicalSpecifications.positionOfWear && <li>Position of Wear considered</li>}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );

  const renderContent = (lenses: any[]) => {
    const filteredLenses = filterLenses(lenses);
    if (filteredLenses.length === 0) {
      return <div className="text-center py-20 text-muted-foreground">No products found matching your criteria.</div>
    }
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredLenses.map(renderLensCard)}
      </div>
    )
  }

  const renderFrames = () => {
    const filteredFrames = frames.filter(frame => {
        const nameMatch = frame.productName.toLowerCase().includes(searchTerm.toLowerCase());
        const typeMatch = frameType === 'all' || frame.frameType.toLowerCase() === frameType;
        const shapeMatch = frameShape === 'all' || frame.frameShape.toLowerCase() === frameShape;
        return nameMatch && typeMatch && shapeMatch;
    });

    if (filteredFrames.length === 0) {
      return <div className="text-center py-20 text-muted-foreground">No frames found matching your criteria.</div>
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {filteredFrames.map(frame => (
                <FrameCard key={frame.id} frame={frame} isFavorite={isFavorite} toggleFavorite={toggleFavorite} />
            ))}
        </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-headline font-bold">
          Product Catalog
        </h1>
        <p className="mt-2 text-muted-foreground">
          Explore our comprehensive range of frames, lenses and treatments.
        </p>
      </header>

      <div className="mb-8 p-4 border rounded-lg bg-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    placeholder="Search by product name..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Select value={frameType} onValueChange={setFrameType}>
                <SelectTrigger>
                    <SelectValue placeholder="Frame Type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Frame Types</SelectItem>
                    <SelectItem value="full rim">Full Rim</SelectItem>
                    <SelectItem value="half rim">Half Rim</SelectItem>
                    <SelectItem value="rimless">Rimless</SelectItem>
                </SelectContent>
            </Select>
             <Select value={frameShape} onValueChange={setFrameShape}>
                <SelectTrigger>
                    <SelectValue placeholder="Frame Shape" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Frame Shapes</SelectItem>
                    <SelectItem value="rectangle">Rectangle</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="round">Round</SelectItem>
                    <SelectItem value="aviator">Aviator</SelectItem>
                    <SelectItem value="cat eye">Cat Eye</SelectItem>
                    <SelectItem value="geometric">Geometric</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      <Tabs defaultValue="frames" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-auto sm:grid-cols-3 lg:grid-cols-7 mb-6">
          <TabsTrigger value="frames">Frames</TabsTrigger>
          <TabsTrigger value="progressive">Progressive</TabsTrigger>
          <TabsTrigger value="single-vision">Single Vision</TabsTrigger>
          <TabsTrigger value="computer-work">Computer & Work</TabsTrigger>
          <TabsTrigger value="anti-reflective">Anti-Reflective</TabsTrigger>
          <TabsTrigger value="photochromic">Photochromic</TabsTrigger>
          <TabsTrigger value="sun-solutions">Sun Solutions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="frames">
          {renderFrames()}
        </TabsContent>
        <TabsContent value="progressive">
          {renderContent(progressiveLenses)}
        </TabsContent>
        <TabsContent value="single-vision">
          {renderContent(singleVisionLenses)}
        </TabsContent>
        <TabsContent value="computer-work">
          {renderContent(computerWorkLenses)}
        </TabsContent>
        <TabsContent value="anti-reflective">
          {renderContent(antiReflectiveCoatings)}
        </TabsContent>
        <TabsContent value="photochromic">
          {renderContent(photochromicLenses)}
        </TabsContent>
        <TabsContent value="sun-solutions">
          {renderContent(sunSolutions)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
