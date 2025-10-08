
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
  price?: number;
  price_details?: {
    basePrice: number;
    lkPrice: number;
    salesPrice: number;
    currency: string;
    symbol: string;
    discount: string;
  };
  variations: FrameVariation[];
  productImage?: string | { url: string; frontURL?: string; hoverURL?: string };
};
