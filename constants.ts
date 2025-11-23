import { Product, Category, SalesData } from './types';

export const STORE_NAME = "LUCE & OMBRA";
export const CURRENCY = "€";

// Fallback image in case specific ones fail
export const FALLBACK_IMAGE = "https://placehold.co/600x800/f5f5f4/292524?text=Luce+%26+Ombra";

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Occhiali "Diva" Tortoise',
    price: 18.50,
    description: 'Occhiali da sole oversize con montatura tartarugata. Lenti sfumate UV400.',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800',
    category: Category.SUNGLASSES,
    material: 'Acetate Premium'
  },
  {
    id: '2',
    name: 'Collana "Amalfi" Gold',
    price: 14.90,
    description: 'Collana a catena spessa con finitura oro 18k. Waterproof e anallergica.',
    image: 'https://images.unsplash.com/photo-1599643477877-5313557d7dce?auto=format&fit=crop&q=80&w=800',
    category: Category.NECKLACE,
    material: 'Stainless Steel 18k Gold Plated'
  },
  {
    id: '3',
    name: 'Orecchini "Perla Barocca"',
    price: 12.00,
    description: 'Orecchini pendenti con perla naturale irregolare. Eleganza senza tempo.',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
    category: Category.EARRINGS,
    material: 'Freshwater Pearl & Brass'
  },
  {
    id: '4',
    name: 'Set Anelli "Roma" Stack',
    price: 9.90,
    description: 'Set di 4 anelli minimalisti da indossare insieme. Design geometrico.',
    image: 'https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?auto=format&fit=crop&q=80&w=800',
    category: Category.RINGS,
    material: 'Stainless Steel'
  },
  {
    id: '5',
    name: 'Foulard Seta "Como"',
    price: 24.00,
    description: 'Foulard quadrato in misto seta con stampa floreale vintage. 70x70cm.',
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=800',
    category: Category.SCARVES,
    material: 'Silk Blend'
  },
  {
    id: '6',
    name: 'Bracciale "Milano" Chain',
    price: 16.50,
    description: 'Bracciale a maglia groumette piatta. Un classico dello stile urban.',
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800',
    category: Category.BRACELETS,
    material: 'Polished Steel'
  },
  {
    id: '7',
    name: 'Mollettone "Tartaruga" Chic',
    price: 6.90,
    description: 'Accessorio capelli in acetato effetto tartaruga. Presa forte e stile francese.',
    image: 'https://images.unsplash.com/photo-1617112848923-cc5ac2e61b6f?auto=format&fit=crop&q=80&w=800',
    category: Category.HAIR,
    material: 'Cellulose Acetate'
  },
  {
    id: '8',
    name: 'Orecchini "Sole" Vintage',
    price: 11.50,
    description: 'Orecchini a bottone texturizzati oro. Ispirazione anni \'80.',
    image: 'https://images.unsplash.com/photo-1615655406736-b37c4d898e6f?auto=format&fit=crop&q=80&w=800',
    category: Category.EARRINGS,
    material: 'Gold Plated Alloy'
  },
  {
    id: '9',
    name: 'Occhiali "Capri" Blue',
    price: 19.00,
    description: 'Occhiali da sole con lenti blu trasparenti e montatura leggera.',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800',
    category: Category.SUNGLASSES,
    material: 'Polycarbonate'
  }
];

export const SALES_DATA: SalesData[] = [
  { month: 'Gen', sales: 12400, visitors: 5400 },
  { month: 'Feb', sales: 10500, visitors: 4200 },
  { month: 'Mar', sales: 15000, visitors: 6800 },
  { month: 'Apr', sales: 18780, visitors: 7908 },
  { month: 'Mag', sales: 21890, visitors: 8800 },
  { month: 'Giu', sales: 25390, visitors: 9800 },
  { month: 'Lug', sales: 31490, visitors: 11300 },
];