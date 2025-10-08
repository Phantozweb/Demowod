
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
      model: 'googleai/gemini-2.5-flash-image-preview',
      prompt: [
        { media: { url: photoDataUri } },
        {
          text: `You are a sophisticated facial analysis AI. Your task is to analyze the face in the provided image and return two things:
1. A new image with specific, futuristic analysis markings overlaid.
2. A JSON object with your analysis of the face shape and skin tone.

Image Generation Instructions:
- Generate a new image that is identical to the original but with the following glowing cyan overlays:
  - Draw thin, precise lines around the eyes, lips, and eyebrows.
  - Draw a dashed line that accurately traces the overall shape of the face (jawline and hairline).
- The style should be clean, high-tech, and professional. Do not alter the person or background.

JSON Output Instructions:
- Identify the primary face shape (e.g., "Oval", "Round", "Square", "Heart", "Diamond", "Oblong").
- Identify the skin tone (e.g., "Fair", "Light", "Medium", "Tan", "Dark").

The final output must be the generated image AND the structured JSON data.`,
        },
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
      output: {
        schema: AnalyzeFaceShapeOutputSchema,
      }
    });

    if (!output || !output.analyzedPhotoDataUri) {
      throw new Error('Image generation failed to return a data URI.');
    }

    return output;
  }
);
