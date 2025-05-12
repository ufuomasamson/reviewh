import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User } from '../lib/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isAuthHydrated: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User> & { country?: string }, password: string) => Promise<void>;
  ensureBusinessProfile: () => Promise<void>;
  updateVerificationStatus: (userId: string, isVerified: boolean) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isAuthHydrated: false,

  // --- Login Logic ---
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { error: authError, data } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        set({ isLoading: false, error: authError.message });
        return;
      }

      if (!data.user) {
        set({ isLoading: false, error: 'Login failed: No user returned.' });
        return;
      }

      const { error: profileError, data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        set({ isLoading: false, error: profileError.message });
        return;
      }

      set({
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          isVerified: userData.is_verified,
          createdAt: userData.created_at,
          phone_number: userData.phone_number,
          subscription_status: userData.subscription_status,
          subscription_expiry: userData.subscription_expiry,
        },
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (err) {
      set({ error: 'Login failed.', isLoading: false });
    }
  },

  // --- Logout Logic ---
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      set({ user: null, isAuthenticated: false });
    } else {
      console.error('Logout error:', error);
    }
  },

  // --- Register Logic ---
  register: async (userData: Partial<User> & { country?: string }, password) => {
    set({ isLoading: true, error: null });

    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', userData.email)
        .single();

      if (existingUser) {
        set({ isLoading: false, error: 'Email already in use.' });
        return;
      }

      const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
        email: userData.email!,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role
          }
        }
      });

      if (signUpError) {
        set({ isLoading: false, error: signUpError.message });
        return;
      }

      const { error: insertError } = await supabase.from('users').insert({
        id: signUpData.user?.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        is_verified: false
      });

      if (insertError) {
        set({ isLoading: false, error: insertError.message });
        return;
      }

      // --- Ensure business profile is created for business users ---
      if (userData.role === 'business') {
        const { error: businessInsertError } = await supabase.from('businesses').insert({
          id: signUpData.user?.id,
          company_name: userData.name,
          description: 'Business profile pending completion',
          wallet_balance: 0
        });
        if (businessInsertError) {
          set({ isLoading: false, error: businessInsertError.message });
          return;
        }
      }

      // --- Ensure reviewer profile is created for reviewer users ---
      if (userData.role === 'reviewer') {
        const { error: reviewerInsertError } = await supabase.from('reviewers').insert({
          id: signUpData.user?.id,
          name: userData.name,
          email: userData.email,
          bio: '',
          review_count: 0,
          wallet_balance: 0,
          total_earnings: 0,
          country: userData.country || null
        });
        if (reviewerInsertError) {
          set({ isLoading: false, error: reviewerInsertError.message });
          return;
        }
      }

      set({
        user: {
          id: signUpData.user?.id!,
          email: userData.email!,
          name: userData.name!,
          role: userData.role!,
          isVerified: false,
          createdAt: new Date().toISOString(),
          phone_number: userData.phone_number,
          subscription_status: undefined,
          subscription_expiry: undefined,
        },
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
    } catch (err) {
      set({ error: 'Registration failed.', isLoading: false });
    }
  },

  // --- Business Profile Logic ---
  ensureBusinessProfile: async () => {
    const state = get();
    const { user } = state;
    if (!user || user.role !== 'business') return;

    try {
      const { data: business, error: fetchError } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      // Create if not exists
      if (!business) {
        const { error: createError } = await supabase.from('businesses').insert({
          id: user.id,
          company_name: user.name,
          description: 'Business profile pending completion',
          wallet_balance: 0
        });

        if (createError) {
          throw createError;
        }
      }
    } catch (error) {
      set({ error: 'Failed to verify business profile.' });
    }
  },

  // --- Admin Approval Logic (Fix for Your Issue) ---
  updateVerificationStatus: async (userId, isVerified) => {
    set({ isLoading: true, error: null });

    try {
      // ✅ Update Verification Column in Supabase
      const { error: updateError } = await supabase
        .from('users')
        .update({ is_verified: isVerified })
        .eq('id', userId);

      if (updateError) {
        set({ error: updateError.message });
        return;
      }

      // 🔄 Update local store if this is the current user
      const currentState = get();
      if (currentState.user?.id === userId) {
        const { data: refreshedUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (fetchError) {
          set({ error: fetchError.message });
          return;
        }

        set({
          user: {
            id: refreshedUser.id,
            email: refreshedUser.email,
            name: refreshedUser.name,
            role: refreshedUser.role,
            isVerified: refreshedUser.is_verified,
            createdAt: refreshedUser.created_at,
            phone_number: refreshedUser.phone_number,
            subscription_status: refreshedUser.subscription_status,
            subscription_expiry: refreshedUser.subscription_expiry,
          },
          isLoading: false
        });
      } else {
        set({ isLoading: false });
      }
    } catch (err) {
      set({ error: 'Failed to update verification status.', isLoading: false });
    }
  }
}));

// --- Hydrate the Auth Store on Load ---
export const initAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (!error && userData) {
      useAuthStore.setState({
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          isVerified: userData.is_verified,
          createdAt: userData.created_at,
          phone_number: userData.phone_number,
          subscription_status: userData.subscription_status,
          subscription_expiry: userData.subscription_expiry,
        },
        isAuthenticated: true,
        isAuthHydrated: true
      });
    } else {
      useAuthStore.setState({ isAuthHydrated: true });
    }
  } else {
    useAuthStore.setState({ isAuthHydrated: true });
  }
};
