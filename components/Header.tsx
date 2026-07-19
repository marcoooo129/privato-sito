import React, { useState } from 'react';
import { STORE_NAME } from '../constants';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
}

const navItems = [
  { href: '#collezione', label: 'Collezione' },
  { href: '#su-misura', label: 'Su misura' },
  { href: '#atelier', label: 'Atelier' },
  { href: '#appuntamento', label: 'Appuntamento' },
];

export const Header: React.FC<HeaderProps> = ({ cartCount, onOpenCart }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-paper text-ink">
      <p className="bg-wine px-4 py-2 text-center text-[11px] font-medium text-cream">
        Fatto su misura a Firenze · Spedizione in Italia
      </p>

      <div className="mx-auto flex h-[4.5rem] max-w-[92rem] items-center justify-between border-b border-ink/10 px-5 md:px-10">
        <button
          type="button"
          className="flex min-h-11 min-w-11 items-center justify-center md:hidden"
          aria-label={isMenuOpen ? 'Chiudi il menu' : 'Apri il menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="size-6" aria-hidden="true">
              <path d="M5 5l14 14M19 5 5 19" strokeWidth="1.5" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="size-6" aria-hidden="true">
              <path d="M3 7h18M3 12h18M3 17h18" strokeWidth="1.5" />
            </svg>
          )}
        </button>

        <nav className="hidden items-center gap-7 text-xs font-medium uppercase md:flex" aria-label="Navigazione principale">
          {navItems.slice(0, 2).map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-wine">
              {item.label}
            </a>
          ))}
        </nav>

        <a href="#top" className="absolute left-1/2 -translate-x-1/2 text-center" aria-label={`${STORE_NAME}, torna all'inizio`}>
          <span className="block font-display text-2xl leading-none md:text-3xl">NOVE</span>
          <span className="mt-1 block text-[9px] font-semibold uppercase">Firenze</span>
        </a>

        <div className="flex items-center gap-3 md:gap-7">
          <nav className="hidden items-center gap-7 text-xs font-medium uppercase md:flex" aria-label="Servizi">
            {navItems.slice(2).map((item) => (
              <a key={item.href} href={item.href} className="transition-colors hover:text-wine">
                {item.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            onClick={onOpenCart}
            className="flex min-h-11 items-center gap-2 px-1 text-xs font-semibold uppercase transition-colors hover:text-wine"
            aria-label={`Apri la selezione, ${cartCount} ${cartCount === 1 ? 'articolo' : 'articoli'}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="size-5" aria-hidden="true">
              <path d="M5.5 8.5h13l-1 12h-11l-1-12Z" strokeWidth="1.4" />
              <path d="M9 9V6a3 3 0 0 1 6 0v3" strokeWidth="1.4" />
            </svg>
            <span className="tabular-nums">{cartCount}</span>
          </button>
        </div>
      </div>

      <nav
        id="mobile-navigation"
        className={`${isMenuOpen ? 'grid' : 'hidden'} border-b border-ink/10 bg-paper px-6 py-5 md:hidden`}
        aria-label="Navigazione mobile"
      >
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex min-h-11 items-center border-b border-ink/10 font-display text-2xl last:border-0"
            onClick={() => setIsMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
};
