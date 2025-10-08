'use server';

/**
 * @fileOverview A flow that selects the best frames from a catalog for a user.
 *
 * - selectFramesFromCatalog - A function that selects frames from a product catalog based on user preferences.
 * - SelectFramesFromCatalogInput - The input type for the selectFramesFromCatalog function.
 * - SelectFramesFromCatalogOutput - The return type for the selectFramesFromCatalog function.
 */

import { ai } from '@/ai/genkit';
import { Frame } from '@/lib/types';
import { z } from 'genkit';

const FrameSchema = z.object({
  id: z.number(),
  productName: z.string(),
  frameType: z.string().optional(),
  frameShape: z.string().optional(),
  brand: z.string().optional(),
  size: z.string().optional(),
});

export const SelectFramesFromCatalogInputSchema = z.object({
  faceShape: z.string().describe("The user's face shape."),
  stylePreferences: z.string().describe("The user's style preferences."),
  pastPurchases: z
    .string()
    .describe("A description of the user's past frame purchases."),
  frames: z
    .array(FrameSchema)
    .describe('A list of available frames in the catalog.'),
});
export type SelectFramesFromCatalogInput = z.infer<
  typeof SelectFramesFromCatalogInputSchema
>;

export const SelectFramesFromCatalogOutputSchema = z.object({
  recommendations: z
    .array(
      z.object({
        id: z
          .number()
          .describe('The ID of the recommended frame from the catalog.'),
        reasoning: z
          .string()
          .describe(
            'A detailed, professional explanation for why this specific frame is a good fit for the user.'
          ),
      })
    )
    .describe('A list of 3-5 recommended frames from the provided catalog.'),
});
export type SelectFramesFromCatalogOutput = z.infer<
  typeof SelectFramesFromCatalogOutputSchema
>;

export async function selectFramesFromCatalog(
  input: SelectFramesFromCatalogInput
): Promise<SelectFramesFromCatalogOutput> {
  return selectFramesFromCatalogFlow(input);
}

const prompt = ai.definePrompt({
  name: 'selectFramesFromCatalogPrompt',
  input: { schema: SelectFramesFromCatalogInputSchema },
  output: { schema: SelectFramesFromCatalogOutputSchema },
  prompt: `You are an expert optician and stylist. Your task is to recommend the best 3-5 eyeglass frames for a user from a given catalog.

Analyze the user's information and the provided list of frames.

**User Information:**
- **Face Shape:** {{{faceShape}}}
- **Style Preferences:** {{{stylePreferences}}}
- **Past Purchases/Preferences:** {{{pastPurchases}}}

**Your Task:**
1.  Carefully review the entire list of available frames:
    \`\`\`json
    {{{json frames}}}
    \`\`\`
2.  Select the **top 3-5 frames** from the list that best match the user's face shape, style, and stated needs.
3.  For each recommended frame, you **MUST** provide a specific, compelling reasoning. The reasoning should be concise (2-3 sentences) and explain *why* that particular frame is a great choice, connecting it to the user's specific attributes (e.g., "The cat-eye shape of the 'JJ E14409' will complement your oval face by adding width to the upper part of your face," or "Given your preference for modern styles, the minimalist design of the 'VC E13788' is an excellent match.").
4.  Return the output as a JSON object containing the IDs of the recommended frames and the reasoning for each.`,
});

const selectFramesFromCatalogFlow = ai.defineFlow(
  {
    name: 'selectFramesFromCatalogFlow',
    inputSchema: SelectFramesFromCatalogInputSchema,
    outputSchema: SelectFramesFromCatalogOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
