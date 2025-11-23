import React from 'react';
import { CartItem } from '../types';
import { CURRENCY, FALLBACK_IMAGE } from '../constants';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, items, onRemove, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = FALLBACK_IMAGE;
    e.currentTarget.onerror = null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
        <div className="p-6 border-b border-stone-100 flex justify-between items-center">
          <h2 className="font-serif text-xl">Shopping Bag</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-900">Close</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-stone-400">
              <p>Your bag is empty.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 animate-fade-in-up">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  onError={handleImageError}
                  className="w-20 h-24 object-cover bg-stone-100" 
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif text-base text-stone-900">{item.name}</h3>
                    <button onClick={() => onRemove(item.id)} className="text-xs text-stone-400 hover:text-red-500">REMOVE</button>
                  </div>
                  <p className="text-xs text-stone-500 mt-1 uppercase tracking-wide">{item.category}</p>
                  <p className="text-sm font-medium mt-2">{CURRENCY}{item.price}</p>
                  <p className="text-xs text-stone-400 mt-2">Qty: {item.quantity}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-stone-100 bg-stone-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm uppercase tracking-widest text-stone-600">Subtotal</span>
              <span className="font-serif text-xl">{CURRENCY}{total.toFixed(2)}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full bg-stone-900 text-white py-4 text-xs uppercase tracking-[0.2em] hover:bg-gold-500 transition-colors"
            >
              Invia Richiesta Ordine
            </button>
          </div>
        )}
      </div>
    </div>
  );
};