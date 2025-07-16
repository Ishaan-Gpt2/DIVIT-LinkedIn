import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, signUp, signIn, signOut, getCurrentUser, getProfile, updateProfile } from '@/lib/supabase';
import { useApiKeysStore } from './apiKeysStore';
import type { Database } from '@/lib/supabase';

export type User = Database['public']['Tables']['profiles']['Row'];

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateCredits: (amount: number) => Promise<void>;
  upgradePlan: (plan: User['plan']) => Promise<void>;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  initializeAuth: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      
      initializeAuth: async () => {
        try {
          const { user: supabaseUser } = await getCurrentUser();
          
          if (supabaseUser) {
            // Get full profile data
            const { data: profile, error } = await getProfile(supabaseUser.id);
            
            if (profile && !error) {
              set({ user: profile, isAuthenticated: true, isLoading: false });
              // Load API keys from environment when user logs in
              useApiKeysStore.getState().loadFromEnv();
            } else {
              console.error('Failed to load profile:', error);
              set({ user: null, isAuthenticated: false, isLoading: false });
            }
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
      
      login: async (email: string, password: string) => {
        try {
          const { data, error } = await signIn(email, password);
          
          if (error) {
            console.error('Login error:', error);
            return false;
          }
          
          if (data.user) {
            // Get full profile data
            const { data: profile, error: profileError } = await getProfile(data.user.id);
            
            if (profile && !profileError) {
              set({ user: profile, isAuthenticated: true });
              // Load API keys from environment when user logs in
              useApiKeysStore.getState().loadFromEnv();
              return true;
            } else {
              console.error('Failed to load profile after login:', profileError);
              return false;
            }
          }
          
          return false;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },
      
      signup: async (email: string, password: string, name: string) => {
        try {
          const { data, error } = await signUp(email, password, { name });
          
          if (error) {
            console.error('Signup error:', error);
            return false;
          }
          
          if (data.user) {
            // Wait a moment for the trigger to create the profile
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Get the created profile
            const { data: profile, error: profileError } = await getProfile(data.user.id);
            
            if (profile && !profileError) {
              set({ user: profile, isAuthenticated: true });
              // Load API keys from environment when user signs up
              useApiKeysStore.getState().loadFromEnv();
              return true;
            } else {
              console.error('Failed to load profile after signup:', profileError);
              return false;
            }
          }
          
          return false;
        } catch (error) {
          console.error('Signup error:', error);
          return false;
        }
      },
      
      logout: async () => {
        try {
          await signOut();
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          console.error('Logout error:', error);
          // Force logout even if Supabase call fails
          set({ user: null, isAuthenticated: false });
        }
      },
      
      updateCredits: async (amount: number) => {
        const { user } = get();
        if (!user) return;
        
        try {
          const newCredits = Math.max(0, (user.credits || 0) + amount);
          const { data, error } = await updateProfile(user.id, { credits: newCredits });
          
          if (data && !error) {
            set({ user: data });
          } else {
            console.error('Failed to update credits:', error);
          }
        } catch (error) {
          console.error('Error updating credits:', error);
        }
      },
      
      upgradePlan: async (plan: User['plan']) => {
        const { user } = get();
        if (!user) return;
        
        try {
          const creditsMap = {
            free: 5,
            creator: 100,
            ghostwriter: 999999,
            agency: 999999
          };
          
          const { data, error } = await updateProfile(user.id, { 
            plan, 
            credits: creditsMap[plan] 
          });
          
          if (data && !error) {
            set({ user: data });
          } else {
            console.error('Failed to upgrade plan:', error);
          }
        } catch (error) {
          console.error('Error upgrading plan:', error);
        }
      },
      
      updateUserProfile: async (updates: Partial<User>) => {
        const { user } = get();
        if (!user) return;
        
        try {
          const { data, error } = await updateProfile(user.id, updates);
          
          if (data && !error) {
            set({ user: data });
          } else {
            console.error('Failed to update profile:', error);
          }
        } catch (error) {
          console.error('Error updating profile:', error);
        }
      },
      
      refreshUser: async () => {
        const { user } = get();
        if (!user) return;
        
        try {
          const { data, error } = await getProfile(user.id);
          
          if (data && !error) {
            set({ user: data });
          } else {
            console.error('Failed to refresh user:', error);
          }
        } catch (error) {
          console.error('Error refreshing user:', error);
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// Initialize auth on app start and listen for auth changes
supabase.auth.onAuthStateChange(async (event, session) => {
  const store = useAuthStore.getState();
  
  if (event === 'SIGNED_IN' && session?.user) {
    try {
      const { data: profile, error } = await getProfile(session.user.id);
      
      if (profile && !error) {
        useAuthStore.setState({ user: profile, isAuthenticated: true, isLoading: false });
        // Load API keys from environment when user logs in
        useApiKeysStore.getState().loadFromEnv();
      } else {
        console.error('Error loading profile on auth change:', error);
        useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error('Error loading profile on auth change:', error);
      useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false });
    }
  } else if (event === 'SIGNED_OUT') {
    useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false });
  }
});