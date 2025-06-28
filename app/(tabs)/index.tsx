import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, Heart, MessageSquare, Send, Bookmark, MoreHorizontal, CheckCircle } from 'lucide-react-native';

interface Post {
  id: string;
  user: {
    username: string;
    avatar: string;
    isVerified: boolean;
  };
  image: string;
  caption: string;
  likes: number;
  comments: number;
  timeAgo: string;
}

const mockPosts: Post[] = [
  {
    id: '1',
    user: {
      username: 'chef_maria',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      isVerified: true,
    },
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'Homemade pasta with truffle cream sauce 🍝✨ The secret is in the fresh pasta dough and the perfect balance of cream and truffle oil.',
    likes: 342,
    comments: 28,
    timeAgo: '2h',
  },
  {
    id: '2',
    user: {
      username: 'baking_with_tom',
      avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      isVerified: true,
    },
    image: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'Making croissants from scratch! 🥐 This 3-day process is worth every minute. Swipe to see the layers!',
    likes: 189,
    comments: 15,
    timeAgo: '4h',
  },
  {
    id: '3',
    user: {
      username: 'healthy_eats_sarah',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      isVerified: false,
    },
    image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=800',
    caption: 'Rainbow Buddha bowl with quinoa, roasted vegetables, and tahini dressing 🌈 Perfect meal prep option!',
    likes: 267,
    comments: 22,
    timeAgo: '6h',
  },
];

const stories = [
  { id: '1', username: 'Your Story', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop', isOwn: true },
  { id: '2', username: 'chef_maria', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
  { id: '3', username: 'baking_tom', avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
  { id: '4', username: 'healthy_sarah', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' },
];

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<'posts' | 'videos'>('posts');

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: item.user.avatar }} style={styles.userAvatar} />
          <View style={styles.userDetails}>
            <View style={styles.usernameContainer}>
              <Text style={styles.username}>{item.user.username}</Text>
              {item.user.isVerified && (
                <CheckCircle color="#22c55e" size={16} fill="#22c55e" />
              )}
            </View>
          </View>
        </View>
        <TouchableOpacity>
          <MoreHorizontal color="#6b7280" size={24} />
        </TouchableOpacity>
      </View>

      {/* Post Image */}
      <Image source={{ uri: item.image }} style={styles.postImage} />

      {/* Post Actions */}
      <View style={styles.postActions}>
        <View style={styles.leftActions}>
          <TouchableOpacity style={styles.actionButton}>
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
        <Text style={styles.likesText}>{item.likes.toLocaleString()} likes</Text>
        <View style={styles.captionContainer}>
          <Text style={styles.captionUsername}>{item.user.username}</Text>
          <Text style={styles.captionText}> {item.caption}</Text>
        </View>
        {item.comments > 0 && (
          <TouchableOpacity>
            <Text style={styles.commentsText}>View all {item.comments} comments</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.timeText}>{item.timeAgo} ago</Text>
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
        <FlatList
          data={mockPosts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
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
  postImage: {
    width: '100%',
    height: 320,
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
});