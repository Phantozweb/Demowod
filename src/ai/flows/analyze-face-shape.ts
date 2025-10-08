
'use server';
/**
 * @fileOverview A flow that analyzes a face image and returns a new image with analysis markings,
 * along with the detected face shape and skin tone.
 *
 * - analyzeFaceShape - A function that takes an image and returns an "analyzed" version with data.
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
  analyzedPhotoDataUri: z
    .string()
    .describe('The data URI of the generated image with analysis markings.'),
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
    console.log('Generating image and analyzing face...');
    const { output } = await ai.generate({
      model: 'googleai/gemini-pro-vision',
      prompt: `You are a sophisticated facial analysis AI working for a brand called Focus.Ai.
Your task is to analyze the face in the provided image. First, briefly describe your analysis steps as if you are scanning the image. Then, return a JSON object with your analysis of the face shape and skin tone.

JSON Output Instructions:
- Identify the primary face shape (e.g., "Oval", "Round", "Square", "Heart", "Diamond", "Oblong").
- Identify the skin tone (e.g., "Fair", "Light", "Medium", "Tan", "Dark").

The user has provided this image:
{{media url=photoDataUri}}`,
      output: {
        schema: z.object({
            faceShape: z.string().describe('The detected shape of the face (e.g., Oval, Round, Square).'),
            skinTone: z.string().describe('The detected skin tone of the person in the image.'),
        })
      }
    });

    if (!output) {
      throw new Error('Analysis failed to return a result.');
    }

    // Since the model isn't generating an image anymore, we return the original image
    // as the `analyzedPhotoDataUri` and merge the analysis results.
    return {
      analyzedPhotoDataUri: photoDataUri,
      faceShape: output.faceShape,
      skinTone: output.skinTone,
    };
  }
);
