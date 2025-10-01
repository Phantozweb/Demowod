'use server';

import {
  suggestFramesBasedOnPreference,
  type SuggestFramesBasedOnPreferenceInput,
} from '@/ai/flows/suggest-frames-based-preference';
import { z } from 'zod';

const FormSchema = z.object({
  faceShape: z.string().min(1, 'Face shape is required.'),
  stylePreferences: z.string().min(1, 'Style preferences are required.'),
  pastPurchases: z.string().min(1, 'Past purchases are required.'),
});

interface FormState {
  success: boolean;
  message: string;
  data?: {
    frameSuggestions: string[];
    reasoning: string;
  };
  errors?: {
    faceShape?: string[];
    stylePreferences?: string[];
    pastPurchases?: string[];
  };
}

export async function getFrameRecommendations(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {

  const validatedFields = FormSchema.safeParse({
    faceShape: formData.get('faceShape'),
    stylePreferences: formData.get('stylePreferences'),
    pastPurchases: formData.get('pastPurchases'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Please fill out all fields.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const input: SuggestFramesBasedOnPreferenceInput = validatedFields.data;

  try {
    const result = await suggestFramesBasedOnPreference(input);
    return { 
        success: true, 
        message: 'Here are your recommendations!', 
        data: result 
    };
  } catch (error) {
    console.error('AI Error:', error);
    return {
      success: false,
      message: 'Failed to get recommendations. Please try again later.',
    };
  }
}
