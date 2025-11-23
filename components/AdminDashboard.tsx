
import React, { useState, useRef, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SALES_DATA } from '../constants';
import { Product, Category, Order } from '../types';
import { uploadImageToCloud } from '../services/imageService';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
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

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory' | 'data'>('overview');
  
  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);

  // Edit Mode State
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Upload State
  const [isUploading, setIsUploading] = useState(false);

  // Data Tools State
  const [importJson, setImportJson] = useState('');

  // Form State
  const [productForm, setProductForm] = useState<Partial<Product>>({
    id: '',
    name: '',
    price: 0,
    category: Category.NECKLACE,
    material: '',
    description: '',
    image: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load Orders when tab changes to 'orders'
  useEffect(() => {
    if (activeTab === 'orders' && isAuthenticated) {
        const fetchOrders = async () => {
            try {
                const data = await orderService.getAllOrders();
                setOrders(data || []);
            } catch (error) {
                console.error("Failed to fetch orders", error);
                setOrders([]);
            }
        };
        fetchOrders();
    }
  }, [activeTab, isAuthenticated]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const usernameInput = credentials.username.trim().toLowerCase();
    const passwordInput = credentials.password.trim();

    // Use safe access for environment variables to prevent crashes in some environments
    const getEnv = (key: string, fallback: string) => {
      try {
        return process.env[key] || fallback;
      } catch {
        return fallback;
      }
    };

    // Use environment variables for credentials if available, otherwise fallback to defaults
    const adminUser = getEnv('ADMIN_USER', 'admin');
    const adminPass = getEnv('ADMIN_PASSWORD', 'password');

    // Additional hardcoded admin for specific access
    const altUser = 'marcosu';
    const altPass = 'jiayou123';

    if (
      (usernameInput === adminUser && passwordInput === adminPass) || 
      (usernameInput === altUser && passwordInput === altPass)
    ) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Login Failed. Incorrect credentials.');
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        // Upload to Cloud (Imgur) instead of local Base64
        const cloudUrl = await uploadImageToCloud(file);
        setProductForm(prev => ({ ...prev, image: cloudUrl }));
      } catch (error) {
        alert("Failed to upload image to cloud. Please try again or use a direct link.");
        console.error(error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const resetForm = () => {
    setProductForm({
      id: '',
      name: '',
      price: 0,
      category: Category.NECKLACE,
      material: '',
      description: '',
      image: ''
    });
    setEditingId(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsUploading(false);
  };

  const startEditing = (product: Product) => {
    setProductForm(product);
    setEditingId(product.id);
    setActiveTab('inventory'); // Ensure we are on the inventory/edit tab
    // Small timeout to allow tab switch render
    setTimeout(() => {
         const formElement = document.getElementById('product-form-container');
         if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalImage = productForm.image || 'https://placehold.co/800x800/f5f5f4/292524?text=' + encodeURIComponent(productForm.name || 'Item');

    if (editingId) {
      const updatedProduct: Product = {
        ...(productForm as Product),
        id: editingId, // Keep ID consistent on update
        image: finalImage
      };
      onUpdateProduct(updatedProduct);
      alert('Product updated successfully!');
    } else {
      // Manual ID Handling
      let finalId = productForm.id?.trim();
      
      // If manual ID is provided, check for duplicates
      if (finalId) {
          const exists = products.some(p => p.id === finalId);
          if (exists) {
              alert(`Error: Item ID "${finalId}" already exists. Please use a different ID.`);
              return;
          }
      } else {
          // Fallback to auto-gen if empty
          finalId = Date.now().toString();
      }

      const productToAdd: Product = {
        id: finalId,
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

  // Data Tools Handlers
  const handleResetDatabase = async () => {
      if (window.confirm("WARNING: This will DELETE ALL products in the database and restore the default catalog. Are you sure?")) {
          try {
              await productService.resetToDefaults();
              alert("Database reset to defaults. Please refresh the page to see changes.");
              window.location.reload();
          } catch (e) {
              alert("Error resetting database.");
              console.error(e);
          }
      }
  };

  const handleBulkImport = async () => {
      try {
          const data = JSON.parse(importJson);
          if (!Array.isArray(data)) throw new Error("Data must be an array of products");
          
          await productService.bulkImport(data);
          alert("Data imported successfully! Refreshing...");
          window.location.reload();
      } catch (e) {
          alert("Invalid JSON data. Please check format.");
          console.error(e);
      }
  };

  const handleCopyJson = () => {
      navigator.clipboard.writeText(JSON.stringify(products, null, 2));
      alert("Current catalog JSON copied to clipboard!");
  };

  const toggleOrderStatus = async (order: Order) => {
      const newStatus = order.status === 'completed' ? 'pending' : 'completed';
      await orderService.updateStatus(order.id, newStatus);
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: newStatus } : o));
  };

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
          </form>
        </div>
      </div>
    );
  }

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
                    onClick={() => setActiveTab('orders')}
                    className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors ${activeTab === 'orders' ? 'bg-stone-900 text-white' : 'text-stone-500 hover:bg-stone-100'}`}
                >
                    Orders
                </button>
                <button 
                    onClick={() => setActiveTab('inventory')}
                    className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors ${activeTab === 'inventory' ? 'bg-stone-900 text-white' : 'text-stone-500 hover:bg-stone-100'}`}
                >
                    Inventory
                </button>
                 <button 
                    onClick={() => setActiveTab('data')}
                    className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors ${activeTab === 'data' ? 'bg-stone-900 text-white' : 'text-stone-500 hover:bg-stone-100'}`}
                >
                    Data Tools
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
          {activeTab === 'overview' && (
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
    
              {/* Charts */}
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
          )}
          
          {activeTab === 'orders' && (
              <div className="p-8 space-y-8">
                  <div className="text-center mb-8">
                      <h3 className="font-serif text-2xl text-stone-900 mb-2">Order Requests</h3>
                      <p className="text-stone-500 text-sm">
                          Review product lists submitted by customers.
                      </p>
                  </div>
                  
                  {orders.length === 0 ? (
                      <div className="text-center py-12 bg-stone-50 border border-stone-100 rounded">
                          <p className="text-stone-400">No order requests found.</p>
                      </div>
                  ) : (
                      <div className="space-y-4">
                          {orders.map(order => (
                              <div key={order.id} className="border border-stone-200 rounded-lg p-6 bg-white hover:shadow-md transition-shadow">
                                  <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
                                      {/* Customer Info */}
                                      <div className="space-y-1 min-w-[200px]">
                                          <div className="flex items-center space-x-3 mb-2">
                                              <h4 className="font-bold text-stone-900">{order.customer?.name || 'Unknown Customer'}</h4>
                                              <span className={`px-2 py-0.5 text-[10px] uppercase rounded-full font-bold ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                  {order.status}
                                              </span>
                                          </div>
                                          <p className="text-sm text-stone-600">📞 {order.customer?.phone || 'N/A'}</p>
                                          {order.customer?.email && <p className="text-sm text-stone-600">✉️ {order.customer.email}</p>}
                                          <p className="text-xs text-stone-400 mt-2">Date: {new Date(order.created_at).toLocaleDateString()}</p>
                                          {order.customer?.message && (
                                              <div className="mt-3 p-3 bg-stone-50 rounded text-xs text-stone-600 italic">
                                                  "{order.customer.message}"
                                              </div>
                                          )}
                                      </div>

                                      {/* Items */}
                                      <div className="flex-1 bg-stone-50 p-4 rounded-lg">
                                          <ul className="space-y-2 mb-3">
                                              {order.items?.map((item, idx) => (
                                                  <li key={idx} className="flex justify-between items-start text-sm text-stone-700 border-b border-stone-200/50 pb-2 last:border-0 last:pb-0">
                                                      <div>
                                                          <div className="font-medium text-stone-800">{item.name} <span className="text-stone-400 font-mono text-xs">x{item.quantity}</span></div>
                                                          <div className="text-[10px] text-stone-400 font-mono mt-0.5">ID: {item.id}</div>
                                                      </div>
                                                      <span className="font-mono">€{(item.price * item.quantity).toFixed(2)}</span>
                                                  </li>
                                              ))}
                                          </ul>
                                          <div className="flex justify-between text-base font-bold text-stone-900 border-t border-stone-200 pt-2">
                                              <span>Total Estimate</span>
                                              <span>€{order.total?.toFixed(2) || '0.00'}</span>
                                          </div>
                                      </div>

                                      {/* Actions */}
                                      <div className="flex flex-col space-y-2">
                                          <button 
                                            onClick={() => toggleOrderStatus(order)}
                                            className={`px-4 py-2 text-xs uppercase font-bold rounded border transition-colors ${order.status === 'completed' ? 'bg-stone-100 text-stone-500 border-stone-200' : 'bg-stone-900 text-white border-stone-900 hover:bg-gold-500'}`}
                                          >
                                              {order.status === 'completed' ? 'Mark Pending' : 'Mark Done'}
                                          </button>
                                          <a 
                                            href={`tel:${order.customer?.phone}`}
                                            className="px-4 py-2 text-xs uppercase font-bold rounded border border-stone-300 text-stone-700 hover:bg-stone-100 text-center"
                                          >
                                              Call
                                          </a>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
          )}

          {activeTab === 'inventory' && (
            <div className="p-8 max-w-4xl mx-auto space-y-12">
                 {/* Product Form */}
                 <div id="product-form-container" className="bg-stone-50 p-8 rounded-lg border border-stone-100">
                    <div className="text-center mb-8">
                        <h3 className="font-serif text-2xl text-stone-900 mb-2">
                           {editingId ? 'Edit Product' : 'Add New Arrival'}
                        </h3>
                        <p className="text-stone-500 text-sm">
                           Manage your digital catalog.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* ID Field - Manual Input */}
                        <div className="space-y-2">
                            <label className="text-xs uppercase font-bold tracking-widest text-stone-500">Item ID / SKU</label>
                            <input 
                                name="id"
                                value={productForm.id}
                                onChange={handleInputChange}
                                disabled={!!editingId} // Disable editing ID once created
                                type="text" 
                                className={`w-full p-3 border border-stone-200 outline-none transition-colors ${editingId ? 'bg-stone-100 text-stone-500 cursor-not-allowed' : 'bg-white focus:border-stone-900'}`}
                                placeholder="Leave empty to auto-generate (e.g. A001, NECK-25)"
                            />
                            {!editingId && <p className="text-[10px] text-stone-400">If left empty, a system ID will be generated.</p>}
                        </div>

                        {/* Name & Price */}
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

                        {/* Category & Material */}
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
                        <div className="space-y-4 p-5 bg-white border border-stone-200 rounded relative">
                             {isUploading && (
                                <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                                    <div className="text-center">
                                        <svg className="animate-spin h-8 w-8 text-gold-500 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <p className="text-xs font-bold text-stone-900 uppercase tracking-widest">Uploading to Cloud...</p>
                                    </div>
                                </div>
                             )}

                             <label className="text-xs uppercase font-bold tracking-widest text-stone-500 block">Product Image</label>
                             
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Option A: Link */}
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
                                {/* Option B: Cloud Upload */}
                                <div>
                                    <label className="text-[10px] text-stone-400 uppercase mb-1 block">Option B: Cloud Upload</label>
                                    <div className="relative">
                                        <input 
                                            type="file" 
                                            accept="image/*"
                                            ref={fileInputRef}
                                            onChange={handleFileUpload}
                                            className="w-full p-2 bg-stone-50 border border-stone-200 text-xs file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[10px] file:bg-stone-900 file:text-white hover:file:bg-gold-500 file:uppercase file:tracking-widest cursor-pointer"
                                        />
                                    </div>
                                    <p className="text-[10px] text-stone-400 mt-1">
                                        *Automatically uploads to cloud and generates a public URL.
                                    </p>
                                </div>
                             </div>
                             
                             {productForm.image && (
                                <div className="mt-4 flex items-center space-x-4 bg-stone-50 p-2 rounded border border-stone-100">
                                    <img src={productForm.image} alt="Preview" className="h-16 w-16 object-cover rounded border border-stone-200" />
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-[10px] text-stone-400 uppercase">Active URL</p>
                                        <p className="text-xs text-stone-600 truncate font-mono">{productForm.image}</p>
                                    </div>
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
                                disabled={isUploading}
                                className={`bg-stone-900 text-white px-10 py-4 text-xs uppercase tracking-[0.2em] transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gold-500'}`}
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
                                    <th className="p-4">ID</th>
                                    <th className="p-4">Product</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Price</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {products.map(p => (
                                    <tr key={p.id} className="hover:bg-stone-50/50 transition-colors group">
                                        <td className="p-4 font-mono text-xs text-stone-400 select-all">{p.id}</td>
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

          {activeTab === 'data' && (
              <div className="p-8 max-w-4xl mx-auto space-y-12">
                  <div className="text-center mb-8">
                      <h3 className="font-serif text-2xl text-stone-900 mb-2">Data Management</h3>
                      <p className="text-stone-500 text-sm">
                          Sync, backup, or reset your product catalog.
                      </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Import / Export */}
                      <div className="space-y-6">
                          <div className="bg-stone-50 p-6 rounded border border-stone-100">
                              <h4 className="font-serif text-lg text-stone-900 mb-4">Export Data</h4>
                              <p className="text-xs text-stone-500 mb-4">Copy your entire product catalog as JSON.</p>
                              <button 
                                  onClick={handleCopyJson}
                                  className="w-full bg-white border border-stone-200 text-stone-900 py-3 text-xs uppercase tracking-widest hover:bg-stone-900 hover:text-white transition-colors"
                              >
                                  Copy to Clipboard
                              </button>
                          </div>

                          <div className="bg-stone-50 p-6 rounded border border-stone-100">
                              <h4 className="font-serif text-lg text-stone-900 mb-4">Reset Database</h4>
                              <p className="text-xs text-stone-500 mb-4">
                                  Wipe all current products and restore the default catalog (High Quality Images).
                              </p>
                              <button 
                                  onClick={handleResetDatabase}
                                  className="w-full bg-red-50 border border-red-100 text-red-600 py-3 text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-colors"
                              >
                                  Reset to Defaults
                              </button>
                          </div>
                      </div>

                      {/* Import Form */}
                      <div className="bg-stone-50 p-6 rounded border border-stone-100 flex flex-col">
                          <h4 className="font-serif text-lg text-stone-900 mb-4">Import Data</h4>
                          <p className="text-xs text-stone-500 mb-4">Paste JSON data here to bulk import products.</p>
                          <textarea 
                              className="flex-1 w-full p-3 text-xs font-mono bg-white border border-stone-200 mb-4 focus:border-stone-900 outline-none"
                              rows={10}
                              placeholder='[{"name": "...", "price": 10, ...}]'
                              value={importJson}
                              onChange={(e) => setImportJson(e.target.value)}
                          />
                          <button 
                              onClick={handleBulkImport}
                              className="w-full bg-stone-900 text-white py-3 text-xs uppercase tracking-widest hover:bg-gold-500 transition-colors"
                              disabled={!importJson}
                          >
                              Import Products
                          </button>
                      </div>
                  </div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};
