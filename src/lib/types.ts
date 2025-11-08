
import { z } from 'zod';

export type FrameVariation = {
    id: number;
    color: string;
    productURL: string;
    price?: {
      currency: string;
      basePrice: number;
      lkPrice?: number;
      salesPrice?: number;
      symbol: string;
    };
    productImage?: {
      url: string;
      frontURL?: string;
    };
    sku?: string;
    size?: string;
    productRating?: number;
    totalNoOfRatings?: string;
    purchaseCount?: number;
    discount?: {
      label: string;
      textColor: string;
    };
    colorOptions?: {
      id: number;
      color: string;
      productURL: string;
    }[];
  }

export type Frame = {
  id: number;
  productName: string;
  productModelName: string;
  classification: string;
  frameType?: string | string[];
  frameShape?: string | string[];
  brand?: string;
  tags?: string;
  lenskart_url?: string;
  variations?: FrameVariation[];
  sku?: string;
  size?: string;
  productURL?: string;
  productRating?: number;
  totalNoOfRatings?: string;
  purchaseCount?: number;
  price?: {
    currency: string;
    symbol: string;
    basePrice: number;
    salesPrice?: number;
    lkPrice?: number;
  };
  discount?: {
    label: string;
    textColor: string;
  };
  color?: string;
  productImage?: {
    url: string;
    frontURL?: string;
  };
  colorOptions?: {
    id: number;
    color: string;
    productURL: string;
  }[];
};

export type Lens = {
    id: number;
    name: string;
    description: string;
    price?: number;
    features: string[];
    use_case: string;
    category: string;
};


// Schema definitions for AI flows

const FrameInfoSchema = z.object({
  id: z.number(),
  productName: z.string(),
  frameType: z.string().optional(),
  frameShape: z.string().optional(),
  price: z.any().optional(),
  purchaseCount: z.number().optional(),
  productRating: z.number().optional(),
});

const LensInfoSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: z.string(),
});

export const SuggestInitialFramesInputSchema = z.object({
  faceShape: z.string().describe("The user's detected face shape."),
  skinTone: z.string().describe("The user's detected skin tone."),
  age: z.number().optional().describe("The patient's age."),
  visualNeeds: z.string().describe("The patient's stated visual needs or challenges."),
  frames: z
    .array(FrameInfoSchema)
    .describe('A list of available frames in the catalog.'),
  lenses: z
    .array(LensInfoSchema)
    .describe('A list of available lenses in the catalog.'),
});
export type SuggestInitialFramesInput = z.infer<typeof SuggestInitialFramesInputSchema>;


const RecommendationSchema = z.object({
  reasoning: z.string().describe('A brief, one-sentence explanation for why this item is a good fit.'),
});

const ShapeRecommendationSchema = RecommendationSchema.extend({
  shape: z.string().describe('A recommended frame shape from the available list.'),
});

const TypeRecommendationSchema = RecommendationSchema.extend({
  type: z.string().describe('A recommended frame type (e.g., "Full Rim") from the available list.'),
});

const FrameRecommendationSchema = RecommendationSchema.extend({
  id: z.number().describe('The ID of the recommended frame from the catalog.'),
});

const LensRecommendationSchema = RecommendationSchema.extend({
  id: z.number().describe('The ID of the recommended lens from the catalog.'),
});


export const SuggestInitialFramesOutputSchema = z.object({
  recommendedShapes: z.object({
    recommendations: z.array(ShapeRecommendationSchema).describe('A list of 3-4 recommended frame shapes.'),
    reasoning: z.string().describe('A one-sentence summary explaining the overall shape recommendation strategy.'),
  }).describe("Recommendations for frame shapes that complement the user's face shape."),

  recommendedTypes: z.object({
     recommendations: z.array(TypeRecommendationSchema).describe('A list of 2-3 recommended frame types.'),
     reasoning: z.string().describe('A one-sentence summary explaining the overall type recommendation strategy.'),
  }).describe("Recommendations for frame types (e.g., rimless, full-rim) suitable for the user."),
  
  topFrames: z.array(FrameRecommendationSchema).describe('A list of 3-5 top-pick frames from the catalog that are an excellent match for the user.'),
  
  recommendedLenses: z.object({
    recommendations: z.array(LensRecommendationSchema).describe('A list of 1-2 recommended lenses and/or coatings.'),
    reasoning: z.string().describe('A one-sentence summary explaining the overall lens recommendation strategy.'),
  }).describe("Lens and coating recommendations based on the user's age and visual needs."),
});
export type SuggestInitialFramesOutput = z.infer<typeof SuggestInitialFramesOutputSchema>;
