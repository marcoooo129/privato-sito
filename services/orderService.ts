import { supabase, isSupabaseConfigured } from './supabase';
import { Order, CartItem, CustomerInfo } from '../types';

export const orderService = {
  
  // Submit a new order
  submitOrder: async (customer: CustomerInfo, items: CartItem[], total: number): Promise<string> => {
    const orderId = Date.now().toString();
    
    const newOrder = {
      id: orderId,
      customer_info: customer,
      items: items,
      total: total,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured()) {
      const { error } = await supabase!
        .from('orders')
        .insert([newOrder]);
      
      if (error) {
        console.error('Error saving order to Supabase:', error);
        // If table doesn't exist or error, we throw so UI can handle it (or we could fallback to local)
        // For this demo, we will try to fallback to localStorage if API fails
        saveOrderLocally(newOrder);
      }
    } else {
      saveOrderLocally(newOrder);
    }

    return orderId;
  },

  // Get all orders (for Admin)
  getAllOrders: async (): Promise<Order[]> => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        return getLocalOrders();
      }
      
      // Map DB structure back to TS interface if needed (Supabase stores JSONB, comes back as object)
      return data.map((row: any) => ({
        id: row.id,
        customer: row.customer_info,
        items: row.items,
        total: row.total,
        status: row.status,
        created_at: row.created_at
      }));
    }
    return getLocalOrders();
  },

  // Update order status
  updateStatus: async (id: string, status: string) => {
      if (isSupabaseConfigured()) {
          await supabase!.from('orders').update({ status }).eq('id', id);
      } else {
          const orders = getLocalOrders();
          const updated = orders.map((o: any) => o.id === id ? { ...o, status } : o);
          localStorage.setItem('luce_ombra_orders', JSON.stringify(updated));
      }
  }
};

// Local Storage Fallbacks
const saveOrderLocally = (order: any) => {
    const existing = getLocalOrders();
    localStorage.setItem('luce_ombra_orders', JSON.stringify([order, ...existing]));
};

const getLocalOrders = (): any[] => {
    try {
        const data = localStorage.getItem('luce_ombra_orders');
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
};