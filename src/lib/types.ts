
export type Frame = {
  id: number;
  productName: string;
  brand: string;
  price: number;
  price_details?: {
    basePrice: number;
    lkPrice: number;
    salesPrice: number;
    currency: string;
    symbol: string;
    discount: string;
  };
  size: string;
  productImage: string | { url: string; frontURL?: string; hoverURL?: string };
  productRating: number;
  purchaseCount: number;
  productModelName: string;
  frameType: string;
  frameShape: string;
  lenskart_url?: string;
  tags?: string;
};
