import React from 'react';
import { FALLBACK_IMAGE } from '../constants';

export const Hero: React.FC = () => (
  <section id="top" className="scroll-mt-28 bg-cream">
    <div className="mx-auto grid min-h-[calc(100dvh-7rem)] max-w-[92rem] lg:grid-cols-[0.92fr_1.08fr]">
      <div className="flex items-center px-6 py-16 md:px-12 lg:px-16 xl:px-24">
        <div className="max-w-xl">
          <p className="mb-7 text-xs font-semibold uppercase text-wine">Firenze · Gioielli su misura</p>
          <h1 className="text-balance font-display text-5xl font-medium leading-[0.95] text-ink sm:text-6xl md:text-7xl">
            Ogni storia merita una forma unica.
          </h1>
          <p className="mt-7 max-w-lg text-pretty text-base leading-7 text-ink/70 md:text-lg">
            Disegniamo gioielli personali, essenziali e destinati a durare. Ogni pezzo nasce da un incontro e viene lavorato a Firenze.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#collezione" className="inline-flex min-h-12 items-center justify-center bg-ink px-7 text-xs font-semibold uppercase text-paper transition-colors hover:bg-wine">
              Scopri la collezione
            </a>
            <a href="#appuntamento" className="inline-flex min-h-12 items-center justify-center border border-ink px-7 text-xs font-semibold uppercase transition-colors hover:bg-ink hover:text-paper">
              Crea il tuo gioiello
            </a>
          </div>
          <p className="mt-7 text-xs text-ink/55">Realizzati su ordinazione · 3–5 settimane</p>
        </div>
      </div>

      <figure className="relative min-h-[34rem] overflow-hidden bg-sand lg:min-h-0">
        <img
          src="/images/hero-editorial.jpg"
          alt="Ritratto editoriale con orecchino dorato"
          className="absolute inset-0 size-full object-cover object-center"
          fetchPriority="high"
          onError={(event) => {
            event.currentTarget.src = FALLBACK_IMAGE;
            event.currentTarget.onerror = null;
          }}
        />
        <figcaption className="absolute bottom-5 left-5 bg-paper px-4 py-3 text-xs text-ink md:bottom-8 md:left-8">
          Collezione I — luce, linea, gesto
        </figcaption>
      </figure>
    </div>
  </section>
);
