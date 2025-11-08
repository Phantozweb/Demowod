
import { ArrowRight, User, Glasses, Beaker, FileText, Sparkles, Zap, Rocket } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-white">Focus CaseX</h1>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="relative overflow-hidden">
          <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                <span className="block">
                  Welcome to <span className="text-primary">Focus CaseX</span>
                </span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-lg text-muted-foreground sm:text-xl md:mt-5 md:max-w-3xl">
                Made by <a href="https://www.google.com/search?q=janarthan+veeramani" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Janarthan Veeramani</a>
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <div className="inline-flex rounded-md shadow-lg">
                    <Button asChild>
                        <Link href="/patient-analysis">
                        <span>Get Started</span>
                        <ArrowRight className="ml-2" />
                        </Link>
                    </Button>
                </div>
                 <div className="inline-flex rounded-md">
                    <Button asChild variant="outline">
                        <Link href="/demo">
                            <span>View Showcase</span>
                            <ArrowRight className="ml-2" />
                        </Link>
                    </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-secondary py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Demonstrated Features
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Harnessing the power of AI to redefine eye care.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center p-8 rounded-xl bg-background shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="text-3xl" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">
                  AI Face Shape Analyzer
                </h3>
                <p className="mt-2 text-base text-muted-foreground">
                  Our advanced AI precisely identifies face shapes for
                  personalized frame suggestions.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-8 rounded-xl bg-background shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Glasses className="text-3xl" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">
                  Frame Shape Recommender
                </h3>
                <p className="mt-2 text-base text-muted-foreground">
                  Get intelligent frame recommendations that perfectly complement
                  your unique facial features.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-8 rounded-xl bg-background shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Beaker className="text-3xl" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">
                  Lens Recommender
                </h3>
                <p className="mt-2 text-base text-muted-foreground">
                  Receive recommendations for lenses based on prescription,
                  lifestyle, and visual needs.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-background py-16 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-2xl bg-secondary px-6 py-16 shadow-glow sm:px-12 md:py-20 lg:px-16">
                    <div className="absolute inset-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]]"></div>
                    <div className="relative grid md:grid-cols-2 gap-8 items-center">
                        <div className="flex flex-col items-center md:items-start text-center md:text-left">
                             <div className="flex gap-4">
                                <Sparkles className="h-8 w-8 text-primary" />
                                <Zap className="h-8 w-8 text-primary" />
                                <Rocket className="h-8 w-8 text-primary" />
                             </div>
                            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl mt-6">
                                Experience Focus CaseX Live
                            </h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Explore the deployed application and experience the full suite of features firsthand.
                            </p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="text-sm text-amber-400/80 bg-background/50 border border-amber-400/50 rounded-full px-4 py-2">
                                Focus CaseX is under Beta.
                            </p>
                            <Button asChild size="lg" className="mt-6">
                                <a href="https://focuscasex.netlify.app" target="_blank" rel="noopener noreferrer">
                                    Visit Site <ArrowRight className="ml-2" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </main>
      <footer className="bg-secondary border-t border-border">
        <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
              <FileText className="h-8 w-8 text-primary" />
              <h3 className="text-xl font-bold text-white">Focus CaseX</h3>
            </div>
            <p className="max-w-2xl mx-auto text-base text-muted-foreground">
              The future of optical assistance. AI-powered recommendations for the perfect vision and style.
            </p>
            <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
              <p>© 2025 Focus CaseX. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
