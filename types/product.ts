export type Product = {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  discountPercent?: number;
  ratingValue: number;
  ratingCount: number;
  isHot?: boolean;
  colors: string[];
  category: string;
  imageUrl: string;
};
