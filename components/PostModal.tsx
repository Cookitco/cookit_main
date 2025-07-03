import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, Image, TextInput, ScrollView, Alert } from 'react-native';
import { X, Heart, MessageSquare, Send, Bookmark, MoreHorizontal, CheckCircle, Trash2 } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { usePosts } from '@/hooks/usePosts';
import { useComments } from '@/hooks/useComments';

interface PostModalProps {
  visible: boolean;
  onClose: () => void;
  post: any;
  onLike: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

export default function PostModal({ visible, onClose, post, onLike, onDelete }: PostModalProps) {
  const { user } = useAuth();
  const { comments, createComment, deleteComment } = useComments(post?.id);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;

    setSubmitting(true);
    const { error } = await createComment({
      user_id: user.id,
      post_id: post.id,
      content: newComment.trim(),
    });

    if (error) {
      Alert.alert('Error', 'Failed to post comment');
    } else {
      setNewComment('');
    }
    setSubmitting(false);
  };

  const handleDeleteComment = async (commentId: string) => {
    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { error } = await deleteComment(commentId);
            if (error) {
              Alert.alert('Error', 'Failed to delete comment');
            }
          }
        }
      ]
    );
  };

  const handleDeletePost = () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDelete?.(post.id);
            onClose();
          }
        }
      ]
    );
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

  if (!post) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContainer}>
          <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.userInfo}>
                <Image 
                  source={{ uri: post.profiles?.avatar_url || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' }} 
                  style={styles.userAvatar} 
                />
                <View style={styles.userDetails}>
                  <View style={styles.usernameContainer}>
                    <Text style={styles.username}>{post.profiles?.username || 'Unknown User'}</Text>
                    {post.profiles?.is_verified && (
                      <CheckCircle color="#22c55e" size={16} fill="#22c55e" />
                    )}
                  </View>
                  <Text style={styles.timeText}>{formatTimeAgo(post.created_at)} ago</Text>
                </View>
              </View>
              <View style={styles.headerActions}>
                {user?.id === post.user_id && onDelete && (
                  <TouchableOpacity onPress={handleDeletePost} style={styles.headerButton}>
                    <Trash2 color="#ef4444" size={20} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={onClose} style={styles.headerButton}>
                  <X color="#6b7280" size={24} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Post Image */}
            <Image source={{ uri: post.media_url }} style={styles.postImage} />

            {/* Post Actions */}
            <View style={styles.postActions}>
              <View style={styles.leftActions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => onLike(post.id)}>
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
              <Text style={styles.likesText}>{post.likes_count || 0} likes</Text>
              {post.caption && (
                <View style={styles.captionContainer}>
                  <Text style={styles.captionUsername}>{post.profiles?.username || 'Unknown User'}</Text>
                  <Text style={styles.captionText}> {post.caption}</Text>
                </View>
              )}
            </View>

            {/* Comments */}
            <ScrollView style={styles.commentsContainer} showsVerticalScrollIndicator={false}>
              {comments.map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                  <Image 
                    source={{ uri: comment.profiles?.avatar_url || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' }} 
                    style={styles.commentAvatar} 
                  />
                  <View style={styles.commentContent}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentUsername}>{comment.profiles?.username}</Text>
                      <Text style={styles.commentTime}>{formatTimeAgo(comment.created_at)}</Text>
                      {user?.id === comment.user_id && (
                        <TouchableOpacity onPress={() => handleDeleteComment(comment.id)}>
                          <Trash2 color="#ef4444" size={14} />
                        </TouchableOpacity>
                      )}
                    </View>
                    <Text style={styles.commentText}>{comment.content}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            {/* Comment Input */}
            <View style={styles.commentInputContainer}>
              <Image 
                source={{ uri: user?.user_metadata?.avatar_url || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' }} 
                style={styles.inputAvatar} 
              />
              <TextInput
                style={styles.commentInput}
                placeholder="Add a comment..."
                value={newComment}
                onChangeText={setNewComment}
                multiline
                placeholderTextColor="#9ca3af"
              />
              <TouchableOpacity 
                onPress={handleSubmitComment}
                disabled={!newComment.trim() || submitting}
                style={[styles.sendButton, (!newComment.trim() || submitting) && styles.sendButtonDisabled]}
              >
                <Send color={newComment.trim() && !submitting ? "#22c55e" : "#9ca3af"} size={20} />
              </TouchableOpacity>
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '95%',
    maxWidth: 500,
    maxHeight: '90%',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  timeText: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#9ca3af',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 12,
    padding: 4,
  },
  postImage: {
    width: '100%',
    height: 300,
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
    paddingBottom: 12,
  },
  likesText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  captionContainer: {
    flexDirection: 'row',
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
  commentsContainer: {
    maxHeight: 200,
    paddingHorizontal: 16,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  commentAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  commentUsername: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#111827',
    marginRight: 8,
  },
  commentTime: {
    fontSize: 10,
    fontFamily: 'Nunito-Regular',
    color: '#9ca3af',
    flex: 1,
  },
  commentText: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#374151',
    lineHeight: 16,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  inputAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    maxHeight: 80,
  },
  sendButton: {
    marginLeft: 8,
    padding: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});