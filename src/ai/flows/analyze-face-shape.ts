
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

const analyzeFaceShapeFlow = ai.defineFlow(
  {
    name: 'analyzeFaceShapeFlow',
    inputSchema: AnalyzeFaceShapeInputSchema,
    outputSchema: AnalyzeFaceShapeOutputSchema,
  },
  async (input) => {
    // This flow uses the modern Gemini API pattern for getting structured JSON output.
    const { output } = await ai.generate({
      prompt: `Analyze the provided photo of a person's face. Your task is to determine their face shape and skin tone.
      
      Respond with ONLY a valid JSON object containing two keys:
      1.  "faceShape": The most prominent face shape (e.g., "Oval", "Round", "Square", "Heart").
      2.  "skinTone": The underlying skin tone (e.g., "Warm", "Cool", "Neutral").

      Example response:
      {
        "faceShape": "Oval",
        "skinTone": "Warm"
      }
      
      Photo: {{media url=photoDataUri}}`,
      // This config is crucial. It tells the model to output a JSON string.
      config: {
        responseMimeType: 'application/json',
      },
      input: {
        photoDataUri: input.photoDataUri,
      },
    });

    if (!output) {
      throw new Error('Analysis failed to return a result.');
    }

    // The model's output can sometimes include conversational text or markdown.
    // We must extract the JSON block before parsing.
    try {
      // Find the start and end of the JSON object.
      const jsonStart = output.indexOf('{');
      const jsonEnd = output.lastIndexOf('}');

      if (jsonStart === -1 || jsonEnd === -1) {
          throw new Error("No JSON object found in the response.");
      }

      const jsonString = output.substring(jsonStart, jsonEnd + 1);
      return JSON.parse(jsonString) as AnalyzeFaceShapeOutput;
    } catch (e) {
      console.error('Failed to parse AI response as JSON.', {
        rawOutput: output,
        error: e,
      });
      throw new Error('The AI returned an invalid response format.');
    }
  }
);
