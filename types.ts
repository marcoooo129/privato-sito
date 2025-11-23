export enum Category {
  NECKLACE = 'Collane',
  RINGS = 'Anelli',
  EARRINGS = 'Orecchini',
  BRACELETS = 'Bracciali',
  SUNGLASSES = 'Occhiali da Sole',
  SCARVES = 'Sciarpe & Foulard',
  HAIR = 'Accessori Capelli'
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