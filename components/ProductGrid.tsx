import React from 'react';
import { Product } from '../types';
import { CURRENCY, FALLBACK_IMAGE } from '../constants';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart }) => {
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = FALLBACK_IMAGE;
    e.currentTarget.onerror = null; // Prevent infinite loop
  };

  return (
    <section id="shop" className="py-20 bg-stone-50 scroll-mt-24">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4">Nuovi Arrivi</h2>
          <div className="w-20 h-[1px] bg-stone-800"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {products.map((product) => (
            <div key={product.id} className="group cursor-pointer">
              <div className="relative overflow-hidden aspect-[4/5] bg-stone-100 mb-6">
                 {/* Image */}
                <img 
                  src={product.image} 
                  alt={product.name}
                  onError={handleImageError}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-90 group-hover:opacity-100"
                />
                
                {/* Quick Add Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    className="w-full py-3 bg-white/90 backdrop-blur-sm text-stone-900 text-xs uppercase tracking-widest hover:bg-stone-900 hover:text-white transition-colors"
                  >
                    Add to Cart — {CURRENCY}{product.price}
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-widest text-stone-500 mb-1 block">
                  {product.category}
                </span>
                <h3 className="font-serif text-lg text-stone-900 mb-1 group-hover:text-gold-500 transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm font-light text-stone-600">
                  {CURRENCY}{product.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};