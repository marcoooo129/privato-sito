import React from 'react';

export const Hero: React.FC = () => {
  const scrollToCollection = () => {
    const section = document.getElementById('shop');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image with Overlay */}
      {/* Updated image to show a fashion/accessories mood */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] hover:scale-105"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1920")' }} 
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-6">
        <span className="text-sm md:text-base tracking-[0.3em] uppercase mb-4 opacity-90 animate-fade-in-up">
          Civitanova Marche Fashion Hub
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium mb-8 tracking-wide animate-fade-in-up delay-100">
          Stile Urbano <br/> <span className="italic font-light">Dettagli Unici</span>
        </h1>
        <button 
          onClick={scrollToCollection}
          className="px-10 py-4 bg-white text-stone-900 text-sm tracking-widest uppercase hover:bg-stone-900 hover:text-white transition-all duration-300 animate-fade-in-up delay-200"
        >
          Scopri La Collezione
        </button>
      </div>
    </div>
  );
};