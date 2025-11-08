
'use server';

/**
 * @fileOverview A flow that suggests frame shapes based on face shape and available inventory.
 *
 * - suggestFrameShapes - A function that suggests frame shapes.
 * - SuggestFrameShapesInput - The input type for the suggestFrameShapes function.
 * - SuggestFrameShapesOutput - The return type for the suggestFrameShapes function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestFrameShapesInputSchema = z.object({
  faceShape: z.string().describe("The user's detected face shape."),
  availableShapes: z
    .array(z.string())
    .describe('A list of frame shapes available in the product catalog.'),
});
export type SuggestFrameShapesInput = z.infer<
  typeof SuggestFrameShapesInputSchema
>;

const SuggestFrameShapesOutputSchema = z.object({
  recommendations: z
    .array(
      z.object({
        shape: z.string().describe('A recommended frame shape from the available list.'),
        reasoning: z
          .string()
          .describe(
            'A brief, one-sentence explanation for why this shape is a good fit.'
          ),
      })
    )
    .describe('A list of 3-4 recommended frame shapes.'),
  reasoning: z
    .string()
    .describe(
      'A one-sentence summary explaining the overall recommendation strategy.'
    ),
});
export type SuggestFrameShapesOutput = z.infer<
  typeof SuggestFrameShapesOutputSchema
>;

export async function suggestFrameShapes(
  input: SuggestFrameShapesInput
): Promise<SuggestFrameShapesOutput> {
  // Guard against running analysis without an API key.
  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set. Skipping shape suggestion.');
    return {
      recommendations: [],
      reasoning: 'AI analysis is disabled. No API key provided.',
    };
  }
  return suggestFrameShapesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFrameShapesPrompt',
  input: { schema: SuggestFrameShapesInputSchema },
  output: { schema: SuggestFrameShapesOutputSchema },
  prompt: `You are an expert stylist. Your task is to recommend the best frame shapes for a user based on their face shape.

**User's Face Shape:** {{{faceShape}}}

**Available Frame Shapes in Catalog:**
{{#each availableShapes}}- {{{this}}}\n{{/each}}

**Instructions:**
1.  From the **Available Frame Shapes in Catalog** list provided, select the top 3-4 shapes that would best complement the user's face shape.
2.  **You MUST only use shapes from the provided list.** Do not invent shapes.
3.  For each recommended shape, provide a concise, one-sentence reasoning explaining why it's a good choice (e.g., "Adds angles to soften features," "Balances proportions," "Complements your natural lines").
4.  Provide a single, overarching summary sentence for your recommendation strategy.`,
});

const suggestFrameShapesFlow = ai.defineFlow(
  {
    name: 'suggestFrameShapesFlow',
    inputSchema: SuggestFrameShapesInputSchema,
    outputSchema: SuggestFrameShapesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);

    if (!output) {
      console.error('AI shape suggestion failed to return a result.', { input });
      throw new Error('The AI returned an empty response for shape suggestions.');
    }
    
    return output;
  }
);
