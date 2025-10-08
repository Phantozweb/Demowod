
export type Frame = {
  id: number;
  size: string;
  productName: string;
  brand: string;
  productModelName: string;
  productRating: number;
  purchaseCount: number;
  tags?: string;
  lenskart_url?: string;
  productImage: string | { url: string; frontURL?: string; hoverURL?: string };
  price: number;
  price_details?: {
    basePrice: number;
    lkPrice: number;
    salesPrice: number;
    currency: string;
    symbol: string;
    discount: string;
  };
  frameType: string;
  frameShape: string;
};
