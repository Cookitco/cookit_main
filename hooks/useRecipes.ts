import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

type Recipe = Database['public']['Tables']['recipes']['Row'] & {
  profiles?: {
    username: string;
    avatar_url: string | null;
    is_verified: boolean | null;
  };
};
type RecipeInsert = Database['public']['Tables']['recipes']['Insert'];

export function useRecipes(userId?: string) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecipes();
  }, [userId]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('recipes')
        .select(`
          *,
          profiles (
            username,
            avatar_url,
            is_verified
          )
        `)
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      } else {
        // Only show public recipes if no specific user
        query = query.eq('is_private', false);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching recipes:', error);
        setError(error.message);
      } else {
        setRecipes(data || []);
      }
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  const createRecipe = async (recipe: RecipeInsert) => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .insert(recipe)
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
        console.error('Error creating recipe:', error);
        setError(error.message);
        return { error };
      } else {
        setRecipes(prev => [data, ...prev]);
        return { data };
      }
    } catch (err) {
      console.error('Error creating recipe:', err);
      setError('Failed to create recipe');
      return { error: 'Failed to create recipe' };
    }
  };

  const updateRecipe = async (id: string, updates: Partial<Recipe>) => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .update(updates)
        .eq('id', id)
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
        console.error('Error updating recipe:', error);
        setError(error.message);
        return { error };
      } else {
        setRecipes(prev => prev.map(recipe => recipe.id === id ? data : recipe));
        return { data };
      }
    } catch (err) {
      console.error('Error updating recipe:', err);
      setError('Failed to update recipe');
      return { error: 'Failed to update recipe' };
    }
  };

  const deleteRecipe = async (id: string) => {
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting recipe:', error);
        setError(error.message);
        return { error };
      } else {
        setRecipes(prev => prev.filter(recipe => recipe.id !== id));
        return { success: true };
      }
    } catch (err) {
      console.error('Error deleting recipe:', err);
      setError('Failed to delete recipe');
      return { error: 'Failed to delete recipe' };
    }
  };

  const likeRecipe = async (recipeId: string, userId: string) => {
    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('recipe_id', recipeId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Unlike
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('recipe_id', recipeId)
          .eq('user_id', userId);

        if (error) {
          console.error('Error unliking recipe:', error);
          setError(error.message);
          return { error };
        }
      } else {
        // Like
        const { error } = await supabase
          .from('likes')
          .insert({
            recipe_id: recipeId,
            user_id: userId,
          });

        if (error) {
          console.error('Error liking recipe:', error);
          setError(error.message);
          return { error };
        }
      }

      // Refresh recipes to get updated like counts
      await fetchRecipes();
      return { success: true };
    } catch (err) {
      console.error('Error toggling recipe like:', err);
      setError('Failed to toggle recipe like');
      return { error: 'Failed to toggle recipe like' };
    }
  };

  const saveRecipe = async (recipeId: string, userId: string) => {
    try {
      // Check if already saved
      const { data: existingSave } = await supabase
        .from('saves')
        .select('id')
        .eq('recipe_id', recipeId)
        .eq('user_id', userId)
        .single();

      if (existingSave) {
        // Unsave
        const { error } = await supabase
          .from('saves')
          .delete()
          .eq('recipe_id', recipeId)
          .eq('user_id', userId);

        if (error) {
          console.error('Error unsaving recipe:', error);
          setError(error.message);
          return { error };
        }
      } else {
        // Save
        const { error } = await supabase
          .from('saves')
          .insert({
            recipe_id: recipeId,
            user_id: userId,
          });

        if (error) {
          console.error('Error saving recipe:', error);
          setError(error.message);
          return { error };
        }
      }

      // Refresh recipes to get updated save counts
      await fetchRecipes();
      return { success: true };
    } catch (err) {
      console.error('Error toggling recipe save:', err);
      setError('Failed to toggle recipe save');
      return { error: 'Failed to toggle recipe save' };
    }
  };

  return {
    recipes,
    loading,
    error,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    likeRecipe,
    saveRecipe,
    refetch: fetchRecipes,
  };
}