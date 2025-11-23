
import React, { useState, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { SALES_DATA } from '../constants';
import { Product, Category } from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[]; // Pass all products to display list
  onAddProduct: (product: Product) => void;
  onRemoveProduct: (id: string) => void;
  onUpdateProduct: (product: Product) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  isOpen, 
  onClose, 
  products, 
  onAddProduct, 
  onRemoveProduct, 
  onUpdateProduct 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'overview' | 'inventory'>('overview');
  
  // Edit Mode State
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: Category.NECKLACE,
    material: '',
    description: '',
    image: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Normalize inputs: trim whitespace and lowercase username
    const usernameInput = credentials.username.trim().toLowerCase();
    const passwordInput = credentials.password.trim();

    // Hardcoded credentials for demo purpose
    if (usernameInput === 'admin' && passwordInput === 'admin123') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Login Failed. Please use: admin / admin123');
    }
  };

  const handleCredentialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    if (authError) setAuthError('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCredentials({ username: '', password: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.name === 'price' ? parseFloat(e.target.value) : e.target.value;
    setProductForm({ ...productForm, [e.target.name]: value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Set the base64 string as the image
        setProductForm(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      price: 0,
      category: Category.NECKLACE,
      material: '',
      description: '',
      image: ''
    });
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startEditing = (product: Product) => {
    setProductForm(product);
    setEditingId(product.id);
    // Scroll to form top
    const formElement = document.getElementById('product-form-container');
    if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Default placeholder if image is empty
    const finalImage = productForm.image || 'https://placehold.co/800x800/f5f5f4/292524?text=' + encodeURIComponent(productForm.name || 'Item');

    if (editingId) {
      // Update Mode
      const updatedProduct: Product = {
        ...(productForm as Product),
        id: editingId,
        image: finalImage
      };
      onUpdateProduct(updatedProduct);
      alert('Product updated successfully!');
    } else {
      // Add Mode
      const productToAdd: Product = {
        id: Date.now().toString(),
        name: productForm.name!,
        price: productForm.price!,
        category: productForm.category as Category,
        material: productForm.material || 'Standard',
        description: productForm.description || '',
        image: finalImage,
      };
      onAddProduct(productToAdd);
      alert('Product added successfully!');
    }
    
    resetForm();
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[70] bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-2xl relative animate-fade-in-up">
          <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-stone-900">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="text-center mb-8">
             <div className="inline-block p-3 rounded-full bg-stone-100 mb-4 text-stone-900">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
             </div>
             <h2 className="font-serif text-2xl text-stone-900">Admin Access</h2>
             <p className="text-xs text-stone-500 uppercase tracking-widest mt-2">Login to manage inventory</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <input 
                type="text" 
                name="username"
                value={credentials.username}
                onChange={handleCredentialChange}
                placeholder="Username" 
                className="w-full p-4 bg-stone-50 border border-stone-200 focus:border-stone-900 outline-none transition-colors"
              />
            </div>
            <div>
              <input 
                type="password" 
                name="password"
                value={credentials.password}
                onChange={handleCredentialChange}
                placeholder="Password" 
                className="w-full p-4 bg-stone-50 border border-stone-200 focus:border-stone-900 outline-none transition-colors"
              />
            </div>
            
            {authError && (
              <p className="text-red-500 text-xs text-center font-medium animate-fade-in">{authError}</p>
            )}

            <button type="submit" className="w-full bg-stone-900 text-white py-4 text-xs uppercase tracking-[0.2em] hover:bg-gold-500 transition-colors">
              Login
            </button>
            
            <div className="text-center mt-4 p-2 bg-stone-50 rounded border border-stone-100">
               <p className="text-[10px] text-stone-400 uppercase tracking-wider mb-1">Demo Credentials</p>
               <p className="text-xs font-mono text-stone-600">user: admin</p>
               <p className="text-xs font-mono text-stone-600">pass: admin123</p>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard Screen
  return (
    <div className="fixed inset-0 z-[70] bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-6xl h-[90vh] overflow-hidden rounded-lg shadow-2xl flex flex-col animate-fade-in-up">
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
                    Inventory
                </button>
            </div>
           </div>
           <div className="flex items-center space-x-4">
             <button onClick={handleLogout} className="text-xs uppercase tracking-widest text-stone-500 hover:text-red-500">Logout</button>
             <button onClick={onClose} className="p-2 hover:bg-stone-200 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
             </button>
           </div>
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
            </div>
          ) : (
            <div className="p-8 max-w-4xl mx-auto space-y-12">
                 {/* Product Form */}
                 <div id="product-form-container" className="bg-stone-50 p-8 rounded-lg border border-stone-100">
                    <div className="text-center mb-8">
                        <h3 className="font-serif text-2xl text-stone-900 mb-2">
                           {editingId ? 'Edit Product' : 'Add New Arrival'}
                        </h3>
                        <p className="text-stone-500 text-sm">
                           {editingId ? 'Modify existing item details.' : 'Add a new item to the collection.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase font-bold tracking-widest text-stone-500">Product Name</label>
                                <input 
                                    name="name"
                                    value={productForm.name}
                                    onChange={handleInputChange}
                                    required
                                    type="text" 
                                    className="w-full p-3 bg-white border border-stone-200 focus:border-stone-900 outline-none transition-colors"
                                    placeholder="e.g. Anello Luce"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase font-bold tracking-widest text-stone-500">Price (€)</label>
                                <input 
                                    name="price"
                                    value={productForm.price}
                                    onChange={handleInputChange}
                                    required
                                    type="number" 
                                    className="w-full p-3 bg-white border border-stone-200 focus:border-stone-900 outline-none transition-colors"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase font-bold tracking-widest text-stone-500">Category</label>
                                <select 
                                    name="category"
                                    value={productForm.category}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-white border border-stone-200 focus:border-stone-900 outline-none transition-colors appearance-none"
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
                                    value={productForm.material}
                                    onChange={handleInputChange}
                                    required
                                    type="text" 
                                    className="w-full p-3 bg-white border border-stone-200 focus:border-stone-900 outline-none transition-colors"
                                    placeholder="e.g. 18k Gold"
                                />
                            </div>
                        </div>

                        {/* Image Management Section */}
                        <div className="space-y-4 p-4 bg-white border border-stone-200 rounded">
                             <label className="text-xs uppercase font-bold tracking-widest text-stone-500 block">Product Image</label>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] text-stone-400 uppercase mb-1 block">Option A: Image Link (URL)</label>
                                    <input 
                                        name="image"
                                        value={productForm.image}
                                        onChange={handleInputChange}
                                        type="text" 
                                        className="w-full p-3 bg-stone-50 border border-stone-200 focus:border-stone-900 outline-none transition-colors text-xs"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-stone-400 uppercase mb-1 block">Option B: Upload File (Local)</label>
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        className="w-full p-2 bg-stone-50 border border-stone-200 text-xs file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[10px] file:bg-stone-900 file:text-white hover:file:bg-gold-500 file:uppercase file:tracking-widest"
                                    />
                                </div>
                             </div>
                             
                             {productForm.image && (
                                <div className="mt-2">
                                    <span className="text-[10px] text-stone-400 uppercase">Preview:</span>
                                    <img src={productForm.image} alt="Preview" className="h-20 w-20 object-cover mt-1 border border-stone-200 rounded" />
                                </div>
                             )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold tracking-widest text-stone-500">Description</label>
                            <textarea 
                                name="description"
                                value={productForm.description}
                                onChange={handleInputChange}
                                required
                                rows={3}
                                className="w-full p-3 bg-white border border-stone-200 focus:border-stone-900 outline-none transition-colors resize-none"
                                placeholder="Describe the piece..."
                            />
                        </div>

                        <div className="flex justify-between items-center pt-2">
                            {editingId ? (
                                <button 
                                    type="button" 
                                    onClick={resetForm}
                                    className="text-stone-500 text-xs uppercase hover:text-red-500"
                                >
                                    Cancel Edit
                                </button>
                            ) : <div></div>}

                            <button 
                                type="submit"
                                className="bg-stone-900 text-white px-10 py-4 text-xs uppercase tracking-[0.2em] hover:bg-gold-500 transition-colors"
                            >
                                {editingId ? 'Update Item' : 'Publish Item'}
                            </button>
                        </div>
                    </form>
                 </div>

                 {/* Inventory List */}
                 <div className="space-y-6">
                    <h3 className="font-serif text-2xl text-stone-900 border-b border-stone-100 pb-4">Current Inventory ({products.length})</h3>
                    
                    <div className="bg-white border border-stone-100 rounded-lg overflow-hidden">
                        <table className="w-full text-left text-sm text-stone-600">
                            <thead className="bg-stone-50 text-xs uppercase tracking-widest font-bold text-stone-500">
                                <tr>
                                    <th className="p-4">Product</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Price</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {products.map(p => (
                                    <tr key={p.id} className="hover:bg-stone-50/50 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center space-x-4">
                                                <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover bg-stone-100" />
                                                <span className="font-medium text-stone-900">{p.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">{p.category}</td>
                                        <td className="p-4">€{p.price.toFixed(2)}</td>
                                        <td className="p-4 text-right space-x-3">
                                            <button 
                                                onClick={() => startEditing(p)}
                                                className="text-stone-400 hover:text-gold-500 transition-colors uppercase text-[10px] tracking-widest font-bold"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => onRemoveProduct(p.id)}
                                                className="text-stone-400 hover:text-red-600 transition-colors uppercase text-[10px] tracking-widest font-bold"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {products.length === 0 && (
                             <div className="p-8 text-center text-stone-400 text-sm">No products found.</div>
                        )}
                    </div>
                 </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
