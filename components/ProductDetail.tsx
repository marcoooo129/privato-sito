import React, { useEffect, useRef, useState } from 'react';
import { Product } from '../types';
import { CURRENCY, FALLBACK_IMAGE } from '../constants';

interface ProductDetailProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, onClose, onAddToCart }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    setQuantity(1);
    setIsAdded(false);
    if (product && dialogRef.current && !dialogRef.current.open) dialogRef.current.showModal();
  }, [product]);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setIsAdded(true);
    window.setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <dialog
      ref={dialogRef}
      className="product-dialog"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      aria-labelledby="product-title"
    >
      <div className="relative grid max-h-[92dvh] w-[min(72rem,calc(100vw-2rem))] overflow-y-auto bg-paper md:grid-cols-2">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex size-11 items-center justify-center bg-paper text-ink md:right-6 md:top-6"
          aria-label="Chiudi i dettagli"
          autoFocus
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="size-6" aria-hidden="true">
            <path d="M5 5l14 14M19 5 5 19" strokeWidth="1.5" />
          </svg>
        </button>

        <div className="min-h-[26rem] bg-sand md:min-h-[42rem]">
          <img
            src={product.image}
            alt={product.name}
            className="size-full object-cover"
            onError={(event) => {
              event.currentTarget.src = FALLBACK_IMAGE;
              event.currentTarget.onerror = null;
            }}
          />
        </div>

        <div className="flex flex-col p-7 md:p-12 lg:p-16">
          <p className="text-xs font-semibold uppercase text-wine">{product.category}</p>
          <h2 id="product-title" className="mt-3 font-display text-4xl leading-none md:text-5xl">{product.name}</h2>
          <p className="mt-5 text-xl tabular-nums">A partire da {CURRENCY}{product.price}</p>
          <p className="mt-7 text-pretty leading-7 text-ink/65">{product.description}</p>

          <dl className="mt-8 border-y border-ink/15 py-5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="font-semibold">Materiale</dt>
              <dd className="text-right text-ink/65">{product.material}</dd>
            </div>
            <div className="mt-4 flex justify-between gap-4">
              <dt className="font-semibold">Realizzazione</dt>
              <dd className="text-right text-ink/65">Su ordinazione · 3–5 settimane</dd>
            </div>
          </dl>

          <div className="mt-auto pt-9">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Quantità</span>
              <div className="flex items-center border border-ink/20">
                <button type="button" className="flex size-11 items-center justify-center" aria-label="Riduci quantità" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button>
                <span className="w-9 text-center text-sm tabular-nums" aria-live="polite">{quantity}</span>
                <button type="button" className="flex size-11 items-center justify-center" aria-label="Aumenta quantità" onClick={() => setQuantity((value) => value + 1)}>+</button>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAdd}
              className="mt-5 min-h-12 w-full bg-ink px-5 text-xs font-semibold uppercase text-paper transition-colors hover:bg-wine"
              aria-live="polite"
            >
              {isAdded ? 'Aggiunto alla selezione' : `Aggiungi · ${CURRENCY}${product.price * quantity}`}
            </button>
            <p className="mt-4 text-center text-xs text-ink/55">Personalizzazione definita dopo la richiesta</p>
          </div>
        </div>
      </div>
    </dialog>
  );
};
