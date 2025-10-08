
'use server';

/**
 * @fileOverview A flow that analyzes a user's face shape and skin tone from a photo.
 *
 * - analyzeFaceShape - A function that analyzes a face from a photo.
 * - AnalyzeFaceShapeInput - The input type for the analyzeFaceShape function.
 * - AnalyzeFaceShapeOutput - The return type for the analyzeFaceShape function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeFaceShapeInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a person's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeFaceShapeInput = z.infer<
  typeof AnalyzeFaceShapeInputSchema
>;

const AnalyzeFaceShapeOutputSchema = z.object({
  faceShape: z
    .string()
    .describe(
      'The detected face shape (e.g., "Oval", "Round", "Square", "Heart", "Diamond", "Long").'
    ),
  skinTone: z
    .string()
    .describe(
      'The detected skin tone (e.g., "Warm", "Cool", "Neutral").'
    ),
});
export type AnalyzeFaceShapeOutput = z.infer<
  typeof AnalyzeFaceShapeOutputSchema
>;

export async function analyzeFaceShape(
  input: AnalyzeFaceShapeInput
): Promise<AnalyzeFaceShapeOutput> {
  // Guard against running analysis without an API key.
  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set. Skipping analysis.');
    // Return a default value so the app doesn't crash.
    return {
      faceShape: 'Not analyzed',
      skinTone: 'Not analyzed',
    };
  }
  return analyzeFaceShapeFlow(input);
}

const prompt = ai.definePrompt({
    name: 'analyzeFaceShapePrompt',
    input: { schema: AnalyzeFaceShapeInputSchema },
    output: { schema: AnalyzeFaceShapeOutputSchema },
    prompt: `Analyze the provided photo to determine the user's face shape and skin tone.

    Photo: {{media url=photoDataUri}}`,
});


const analyzeFaceShapeFlow = ai.defineFlow(
  {
    name: 'analyzeFaceShapeFlow',
    inputSchema: AnalyzeFaceShapeInputSchema,
    outputSchema: AnalyzeFaceShapeOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);

    if (!output) {
      console.error('AI analysis failed to return a result.', { input });
      throw new Error('The AI returned an empty response.');
    }
    
    // The prompt definition ensures the output is valid JSON.
    return output;
  }
);
