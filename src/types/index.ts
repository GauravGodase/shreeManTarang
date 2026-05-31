export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: Category;
  tags: string[];
  sizes: Size[];
  colors: Color[];
  images: string[];
  description: string;
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isBestseller?: boolean;
  stock: number;
}

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface Color {
  name: string;
  hex: string;
}

export type Category =
  | 'tshirts'
  | 'kids'
  | 'corporate'
  | 'caps'
  | 'mugs'
  | 'sublimation'
  | 'frames';

export interface CartItem {
  product: Product;
  size: Size;
  color: Color;
  quantity: number;
}
