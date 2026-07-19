import React, { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { CartSidebar } from './components/CartSidebar';
import { ProductDetail } from './components/ProductDetail';
import { PRODUCTS, STORE_NAME } from './constants';
import { CartItem, Product } from './types';
import { copy, Language, localizeProducts } from './i18n';

const AdminDashboard = lazy(() =>
  import('./components/AdminDashboard').then((module) => ({ default: module.AdminDashboard })),
);

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = window.localStorage.getItem('nove-language');
    return savedLanguage === 'en' ? 'en' : 'it';
  });
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const content = copy[language];
  const localizedProducts = useMemo(() => localizeProducts(products, language), [products, language]);
  const localizedCartItems = useMemo(
    () => cartItems.map((item) => ({ ...item, ...localizedProducts.find((product) => product.id === item.id) })),
    [cartItems, localizedProducts],
  );
  const selectedProduct = localizedProducts.find((product) => product.id === selectedProductId) ?? null;

  useEffect(() => {
    window.localStorage.setItem('nove-language', language);
    document.documentElement.lang = language;
    document.title = content.meta.title;

    const setMetaContent = (selector: string, value: string) => {
      document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', value);
    };

    setMetaContent('meta[name="description"]', content.meta.description);
    setMetaContent('meta[property="og:title"]', content.meta.title);
    setMetaContent('meta[property="og:description"]', content.meta.ogDescription);
    setMetaContent('meta[property="og:locale"]', content.meta.locale);
    setMetaContent('meta[property="og:locale:alternate"]', language === 'it' ? 'en_GB' : 'it_IT');
    setMetaContent('meta[name="twitter:title"]', content.meta.title);
    setMetaContent('meta[name="twitter:description"]', content.meta.ogDescription);
  }, [content.meta, language]);

  const addToCart = (product: Product, quantity = 1) => {
    setCartItems((items) => {
      const existing = items.find((item) => item.id === product.id);
      if (existing) {
        return items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...items, { ...product, quantity }];
    });
  };

  const requestAvailability = () => {
    setIsCartOpen(false);
    window.requestAnimationFrame(() => document.getElementById('appuntamento')?.scrollIntoView({ behavior: 'smooth' }));
  };

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header
        cartCount={cartItems.reduce((count, item) => count + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        language={language}
        onLanguageChange={setLanguage}
      />

      <main>
        <Hero language={language} />

        <aside className="border-y border-ink/15 bg-paper px-5 py-6 md:px-10" aria-label={content.values.label}>
          <ul className="mx-auto grid max-w-[86rem] gap-4 text-center text-xs font-semibold uppercase sm:grid-cols-3">
            {content.values.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </aside>

        <ProductGrid
          products={localizedProducts}
          onAddToCart={addToCart}
          onProductClick={(product) => setSelectedProductId(product.id)}
          language={language}
        />

        <section id="su-misura" className="scroll-mt-28 bg-wine px-5 py-20 text-cream md:px-10 md:py-28">
          <div className="mx-auto grid max-w-[86rem] gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase text-cream/65">{content.custom.eyebrow}</p>
              <h2 className="mt-4 max-w-2xl text-balance font-display text-5xl leading-[0.95] md:text-7xl">{content.custom.title}</h2>
              <p className="mt-7 max-w-lg text-pretty leading-7 text-cream/70">
                {content.custom.body}
              </p>
              <a href="#appuntamento" className="mt-9 inline-flex min-h-12 items-center justify-center border border-cream px-7 text-xs font-semibold uppercase transition-colors hover:bg-cream hover:text-wine">
                {content.custom.cta}
              </a>
            </div>

            <ol className="border-t border-cream/25">
              {content.custom.steps.map(([number, title, stepCopy]) => (
                <li key={number} className="grid grid-cols-[3.5rem_1fr] gap-5 border-b border-cream/25 py-7 md:grid-cols-[4.5rem_0.7fr_1fr] md:items-baseline">
                  <span className="text-xs text-cream/55">{number}</span>
                  <h3 className="text-balance font-display text-3xl">{title}</h3>
                  <p className="col-start-2 text-pretty text-sm leading-6 text-cream/65 md:col-start-auto">{stepCopy}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="atelier" className="scroll-mt-28 bg-cream">
          <div className="mx-auto grid max-w-[92rem] lg:grid-cols-2">
            <div className="grid min-h-[38rem] grid-cols-2 gap-3 p-5 md:gap-5 md:p-10">
              <img src="/images/atelier.jpg" alt={content.atelier.artisanAlt} className="h-full min-h-[34rem] w-full object-cover" loading="lazy" decoding="async" />
              <img src="/images/craft-detail.jpg" alt={content.atelier.detailAlt} className="mt-20 h-[calc(100%-5rem)] min-h-[26rem] w-full object-cover" loading="lazy" decoding="async" />
            </div>
            <div className="flex items-center px-6 py-16 md:px-14 md:py-24 xl:px-24">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase text-wine">{content.atelier.eyebrow}</p>
                <h2 className="mt-4 text-balance font-display text-5xl leading-[0.95] md:text-7xl">{content.atelier.title}</h2>
                <p className="mt-7 text-pretty leading-7 text-ink/65">
                  {content.atelier.body}
                </p>
                <dl className="mt-9 border-y border-ink/15 py-5 text-sm">
                  <div className="flex justify-between gap-5">
                    <dt className="font-semibold">{content.atelier.where}</dt>
                    <dd className="text-ink/60">{content.atelier.location}</dd>
                  </div>
                  <div className="mt-4 flex justify-between gap-5">
                    <dt className="font-semibold">{content.atelier.visits}</dt>
                    <dd className="text-ink/60">{content.atelier.appointmentOnly}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        <section id="appuntamento" className="scroll-mt-28 bg-ink px-5 py-24 text-center text-paper md:px-10 md:py-32">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold uppercase text-paper/55">{content.appointment.eyebrow}</p>
            <h2 className="mt-5 text-balance font-display text-5xl leading-none md:text-7xl">{content.appointment.title}</h2>
            <p className="mx-auto mt-7 max-w-xl text-pretty leading-7 text-paper/65">
              {content.appointment.body}
            </p>
            <a
              href={`mailto:atelier@nove-firenze.demo?subject=${encodeURIComponent(content.appointment.subject)}`}
              className="mt-9 inline-flex min-h-12 items-center justify-center bg-paper px-8 text-xs font-semibold uppercase text-ink transition-colors hover:bg-wine hover:text-paper"
            >
              {content.appointment.cta}
            </a>
            <p className="mt-5 text-xs text-paper/45">{content.appointment.demo}</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-paper/15 bg-ink px-5 py-10 text-paper md:px-10">
        <div className="mx-auto flex max-w-[86rem] flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-3xl">{STORE_NAME}</p>
            <p className="mt-2 text-xs text-paper/50">{content.footer.subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs">
            <a href="#collezione" className="hover:text-paper/65">{content.header.nav[0]}</a>
            <a href="#su-misura" className="hover:text-paper/65">{content.header.nav[1]}</a>
            <a href="#appuntamento" className="hover:text-paper/65">{content.header.nav[3]}</a>
            <button type="button" onClick={() => setIsAdminOpen(true)} className="min-h-11 text-paper/45 hover:text-paper">{content.footer.reserved}</button>
          </div>
        </div>
      </footer>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={localizedCartItems}
        onRemove={(id) => setCartItems((items) => items.filter((item) => item.id !== id))}
        onCheckout={requestAvailability}
        language={language}
      />

      <ProductDetail product={selectedProduct} onClose={() => setSelectedProductId(null)} onAddToCart={addToCart} language={language} />

      {isAdminOpen && (
        <Suspense fallback={null}>
          <AdminDashboard
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
            products={products}
            onAddProduct={(product) => setProducts((items) => [...items, product])}
            onRemoveProduct={(id) => setProducts((items) => items.filter((item) => item.id !== id))}
            onUpdateProduct={(product) => setProducts((items) => items.map((item) => item.id === product.id ? product : item))}
          />
        </Suspense>
      )}
    </div>
  );
};

export default App;
