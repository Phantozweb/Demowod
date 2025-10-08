import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: 'AIzaSyD5WkVoZK-Hrm7MTOUa-xkpaHwfVXW2OJI',
    }),
  ],
  model: 'googleai/gemini-2.5-flash',
});
