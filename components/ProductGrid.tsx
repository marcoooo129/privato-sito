import React, { useMemo, useState } from 'react';
import { Product } from '../types';
import { CURRENCY, FALLBACK_IMAGE } from '../constants';
import { cn } from '../utils/cn';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

const ProductCard: React.FC<{
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}> = ({ product, onAddToCart, onProductClick }) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    onAddToCart(product);
    setIsAdded(true);
    window.setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <article>
      <button
        type="button"
        className="block aspect-[4/5] w-full overflow-hidden bg-sand text-left"
        onClick={() => onProductClick(product)}
        aria-label={`Scopri ${product.name}`}
      >
        <img
          src={product.image}
          alt={product.name}
          className="size-full object-cover"
          loading="lazy"
          decoding="async"
          onError={(event) => {
            event.currentTarget.src = FALLBACK_IMAGE;
            event.currentTarget.onerror = null;
          }}
        />
      </button>

      <div className="border-x border-b border-ink/10 p-5 md:p-6">
        <p className="text-[11px] font-semibold uppercase text-wine">{product.category}</p>
        <div className="mt-2 flex items-start justify-between gap-5">
          <button type="button" className="text-left" onClick={() => onProductClick(product)}>
            <h3 className="font-display text-2xl leading-tight hover:text-wine">{product.name}</h3>
          </button>
          <p className="shrink-0 text-sm tabular-nums">da {CURRENCY}{product.price}</p>
        </div>
        <p className="mt-3 text-sm leading-6 text-ink/65">{product.material}</p>
        <button
          type="button"
          onClick={handleAdd}
          className={cn(
            'mt-5 inline-flex min-h-11 w-full items-center justify-center border px-5 text-xs font-semibold uppercase transition-colors',
            isAdded ? 'border-wine bg-wine text-paper' : 'border-ink hover:bg-ink hover:text-paper',
          )}
          aria-live="polite"
        >
          {isAdded ? 'Aggiunto alla selezione' : 'Aggiungi alla selezione'}
        </button>
      </div>
    </article>
  );
};

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart, onProductClick }) => {
  const filters = useMemo(() => ['Tutti', ...Array.from(new Set(products.map((product) => product.category)))], [products]);
  const [activeFilter, setActiveFilter] = useState('Tutti');
  const visibleProducts = activeFilter === 'Tutti' ? products : products.filter((product) => product.category === activeFilter);

  return (
    <section id="collezione" className="scroll-mt-28 bg-paper px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-[86rem]">
        <div className="grid gap-7 border-b border-ink/15 pb-9 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase text-wine">Collezione I</p>
            <h2 className="mt-3 text-balance font-display text-4xl leading-none md:text-6xl">Forme da abitare.</h2>
          </div>
          <p className="max-w-md text-pretty text-sm leading-6 text-ink/65 md:text-right">
            Quattro linee da cui partire. Metallo, finitura, pietre e incisioni vengono scelti insieme.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2" aria-label="Filtra per categoria">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              aria-pressed={activeFilter === filter}
              className={cn(
                'min-h-11 border px-4 text-xs font-semibold transition-colors',
                activeFilter === filter ? 'border-ink bg-ink text-paper' : 'border-ink/20 hover:border-ink',
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:gap-x-8">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onProductClick={onProductClick} />
          ))}
        </div>
      </div>
    </section>
  );
};
