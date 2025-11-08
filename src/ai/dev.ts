import { config } from 'dotenv';
config();

import '@/ai/flows/select-frames-from-catalog.ts';
import '@/ai/flows/analyze-face-shape.ts';
import '@/ai/flows/suggest-frames-based-preference.ts';
import '@/ai/flows/suggest-frame-shapes.ts';
