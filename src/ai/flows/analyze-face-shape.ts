
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

const prompt = ai.definePrompt({
  name: 'analyzeFaceShapePrompt',
  input: { schema: AnalyzeFaceShapeInputSchema },
  prompt: `You are Focus.Ai, an expert in facial analysis. Analyze the provided image to determine the user's face shape and skin tone.

Analyze the user's face in the image and identify the primary shape (e.g., Oval, Round, Square, Heart, Diamond, etc.) and their skin tone.

Return ONLY a valid JSON object formatted like this: {"faceShape": "...", "skinTone": "..."}.
Do not include any other text, explanation, or markdown formatting like \`\`\`json.

Image to analyze:
{{media url=photoDataUri}}`,
});

const analyzeFaceShapeFlow = ai.defineFlow(
  {
    name: 'analyzeFaceShapeFlow',
    inputSchema: AnalyzeFaceShapeInputSchema,
    outputSchema: AnalyzeFaceShapeOutputSchema,
  },
  async (input) => {
    const response = await prompt(input);
    const textOutput = response.text;
    
    if (!textOutput) {
      throw new Error('Analysis failed to return a result.');
    }

    try {
      return JSON.parse(textOutput);
    } catch (e) {
        console.error("Failed to parse JSON from AI response:", textOutput);
        throw new Error("The AI returned an invalid response format.");
    }
  }
);
