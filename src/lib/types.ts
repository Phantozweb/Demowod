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
  frameType?: string;
  frameShape?: string;
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
    price: number;
    features: string[];
    use_case: string;
    targetUser: string;
    category: string;
};

    