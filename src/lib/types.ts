
export type FrameVariation = {
    id: number;
    color: string;
    glassColor: string;
    price: {
      currency: string;
      basePrice: number;
      lkPrice: number;
      symbol: string;
    };
    productImage: {
      url: string;
    };
  }

export type Frame = {
  id: number;
  productName: string;
  productModelName: string;
  classification: string;
  frameType?: string;
  frameShape?: string;
  size?: string;
  brand?: string;
  productRating?: number;
  purchaseCount?: number;
  tags?: string;
  lenskart_url?: string;
  price?: {
      currency: string;
      basePrice: number;
      lkPrice?: number;
      salesPrice?: number;
      symbol: string;
  };
  variations?: FrameVariation[];
  productImage?: {
    url: string;
  };
};
