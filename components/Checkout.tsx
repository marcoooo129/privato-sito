import React, { useState } from 'react';
import { CartItem } from '../types';
import { CURRENCY, FALLBACK_IMAGE } from '../constants';

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onComplete: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ isOpen, onClose, items, onComplete }) => {
  const [step, setStep] = useState<'info' | 'payment' | 'success'>('info');
  const [isProcessing, setIsProcessing] = useState(false);
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    country: 'Italy'
  });

  // Error State
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = FALLBACK_IMAGE;
    e.currentTarget.onerror = null;
  };

  if (!isOpen) return null;

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email address';
      case 'phone':
        // Allows international format, spaces, dashes, parenthesis. Min length check.
        return /^\+?[0-9\s\-()]{7,20}$/.test(value) ? '' : 'Invalid phone number';
      case 'postalCode':
        // Generic check for length and alphanumeric
        return /^[a-zA-Z0-9\s-]{3,10}$/.test(value) ? '' : 'Invalid postal code';
      default:
        return value.trim() ? '' : 'This field is required';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // If this field already has an error, re-validate on change to clear it immediately when fixed
    if (errors[name]) {
      const error = validateField(name, value);
      if (!error) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    // Specific validation checks
    const emailErr = validateField('email', formData.email);
    if (emailErr) newErrors.email = emailErr;

    const phoneErr = validateField('phone', formData.phone);
    if (phoneErr) newErrors.phone = phoneErr;

    const postalErr = validateField('postalCode', formData.postalCode);
    if (postalErr) newErrors.postalCode = postalErr;

    // Required field checks
    ['firstName', 'lastName', 'address', 'city'].forEach(field => {
        if (!(formData as any)[field].trim()) newErrors[field] = 'Required';
    });

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
    }

    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      // Delay closing/clearing to let user see success message
      setTimeout(() => {
        onComplete();
      }, 3000);
    }, 2000);
  };

  // Helper to render input fields with consistent error styling
  const renderInput = (name: keyof typeof formData, placeholder: string, type: string = 'text', required: boolean = true) => (
    <div className="w-full">
       <input
           required={required}
           type={type}
           name={name}
           placeholder={placeholder}
           value={formData[name]}
           onChange={handleInputChange}
           onBlur={handleBlur}
           className={`w-full p-3 bg-stone-50 border-b ${
               errors[name] ? 'border-red-500 text-red-900' : 'border-stone-200 focus:border-stone-900'
           } focus:outline-none transition-colors`}
       />
       {errors[name] && <span className="text-red-500 text-[10px] uppercase tracking-wide mt-1 block animate-fade-in">{errors[name]}</span>}
    </div>
 );

  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-[80] bg-white flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div className="mb-6 rounded-full bg-stone-50 p-6 animate-fade-in-up">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gold-500">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mb-4 animate-fade-in-up delay-100">Grazie, {formData.firstName}.</h2>
        <p className="text-stone-500 mb-8 max-w-md animate-fade-in-up delay-200">
          Il tuo ordine è confermato. Your timeless piece is being prepared with care in our Italian atelier.
        </p>
        <button onClick={onComplete} className="text-sm underline tracking-widest uppercase hover:text-gold-500 animate-fade-in-up delay-300">
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[70] bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-6xl h-[90vh] md:h-auto md:max-h-[90vh] overflow-hidden rounded-lg shadow-2xl flex flex-col md:flex-row animate-fade-in-up">
        
        {/* Left Column: Forms */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 border-b md:border-b-0 md:border-r border-stone-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-serif text-2xl text-stone-900">Checkout</h2>
             <button onClick={onClose} className="md:hidden text-stone-400">Cancel</button>
          </div>
          
          {/* Breadcrumbs */}
          <div className="flex items-center space-x-2 text-xs tracking-widest uppercase mb-8">
            <span className={`font-bold ${step === 'info' ? 'text-stone-900' : 'text-gold-500'}`}>1. Details</span>
            <span className="text-stone-300">/</span>
            <span className={`font-bold ${step === 'payment' ? 'text-stone-900' : 'text-stone-300'}`}>2. Payment</span>
          </div>

          {step === 'info' ? (
            <form onSubmit={handleInfoSubmit} className="space-y-6" noValidate>
              <div className="space-y-4">
                <h3 className="font-serif text-lg text-stone-800">Contact Information</h3>
                {renderInput('email', 'Email Address', 'email')}
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="font-serif text-lg text-stone-800">Shipping Address</h3>
                <div className="grid grid-cols-2 gap-4">
                   {renderInput('firstName', 'First Name')}
                   {renderInput('lastName', 'Last Name')}
                </div>
                {renderInput('address', 'Address')}
                 <div className="grid grid-cols-2 gap-4">
                  {renderInput('postalCode', 'Postal Code')}
                  {renderInput('city', 'City')}
                </div>
                 <div className="w-full">
                     <select 
                        name="country" 
                        value={formData.country} 
                        onChange={handleInputChange}
                        className="w-full p-3 bg-stone-50 border-b border-stone-200 focus:border-stone-900 focus:outline-none transition-colors text-stone-600"
                    >
                        <option value="Italy">Italy (Italia)</option>
                        <option value="France">France</option>
                        <option value="Germany">Germany</option>
                        <option value="USA">United States</option>
                        <option value="UK">United Kingdom</option>
                    </select>
                 </div>
                 {renderInput('phone', 'Phone', 'tel')}
              </div>

              <div className="pt-6 flex justify-end">
                <button type="submit" className="bg-stone-900 text-white px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-gold-500 transition-colors">
                  Continue to Payment
                </button>
              </div>
            </form>
          ) : (
             <form onSubmit={handlePaymentSubmit} className="space-y-6 animate-fade-in">
              <div className="p-4 bg-stone-50 border border-stone-100 rounded text-sm text-stone-600 mb-6 flex justify-between items-center">
                 <div>
                   <span className="block text-xs uppercase text-stone-400">Ship to</span>
                   {formData.address}, {formData.city}, {formData.country}
                 </div>
                 <button type="button" onClick={() => setStep('info')} className="text-xs underline hover:text-gold-500">Edit</button>
              </div>

               <h3 className="font-serif text-lg text-stone-800">Payment Method</h3>
               <div className="grid grid-cols-3 gap-4 mb-6">
                 <button type="button" className="border border-stone-900 bg-stone-50 p-3 text-center text-xs font-bold uppercase">Credit Card</button>
                 <button type="button" className="border border-stone-200 text-stone-400 p-3 text-center text-xs uppercase hover:border-stone-400">PayPal</button>
                 <button type="button" className="border border-stone-200 text-stone-400 p-3 text-center text-xs uppercase hover:border-stone-400">Apple Pay</button>
               </div>

               <div className="space-y-4">
                  <input required type="text" placeholder="Card Number" 
                    className="w-full p-3 bg-stone-50 border-b border-stone-200 focus:border-stone-900 focus:outline-none transition-colors" />
                  <div className="grid grid-cols-2 gap-4">
                    <input required type="text" placeholder="MM / YY" 
                      className="w-full p-3 bg-stone-50 border-b border-stone-200 focus:border-stone-900 focus:outline-none transition-colors" />
                    <input required type="text" placeholder="CVC" 
                      className="w-full p-3 bg-stone-50 border-b border-stone-200 focus:border-stone-900 focus:outline-none transition-colors" />
                  </div>
                  <input required type="text" placeholder="Name on Card" 
                    className="w-full p-3 bg-stone-50 border-b border-stone-200 focus:border-stone-900 focus:outline-none transition-colors" />
               </div>

               <div className="pt-6 flex justify-between items-center">
                 <button type="button" onClick={() => setStep('info')} className="text-xs uppercase tracking-wider text-stone-500 hover:text-stone-900">
                    &larr; Back
                 </button>
                <button type="submit" disabled={isProcessing} className="bg-stone-900 text-white px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-gold-500 transition-colors disabled:opacity-50 disabled:cursor-wait">
                  {isProcessing ? 'Processing...' : `Pay ${CURRENCY}${total.toFixed(2)}`}
                </button>
              </div>
             </form>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="w-full md:w-96 bg-stone-50 p-8 md:p-12 flex flex-col h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-8 md:hidden">
             <h2 className="font-serif text-xl">Order Summary</h2>
          </div>
           <button onClick={onClose} className="hidden md:block absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-900 bg-white rounded-full shadow-sm">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="space-y-6 flex-1">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative">
                   <img 
                      src={item.image} 
                      alt={item.name} 
                      onError={handleImageError}
                      className="w-16 h-16 object-cover bg-white rounded-sm" 
                   />
                   <span className="absolute -top-2 -right-2 bg-stone-900 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                     {item.quantity}
                   </span>
                </div>
                <div className="flex-1">
                  <h4 className="font-serif text-sm text-stone-900">{item.name}</h4>
                  <p className="text-xs text-stone-500">{item.category}</p>
                </div>
                <p className="text-sm font-medium">{CURRENCY}{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-stone-200 space-y-3">
             <div className="flex justify-between text-sm text-stone-600">
               <span>Subtotal</span>
               <span>{CURRENCY}{total.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-sm text-stone-600">
               <span>Shipping</span>
               <span>Free</span>
             </div>
             <div className="flex justify-between text-lg font-serif text-stone-900 pt-4 border-t border-stone-200 mt-4">
               <span>Total</span>
               <span>{CURRENCY}{total.toFixed(2)}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};