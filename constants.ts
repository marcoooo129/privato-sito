import { Product, Category, SalesData } from './types';

export const STORE_NAME = "LUCE & OMBRA";
export const CURRENCY = "€";

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Occhiali Cat-Eye Retro',
    price: 15.00,
    description: 'Vintage inspired oversized sunglasses with UV400 protection.',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800',
    category: Category.SUNGLASSES,
    material: 'Acetate & Polycarbonate'
  },
  {
    id: '2',
    name: 'Set Anelli Gold Stack',
    price: 8.50,
    description: 'Set of 5 minimalist stacking rings. Perfect for daily wear.',
    image: 'https://images.unsplash.com/photo-1629224316810-9d8805b95076?auto=format&fit=crop&q=80&w=800',
    category: Category.RINGS,
    material: 'Stainless Steel (Acciaio)'
  },
  {
    id: '3',
    name: 'Foulard Seta Print',
    price: 12.00,
    description: 'Elegant square scarf with geometric print. Soft touch.',
    image: 'https://images.unsplash.com/photo-1584030373081-f37b7bb4faae?auto=format&fit=crop&q=80&w=800',
    category: Category.SCARVES,
    material: 'Satin Silk Blend'
  },
  {
    id: '4',
    name: 'Orecchini Cerchio Chunky',
    price: 9.90,
    description: 'Bold gold-tone hoop earrings. Lightweight and trendy.',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a51?auto=format&fit=crop&q=80&w=800',
    category: Category.EARRINGS,
    material: 'Gold Plated Steel'
  },
  {
    id: '5',
    name: 'Clip Capelli Perla',
    price: 5.50,
    description: 'Oversized hair clip with pearl embellishments.',
    image: 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?auto=format&fit=crop&q=80&w=800',
    category: Category.HAIR,
    material: 'Resin & Faux Pearl'
  },
  {
    id: '6',
    name: 'Collana Multistrato',
    price: 14.00,
    description: 'Layered necklace with coin pendant. Tarnish resistant.',
    image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&q=80&w=800',
    category: Category.NECKLACE,
    material: 'Stainless Steel'
  },
  {
    id: '7',
    name: 'Occhiali Aviator Neri',
    price: 18.00,
    description: 'Classic black aviator frames. Unisex design.',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800',
    category: Category.SUNGLASSES,
    material: 'Metal Frame'
  },
  {
    id: '8',
    name: 'Sciarpa Cashmere Blend',
    price: 22.00,
    description: 'Warm and cozy scarf in neutral beige tones.',
    image: 'https://images.unsplash.com/photo-1601662546140-d7c3d2e26039?auto=format&fit=crop&q=80&w=800',
    category: Category.SCARVES,
    material: 'Viscose & Cashmere'
  },
  {
    id: '9',
    name: 'Bracciale Catena',
    price: 11.00,
    description: 'Industrial style chain link bracelet.',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800',
    category: Category.BRACELETS,
    material: 'Polished Steel'
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