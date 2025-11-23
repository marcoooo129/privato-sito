import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { SALES_DATA } from '../constants';
import { Product, Category } from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct?: (product: Product) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose, onAddProduct }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'inventory'>('overview');
  
  // New Product Form State
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: Category.NECKLACE,
    material: '',
    description: '',
    image: 'https://picsum.photos/seed/new/800/800' // Default random image
  });

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.name === 'price' ? parseFloat(e.target.value) : e.target.value;
    setNewProduct({ ...newProduct, [e.target.name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddProduct && newProduct.name && newProduct.price) {
      const productToAdd: Product = {
        id: Date.now().toString(),
        name: newProduct.name!,
        price: newProduct.price!,
        category: newProduct.category as Category,
        material: newProduct.material || 'Standard',
        description: newProduct.description || '',
        image: newProduct.image || 'https://picsum.photos/seed/fallback/800/800',
      };
      onAddProduct(productToAdd);
      
      // Reset form
      setNewProduct({
        name: '',
        price: 0,
        category: Category.NECKLACE,
        material: '',
        description: '',
        image: 'https://picsum.photos/seed/' + Date.now() + '/800/800'
      });
      alert('Product added successfully!');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl h-[90vh] overflow-hidden rounded-lg shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-stone-100 bg-stone-50">
           <div className="flex items-center space-x-8">
            <div>
                <h2 className="font-serif text-2xl text-stone-900">Admin Dashboard</h2>
            </div>
            <div className="flex space-x-1 bg-white p-1 rounded-md border border-stone-200">
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors ${activeTab === 'overview' ? 'bg-stone-900 text-white' : 'text-stone-500 hover:bg-stone-100'}`}
                >
                    Overview
                </button>
                <button 
                    onClick={() => setActiveTab('inventory')}
                    className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors ${activeTab === 'inventory' ? 'bg-stone-900 text-white' : 'text-stone-500 hover:bg-stone-100'}`}
                >
                    Add Product
                </button>
            </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
           </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-white">
          {activeTab === 'overview' ? (
              <div className="p-8 space-y-12">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-stone-50 p-6 rounded-sm border border-stone-100">
                  <h4 className="text-xs uppercase tracking-widest text-stone-500 mb-2">Total Sales</h4>
                  <p className="text-3xl font-serif text-stone-900">€19,450.00</p>
                </div>
                 <div className="bg-stone-50 p-6 rounded-sm border border-stone-100">
                  <h4 className="text-xs uppercase tracking-widest text-stone-500 mb-2">Total Visitors</h4>
                  <p className="text-3xl font-serif text-stone-900">28,496</p>
                </div>
                 <div className="bg-stone-50 p-6 rounded-sm border border-stone-100">
                  <h4 className="text-xs uppercase tracking-widest text-stone-500 mb-2">Conversion Rate</h4>
                  <p className="text-3xl font-serif text-stone-900">2.4%</p>
                </div>
              </div>
    
              {/* Charts Row 1 */}
              <div className="h-96 w-full">
                <h3 className="font-serif text-xl mb-6 text-stone-800">Monthly Revenue</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={SALES_DATA}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#78716c'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#78716c'}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: '0px' }}
                      itemStyle={{ color: '#1c1917' }}
                    />
                    <Area type="monotone" dataKey="sales" stroke="#D4AF37" fillOpacity={1} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
    
               {/* Charts Row 2 */}
              <div className="h-96 w-full">
                <h3 className="font-serif text-xl mb-6 text-stone-800">Traffic vs. Sales</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={SALES_DATA}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                     <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#78716c'}} />
                     <YAxis yAxisId="left" orientation="left" stroke="#1c1917" axisLine={false} tickLine={false} />
                     <YAxis yAxisId="right" orientation="right" stroke="#D4AF37" axisLine={false} tickLine={false} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e5e5', borderRadius: '0px' }}
                     />
                     <Legend />
                     <Bar yAxisId="left" dataKey="visitors" fill="#1c1917" barSize={20} />
                     <Bar yAxisId="right" dataKey="sales" fill="#D4AF37" barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="p-8 max-w-3xl mx-auto">
                 <div className="text-center mb-10">
                    <h3 className="font-serif text-3xl text-stone-900 mb-2">New Arrival</h3>
                    <p className="text-stone-500">Add a new item to the collection.</p>
                 </div>

                 <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold tracking-widest text-stone-500">Product Name</label>
                            <input 
                                name="name"
                                value={newProduct.name}
                                onChange={handleInputChange}
                                required
                                type="text" 
                                className="w-full p-4 bg-stone-50 border border-stone-200 focus:border-stone-900 outline-none transition-colors"
                                placeholder="e.g. Anello Luce"
                            />
                        </div>
                        <div className="space-y-2">
                             <label className="text-xs uppercase font-bold tracking-widest text-stone-500">Price (€)</label>
                            <input 
                                name="price"
                                value={newProduct.price}
                                onChange={handleInputChange}
                                required
                                type="number" 
                                className="w-full p-4 bg-stone-50 border border-stone-200 focus:border-stone-900 outline-none transition-colors"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold tracking-widest text-stone-500">Category</label>
                            <select 
                                name="category"
                                value={newProduct.category}
                                onChange={handleInputChange}
                                className="w-full p-4 bg-stone-50 border border-stone-200 focus:border-stone-900 outline-none transition-colors appearance-none"
                            >
                                {Object.values(Category).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                         <div className="space-y-2">
                            <label className="text-xs uppercase font-bold tracking-widest text-stone-500">Material</label>
                            <input 
                                name="material"
                                value={newProduct.material}
                                onChange={handleInputChange}
                                required
                                type="text" 
                                className="w-full p-4 bg-stone-50 border border-stone-200 focus:border-stone-900 outline-none transition-colors"
                                placeholder="e.g. 18k Gold"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase font-bold tracking-widest text-stone-500">Image URL</label>
                        <input 
                            name="image"
                            value={newProduct.image}
                            onChange={handleInputChange}
                            required
                            type="text" 
                            className="w-full p-4 bg-stone-50 border border-stone-200 focus:border-stone-900 outline-none transition-colors"
                            placeholder="https://..."
                        />
                         <p className="text-[10px] text-stone-400">Paste a direct image link. We've auto-filled a placeholder for you.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase font-bold tracking-widest text-stone-500">Description</label>
                        <textarea 
                            name="description"
                            value={newProduct.description}
                            onChange={handleInputChange}
                            required
                            rows={4}
                            className="w-full p-4 bg-stone-50 border border-stone-200 focus:border-stone-900 outline-none transition-colors resize-none"
                            placeholder="Describe the piece..."
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button 
                            type="submit"
                            className="bg-stone-900 text-white px-10 py-4 text-xs uppercase tracking-[0.2em] hover:bg-gold-500 transition-colors"
                        >
                            Publish Item
                        </button>
                    </div>
                 </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};