import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Utensils, Users, CheckCircle } from 'lucide-react-native';

interface Recipe {
  id: string;
  name: string;
  image: string;
  prepTime: string;
  isVeg: boolean;
  category: string;
}

interface User {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  followers: number;
  isVerified: boolean;
}

const mockRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Truffle Pasta',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    prepTime: '30 min',
    isVeg: true,
    category: 'dinner',
  },
  {
    id: '2',
    name: 'Chocolate Croissants',
    image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
    prepTime: '3 days',
    isVeg: true,
    category: 'bakery',
  },
  {
    id: '3',
    name: 'Buddha Bowl',
    image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=400',
    prepTime: '45 min',
    isVeg: true,
    category: 'lunch',
  },
  {
    id: '4',
    name: 'Grilled Salmon',
    image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400',
    prepTime: '25 min',
    isVeg: false,
    category: 'dinner',
  },
];

const mockUsers: User[] = [
  {
    id: '1',
    username: 'chef_maria',
    fullName: 'Maria Rodriguez',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    followers: 15420,
    isVerified: true,
  },
  {
    id: '2',
    username: 'baking_with_tom',
    fullName: 'Tom Baker',
    avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    followers: 8930,
    isVerified: true,
  },
  {
    id: '3',
    username: 'healthy_eats_sarah',
    fullName: 'Sarah Johnson',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    followers: 12500,
    isVerified: false,
  },
];

const categories = ['all', 'breakfast', 'brunch', 'lunch', 'snacks', 'dinner', 'bakery', 'dessert'];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'recipes' | 'users'>('recipes');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredRecipes = mockRecipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedCategory === 'all' || recipe.category === selectedCategory)
  );

  const filteredUsers = mockUsers.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderRecipe = ({ item }: { item: Recipe }) => (
    <TouchableOpacity style={styles.recipeCard}>
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.recipeDetails}>
          <Text style={styles.prepTime}>{item.prepTime}</Text>
          <View style={[styles.vegBadge, { backgroundColor: item.isVeg ? '#dcfce7' : '#fef2f2' }]}>
            <Text style={[styles.vegText, { color: item.isVeg ? '#16a34a' : '#dc2626' }]}>
              {item.isVeg ? 'Veg' : 'Non-Veg'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderUser = ({ item }: { item: User }) => (
    <TouchableOpacity style={styles.userCard}>
      <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
      <View style={styles.userInfo}>
        <View style={styles.userNameContainer}>
          <Text style={styles.userUsername}>{item.username}</Text>
          {item.isVerified && (
            <CheckCircle color="#22c55e" size={16} fill="#22c55e" />
          )}
        </View>
        <Text style={styles.userFullName}>{item.fullName}</Text>
        <Text style={styles.userFollowers}>{item.followers.toLocaleString()} followers</Text>
      </View>
      <TouchableOpacity style={styles.followButton}>
        <Text style={styles.followButtonText}>Follow</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

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
            <FlatList
              data={filteredRecipes}
              renderItem={renderRecipe}
              keyExtractor={(item) => item.id}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={styles.recipeRow}
            />
          </View>
        ) : (
          <View style={styles.usersList}>
            <FlatList
              data={filteredUsers}
              renderItem={renderUser}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>
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
  followButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: 'white',
  },
});