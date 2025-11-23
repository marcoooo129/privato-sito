
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { AIStylist } from './components/AIStylist';
import { CartSidebar } from './components/CartSidebar';
import { AdminDashboard } from './components/AdminDashboard';
import { Checkout } from './components/Checkout';
import { ProductDetail } from './components/ProductDetail';
import { FALLBACK_IMAGE } from './constants';
import { Product, CartItem } from './types';
import { productService } from './services/productService';

const App: React.FC = () => {
  // Initialize with empty array, will load async
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  // State for selected product (Detail Modal)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Load products on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await productService.getAll();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Updated to accept optional quantity
  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity: quantity }];
    });
    // Optional: Open cart automatically on add for better feedback
    // setIsCartOpen(true); 
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

  // Async handlers for Admin actions
  const handleAddProduct = async (newProduct: Product) => {
    try {
      await productService.add(newProduct);
      // Refresh list
      const updatedList = await productService.getAll();
      setProducts(updatedList);
    } catch (error) {
      alert("Error adding product");
      console.error(error);
    }
  };

  const handleRemoveProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.remove(id);
        // Optimistic update or refresh
        setProducts(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        alert("Error deleting product");
        console.error(error);
      }
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      await productService.update(updatedProduct);
      // Refresh list or optimistic update
      setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    } catch (error) {
      alert("Error updating product");
      console.error(error);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = FALLBACK_IMAGE;
    e.currentTarget.onerror = null;
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
        
        {isLoading ? (
          <div className="py-20 flex justify-center">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
          </div>
        ) : (
          <ProductGrid 
            products={products} 
            onAddToCart={addToCart} 
            onProductClick={setSelectedProduct}
          />
        )}
        
        {/* Brand Story Section */}
        <section id="about" className="py-24 bg-white text-center scroll-mt-24">
           <div className="container mx-auto px-6 max-w-2xl">
              <h2 className="text-3xl font-serif mb-8 text-stone-900">La Nostra Storia</h2>
              <div className="space-y-6 text-stone-600 leading-relaxed font-light mb-8">
                <p>
                  Nel cuore vibrante del distretto commerciale di <strong>Civitanova Marche</strong>, 
                  Luce & Ombra rappresenta il punto di incontro tra la moda internazionale e lo stile italiano.
                </p>
                <p>
                  Nati come punto di riferimento per l'ingrosso (wholesale) e il dettaglio nel centro commerciale, 
                  selezioniamo con cura piccoli accessori di tendenza: dagli occhiali da sole statement 
                  alla bigiotteria in acciaio inossidabile, fino agli accessori per capelli più ricercati.
                </p>
                <p>
                  La nostra missione è offrire design ricercato e qualità accessibile, portando le ultime novità 
                  globali direttamente nel cuore delle Marche.
                </p>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1550614000-4b9519e0233b?auto=format&fit=crop&q=80&w=1200" 
                alt="Civitanova Commercial District Vibes" 
                className="w-full h-80 object-cover grayscale opacity-90 rounded-sm"
                onError={handleImageError}
              />
           </div>
        </section>
      </main>

      <footer className="bg-stone-900 text-stone-400 py-12 border-t border-stone-800">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs tracking-widest uppercase">
          <p>&copy; 2024 Luce & Ombra. Civitanova Marche (MC).</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
             <a href="#" className="hover:text-white">Instagram</a>
             <a href="#" className="hover:text-white">WeChat</a>
             <a href="#" className="hover:text-white">Wholesale Info</a>
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

      <ProductDetail
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />

      <AIStylist 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        products={products}
      />

      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onAddProduct={handleAddProduct}
        onRemoveProduct={handleRemoveProduct}
        onUpdateProduct={handleUpdateProduct}
      />
    </div>
  );
};

export default App;
