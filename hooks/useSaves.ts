import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

type SavedRecipe = Database['public']['Tables']['saves']['Row'] & {
  recipes: {
    id: string;
    name: string;
    description: string;
    image_url: string;
    category: string;
    is_veg: boolean | null;
    prep_time: string;
    likes_count: number | null;
    saves_count: number | null;
    profiles: {
      username: string;
      avatar_url: string | null;
    };
  };
};

export function useSaves(userId?: string) {
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchSavedRecipes();
    }
  }, [userId]);

  const fetchSavedRecipes = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('saves')
        .select(`
          *,
          recipes (
            id,
            name,
            description,
            image_url,
            category,
            is_veg,
            prep_time,
            likes_count,
            saves_count,
            profiles (
              username,
              avatar_url
            )
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching saved recipes:', error);
        setError(error.message);
      } else {
        setSavedRecipes(data || []);
      }
    } catch (err) {
      console.error('Error fetching saved recipes:', err);
      setError('Failed to fetch saved recipes');
    } finally {
      setLoading(false);
    }
  };

  const checkSaveStatus = async (recipeId: string, userId: string) => {
    try {
      const { data, error } = await supabase
        .from('saves')
        .select('id')
        .eq('recipe_id', recipeId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking save status:', error);
        return { isSaved: false };
      }

      return { isSaved: !!data };
    } catch (err) {
      console.error('Error checking save status:', err);
      return { isSaved: false };
    }
  };

  return {
    savedRecipes,
    loading,
    error,
    checkSaveStatus,
    refetch: fetchSavedRecipes,
  };
}