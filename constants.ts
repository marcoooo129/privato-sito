import { Product, Category, SalesData } from './types';

export const STORE_NAME = "LUCE & OMBRA";
export const CURRENCY = "€";

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Anello Eternità Oro',
    price: 350,
    description: '18k gold infinite loop ring, embodying timeless elegance.',
    image: 'https://picsum.photos/id/119/800/800', // Metallic/abstract feel
    category: Category.RINGS,
    material: '18k Gold'
  },
  {
    id: '2',
    name: 'Collana Luna Argento',
    price: 180,
    description: 'Sterling silver crescent pendant with a minimalist chain.',
    image: 'https://picsum.photos/id/26/800/800',
    category: Category.NECKLACE,
    material: 'Sterling Silver'
  },
  {
    id: '3',
    name: 'Orecchini Perla Nera',
    price: 220,
    description: 'Rare black pearls set in a modern titanium stud.',
    image: 'https://picsum.photos/id/250/800/800',
    category: Category.EARRINGS,
    material: 'Titanium & Pearl'
  },
  {
    id: '4',
    name: 'Bracciale Rigido',
    price: 410,
    description: 'Structural gold cuff bracelet for the bold minimalist.',
    image: 'https://picsum.photos/id/146/800/800',
    category: Category.BRACELETS,
    material: '18k Gold Vermeil'
  },
  {
    id: '5',
    name: 'Anello Minimalista',
    price: 120,
    description: 'A thin, hammered silver band perfect for stacking.',
    image: 'https://picsum.photos/id/160/800/800',
    category: Category.RINGS,
    material: 'Sterling Silver'
  },
  {
    id: '6',
    name: 'Collana Solitaria',
    price: 550,
    description: 'Single diamond chip embedded in a gold disc.',
    image: 'https://picsum.photos/id/175/800/800', // Clock/antique feel works for jewelry vibe
    category: Category.NECKLACE,
    material: '14k Gold & Diamond'
  }
];

export const SALES_DATA: SalesData[] = [
  { month: 'Gen', sales: 4000, visitors: 2400 },
  { month: 'Feb', sales: 3000, visitors: 1398 },
  { month: 'Mar', sales: 2000, visitors: 9800 },
  { month: 'Apr', sales: 2780, visitors: 3908 },
  { month: 'Mag', sales: 1890, visitors: 4800 },
  { month: 'Giu', sales: 2390, visitors: 3800 },
  { month: 'Lug', sales: 3490, visitors: 4300 },
];
