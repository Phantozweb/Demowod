
'use server';

/**
 * @fileOverview A comprehensive flow to generate initial frame and lens recommendations.
 *
 * - suggestInitialFrames - A function that provides a full set of initial recommendations.
 * - SuggestInitialFramesInput - The input type for the function.
 * - SuggestInitialFramesOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FrameInfoSchema = z.object({
  id: z.number(),
  productName: z.string(),
  frameType: z.string().optional(),
  frameShape: z.string().optional(),
  price: z.any().optional(),
  purchaseCount: z.number().optional(),
  productRating: z.number().optional(),
});

const LensInfoSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string(),
});

export const SuggestInitialFramesInputSchema = z.object({
  faceShape: z.string().describe("The user's detected face shape."),
  skinTone: z.string().describe("The user's detected skin tone."),
  age: z.number().optional().describe("The patient's age."),
  visualNeeds: z.string().describe("The patient's stated visual needs or challenges."),
  frames: z
    .array(FrameInfoSchema)
    .describe('A list of available frames in the catalog.'),
  lenses: z
    .array(LensInfoSchema)
    .describe('A list of available lenses in the catalog.'),
});
export type SuggestInitialFramesInput = z.infer<typeof SuggestInitialFramesInputSchema>;


const RecommendationSchema = z.object({
  reasoning: z.string().describe('A brief, one-sentence explanation for why this item is a good fit.'),
});

const ShapeRecommendationSchema = RecommendationSchema.extend({
  shape: z.string().describe('A recommended frame shape from the available list.'),
});

const TypeRecommendationSchema = RecommendationSchema.extend({
  type: z.string().describe('A recommended frame type (e.g., "Full Rim") from the available list.'),
});

const FrameRecommendationSchema = RecommendationSchema.extend({
  id: z.number().describe('The ID of the recommended frame from the catalog.'),
});

const LensRecommendationSchema = RecommendationSchema.extend({
  id: z.number().describe('The ID of the recommended lens from the catalog.'),
});


export const SuggestInitialFramesOutputSchema = z.object({
  recommendedShapes: z.object({
    recommendations: z.array(ShapeRecommendationSchema).describe('A list of 3-4 recommended frame shapes.'),
    reasoning: z.string().describe('A one-sentence summary explaining the overall shape recommendation strategy.'),
  }).describe("Recommendations for frame shapes that complement the user's face shape."),

  recommendedTypes: z.object({
     recommendations: z.array(TypeRecommendationSchema).describe('A list of 2-3 recommended frame types.'),
     reasoning: z.string().describe('A one-sentence summary explaining the overall type recommendation strategy.'),
  }).describe("Recommendations for frame types (e.g., rimless, full-rim) suitable for the user."),
  
  topFrames: z.array(FrameRecommendationSchema).describe('A list of 3-5 top-pick frames from the catalog that are an excellent match for the user.'),
  
  recommendedLenses: z.object({
    recommendations: z.array(LensRecommendationSchema).describe('A list of 1-2 recommended lenses and/or coatings.'),
    reasoning: z.string().describe('A one-sentence summary explaining the overall lens recommendation strategy.'),
  }).describe("Lens and coating recommendations based on the user's age and visual needs."),
});
export type SuggestInitialFramesOutput = z.infer<typeof SuggestInitialFramesOutputSchema>;


export async function suggestInitialFrames(
  input: SuggestInitialFramesInput
): Promise<SuggestInitialFramesOutput> {
  // Guard against running analysis without an API key.
  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set. Skipping initial frame suggestions.');
    return {
      recommendedShapes: { recommendations: [], reasoning: 'AI analysis is disabled.' },
      recommendedTypes: { recommendations: [], reasoning: 'AI analysis is disabled.' },
      topFrames: [],
      recommendedLenses: { recommendations: [], reasoning: 'AI analysis is disabled.' },
    };
  }
  return suggestInitialFramesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestInitialFramesPrompt',
  input: { schema: SuggestInitialFramesInputSchema },
  output: { schema: SuggestInitialFramesOutputSchema },
  prompt: `You are an expert optician and master stylist providing a premium, personalized consultation.

**Patient Profile:**
- **Face Shape:** {{{faceShape}}}
- **Skin Tone:** {{{skinTone}}}
- **Age:** {{{age}}}
- **Visual Needs & Lifestyle:** {{{visualNeeds}}}

**Your Task:**
Based on the patient's profile and the provided catalogs, generate a comprehensive set of recommendations.

**1. Frame Shape Recommendations:**
- From the available frame shapes in the catalog, select the top 3-4 shapes that will best complement the user's '{{{faceShape}}}' face shape.
- Provide a concise, one-sentence reasoning for each shape.
- Provide a single, overarching summary sentence for your shape recommendation strategy.
- **You MUST only use shapes from the provided catalog.**

**2. Frame Type Recommendations:**
- From the available frame types (e.g., Full Rim, Rimless, Half Rim), select the 2-3 types that best suit the user's style and needs. For example, Rimless is good for a minimalist look, while Full Rim is more durable.
- Provide a concise, one-sentence reasoning for each recommended type.
- Provide a single, overarching summary sentence for your type recommendation strategy.
- **You MUST only use types from the provided catalog.**

**3. Top Frame Recommendations:**
- Analyze the full frame catalog and select a diverse range of **3-5 top-pick frames**.
- Your selection must be an excellent match for the user's face shape, age, and style as described in their visual needs.
- Consider popularity (purchaseCount) and quality (productRating) as tie-breakers.
- For each frame, provide a compelling, 1-2 sentence reasoning connecting it directly to the patient's profile.

**4. Lens & Coating Recommendations:**
- Analyze the lens catalog.
- Based on the patient's age ('{{{age}}}') and stated visual needs ('{{{visualNeeds}}}'), recommend 1-2 lenses or coatings.
- For example, for a user who "experiences eye strain from computer use", recommend a blue light filtering lens. For an older patient, consider progressive lenses.
- Provide a concise, one-sentence reasoning for each recommendation, explaining how it addresses a specific need.
- Provide a single, overarching summary sentence for your lens recommendation strategy.

**Catalogs for your reference:**
Frame Catalog:
\`\`\`json
{{{json frames}}}
\`\`\`
Lens Catalog:
\`\`\`json
{{{json lenses}}}
\`\`\`
`,
});

const suggestInitialFramesFlow = ai.defineFlow(
  {
    name: 'suggestInitialFramesFlow',
    inputSchema: SuggestInitialFramesInputSchema,
    outputSchema: SuggestInitialFramesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);

    if (!output) {
      console.error('AI initial suggestion flow failed to return a result.', { input });
      throw new Error('The AI returned an empty response for initial suggestions.');
    }
    
    return output;
  }
);

    