import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export default function SessionCheck() {
  const { checkSession } = useAuthStore();
  const isInitialMount = useRef(true);

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    const initialize = async () => {
      if (isInitialMount.current) {
        try {
          await checkSession();
        } catch (error) {
          console.error('Initial session check error:', error);
        }
        isInitialMount.current = false;
      }

      subscription = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          checkSession();
        } else {
          // Use getState to avoid React state updates
          const store = useAuthStore.getState();
          if (store.isAuthenticated) {
            store.logout();
          }
        }
      }).data.subscription;
    };

    initialize();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return null;
}



