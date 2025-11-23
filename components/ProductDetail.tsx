
import React from 'react';
import { Product } from '../types';
import { CURRENCY, FALLBACK_IMAGE } from '../constants';

interface ProductDetailProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose, onAddToCart }) => {
  if (!product) return null;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = FALLBACK_IMAGE;
    e.currentTarget.onerror = null;
  };

  const handleAddToCart = () => {
    onAddToCart(product);
    // Optional: Close modal on add, or keep open. Keeping open is more "Amazon-like"
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl animate-fade-in-up flex flex-col md:flex-row">
        
        {/* Close Button Mobile */}
        <button 
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 z-10 p-2 bg-white/80 rounded-full text-stone-500 hover:text-stone-900"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Image Section */}
        <div className="w-full md:w-1/2 bg-stone-50 h-[400px] md:h-auto md:min-h-[500px] relative group">
          <img 
            src={product.image} 
            alt={product.name}
            onError={handleImageError}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Details Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col">
          <div className="flex justify-between items-start">
            <div className="text-xs tracking-widest uppercase text-stone-500 mb-2">
              {product.category}
            </div>
            {/* Close Button Desktop */}
            <button 
              onClick={onClose}
              className="hidden md:block text-stone-400 hover:text-stone-900 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4">{product.name}</h2>
          
          <div className="flex items-center space-x-4 mb-6">
            <span className="font-serif text-2xl text-stone-900">{CURRENCY}{product.price.toFixed(2)}</span>
            <span className="px-2 py-1 bg-stone-100 text-[10px] uppercase tracking-wide text-stone-600 rounded">In Stock</span>
          </div>

          <div className="prose prose-stone mb-8">
            <p className="text-stone-600 leading-relaxed font-light">
              {product.description}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex border-t border-stone-100 py-3">
              <span className="w-32 text-xs uppercase font-bold tracking-widest text-stone-500">Material</span>
              <span className="text-sm text-stone-800">{product.material}</span>
            </div>
             <div className="flex border-t border-b border-stone-100 py-3">
              <span className="w-32 text-xs uppercase font-bold tracking-widest text-stone-500">Item ID</span>
              <span className="text-sm text-stone-800">{product.id}</span>
            </div>
          </div>

          <div className="mt-auto pt-6">
            <button 
              onClick={handleAddToCart}
              className="w-full bg-stone-900 text-white py-4 text-sm uppercase tracking-[0.2em] hover:bg-gold-500 transition-colors flex items-center justify-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 5.659c.992 4.425.542 6.245-1.631 6.245h-13.4c-2.174 0-2.623-1.82-1.631-6.245l1.263-5.659c.578-2.59 1.98-3.664 3.596-3.664h6.917c1.616 0 3.018 1.075 3.596 3.664z" />
              </svg>
              <span>Add to Cart</span>
            </button>
            <p className="text-center text-[10px] text-stone-400 mt-3 uppercase tracking-wider">
              Free shipping on all orders over {CURRENCY}50
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
