import { RecommendationForm } from '@/components/recommendation-form';

export default function RecommendationsPage() {
  return (
    <div className="p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-headline font-bold">AI Frame Recommendations</h1>
        <p className="text-muted-foreground mt-2">Get personalized suggestions powered by generative AI.</p>
      </header>
      <RecommendationForm />
    </div>
  );
}
