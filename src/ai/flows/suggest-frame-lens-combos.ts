
'use server';

/**
 * @fileOverview A flow that suggests frame and lens combinations.
 *
 * - suggestFrameLensCombos - A function that suggests combos based on user preferences.
 * - SuggestFrameLensCombosInput - The input type for the suggestFrameLensCombos function.
 * - SuggestFrameLensCombosOutput - The return type for the suggestFrameLensCombos function.
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

const LensSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    features: z.array(z.string()),
    use_case: z.string(),
    targetUser: z.string(),
    category: z.string(),
});

const SuggestFrameLensCombosInputSchema = z.object({
  visualNeeds: z.string().describe("The user's specific visual needs and daily activities (e.g., 'heavy computer use, glare sensitivity', 'needs glasses for driving at night')."),
  stylePreferences: z.string().describe("The user's aesthetic preferences for frames (e.g., 'modern and minimalist', 'bold statement pieces', 'classic and professional')."),
  frames: z.array(FrameSchema).describe('A list of available frames in the catalog.'),
  lenses: z.array(LensSchema).describe('A list of available lenses in the catalog.'),
});
export type SuggestFrameLensCombosInput = z.infer<typeof SuggestFrameLensCombosInputSchema>;

const SuggestFrameLensCombosOutputSchema = z.object({
  recommendations: z
    .array(
      z.object({
        frameId: z.number().describe('The ID of the recommended frame.'),
        lensId: z.number().describe('The ID of the recommended lens.'),
        reasoning: z.string().describe('A detailed explanation for why this frame and lens combination is a good fit for the user, explaining how they complement each other and meet the user\'s needs.'),
      })
    )
    .describe('A list of 2-3 recommended frame and lens combinations.'),
});
export type SuggestFrameLensCombosOutput = z.infer<typeof SuggestFrameLensCombosOutputSchema>;

export async function suggestFrameLensCombos(
  input: SuggestFrameLensCombosInput
): Promise<SuggestFrameLensCombosOutput> {
  return suggestFrameLensCombosFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFrameLensCombosPrompt',
  input: { schema: SuggestFrameLensCombosInputSchema },
  output: { schema: SuggestFrameLensCombosOutputSchema },
  prompt: `You are an expert AI stylist for eyewear. Your task is to recommend 2-3 complete eyewear packages (a frame and a lens) based on the user's needs and the available product catalogs.

**User Profile:**
- **Visual Needs & Lifestyle:** {{{visualNeeds}}}
- **Style Preferences:** {{{stylePreferences}}}

**Your Task:**
1.  **Analyze the Catalogs:** Review the provided lists of frames and lenses.
    *   **Frames:** \`\`\`json
        {{{json frames}}}
        \`\`\`
    *   **Lenses:** \`\`\`json
        {{{json lenses}}}
        \`\`\`
2.  **Create Holistic Recommendations:** Select 2-3 pairs of one frame and one lens. Each pairing should be a thoughtful match.
3.  **Craft Compelling Reasoning:** For each combination, provide a concise (2-3 sentences) and persuasive reasoning.
    *   Explain how the chosen **lens** directly addresses the user's **visual needs**.
    *   Explain how the chosen **frame** aligns with the user's **style preferences**.
    *   Briefly mention why the frame and lens work well *together*.
    *   Example Reasoning: "For your heavy computer use, the 'Sync III™' lens is ideal as its 'boost zone' reduces digital eye strain. We've paired it with the 'Minimalist Silver' frame, which perfectly matches your preference for modern, understated style. This combination offers top-tier visual comfort in a sleek, professional package."
4.  **Return the Output:** Format your response as a JSON object containing the \`frameId\`, \`lensId\`, and the crafted \`reasoning\` for each recommendation.`,
});

const suggestFrameLensCombosFlow = ai.defineFlow(
  {
    name: 'suggestFrameLensCombosFlow',
    inputSchema: SuggestFrameLensCombosInputSchema,
    outputSchema: SuggestFrameLensCombosOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
