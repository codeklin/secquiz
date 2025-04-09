import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAuthenticated: false });
  },
}));

// Initialize auth state from Supabase session
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session) {
    useAuthStore.getState().setUser(session.user);
  }
});

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    useAuthStore.getState().setUser(session.user);
  } else {
    useAuthStore.getState().setUser(null);
  }
});