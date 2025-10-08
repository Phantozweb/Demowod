
'use server';

/**
 * @fileOverview A flow that selects the best frames from a catalog for a user.
 *
 * - selectFramesFromCatalog - A function that selects frames from a product catalog based on user preferences.
 * - SelectFramesFromCatalogInput - The input type for the selectFramesFromCatalog function.
 * - SelectFramesFromCatalogOutput - The return type for the selectFramesFromCatalog function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FrameSchema = z.object({
  id: z.number(),
  productName: z.string(),
  frameType: z.string().optional(),
  frameShape: z.string().optional(),
  brand: z.string().optional(),
  size: z.string().optional(),
  price: z.object({
    salesPrice: z.number().optional(),
    lkPrice: z.number().optional(),
  }).optional(),
  purchaseCount: z.number().optional(),
  productRating: z.number().optional(),
});

const SelectFramesFromCatalogInputSchema = z.object({
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

const SelectFramesFromCatalogOutputSchema = z.object({
  recommendations: z
    .array(
      z.object({
        id: z
          .number()
          .describe('The ID of the recommended frame from the catalog.'),
        reasoning: z
          .string()
          .describe(
            'A detailed, professional, and visually attractive explanation for why this specific frame is a good fit for the user. Use Markdown for formatting if helpful.'
          ),
      })
    )
    .describe('A list of 3-5 recommended frames from the provided catalog, including top recommendations and price-conscious options.'),
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
  prompt: `You are an expert optician and master stylist. Your goal is to provide a premium, personalized consultation by recommending the absolute best 3-5 eyeglass frames for a user from a given catalog.

**Patient Profile:**
- **Face Shape:** {{{faceShape}}}
- **Stated Style Preferences:** {{{stylePreferences}}}
- **Previous Eyewear Experience:** {{{pastPurchases}}}

**Your Task:**
1.  **Analyze the Catalog:** Carefully review the entire list of available frames. Pay close attention to purchaseCount and productRating to identify top-selling and highly-rated items.
    \`\`\`json
    {{{json frames}}}
    \`\`\`
2.  **Curate Recommendations:** Select a diverse and thoughtful range of **3-5 frames**. Your selection should include:
    *   **A Top Recommendation:** At least one frame that is a clear best-seller or highly-rated, justifying why its popularity is relevant to the user.
    *   **Price-Conscious Options:** A mix of frames at different price points to give the user choices.
    *   **The Perfect Fit:** All recommendations must be an excellent match for the user's face shape, style, and stated needs.
3.  **Craft Compelling Reasoning:** For each recommended frame, you **MUST** provide specific, persuasive, and visually attractive reasoning.
    *   Be concise (2-3 sentences).
    *   Explain *why* that particular frame is a great choice.
    *   Connect your reasoning directly to the user's specific attributes (e.g., "The cat-eye shape of the 'JJ E14409' will beautifully complement your oval face by adding a gentle lift. Given its high rating and popularity, it's a trusted choice for a modern, chic look.").
    *   Make it sound like expert advice, not just a description.
4.  **Return the Output:** Format your response as a JSON object containing the \`id\` of each recommended frame and the crafted \`reasoning\`.`,
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
