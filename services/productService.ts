import { supabase, isSupabaseConfigured } from './supabase';
import { Product } from '../types';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../constants';

const LOCAL_STORAGE_KEY = 'luce_ombra_products';

// Helper to get local data
const getLocalProducts = (): Product[] => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_PRODUCTS;
  } catch (e) {
    return DEFAULT_PRODUCTS;
  }
};

// Helper to save local data
const saveLocalProducts = (products: Product[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
};

export const productService = {
  
  // FETCH ALL PRODUCTS
  getAll: async (): Promise<Product[]> => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Supabase fetch error:', error);
        // If auth fails or table doesn't exist, fallback to local so site still works
        return getLocalProducts(); 
      }
      
      // Auto-Seed: If DB is connected but empty, upload default products
      if (!data || data.length === 0) {
          console.log("Database connected but empty. Seeding default products to cloud...");
          await productService.resetToDefaults();
          return DEFAULT_PRODUCTS;
      }
      
      return data as Product[];
    } else {
      // Fallback to Local Storage if no keys configured
      return getLocalProducts();
    }
  },

  // ADD PRODUCT
  add: async (product: Product): Promise<Product> => {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!
        .from('products')
        .insert([product])
        .select()
        .single();

      if (error) throw error;
      return data as Product;
    } else {
      const current = getLocalProducts();
      const updated = [product, ...current];
      saveLocalProducts(updated);
      return product;
    }
  },

  // DELETE PRODUCT
  remove: async (id: string): Promise<void> => {
    if (isSupabaseConfigured()) {
      const { error } = await supabase!
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } else {
      const current = getLocalProducts();
      const updated = current.filter(p => p.id !== id);
      saveLocalProducts(updated);
    }
  },

  // UPDATE PRODUCT
  update: async (product: Product): Promise<void> => {
    if (isSupabaseConfigured()) {
       const { error } = await supabase!
        .from('products')
        .update(product)
        .eq('id', product.id);

       if (error) throw error;
    } else {
      const current = getLocalProducts();
      const updated = current.map(p => p.id === product.id ? product : p);
      saveLocalProducts(updated);
    }
  },

  // RESET TO DEFAULTS (Wipe DB and Seed)
  resetToDefaults: async (): Promise<void> => {
    if (isSupabaseConfigured()) {
        // 1. Delete all rows
        const { error: deleteError } = await supabase!
            .from('products')
            .delete()
            .neq('id', '0'); // Delete all where id is not '0' (effectively all)
        
        if (deleteError) throw deleteError;

        // 2. Insert defaults
        const { error: insertError } = await supabase!
            .from('products')
            .insert(DEFAULT_PRODUCTS);
        
        if (insertError) throw insertError;
    } else {
        saveLocalProducts(DEFAULT_PRODUCTS);
    }
  },

  // BULK IMPORT
  bulkImport: async (products: Product[]): Promise<void> => {
      if (isSupabaseConfigured()) {
        const { error } = await supabase!
            .from('products')
            .upsert(products);
        
        if (error) throw error;
      } else {
          saveLocalProducts(products);
      }
  }
};