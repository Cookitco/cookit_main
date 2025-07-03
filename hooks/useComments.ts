import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

type Comment = Database['public']['Tables']['comments']['Row'] & {
  profiles: {
    username: string;
    avatar_url: string | null;
    is_verified: boolean | null;
  };
};
type CommentInsert = Database['public']['Tables']['comments']['Insert'];

export function useComments(postId?: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId]);

  const fetchComments = async () => {
    if (!postId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles (
            username,
            avatar_url,
            is_verified
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
        setError(error.message);
      } else {
        setComments(data || []);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  };

  const createComment = async (comment: CommentInsert) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert(comment)
        .select(`
          *,
          profiles (
            username,
            avatar_url,
            is_verified
          )
        `)
        .single();

      if (error) {
        console.error('Error creating comment:', error);
        setError(error.message);
        return { error };
      } else {
        setComments(prev => [...prev, data]);
        return { data };
      }
    } catch (err) {
      console.error('Error creating comment:', err);
      setError('Failed to create comment');
      return { error: 'Failed to create comment' };
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        console.error('Error deleting comment:', error);
        setError(error.message);
        return { error };
      } else {
        setComments(prev => prev.filter(comment => comment.id !== commentId));
        return { success: true };
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('Failed to delete comment');
      return { error: 'Failed to delete comment' };
    }
  };

  return {
    comments,
    loading,
    error,
    createComment,
    deleteComment,
    refetch: fetchComments,
  };
}