import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/auth';

export function usePaymentAccess() {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore(state => state.user);

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

        const hasValidAccess = data?.has_access &&
          (!data?.access_expires_at || new Date(data.access_expires_at) > new Date());

        setHasAccess(hasValidAccess);
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
