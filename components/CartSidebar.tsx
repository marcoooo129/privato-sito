import React, { useEffect, useRef } from 'react';
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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className="drawer-dialog"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      aria-labelledby="selection-title"
    >
      <div className="flex h-full w-[min(30rem,100vw)] flex-col bg-paper">
        <div className="flex items-center justify-between border-b border-ink/15 px-6 py-5">
          <div>
            <p className="text-[11px] font-semibold uppercase text-wine">La tua selezione</p>
            <h2 id="selection-title" className="mt-1 font-display text-3xl">Gioielli scelti</h2>
          </div>
          <button type="button" onClick={onClose} className="flex size-11 items-center justify-center" aria-label="Chiudi la selezione">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="size-6" aria-hidden="true">
              <path d="M5 5l14 14M19 5 5 19" strokeWidth="1.5" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-display text-3xl">La selezione è vuota.</p>
              <p className="mt-3 max-w-xs text-sm leading-6 text-ink/60">Scegli una forma dalla collezione: la personalizzeremo insieme.</p>
              <button type="button" onClick={onClose} className="mt-7 min-h-11 border border-ink px-5 text-xs font-semibold uppercase hover:bg-ink hover:text-paper">Continua a esplorare</button>
            </div>
          ) : (
            <ul className="space-y-7">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 border-b border-ink/10 pb-7">
                  <img
                    src={item.image}
                    alt=""
                    className="size-24 shrink-0 object-cover"
                    onError={(event) => {
                      event.currentTarget.src = FALLBACK_IMAGE;
                      event.currentTarget.onerror = null;
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-xl">{item.name}</h3>
                      <button type="button" onClick={() => onRemove(item.id)} className="min-h-11 px-1 text-xs underline underline-offset-4" aria-label={`Rimuovi ${item.name}`}>Rimuovi</button>
                    </div>
                    <p className="mt-1 text-xs text-ink/55">{item.material}</p>
                    <div className="mt-4 flex justify-between text-sm">
                      <span>Quantità {item.quantity}</span>
                      <span className="tabular-nums">{CURRENCY}{item.price * item.quantity}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-ink/15 bg-cream p-6">
            <div className="flex justify-between text-sm">
              <span>Valore indicativo</span>
              <span className="font-display text-2xl tabular-nums">{CURRENCY}{total}</span>
            </div>
            <p className="mt-3 text-xs leading-5 text-ink/55">Il prezzo finale dipende da misure, metalli, pietre e personalizzazione.</p>
            <button type="button" onClick={onCheckout} className="mt-5 min-h-12 w-full bg-ink px-5 text-xs font-semibold uppercase text-paper transition-colors hover:bg-wine">Richiedi disponibilità</button>
          </div>
        )}
      </div>
    </dialog>
  );
};
