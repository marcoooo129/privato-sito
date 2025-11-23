import React, { useState, useEffect } from 'react';
import { STORE_NAME } from '../constants';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenChat: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ cartCount, onOpenCart, onOpenChat, onOpenAdmin }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${
        scrolled || isMobileMenuOpen
          ? 'bg-white/90 backdrop-blur-md text-stone-900 shadow-sm py-4' 
          : 'bg-transparent text-stone-900 py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center relative">
        {/* Mobile Menu Button (Hamburger) */}
        <button 
          className="md:hidden p-2 -ml-2 text-stone-900"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>

        {/* Left Nav (Desktop) */}
        <nav className="hidden md:flex space-x-8 text-sm tracking-widest uppercase font-sans font-medium">
          <a href="#shop" onClick={(e) => handleScrollToSection(e, 'shop')} className="hover:text-gold-500 transition-colors">Shop</a>
          <a href="#about" onClick={(e) => handleScrollToSection(e, 'about')} className="hover:text-gold-500 transition-colors">La Storia</a>
          <button onClick={onOpenAdmin} className="hover:text-gold-500 transition-colors text-left uppercase">Admin</button>
        </nav>

        {/* Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2 md:relative md:left-auto md:transform-none text-2xl md:text-3xl font-serif font-semibold tracking-widest text-center cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
          {STORE_NAME}
        </div>

        {/* Right Nav */}
        <div className="flex items-center space-x-4 md:space-x-6">
           <button 
            onClick={onOpenChat}
            className="group flex items-center space-x-2 text-sm tracking-widest hover:text-gold-500 transition-colors"
          >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
            </svg>
            <span className="hidden md:inline">Stylist</span>
          </button>

          <button onClick={onOpenCart} className="relative hover:text-gold-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 5.659c.992 4.425.542 6.245-1.631 6.245h-13.4c-2.174 0-2.623-1.82-1.631-6.245l1.263-5.659c.578-2.59 1.98-3.664 3.596-3.664h6.917c1.616 0 3.018 1.075 3.596 3.664z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-stone-100 shadow-lg animate-fade-in origin-top">
          <div className="flex flex-col p-6 space-y-6 text-center text-sm uppercase tracking-widest font-medium text-stone-800">
             <a href="#shop" onClick={(e) => handleScrollToSection(e, 'shop')} className="hover:text-gold-500">Shop</a>
             <a href="#about" onClick={(e) => handleScrollToSection(e, 'about')} className="hover:text-gold-500">La Storia</a>
             <button onClick={() => { onOpenAdmin(); setIsMobileMenuOpen(false); }} className="hover:text-gold-500 uppercase">Admin Dashboard</button>
          </div>
        </div>
      )}
    </header>
  );
};