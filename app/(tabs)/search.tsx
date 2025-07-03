import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Utensils, Users, CheckCircle } from 'lucide-react-native';
import { useRecipes } from '@/hooks/useRecipes';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import RecipeModal from '@/components/RecipeModal';

interface User {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  followers_count: number | null;
  is_verified: boolean | null;
  is_private: boolean | null;
}

const categories = ['all', 'breakfast', 'brunch', 'lunch', 'snacks', 'dinner', 'bakery', 'dessert'];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'recipes' | 'users'>('recipes');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [recipeModalVisible, setRecipeModalVisible] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [followingUsers, setFollowingUsers] = useState<Set<string>>(new Set());
  
  const { recipes, loading: loadingRecipes, likeRecipe, saveRecipe, deleteRecipe } = useRecipes();
  const { followUser } = useProfile();
  const { user } = useAuth();

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab, searchQuery]);

  useEffect(() => {
    if (user && activeTab === 'users') {
      fetchFollowingStatus();
    }
  }, [user, users]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('followers_count', { ascending: false });

      if (searchQuery) {
        query = query.or(`username.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.limit(20);

      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchFollowingStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', user.id);

      if (error) {
        console.error('Error fetching following status:', error);
      } else {
        const followingSet = new Set(data.map(follow => follow.following_id));
        setFollowingUsers(followingSet);
      }
    } catch (error) {
      console.error('Error fetching following status:', error);
    }
  };

  const handleFollowUser = async (targetUserId: string) => {
    if (!user) return;

    await followUser(targetUserId, user.id);
    await fetchFollowingStatus();
    await fetchUsers(); // Refresh to get updated follower counts
  };

  const handleRecipePress = (recipe: any) => {
    setSelectedRecipe(recipe);
    setRecipeModalVisible(true);
  };

  const handleLikeRecipe = async (recipeId: string) => {
    if (user) {
      await likeRecipe(recipeId, user.id);
    }
  };

  const handleSaveRecipe = async (recipeId: string) => {
    if (user) {
      await saveRecipe(recipeId, user.id);
    }
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    await deleteRecipe(recipeId);
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === 'all' || recipe.category === selectedCategory)
  );

  const renderRecipe = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.recipeCard} onPress={() => handleRecipePress(item)}>
      <Image source={{ uri: item.image_url }} style={styles.recipeImage} />
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.recipeDetails}>
          <Text style={styles.prepTime}>{item.prep_time}</Text>
          <View style={[styles.vegBadge, { backgroundColor: item.is_veg ? '#dcfce7' : '#fef2f2' }]}>
            <Text style={[styles.vegText, { color: item.is_veg ? '#16a34a' : '#dc2626' }]}>
              {item.is_veg ? 'Veg' : 'Non-Veg'}
            </Text>
          </View>
        </View>
        <View style={styles.recipeStats}>
          <Text style={styles.recipeStatText}>❤️ {item.likes_count || 0}</Text>
          <Text style={styles.recipeStatText}>📌 {item.saves_count || 0}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderUser = ({ item }: { item: User }) => {
    const isFollowing = followingUsers.has(item.id);
    const isOwnProfile = user?.id === item.id;

    return (
      <TouchableOpacity style={styles.userCard}>
        <Image 
          source={{ 
            uri: item.avatar_url || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' 
          }} 
          style={styles.userAvatar} 
        />
        <View style={styles.userInfo}>
          <View style={styles.userNameContainer}>
            <Text style={styles.userUsername}>{item.username}</Text>
            {item.is_verified && (
              <CheckCircle color="#22c55e" size={16} fill="#22c55e" />
            )}
            {item.is_private && (
              <Text style={styles.privateBadge}>🔒</Text>
            )}
          </View>
          <Text style={styles.userFullName}>{item.full_name}</Text>
          <Text style={styles.userFollowers}>{item.followers_count || 0} followers</Text>
        </View>
        {!isOwnProfile && (
          <TouchableOpacity 
            style={[styles.followButton, isFollowing && styles.followingButton]}
            onPress={() => handleFollowUser(item.id)}
          >
            <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
              {isFollowing ? 'Following' : 'Follow'}
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  const renderCategory = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[styles.categoryButton, selectedCategory === item && styles.activeCategoryButton]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text style={[styles.categoryText, selectedCategory === item && styles.activeCategoryText]}>
        {item.charAt(0).toUpperCase() + item.slice(1)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search color="#9ca3af" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes, users, ingredients..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'recipes' && styles.activeTab]}
          onPress={() => setActiveTab('recipes')}
        >
          <Utensils color={activeTab === 'recipes' ? '#22c55e' : '#6b7280'} size={18} />
          <Text style={[styles.tabText, activeTab === 'recipes' && styles.activeTabText]}>
            Recipes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'users' && styles.activeTab]}
          onPress={() => setActiveTab('users')}
        >
          <Users color={activeTab === 'users' ? '#22c55e' : '#6b7280'} size={18} />
          <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>
            Users
          </Text>
        </TouchableOpacity>
      </View>

      {/* Categories (for recipes) */}
      {activeTab === 'recipes' && (
        <View style={styles.categoriesContainer}>
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>
      )}

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'recipes' ? (
          <View style={styles.recipesGrid}>
            {filteredRecipes.length > 0 ? (
              <FlatList
                data={filteredRecipes}
                renderItem={renderRecipe}
                keyExtractor={(item) => item.id}
                numColumns={2}
                scrollEnabled={false}
                columnWrapperStyle={styles.recipeRow}
              />
            ) : (
              <View style={styles.emptyState}>
                <Utensils color="#9ca3af" size={48} />
                <Text style={styles.emptyStateTitle}>No recipes found</Text>
                <Text style={styles.emptyStateDescription}>Try adjusting your search or category</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.usersList}>
            {users.length > 0 ? (
              <FlatList
                data={users}
                renderItem={renderUser}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyState}>
                <Users color="#9ca3af" size={48} />
                <Text style={styles.emptyStateTitle}>No users found</Text>
                <Text style={styles.emptyStateDescription}>Try adjusting your search</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Recipe Modal */}
      <RecipeModal
        visible={recipeModalVisible}
        onClose={() => setRecipeModalVisible(false)}
        recipe={selectedRecipe}
        onLike={handleLikeRecipe}
        onSave={handleSaveRecipe}
        onDelete={user?.id === selectedRecipe?.user_id ? handleDeleteRecipe : undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#111827',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#22c55e',
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#6b7280',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#22c55e',
  },
  categoriesContainer: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  activeCategoryButton: {
    backgroundColor: '#22c55e',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#6b7280',
  },
  activeCategoryText: {
    color: 'white',
  },
  content: {
    flex: 1,
  },
  recipesGrid: {
    padding: 16,
  },
  recipeRow: {
    justifyContent: 'space-between',
  },
  recipeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recipeImage: {
    width: '100%',
    height: 120,
  },
  recipeInfo: {
    padding: 12,
  },
  recipeName: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  recipeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  prepTime: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#6b7280',
  },
  vegBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  vegText: {
    fontSize: 10,
    fontFamily: 'Nunito-SemiBold',
  },
  recipeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recipeStatText: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#6b7280',
  },
  usersList: {
    padding: 16,
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userUsername: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#111827',
    marginRight: 4,
  },
  privateBadge: {
    fontSize: 12,
    marginLeft: 4,
  },
  userFullName: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#6b7280',
    marginBottom: 2,
  },
  userFollowers: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#9ca3af',
  },
  followButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followingButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  followButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: 'white',
  },
  followingButtonText: {
    color: '#6b7280',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Nunito-SemiBold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#6b7280',
    textAlign: 'center',
  },
});