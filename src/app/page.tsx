import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    title: 'Virtual Try-On',
    description: 'Upload your photo and see how our frames look on you instantly.',
  },
  {
    title: 'AI Recommendations',
    description: 'Get personalized frame suggestions based on your unique style.',
  },
  {
    title: 'Full Catalog',
    description: 'Browse our extensive collection of high-quality eyewear.',
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-background');

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="relative w-full h-[60vh] md:h-[70vh]">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              priority
              data-ai-hint={heroImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
          <div className="relative h-full flex flex-col items-center justify-center text-center text-primary-foreground p-4">
            <div className="bg-black/30 backdrop-blur-sm p-8 rounded-lg">
              <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight">
                Welcome to OptiView
              </h1>
              <p className="mt-4 max-w-2xl text-lg md:text-xl">
                Find your perfect pair of glasses with cutting-edge technology and style.
              </p>
              <Button asChild size="lg" className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/catalog">
                  Explore Frames <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
              Our Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature) => (
                <Card key={feature.title} className="text-center shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 border-t">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} OptiView. All rights reserved.</p>
          </div>
      </footer>
    </div>
  );
}
