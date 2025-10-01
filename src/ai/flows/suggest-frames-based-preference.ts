'use server';

/**
 * @fileOverview Frame recommendation flow based on user preferences.
 *
 * - suggestFramesBasedOnPreference - A function that suggests frames based on user preferences.
 * - SuggestFramesBasedOnPreferenceInput - The input type for the suggestFramesBasedOnPreference function.
 * - SuggestFramesBasedOnPreferenceOutput - The return type for the suggestFramesBasedOnPreference function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFramesBasedOnPreferenceInputSchema = z.object({
  faceShape: z
    .string()
    .describe('The shape of the user\'s face (e.g., round, oval, square).'),
  stylePreferences: z
    .string()
    .describe('The user\'s style preferences (e.g., modern, classic, retro).'),
  pastPurchases: z
    .string()
    .describe('A description of the user\'s past frame purchases.'),
});
export type SuggestFramesBasedOnPreferenceInput = z.infer<
  typeof SuggestFramesBasedOnPreferenceInputSchema
>;

const SuggestFramesBasedOnPreferenceOutputSchema = z.object({
  frameSuggestions: z
    .array(z.string())
    .describe('A list of suggested frame styles based on the user\'s preferences.'),
  reasoning: z.string().describe('Explanation of why these frames were recommended.'),
});
export type SuggestFramesBasedOnPreferenceOutput = z.infer<
  typeof SuggestFramesBasedOnPreferenceOutputSchema
>;

export async function suggestFramesBasedOnPreference(
  input: SuggestFramesBasedOnPreferenceInput
): Promise<SuggestFramesBasedOnPreferenceOutput> {
  return suggestFramesBasedOnPreferenceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFramesBasedOnPreferencePrompt',
  input: {schema: SuggestFramesBasedOnPreferenceInputSchema},
  output: {schema: SuggestFramesBasedOnPreferenceOutputSchema},
  prompt: `You are an expert optician, recommending frames to customers based on their face shape, style preferences, and past purchases.

  Consider the following information about the user:
  Face Shape: {{{faceShape}}}
  Style Preferences: {{{stylePreferences}}}
  Past Purchases: {{{pastPurchases}}}

  Recommend frame styles that would suit the user, providing a brief explanation of why each frame style is recommended in the reasoning field.`,
});

const suggestFramesBasedOnPreferenceFlow = ai.defineFlow(
  {
    name: 'suggestFramesBasedOnPreferenceFlow',
    inputSchema: SuggestFramesBasedOnPreferenceInputSchema,
    outputSchema: SuggestFramesBasedOnPreferenceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
