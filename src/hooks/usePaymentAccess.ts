import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/auth';

export function usePaymentAccess() {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    async function checkAccess() {
      if (!user?.email) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('has_access, access_expires_at')
          .eq('email', user.email)
          .single();

        if (error) throw error;

        // Temporarily grant access to all authenticated users
        // const hasValidAccess = data?.has_access &&
        //   (!data?.access_expires_at || new Date(data.access_expires_at) > new Date());

        // Always grant access to authenticated users for now
        setHasAccess(true);
      } catch (error) {
        console.error('Error checking access:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    }

    checkAccess();
  }, [user?.email]);

  return { hasAccess, loading };
}