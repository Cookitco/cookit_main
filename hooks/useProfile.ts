import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export function useProfile(userId?: string) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setError(error.message);
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: ProfileUpdate) => {
    if (!userId) return { error: 'No user ID provided' };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        setError(error.message);
        return { error };
      } else {
        setProfile(data);
        return { data };
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
      return { error: 'Failed to update profile' };
    }
  };

  const followUser = async (targetUserId: string, currentUserId: string) => {
    try {
      // Check if already following
      const { data: existingFollow } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', currentUserId)
        .eq('following_id', targetUserId)
        .single();

      if (existingFollow) {
        // Unfollow
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', currentUserId)
          .eq('following_id', targetUserId);

        if (error) {
          console.error('Error unfollowing user:', error);
          setError(error.message);
          return { error };
        }
      } else {
        // Follow
        const { error } = await supabase
          .from('follows')
          .insert({
            follower_id: currentUserId,
            following_id: targetUserId,
          });

        if (error) {
          console.error('Error following user:', error);
          setError(error.message);
          return { error };
        }
      }

      // Refresh profile to get updated counts
      await fetchProfile();
      return { success: true };
    } catch (err) {
      console.error('Error toggling follow:', err);
      setError('Failed to toggle follow');
      return { error: 'Failed to toggle follow' };
    }
  };

  const checkFollowStatus = async (targetUserId: string, currentUserId: string) => {
    try {
      const { data, error } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', currentUserId)
        .eq('following_id', targetUserId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking follow status:', error);
        return { isFollowing: false };
      }

      return { isFollowing: !!data };
    } catch (err) {
      console.error('Error checking follow status:', err);
      return { isFollowing: false };
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    followUser,
    checkFollowStatus,
    refetch: fetchProfile,
  };
}