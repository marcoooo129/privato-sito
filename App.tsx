import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { AIStylist } from './components/AIStylist';
import { CartSidebar } from './components/CartSidebar';
import { AdminDashboard } from './components/AdminDashboard';
import { Checkout } from './components/Checkout';
import { PRODUCTS } from './constants';
import { Product, CartItem } from './types';

const App: React.FC = () => {
  // Initialize products from constants, but keep them in state to allow updates
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleStartCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = () => {
    setCartItems([]);
    setIsCheckoutOpen(false);
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      <main className="flex-grow">
        <Hero />
        {/* Pass the dynamic products state instead of the constant */}
        <ProductGrid products={products} onAddToCart={addToCart} />
        
        {/* Brand Story Section */}
        <section id="about" className="py-24 bg-white text-center scroll-mt-24">
           <div className="container mx-auto px-6 max-w-2xl">
              <h2 className="text-3xl font-serif mb-8 text-stone-900">La Nostra Storia</h2>
              <p className="text-stone-600 leading-relaxed font-light mb-8">
                Luce & Ombra was born in the historic streets of Florence. We believe that true luxury lies in simplicity. 
                Our designs balance the light (Luce) of polished metals with the shadow (Ombra) of negative space, 
                creating pieces that are not just worn, but experienced.
              </p>
              <img 
                src="https://picsum.photos/id/447/800/400" 
                alt="Atelier" 
                className="w-full h-64 object-cover grayscale opacity-80"
              />
           </div>
        </section>
      </main>

      <footer className="bg-stone-900 text-stone-400 py-12 border-t border-stone-800">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs tracking-widest uppercase">
          <p>&copy; 2024 Luce & Ombra. Milano - Firenze - Roma.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
             <a href="#" className="hover:text-white">Instagram</a>
             <a href="#" className="hover:text-white">Pinterest</a>
             <a href="#" className="hover:text-white">Legal</a>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems} 
        onRemove={removeFromCart}
        onCheckout={handleStartCheckout}
      />
      
      <Checkout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onComplete={handleOrderComplete}
      />

      {/* Pass dynamic products to AI Stylist so it knows about new items */}
      <AIStylist 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        products={products}
      />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onAddProduct={handleAddProduct}
      />
    </div>
  );
};

export default App;