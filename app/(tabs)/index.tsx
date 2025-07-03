import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, Heart, MessageSquare, Send, Bookmark, MoreHorizontal, CheckCircle, Play } from 'lucide-react-native';
import { usePosts } from '@/hooks/usePosts';
import { useAuth } from '@/hooks/useAuth';

const stories = [
  { id: '1', username: 'Your Story', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop', isOwn: true },
  { id: '2', username: 'chef_maria', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
  { id: '3', username: 'baking_tom', avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
  { id: '4', username: 'healthy_sarah', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
];

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<'posts' | 'videos'>('posts');
  const { posts, loading, likePost, refetch } = usePosts();
  const { user } = useAuth();

  const handleLike = async (postId: string) => {
    if (user) {
      await likePost(postId, user.id);
    }
  };

  const formatTimeAgo = (dateString: string | null) => {
    if (!dateString) return 'now';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d`;
    }
  };

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'posts') {
      return post.type === 'image';
    } else {
      return post.type === 'video' || post.type === 'short';
    }
  });

  const renderPost = ({ item }: { item: any }) => (
    <View style={styles.postContainer}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Image 
            source={{ uri: item.profiles?.avatar_url || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' }} 
            style={styles.userAvatar} 
          />
          <View style={styles.userDetails}>
            <View style={styles.usernameContainer}>
              <Text style={styles.username}>{item.profiles?.username || 'Unknown User'}</Text>
              {item.profiles?.is_verified && (
                <CheckCircle color="#22c55e" size={16} fill="#22c55e" />
              )}
            </View>
            {item.recipes && (
              <Text style={styles.recipeInfo}>Recipe: {item.recipes.name}</Text>
            )}
          </View>
        </View>
        <TouchableOpacity>
          <MoreHorizontal color="#6b7280" size={24} />
        </TouchableOpacity>
      </View>

      {/* Post Media */}
      <View style={styles.mediaContainer}>
        <Image source={{ uri: item.media_url }} style={styles.postImage} />
        {(item.type === 'video' || item.type === 'short') && (
          <View style={styles.playOverlay}>
            <View style={styles.playButton}>
              <Play color="white" size={24} fill="white" />
            </View>
            {item.duration && (
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{item.duration}</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Post Actions */}
      <View style={styles.postActions}>
        <View style={styles.leftActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleLike(item.id)}>
            <Heart color="#374151" size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MessageSquare color="#374151" size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Send color="#374151" size={24} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Bookmark color="#374151" size={24} />
        </TouchableOpacity>
      </View>

      {/* Post Info */}
      <View style={styles.postInfo}>
        <Text style={styles.likesText}>{item.likes_count || 0} likes</Text>
        {item.caption && (
          <View style={styles.captionContainer}>
            <Text style={styles.captionUsername}>{item.profiles?.username || 'Unknown User'}</Text>
            <Text style={styles.captionText}> {item.caption}</Text>
          </View>
        )}
        {(item.comments_count || 0) > 0 && (
          <TouchableOpacity>
            <Text style={styles.commentsText}>View all {item.comments_count} comments</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.timeText}>{formatTimeAgo(item.created_at)} ago</Text>
      </View>
    </View>
  );

  const renderStory = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.storyContainer}>
      <View style={[styles.storyBorder, item.isOwn && styles.ownStoryBorder]}>
        <Image source={{ uri: item.avatar }} style={styles.storyAvatar} />
        {item.isOwn && (
          <View style={styles.addStoryButton}>
            <Text style={styles.addStoryText}>+</Text>
          </View>
        )}
      </View>
      <Text style={styles.storyUsername} numberOfLines={1}>
        {item.isOwn ? 'Your Story' : item.username}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>CooKit</Text>
        <TouchableOpacity>
          <MessageCircle color="#374151" size={24} />
        </TouchableOpacity>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
          onPress={() => setActiveTab('posts')}
        >
          <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
            Posts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'videos' && styles.activeTab]}
          onPress={() => setActiveTab('videos')}
        >
          <Text style={[styles.tabText, activeTab === 'videos' && styles.activeTabText]}>
            Videos
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      >
        {/* Stories */}
        <View style={styles.storiesSection}>
          <FlatList
            data={stories}
            renderItem={renderStory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesList}
          />
        </View>

        {/* Posts */}
        {filteredPosts.length > 0 ? (
          <FlatList
            data={filteredPosts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {activeTab === 'posts' 
                ? 'No posts yet. Create your first post!' 
                : 'No videos yet. Upload your first video!'
              }
            </Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  logo: {
    fontSize: 28,
    fontFamily: 'Nunito-Bold',
    color: '#22c55e',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  activeTab: {
    backgroundColor: '#22c55e',
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#6b7280',
  },
  activeTabText: {
    color: 'white',
  },
  content: {
    flex: 1,
  },
  storiesSection: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  storiesList: {
    paddingHorizontal: 16,
  },
  storyContainer: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  storyBorder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#22c55e',
    padding: 2,
    marginBottom: 4,
    position: 'relative',
  },
  ownStoryBorder: {
    borderColor: '#d1d5db',
  },
  storyAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  addStoryButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  addStoryText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
  },
  storyUsername: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#374151',
    textAlign: 'center',
  },
  postContainer: {
    backgroundColor: 'white',
    marginBottom: 1,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#111827',
    marginRight: 4,
  },
  recipeInfo: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#6b7280',
    marginTop: 2,
  },
  mediaContainer: {
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: 320,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginRight: 16,
  },
  postInfo: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  likesText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  captionContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  captionUsername: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#111827',
  },
  captionText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#111827',
    flex: 1,
  },
  commentsText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#6b7280',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#9ca3af',
    textTransform: 'uppercase',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#6b7280',
    textAlign: 'center',
  },
});