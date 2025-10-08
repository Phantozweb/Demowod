
type FrameVariation = {
    id: number;
    color: string;
    glassColor: string;
    colorID: number;
    frameColorImage: string;
    productURL: string;
    price: {
      currency: string;
      basePrice: number;
      lkPrice: number;
      symbol: string;
    };
    arModel: {
      ios: string | null;
      android: string | null;
    } | null;
    productImage: {
      url: string;
      frontURL: string;
      hoverURL: string;
    };
  }

export type Frame = {
  id?: number;
  productName: string;
  productModelName: string;
  classification: string;
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
  frameType?: string;
  frameShape?: string;
  variations?: FrameVariation[];
  productImage?: string | { url: string; frontURL?: string; hoverURL?: string };
};
