export enum Category {
  NECKLACE = 'Necklace',
  RINGS = 'Rings',
  EARRINGS = 'Earrings',
  BRACELETS = 'Bracelets'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: Category;
  material: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isStreaming?: boolean;
}

// Chart Data Types
export interface SalesData {
  month: string;
  sales: number;
  visitors: number;
}