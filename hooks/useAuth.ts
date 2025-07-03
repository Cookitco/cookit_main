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
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
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
        email: email.trim().toLowerCase(),
        password,
      });
      
      console.log('Sign in result:', { data, error });
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return { data, error: { message: 'Invalid email or password. Please check your credentials.' } };
        } else if (error.message.includes('Email not confirmed')) {
          return { data, error: { message: 'Please check your email and confirm your account.' } };
        } else if (error.message.includes('Too many requests')) {
          return { data, error: { message: 'Too many login attempts. Please wait a moment and try again.' } };
        }
        return { data, error };
      }
      
      return { data, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { data: null, error: { message: 'An unexpected error occurred. Please try again.' } };
    }
  };

  const signUp = async (email: string, password: string, username: string, fullName: string) => {
    try {
      console.log('Attempting sign up with:', email, username);
      
      // Check if username already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.trim())
        .single();

      if (existingProfile) {
        return { 
          data: null, 
          error: { message: `Username "${username}" is already taken. Please choose a different username.` } 
        };
      }

      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: undefined,
          data: {
            username: username.trim(),
            full_name: fullName.trim(),
          }
        }
      });

      console.log('Sign up result:', { data, error });

      if (error) {
        if (error.message.includes('User already registered')) {
          return { 
            data, 
            error: { message: 'This email is already registered. Please sign in instead or use a different email.' } 
          };
        } else if (error.message.includes('Password should be at least')) {
          return { 
            data, 
            error: { message: 'Password must be at least 6 characters long.' } 
          };
        } else if (error.message.includes('Unable to validate email address')) {
          return { 
            data, 
            error: { message: 'Please enter a valid email address.' } 
          };
        } else if (error.message.includes('For security purposes') || error.message.includes('rate limit')) {
          return { 
            data, 
            error: { message: 'Please wait a moment before trying again. Too many requests.' } 
          };
        }
        return { data, error };
      }

      // If signup was successful and we have a user
      if (data.user && !error) {
        try {
          // Create profile immediately
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              username: username.trim(),
              full_name: fullName.trim(),
              bio: 'Welcome to CooKit! 🍳',
              is_private: false,
            });

          if (profileError) {
            console.error('Error creating profile:', profileError);
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

      return { data, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { data: null, error: { message: 'An unexpected error occurred. Please try again.' } };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        setSession(null);
        setUser(null);
      }
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