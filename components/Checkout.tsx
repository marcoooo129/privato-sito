
import React, { useState } from 'react';
import { CartItem } from '../types';
import { CURRENCY, FALLBACK_IMAGE } from '../constants';
import { orderService } from '../services/orderService';
import html2canvas from 'html2canvas';

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onComplete: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ isOpen, onClose, items, onComplete }) => {
  const [step, setStep] = useState<'info' | 'success'>('info');
  const [isProcessing, setIsProcessing] = useState(false);
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  // Error State
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors(prev => { const n = {...prev}; delete n[name]; return n; });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic Validation
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    
    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
    }

    setIsProcessing(true);

    // We deliberately SKIP throwing errors here to ensure the flow continues
    // The user requested to generate an image instead of strict DB saving if DB fails.
    try {
        await orderService.submitOrder(
            { name: formData.name, email: formData.email, phone: formData.phone, message: formData.message },
            items,
            total
        );
    } catch (error) {
        console.warn("Database save failed, proceeding to manual image generation flow.", error);
        // Do NOT alert user, just proceed to success screen so they can download the image
    } finally {
        setIsProcessing(false);
        setStep('success');
    }
  };

  const handleDownloadReceipt = async () => {
      const element = document.getElementById('receipt-capture');
      if (element) {
          try {
              const canvas = await html2canvas(element, {
                  scale: 2, // Better quality
                  backgroundColor: '#ffffff',
                  logging: false
              });
              const link = document.createElement('a');
              link.download = `LuceOmbra_Order_${Date.now()}.png`;
              link.href = canvas.toDataURL('image/png');
              link.click();
          } catch (e) {
              alert("Could not generate image. Please screenshot the screen instead.");
          }
      }
  };

  // Generate the email body for the mailto link
  const getMailtoLink = () => {
    const ownerEmail = "info@luceombra.it"; // Placeholder
    const subject = `Nuovo Ordine: ${formData.name}`;
    let body = `Ciao, invio in allegato la foto del mio ordine.\n\nDettagli:\n`;
    body += `Nome: ${formData.name}\nTelefono: ${formData.phone}\n`;
    return `mailto:${ownerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const getWhatsAppLink = () => {
    // Example Phone Number, replace with real one
    const phoneNumber = "393331234567"; 
    let text = `Ciao Luce & Ombra, ho appena scaricato la mia lista ordine. Ve la invio qui.`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
  };

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-[80] bg-stone-100 flex flex-col items-center justify-center p-4 animate-fade-in overflow-y-auto">
        <div className="max-w-md w-full bg-transparent flex flex-col items-center space-y-6 py-8">
            
            <div className="text-center">
                <h2 className="font-serif text-2xl text-stone-900 mb-2">Ordine Pronto!</h2>
                <p className="text-stone-500 text-sm">
                    1. Clicca <strong>Scarica Immagine</strong>.<br/>
                    2. Inviaci l'immagine su WhatsApp o Email.
                </p>
            </div>

            {/* RECEIPT TICKET - This is what gets captured */}
            <div id="receipt-capture" className="bg-white p-8 shadow-xl w-full relative">
                 {/* Decorative Tape effect */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-8 bg-yellow-100/50 rotate-1 backdrop-blur-sm border border-yellow-200/30"></div>

                 <div className="text-center border-b border-dashed border-stone-300 pb-6 mb-6">
                     <h3 className="font-serif text-2xl text-stone-900 tracking-wider">LUCE & OMBRA</h3>
                     <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400 mt-1">Civitanova Marche</p>
                     <p className="text-xs text-stone-500 mt-4 font-mono">{new Date().toLocaleDateString()} — {new Date().toLocaleTimeString()}</p>
                 </div>

                 <div className="mb-6 text-sm">
                     <div className="flex justify-between mb-1">
                         <span className="text-stone-500">Cliente:</span>
                         <span className="font-medium">{formData.name}</span>
                     </div>
                     <div className="flex justify-between">
                         <span className="text-stone-500">Tel:</span>
                         <span className="font-medium">{formData.phone}</span>
                     </div>
                 </div>

                 <div className="space-y-3 mb-6">
                     {items.map((item, idx) => (
                         <div key={idx} className="flex justify-between text-sm items-start border-b border-stone-100 pb-2 last:border-0">
                             <div className="flex-1 pr-4">
                                 <span className="text-stone-900 font-medium block">{item.name}</span>
                                 <div className="flex items-center space-x-2 mt-0.5">
                                    <span className="text-[10px] text-stone-500 font-mono bg-stone-100 px-1 rounded">#{item.id}</span>
                                    <span className="text-[10px] text-stone-400 uppercase tracking-wide">{item.category}</span>
                                 </div>
                             </div>
                             <div className="text-right whitespace-nowrap pt-1">
                                 <span className="text-stone-500 text-xs">x{item.quantity}</span>
                                 <span className="text-stone-900 font-medium ml-3">{CURRENCY}{(item.price * item.quantity).toFixed(2)}</span>
                             </div>
                         </div>
                     ))}
                 </div>

                 <div className="border-t border-dashed border-stone-300 pt-4 mb-8">
                     <div className="flex justify-between text-xl font-serif text-stone-900">
                         <span>Totale</span>
                         <span>{CURRENCY}{total.toFixed(2)}</span>
                     </div>
                 </div>

                 <div className="text-center text-[10px] text-stone-400 uppercase tracking-widest">
                     Grazie per il tuo ordine
                 </div>
            </div>

            {/* Actions */}
            <div className="w-full space-y-3">
                <button 
                    onClick={handleDownloadReceipt}
                    className="w-full bg-stone-900 text-white py-4 text-xs uppercase tracking-[0.2em] hover:bg-gold-500 transition-colors shadow-lg flex items-center justify-center space-x-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M12 12.75l-3-3m0 0l3-3m-3 3h7.5" />
                    </svg>
                    <span>Scarica Immagine</span>
                </button>

                <div className="grid grid-cols-2 gap-3">
                    <a 
                        href={getWhatsAppLink()}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-[#25D366] text-white py-3 text-xs uppercase tracking-widest hover:opacity-90 transition-colors text-center flex items-center justify-center rounded"
                    >
                        WhatsApp
                    </a>
                     <a 
                        href={getMailtoLink()}
                        className="bg-stone-800 text-white py-3 text-xs uppercase tracking-widest hover:bg-stone-700 transition-colors text-center flex items-center justify-center rounded"
                    >
                        Email
                    </a>
                </div>
                
                <button onClick={onComplete} className="w-full py-2 text-xs text-stone-400 hover:text-stone-900 underline">
                    Chiudi e Torna allo Shop
                </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[70] bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-lg shadow-2xl flex flex-col md:flex-row animate-fade-in-up">
        
        {/* Left Column: Form */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 border-b md:border-b-0 md:border-r border-stone-100">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-serif text-2xl text-stone-900">Richiesta Ordine</h2>
             <button onClick={onClose} className="md:hidden text-stone-400">Cancel</button>
          </div>
          <p className="text-stone-500 text-sm mb-8">
            Compila il modulo per generare la lista ordine.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-widest text-stone-500">Nome Completo *</label>
                <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full p-3 bg-stone-50 border ${errors.name ? 'border-red-500' : 'border-stone-200'} focus:border-stone-900 outline-none transition-colors`}
                    placeholder="Il tuo nome"
                />
                 {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-widest text-stone-500">Telefono / WhatsApp *</label>
                <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full p-3 bg-stone-50 border ${errors.phone ? 'border-red-500' : 'border-stone-200'} focus:border-stone-900 outline-none transition-colors`}
                    placeholder="+39 333 ..."
                />
                {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-widest text-stone-500">Email (Opzionale)</label>
                <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-stone-50 border border-stone-200 focus:border-stone-900 outline-none transition-colors"
                    placeholder="email@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase font-bold tracking-widest text-stone-500">Messaggio / Note</label>
                <textarea 
                    name="message"
                    rows={3}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-stone-50 border border-stone-200 focus:border-stone-900 outline-none transition-colors resize-none"
                    placeholder="Dettagli aggiuntivi..."
                />
              </div>

              <div className="pt-4 flex justify-between items-center">
                 <button type="button" onClick={onClose} className="text-xs uppercase tracking-wider text-stone-400 hover:text-stone-900">
                    Annulla
                 </button>
                 <button type="submit" disabled={isProcessing} className="bg-stone-900 text-white px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-gold-500 transition-colors disabled:opacity-50">
                    {isProcessing ? 'Elaborazione...' : 'Crea Ordine'}
                 </button>
              </div>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="w-full md:w-80 bg-stone-50 p-8 md:p-12 flex flex-col h-full overflow-y-auto">
           <h3 className="font-serif text-lg text-stone-900 mb-6">Riepilogo</h3>
           <div className="space-y-4 flex-1">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 border-b border-stone-200 pb-3">
                 <div className="w-12 h-12 bg-white rounded flex-shrink-0">
                     <img src={item.image} alt="" className="w-full h-full object-cover" onError={(e:any) => e.target.src=FALLBACK_IMAGE} />
                 </div>
                <div className="flex-1">
                  <h4 className="font-serif text-xs text-stone-900 line-clamp-1">{item.name}</h4>
                  <div className="flex justify-between items-center mt-1">
                     <span className="text-xs text-stone-500">x{item.quantity}</span>
                     <span className="text-xs font-medium">{CURRENCY}{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-stone-300">
             <div className="flex justify-between text-lg font-serif text-stone-900">
               <span>Totale</span>
               <span>{CURRENCY}{total.toFixed(2)}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
