import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Grid2x2 as Grid, BookOpen, Heart, MoreHorizontal, Edit, CheckCircle, LogOut, Play } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useRecipes } from '@/hooks/useRecipes';
import { usePosts } from '@/hooks/usePosts';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { profile } = useProfile(user?.id);
  const { recipes } = useRecipes(user?.id);
  const { posts } = usePosts(user?.id);
  const [activeTab, setActiveTab] = useState<'posts' | 'recipes' | 'saved'>('posts');

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            await signOut();
          }
        },
      ]
    );
  };

  const renderPost = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.postItem}>
      <Image source={{ uri: item.media_url }} style={styles.postImage} />
      {(item.type === 'video' || item.type === 'short') && (
        <View style={styles.postPlayOverlay}>
          <Play color="white" size={16} fill="white" />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderRecipe = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.recipeCard}>
      <Image source={{ uri: item.image_url }} style={styles.recipeImage} />
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.recipeStats}>
          <Text style={styles.recipeStatText}>❤️ {item.likes_count || 0}</Text>
          <Text style={styles.recipeStatText}>📌 {item.saves_count || 0}</Text>
        </View>
        <View style={styles.recipeMeta}>
          <Text style={styles.recipeCategory}>{item.category}</Text>
          <View style={[styles.vegBadge, { backgroundColor: item.is_veg ? '#dcfce7' : '#fef2f2' }]}>
            <Text style={[styles.vegText, { color: item.is_veg ? '#16a34a' : '#dc2626' }]}>
              {item.is_veg ? 'Veg' : 'Non-Veg'}
            </Text>
          </View>
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
        <Text style={styles.username}>{profile?.username || 'Loading...'}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Settings color="#374151" size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleSignOut}>
            <LogOut color="#374151" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Image 
              source={{ 
                uri: profile?.avatar_url || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' 
              }} 
              style={styles.profileAvatar} 
            />
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{posts.length}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile?.followers_count || 0}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{profile?.following_count || 0}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameContainer}>
              <Text style={styles.fullName}>{profile?.full_name || 'User'}</Text>
              {profile?.is_verified && (
                <CheckCircle color="#22c55e" size={16} fill="#22c55e" />
              )}
              {profile?.is_private && (
                <Text style={styles.privateBadge}>🔒</Text>
              )}
            </View>
            <Text style={styles.bio}>{profile?.bio || 'Welcome to CooKit!'}</Text>
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
            posts.length > 0 ? (
              <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item) => item.id}
                numColumns={3}
                scrollEnabled={false}
                columnWrapperStyle={styles.postRow}
              />
            ) : (
              <View style={styles.emptyState}>
                <Grid color="#9ca3af" size={48} />
                <Text style={styles.emptyStateTitle}>No posts yet</Text>
                <Text style={styles.emptyStateDescription}>Share your first cooking moment!</Text>
              </View>
            )
          )}
          
          {activeTab === 'recipes' && (
            recipes.length > 0 ? (
              <FlatList
                data={recipes}
                renderItem={renderRecipe}
                keyExtractor={(item) => item.id}
                numColumns={2}
                scrollEnabled={false}
                columnWrapperStyle={styles.recipeRow}
              />
            ) : (
              <View style={styles.emptyState}>
                <BookOpen color="#9ca3af" size={48} />
                <Text style={styles.emptyStateTitle}>No recipes yet</Text>
                <Text style={styles.emptyStateDescription}>Create your first recipe!</Text>
              </View>
            )
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
  privateBadge: {
    fontSize: 14,
    marginLeft: 4,
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
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  postPlayOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    padding: 4,
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
    marginBottom: 8,
  },
  recipeStatText: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#6b7280',
  },
  recipeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recipeCategory: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#9ca3af',
    textTransform: 'capitalize',
  },
  vegBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  vegText: {
    fontSize: 10,
    fontFamily: 'Nunito-SemiBold',
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