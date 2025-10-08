'use server';
/**
 * @fileOverview A flow that analyzes a face image and returns a new image with analysis markings.
 *
 * - analyzeFaceShape - A function that takes an image and returns an "analyzed" version.
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
  analyzedPhotoDataUri: z.string().describe('The data URI of the generated image with analysis markings.'),
});
export type AnalyzeFaceShapeOutput = z.infer<typeof AnalyzeFaceShapeOutputSchema>;


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
    console.log('Generating image...');
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        { media: { url: photoDataUri } },
        {
          text: `Analyze the face in the provided image. Your task is to generate a new image with specific analysis markings overlaid. Do not change the person, background, or any other aspect of the original image.

Your modifications should be:
1.  Draw small, precise, glowing cyan dots (like futuristic HUD markers) on the following facial landmarks:
    *   The center of each eye pupil.
    *   The tip of the nose.
    *   The corners of the mouth.
    *   The point of the chin.
    *   The outer corners of the jawline.
2.  Draw a thin, dashed, glowing cyan line that accurately traces the overall shape of the face (the jawline and hairline).

The final output must be ONLY the generated image. The style should be clean and high-tech.`,
        },
      ],
      config: {
        // You must provide both TEXT and IMAGE, IMAGE only won't work
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media.url) {
      throw new Error('Image generation failed to return a data URI.');
    }

    return {
      analyzedPhotoDataUri: media.url,
    };
  }
);
