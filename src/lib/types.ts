
export type FrameVariation = {
    id: number;
    color: string;
    glassColor?: string;
    price?: {
      currency: string;
      basePrice: number;
      lkPrice?: number;
      salesPrice?: number;
      symbol: string;
    };
    productImage?: {
      url: string;
    };
    sku?: string;
    size?: string;
    productURL?: string;
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
  productName: string;
  productModelName: string;
  classification: string;
  frameType?: string;
  frameShape?: string;
  brand?: string;
  tags?: string;
  lenskart_url?: string;
  variations?: FrameVariation[];
};
