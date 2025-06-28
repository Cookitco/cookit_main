import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/database';

type Recipe = Database['public']['Tables']['recipes']['Row'];
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
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      } else {
        // Only show public recipes if no specific user
        query = query.eq('is_private', false);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        setRecipes(data || []);
      }
    } catch (err) {
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
        .select()
        .single();

      if (error) {
        setError(error.message);
        return { error };
      } else {
        setRecipes(prev => [data, ...prev]);
        return { data };
      }
    } catch (err) {
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
        .select()
        .single();

      if (error) {
        setError(error.message);
        return { error };
      } else {
        setRecipes(prev => prev.map(recipe => recipe.id === id ? data : recipe));
        return { data };
      }
    } catch (err) {
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
        setError(error.message);
        return { error };
      } else {
        setRecipes(prev => prev.filter(recipe => recipe.id !== id));
        return { success: true };
      }
    } catch (err) {
      setError('Failed to delete recipe');
      return { error: 'Failed to delete recipe' };
    }
  };

  return {
    recipes,
    loading,
    error,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    refetch: fetchRecipes,
  };
}