import { Product, Category, SalesData } from './types';

export const STORE_NAME = "NOVE FIRENZE";
export const CURRENCY = "€";

export const FALLBACK_IMAGE = "/images/anello-aura.jpg";

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Anello Aura',
    price: 390,
    description: 'Un anello sottile modellato a mano, personalizzabile con iniziali o una data incisa all’interno.',
    image: '/images/anello-aura.jpg',
    category: Category.RINGS,
    material: 'Oro giallo 18 kt'
  },
  {
    id: '2',
    name: 'Collana Linea',
    price: 460,
    description: 'Una catena essenziale dalle proporzioni leggere, realizzata nella lunghezza scelta per chi la indossa.',
    image: '/images/collana-linea.jpg',
    category: Category.NECKLACE,
    material: 'Oro giallo 18 kt'
  },
  {
    id: '3',
    name: 'Orecchini Onda',
    price: 320,
    description: 'Cerchi scultorei e luminosi, rifiniti a mano per creare un movimento diverso da ogni angolazione.',
    image: '/images/orecchini-onda.jpg',
    category: Category.EARRINGS,
    material: 'Oro giallo 14 kt'
  },
  {
    id: '4',
    name: 'Bracciale Filo',
    price: 520,
    description: 'Una linea rigida e delicata, adattata al polso e completata da una piccola pietra scelta insieme.',
    image: '/images/bracciale-filo.jpg',
    category: Category.BRACELETS,
    material: 'Oro giallo 18 kt e diamante'
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
