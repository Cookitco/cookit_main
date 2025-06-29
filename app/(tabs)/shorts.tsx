import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, MessageCircle, Send, Bookmark, MoreVertical, Volume2, VolumeX, CheckCircle, Play } from 'lucide-react-native';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

interface Short {
  id: string;
  user: {
    username: string;
    avatar: string;
    isVerified: boolean;
  };
  video: string;
  caption: string;
  likes: number;
  comments: number;
  music: string;
  isLiked?: boolean;
  isSaved?: boolean;
}

const mockShorts: Short[] = [
  {
    id: '1',
    user: {
      username: 'chef_maria',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      isVerified: true,
    },
    video: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=800&fit=crop',
    caption: 'Quick pasta hack that will blow your mind! 🍝✨ #pasta #cooking #foodhack',
    likes: 12400,
    comments: 89,
    music: 'Original Audio',
  },
  {
    id: '2',
    user: {
      username: 'baking_with_tom',
      avatar: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      isVerified: true,
    },
    video: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400&h=800&fit=crop',
    caption: 'Perfect croissant layers every time! 🥐 The secret is in the temperature #baking #croissant',
    likes: 8900,
    comments: 156,
    music: 'Trending Audio',
  },
  {
    id: '3',
    user: {
      username: 'healthy_eats_sarah',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      isVerified: false,
    },
    video: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=400&h=800&fit=crop',
    caption: '5-minute healthy breakfast bowl 🌈 Perfect for busy mornings! #healthy #breakfast #quickrecipe',
    likes: 15600,
    comments: 234,
    music: 'Upbeat Cooking Music',
  },
  {
    id: '4',
    user: {
      username: 'spice_master',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      isVerified: true,
    },
    video: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=400&h=800&fit=crop',
    caption: 'Secret spice blend that changes everything! 🌶️ Save this recipe! #spices #cooking #secret',
    likes: 9800,
    comments: 67,
    music: 'Cooking Vibes',
  },
  {
    id: '5',
    user: {
      username: 'dessert_queen',
      avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      isVerified: false,
    },
    video: 'https://images.pexels.com/photos/1126728/pexels-photo-1126728.jpeg?auto=compress&cs=tinysrgb&w=400&h=800&fit=crop',
    caption: 'No-bake chocolate cake in 10 minutes! 🍰 Who needs an oven? #dessert #nobake #chocolate',
    likes: 18200,
    comments: 312,
    music: 'Sweet Dreams',
  },
];

export default function ShortsScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [likedShorts, setLikedShorts] = useState<Set<string>>(new Set());
  const [savedShorts, setSavedShorts] = useState<Set<string>>(new Set());
  const flatListRef = useRef<FlatList>(null);

  const handleLike = (shortId: string) => {
    const newLikedShorts = new Set(likedShorts);
    if (newLikedShorts.has(shortId)) {
      newLikedShorts.delete(shortId);
    } else {
      newLikedShorts.add(shortId);
    }
    setLikedShorts(newLikedShorts);
  };

  const handleSave = (shortId: string) => {
    const newSavedShorts = new Set(savedShorts);
    if (newSavedShorts.has(shortId)) {
      newSavedShorts.delete(shortId);
    } else {
      newSavedShorts.add(shortId);
    }
    setSavedShorts(newSavedShorts);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const renderShort = ({ item }: { item: Short }) => {
    const isLiked = likedShorts.has(item.id);
    const isSaved = savedShorts.has(item.id);

    return (
      <View style={styles.shortContainer}>
        {/* Background Video/Image */}
        <Image source={{ uri: item.video }} style={styles.backgroundVideo} />
        
        {/* Play Button Overlay */}
        <View style={styles.playOverlay}>
          <TouchableOpacity style={styles.playButton}>
            <Play color="white" size={32} fill="white" />
          </TouchableOpacity>
        </View>
        
        {/* Gradient Overlays */}
        <View style={styles.topGradient} />
        <View style={styles.bottomGradient} />

        {/* Volume Control */}
        <TouchableOpacity
          style={styles.volumeButton}
          onPress={() => setIsMuted(!isMuted)}
        >
          {isMuted ? (
            <VolumeX color="white" size={24} />
          ) : (
            <Volume2 color="white" size={24} />
          )}
        </TouchableOpacity>

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Left Content - User Info and Caption */}
          <View style={styles.leftContent}>
            <View style={styles.userInfo}>
              <Image source={{ uri: item.user.avatar }} style={styles.userAvatar} />
              <View style={styles.userDetails}>
                <View style={styles.usernameContainer}>
                  <Text style={styles.username}>{item.user.username}</Text>
                  {item.user.isVerified && (
                    <CheckCircle color="#22c55e" size={16} fill="#22c55e" />
                  )}
                </View>
                <TouchableOpacity style={styles.followButton}>
                  <Text style={styles.followButtonText}>Follow</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <Text style={styles.caption}>{item.caption}</Text>
            
            <View style={styles.musicInfo}>
              <Text style={styles.musicText}>♪ {item.music}</Text>
            </View>
          </View>

          {/* Right Actions */}
          <View style={styles.rightActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleLike(item.id)}
            >
              <View style={[styles.actionIconContainer, isLiked && styles.likedContainer]}>
                <Heart
                  color="white"
                  size={28}
                  fill={isLiked ? "white" : "none"}
                />
              </View>
              <Text style={styles.actionText}>
                {formatNumber(item.likes + (isLiked ? 1 : 0))}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIconContainer}>
                <MessageCircle color="white" size={28} />
              </View>
              <Text style={styles.actionText}>{formatNumber(item.comments)}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIconContainer}>
                <Send color="white" size={28} />
              </View>
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleSave(item.id)}
            >
              <View style={[styles.actionIconContainer, isSaved && styles.savedContainer]}>
                <Bookmark
                  color="white"
                  size={28}
                  fill={isSaved ? "white" : "none"}
                />
              </View>
              <Text style={styles.actionText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIconContainer}>
                <MoreVertical color="white" size={28} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={mockShorts}
        renderItem={renderShort}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={screenHeight}
        snapToAlignment="start"
        decelerationRate="fast"
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.y / screenHeight);
          setCurrentIndex(index);
        }}
        getItemLayout={(data, index) => ({
          length: screenHeight,
          offset: screenHeight * index,
          index,
        })}
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        windowSize={5}
        initialNumToRender={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  shortContainer: {
    height: screenHeight,
    width: screenWidth,
    position: 'relative',
  },
  backgroundVideo: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 2,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 2,
  },
  volumeButton: {
    position: 'absolute',
    top: 60,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  contentContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 16,
    zIndex: 3,
  },
  leftContent: {
    flex: 1,
    marginRight: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: 'white',
    marginRight: 4,
  },
  followButton: {
    borderWidth: 1,
    borderColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  followButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: 'white',
  },
  caption: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: 'white',
    lineHeight: 20,
    marginBottom: 8,
  },
  musicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  musicText: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: 'white',
    opacity: 0.8,
  },
  rightActions: {
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 24,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  likedContainer: {
    backgroundColor: '#ef4444',
  },
  savedContainer: {
    backgroundColor: '#22c55e',
  },
  actionText: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: 'white',
    textAlign: 'center',
  },
});