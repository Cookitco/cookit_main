import { useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session:', session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in with:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      
      console.log('Sign in result:', { data, error });
      return { data, error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error: { message: 'An unexpected error occurred' } };
    }
  };

  const signUp = async (email: string, password: string, username: string, fullName: string) => {
    try {
      console.log('Attempting sign up with:', email, username);
      
      // Skip username check for now to avoid permission issues
      // We'll handle duplicate usernames in the profile creation step
      
      // Sign up the user with email confirmation disabled
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: undefined,
          data: {
            username,
            full_name: fullName,
          }
        }
      });

      console.log('Sign up result:', { data, error });

      if (error) {
        // Handle rate limiting specifically
        if (error.message.includes('For security purposes')) {
          return { 
            data, 
            error: { message: 'Please wait a moment before trying again. Supabase has rate limiting for security.' } 
          };
        }
        return { data, error };
      }

      if (data.user) {
        // Create profile immediately after signup
        try {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              username,
              full_name: fullName,
              bio: 'Welcome to CooKit!',
            });

          if (profileError) {
            console.error('Error creating profile:', profileError);
            // If username already exists, suggest a different one
            if (profileError.message.includes('duplicate') || profileError.message.includes('unique')) {
              return { 
                data: null, 
                error: { message: `Username "${username}" is already taken. Please choose a different username.` } 
              };
            }
          }
        } catch (profileError) {
          console.error('Profile creation error:', profileError);
        }
      }

      return { data, error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error: { message: 'An unexpected error occurred' } };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: { message: 'An unexpected error occurred' } };
    }
  };

  return {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
}