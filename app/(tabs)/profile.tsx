import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Grid2x2 as Grid, BookOpen, Heart, MoreHorizontal, CreditCard as Edit, CheckCircle } from 'lucide-react-native';

interface Recipe {
  id: string;
  name: string;
  image: string;
  likes: number;
  saves: number;
}

const mockUser = {
  username: 'chef_maria',
  fullName: 'Maria Rodriguez',
  avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
  bio: '👩‍🍳 Professional Chef | Italian Cuisine Expert | Food Photography',
  posts: 248,
  followers: 15420,
  following: 890,
  isVerified: true,
};

const mockPosts = Array.from({ length: 12 }, (_, index) => ({
  id: `${index + 1}`,
  image: `https://images.pexels.com/photos/${1640777 + index}/pexels-photo-${1640777 + index}.jpeg?auto=compress&cs=tinysrgb&w=300`,
}));

const mockRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Truffle Pasta',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 45,
    saves: 23,
  },
  {
    id: '2',
    name: 'Chocolate Croissants',
    image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 78,
    saves: 45,
  },
  {
    id: '3',
    name: 'Buddha Bowl',
    image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 92,
    saves: 67,
  },
  {
    id: '4',
    name: 'Grilled Salmon',
    image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400',
    likes: 56,
    saves: 34,
  },
];

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<'posts' | 'recipes' | 'saved'>('posts');

  const renderPost = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.postItem}>
      <Image source={{ uri: item.image }} style={styles.postImage} />
    </TouchableOpacity>
  );

  const renderRecipe = ({ item }: { item: Recipe }) => (
    <TouchableOpacity style={styles.recipeCard}>
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.recipeStats}>
          <Text style={styles.recipeStatText}>❤️ {item.likes}</Text>
          <Text style={styles.recipeStatText}>📌 {item.saves}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSavedContent = () => (
    <View style={styles.emptyState}>
      <Heart color="#9ca3af" size={48} />
      <Text style={styles.emptyStateTitle}>No saved recipes yet</Text>
      <Text style={styles.emptyStateDescription}>Recipes you save will appear here</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.username}>{mockUser.username}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Settings color="#374151" size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <MoreHorizontal color="#374151" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Image source={{ uri: mockUser.avatar }} style={styles.profileAvatar} />
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{mockUser.posts}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{mockUser.followers.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{mockUser.following}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.fullName}>{mockUser.fullName}</Text>
              {mockUser.isVerified && (
                <CheckCircle color="#22c55e" size={16} fill="#22c55e" />
              )}
            </View>
            <Text style={styles.bio}>{mockUser.bio}</Text>
          </View>

          <TouchableOpacity style={styles.editButton}>
            <Edit color="#374151" size={16} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
            onPress={() => setActiveTab('posts')}
          >
            <Grid color={activeTab === 'posts' ? '#22c55e' : '#6b7280'} size={18} />
            <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
              Posts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'recipes' && styles.activeTab]}
            onPress={() => setActiveTab('recipes')}
          >
            <BookOpen color={activeTab === 'recipes' ? '#22c55e' : '#6b7280'} size={18} />
            <Text style={[styles.tabText, activeTab === 'recipes' && styles.activeTabText]}>
              Recipes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
            onPress={() => setActiveTab('saved')}
          >
            <Heart color={activeTab === 'saved' ? '#22c55e' : '#6b7280'} size={18} />
            <Text style={[styles.tabText, activeTab === 'saved' && styles.activeTabText]}>
              Saved
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.tabContent}>
          {activeTab === 'posts' && (
            <FlatList
              data={mockPosts}
              renderItem={renderPost}
              keyExtractor={(item) => item.id}
              numColumns={3}
              scrollEnabled={false}
              columnWrapperStyle={styles.postRow}
            />
          )}
          
          {activeTab === 'recipes' && (
            <FlatList
              data={mockRecipes}
              renderItem={renderRecipe}
              keyExtractor={(item) => item.id}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={styles.recipeRow}
            />
          )}
          
          {activeTab === 'saved' && renderSavedContent()}
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  username: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: '#111827',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 16,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#6b7280',
  },
  profileInfo: {
    marginBottom: 16,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  fullName: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#111827',
    marginRight: 4,
  },
  bio: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#6b7280',
    lineHeight: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 12,
  },
  editButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#374151',
    marginLeft: 8,
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
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#6b7280',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#22c55e',
  },
  tabContent: {
    padding: 16,
  },
  postRow: {
    justifyContent: 'space-between',
  },
  postItem: {
    width: '32%',
    aspectRatio: 1,
    marginBottom: 4,
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
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
  recipeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recipeStatText: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
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