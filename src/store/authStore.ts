import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { User, Business, Reviewer, Admin } from '../lib/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isAuthHydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  ensureBusinessProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isAuthHydrated: false,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('Attempting login for:', email);
      
      // First verify the user exists in the users table
      const { data: existingUser, error: userCheckError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (userCheckError) {
        console.error('Error checking user existence:', userCheckError);
        throw new Error('Unable to verify user account');
      }

      if (!existingUser) {
        console.error('No user found with email:', email);
        throw new Error('No account found with this email');
      }

      // Attempt authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Auth error:', error);
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password');
        }
        throw error;
      }

      if (!data.user) {
        console.error('No user data returned from auth');
        throw new Error('Authentication failed');
      }

      console.log('Auth successful, fetching user profile...');

      // Fetch the user's complete profile data
      const { data: userData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        throw new Error('Failed to load user profile');
      }

      if (!userData) {
        console.error('No user profile found for ID:', data.user.id);
        throw new Error('User profile not found');
      }

      console.log('Login successful:', userData);

      set({ 
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          isVerified: userData.is_verified,
          createdAt: userData.created_at
        },
        isAuthenticated: true,
        isLoading: false 
      });
    } catch (error) {
      console.error('Login failed:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Authentication failed',
        isLoading: false,
        user: null,
        isAuthenticated: false
      });
      throw error;
    }
  },
  
  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      set({ 
        user: null,
        isAuthenticated: false
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  },
  
  register: async (userData: Partial<User>, password: string) => {
    set({ isLoading: true, error: null });
    try {
      console.log('Starting registration for:', userData.email);
      
      // First check if user already exists in the users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', userData.email)
        .single();

      if (existingUser) {
        throw new Error('An account with this email already exists');
      }

      // Register the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email!,
        password: password,
        options: {
          data: {
            name: userData.name,
            role: userData.role,
          },
        },
      });

      if (authError) {
        console.error('Auth error:', authError);
        throw authError;
      }
      if (!authData.user) {
        console.error('No user data returned from auth');
        throw new Error('No user data returned');
      }

      console.log('Auth successful, creating user profile...');

      try {
      // Create the user profile in the users table
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: userData.email,
            name: userData.name,
            role: userData.role,
            is_verified: false,
          },
        ]);

        if (profileError) {
          // If profile creation fails, clean up the auth user
          await supabase.auth.admin.deleteUser(authData.user.id);
          console.error('Profile creation error:', profileError);
          throw profileError;
        }

      // If user is a business, create business profile
      if (userData.role === 'business') {
          console.log('Creating business profile...');
        const { error: businessError } = await supabase
          .from('businesses')
          .insert([
            {
              id: authData.user.id,
                company_name: userData.name || '',
                description: 'Business profile pending completion',
              wallet_balance: 0,
            },
          ]);

          if (businessError) {
            // If business profile creation fails, clean up everything
            await supabase.auth.admin.deleteUser(authData.user.id);
            await supabase.from('users').delete().eq('id', authData.user.id);
            console.error('Business profile creation error:', businessError);
            throw businessError;
          }
      }

      // If user is a reviewer, create reviewer profile
      if (userData.role === 'reviewer') {
          console.log('Creating reviewer profile...');
        const { error: reviewerError } = await supabase
          .from('reviewers')
          .insert([
            {
              id: authData.user.id,
              review_count: 0,
              wallet_balance: 0,
              total_earnings: 0,
            },
          ]);

          if (reviewerError) {
            // If reviewer profile creation fails, clean up everything
            await supabase.auth.admin.deleteUser(authData.user.id);
            await supabase.from('users').delete().eq('id', authData.user.id);
            console.error('Reviewer profile creation error:', reviewerError);
            throw reviewerError;
      }
        }

        console.log('Registration completed successfully');

        // Set the user state directly after successful registration
        set({ 
          user: {
            id: authData.user.id,
            email: userData.email!,
            name: userData.name!,
            role: userData.role!,
            isVerified: false,
            createdAt: new Date().toISOString()
          },
          isAuthenticated: true,
          isLoading: false 
        });
      } catch (error) {
        // Clean up auth user if any profile creation fails
        if (authData.user) {
          await supabase.auth.admin.deleteUser(authData.user.id);
        }
        throw error;
      }
    } catch (error) {
      console.error('Registration failed:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Registration failed',
        isLoading: false
      });
      throw error;
    }
  },

  ensureBusinessProfile: async () => {
    const { user } = get();
    if (!user || user.role !== 'business') return;

    try {
      // Check if business profile exists
      const { data: business, error: fetchError } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found" error
        console.error('Error checking business profile:', fetchError);
        throw fetchError;
      }

      // If no business profile exists, create one
      if (!business) {
        const { error: createError } = await supabase
          .from('businesses')
          .insert([{
            id: user.id,
            company_name: user.name, // Use user's name as initial company name
            description: 'Business profile pending completion', // Default description
            wallet_balance: 0
          }]);

        if (createError) {
          console.error('Failed to create business profile:', createError);
          throw createError;
        }
      }

      return business;
    } catch (error) {
      console.error('Error ensuring business profile:', error);
      set({ error: 'Failed to verify business profile' });
      throw error;
    }
  }
}));

export const initAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.user) {
    // Fetch the user's complete profile data
    const { data: userData, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();
    console.log('initAuth userData:', userData, 'profileError:', profileError); // Debug log
    if (!profileError && userData) {
      useAuthStore.setState({
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role: userData.role,
          isVerified: userData.is_verified,
          createdAt: userData.created_at
        },
        isAuthenticated: true,
        isLoading: false,
        isAuthHydrated: true
      });
      return;
    }
  }
  // If no session or user, still set hydrated
  useAuthStore.setState({ isAuthHydrated: true });
};