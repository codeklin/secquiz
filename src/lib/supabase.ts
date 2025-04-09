import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  });
  throw new Error('Missing required Supabase environment variables');
}

// Create Supabase client with enhanced options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-client-info': 'secquiz-web'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Verify connection with better error handling and timeout
export const verifyConnection = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .abortSignal(controller.signal)
      .single();
    
    clearTimeout(timeoutId);

    if (error) {
      console.error('Connection verification error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase connection verification failed:', err);
    return false;
  }
};

// Only log in development
if (import.meta.env.DEV) {
  console.info('Supabase client initialized', {
    url: supabaseUrl,
    mode: import.meta.env.MODE,
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
  });
}
