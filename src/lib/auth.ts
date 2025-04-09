import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { supabase } from './supabase';

interface UserProfile {
  id?: string;
  email: string;
  name?: string;
  is_admin?: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  checkSession: () => Promise<void>;
}

// Custom storage object that matches StateStorage interface
const customStorage: StateStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(name);
  },
  setItem: (name: string, value: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(name, value);
    }
  },
  removeItem: (name: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(name);
    }
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isAdmin: false,
      user: null,

      login: async (email: string, password: string) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;
          if (!data.user) throw new Error('No user data returned');

          const { data: profile } = await supabase
            .from('profiles')
            .select('name, is_admin')
            .eq('id', data.user.id)
            .single();

          set({
            isAuthenticated: true,
            isAdmin: profile?.is_admin || false,
            user: {
              id: data.user.id,
              email: data.user.email!,
              name: profile?.name,
              is_admin: profile?.is_admin
            }
          });
          return true;
        } catch (error) {
          console.error('Login error:', error);
          set({ isAuthenticated: false, isAdmin: false, user: null });
          return false;
        }
      },

      logout: async () => {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({ isAuthenticated: false, isAdmin: false, user: null });
        }
      },

      signup: async (email: string, password: string, name: string) => {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { name }
            }
          });

          if (error) throw error;
          if (!data.user) throw new Error('User was not created');

          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                email: email,
                name: name,
                is_admin: false
              }
            ]);

          if (profileError) throw profileError;
          return true;
        } catch (error: any) {
          console.error('Signup error:', error);
          throw new Error(error?.message || 'Could not create account');
        }
      },

      checkSession: async () => {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) throw error;
          
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('name, is_admin')
              .eq('id', session.user.id)
              .single();

            set({
              isAuthenticated: true,
              isAdmin: profile?.is_admin || false,
              user: {
                id: session.user.id,
                email: session.user.email!,
                name: profile?.name,
                is_admin: profile?.is_admin
              }
            });
          }
        } catch (error) {
          console.error('Session check error:', error);
          set({ isAuthenticated: false, isAdmin: false, user: null });
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => customStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        isAdmin: state.isAdmin,
        user: state.user,
      }),
    }
  )
);
