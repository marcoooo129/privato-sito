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

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  message?: string;
}

export interface Order {
  id: string;
  customer: CustomerInfo;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed' | 'contacted';
  created_at: string;
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