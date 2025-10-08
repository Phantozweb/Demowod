
'use server';
/**
 * @fileOverview A flow that analyzes a face image and returns the detected face shape and skin tone.
 *
 * - analyzeFaceShape - A function that takes an image and returns analysis data.
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
export type AnalyzeFaceShapeInput = z.infer<typeof AnalyzeFaceShapeInputSchema>;

const AnalyzeFaceShapeOutputSchema = z.object({
  faceShape: z.string().describe('The detected shape of the face (e.g., Oval, Round, Square).'),
  skinTone: z.string().describe('The detected skin tone of the person in the image.'),
});
export type AnalyzeFaceShapeOutput = z.infer<
  typeof AnalyzeFaceShapeOutputSchema
>;

export async function analyzeFaceShape(
  input: AnalyzeFaceShapeInput
): Promise<AnalyzeFaceShapeOutput> {
  return analyzeFaceShapeFlow(input);
}

const analyzeFaceShapeFlow = ai.defineFlow(
  {
    name: 'analyzeFaceShapeFlow',
    inputSchema: AnalyzeFaceShapeInputSchema,
    outputSchema: AnalyzeFaceShapeOutputSchema,
  },
  async ({ photoDataUri }) => {
    console.log('Analyzing face shape and skin tone...');
    const { output } = await ai.generate({
      model: 'googleai/gemini-pro-vision',
      prompt: `Analyze the provided image to determine the face shape and skin tone.
Return ONLY a valid JSON object with the keys "faceShape" and "skinTone".
Do not include any other text, explanation, or markdown.

The user has provided this image:
{{media url=photoDataUri}}`,
      output: {
        schema: AnalyzeFaceShapeOutputSchema
      }
    });

    if (!output) {
      throw new Error('Analysis failed to return a result.');
    }

    return output;
  }
);
