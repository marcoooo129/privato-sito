import { createClient } from '@supabase/supabase-js';

// Using credentials provided by the user
const SUPABASE_URL = 'https://mhalwdkdgaiohnbtlacl.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_SkfYSBarM15MlOCPNC2MMA__oaC4Zfq';

export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

export const isSupabaseConfigured = () => !!supabase;