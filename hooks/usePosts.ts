import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

type Post = Database['public']['Tables']['posts']['Row'] & {
  profiles: {
    username: string;
    avatar_url: string | null;
    is_verified: boolean | null;
    is_private: boolean | null;
  };
  recipes?: {
    name: string;
    category: string;
  } | null;
};
type PostInsert = Database['public']['Tables']['posts']['Insert'];

export function usePosts(userId?: string) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('posts')
        .select(`
          *,
          profiles (
            username,
            avatar_url,
            is_verified,
            is_private
          ),
          recipes (
            name,
            category
          )
        `)
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      } else {
        // Only show posts from public profiles for general feed
        query = query.eq('profiles.is_private', false);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching posts:', error);
        setError(error.message);
      } else {
        setPosts(data || []);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (post: PostInsert) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert(post)
        .select(`
          *,
          profiles (
            username,
            avatar_url,
            is_verified,
            is_private
          ),
          recipes (
            name,
            category
          )
        `)
        .single();

      if (error) {
        console.error('Error creating post:', error);
        setError(error.message);
        return { error };
      } else {
        setPosts(prev => [data, ...prev]);
        return { data };
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post');
      return { error: 'Failed to create post' };
    }
  };

  const likePost = async (postId: string, userId: string) => {
    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);

        if (error) {
          console.error('Error unliking post:', error);
          setError(error.message);
          return { error };
        }
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert({
            post_id: postId,
            user_id: userId,
          });

        if (error) {
          console.error('Error liking post:', error);
          setError(error.message);
          return { error };
        }
      }

      // Refresh posts to get updated like counts
      await fetchPosts();
      return { success: true };
    } catch (err) {
      console.error('Error toggling like:', err);
      setError('Failed to toggle like');
      return { error: 'Failed to toggle like' };
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) {
        console.error('Error deleting post:', error);
        setError(error.message);
        return { error };
      } else {
        setPosts(prev => prev.filter(post => post.id !== postId));
        return { success: true };
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post');
      return { error: 'Failed to delete post' };
    }
  };

  return {
    posts,
    loading,
    error,
    createPost,
    likePost,
    deletePost,
    refetch: fetchPosts,
  };
}