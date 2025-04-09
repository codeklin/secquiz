import { useEffect, useState, useCallback } from 'react';
import { supabase, verifyConnection } from '@/lib/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface SupabaseProviderProps {
  children: React.ReactNode;
}

export function SupabaseProvider({ children }: SupabaseProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeSupabase = useCallback(async (retryCount = 0) => {
    try {
      // Check if we have the required environment variables
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase configuration');
      }

      // First verify basic connection with timeout
      const isConnected = await verifyConnection();
      if (!isConnected) {
        throw new Error('Database connection failed');
      }

      // Then check session if connection is successful
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.warn('Session error:', sessionError);
      }

      setIsReady(true);
      setError(null);
    } catch (err: any) {
      console.error('Supabase initialization error:', err);
      
      const MAX_RETRIES = 3;
      const RETRY_DELAY = 2000;

      if (retryCount < MAX_RETRIES) {
        console.info(`Retrying connection (${retryCount + 1}/${MAX_RETRIES})...`);
        // Use requestAnimationFrame to handle DOM updates more smoothly
        window.requestAnimationFrame(() => {
          setTimeout(() => {
            initializeSupabase(retryCount + 1);
          }, RETRY_DELAY * (retryCount + 1));
        });
      } else {
        const errorMessage = err.message === 'Missing Supabase configuration'
          ? 'Application configuration error. Please contact support.'
          : 'Unable to connect to the database. Please check your internet connection and try again.';
        
        setError(errorMessage);
        setIsReady(true); // Allow app to load in degraded state
      }
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Use requestAnimationFrame to handle initial render more smoothly
    const frameId = window.requestAnimationFrame(() => {
      if (mounted) {
        initializeSupabase();
      }
    });

    return () => {
      mounted = false;
      window.cancelAnimationFrame(frameId);
    };
  }, [initializeSupabase]);

  if (!isReady) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Connecting to database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
