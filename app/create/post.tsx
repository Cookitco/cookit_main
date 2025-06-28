import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Camera, Save } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { usePosts } from '@/hooks/usePosts';

export default function CreatePostScreen() {
  const { user } = useAuth();
  const { createPost } = usePosts();
  
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user || !imageUrl) {
      Alert.alert('Error', 'Please add an image for your post');
      return;
    }

    setLoading(true);

    const { error } = await createPost({
      user_id: user.id,
      type: 'image',
      media_url: imageUrl,
      caption: caption,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error', 'Failed to create post');
    } else {
      Alert.alert('Success', 'Post created successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#374151" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Create Post</Text>
        <TouchableOpacity 
          onPress={handleSave} 
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          disabled={loading}
        >
          <Save color="white" size={20} />
          <Text style={styles.saveButtonText}>
            {loading ? 'Posting...' : 'Post'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Photo Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photo</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter image URL (e.g., from Pexels)"
            value={imageUrl}
            onChangeText={setImageUrl}
            placeholderTextColor="#9ca3af"
          />
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.previewImage} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Camera color="#9ca3af" size={48} />
              <Text style={styles.photoPlaceholderText}>Image preview will appear here</Text>
            </View>
          )}
        </View>

        {/* Caption Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Caption</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Write a caption for your post..."
            value={caption}
            onChangeText={setCaption}
            multiline
            numberOfLines={6}
            placeholderTextColor="#9ca3af"
          />
          <Text style={styles.characterCount}>{caption.length}/2200</Text>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>💡 Tips for great posts:</Text>
          <Text style={styles.tipText}>• Use high-quality, well-lit photos</Text>
          <Text style={styles.tipText}>• Write engaging captions that tell a story</Text>
          <Text style={styles.tipText}>• Share cooking tips or recipe inspiration</Text>
          <Text style={styles.tipText}>• Use relevant hashtags to reach more people</Text>
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
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: '#111827',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: 'white',
    fontFamily: 'Nunito-SemiBold',
    marginLeft: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Nunito-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#111827',
    marginBottom: 12,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginTop: 12,
  },
  photoPlaceholder: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  photoPlaceholderText: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
  characterCount: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#9ca3af',
    textAlign: 'right',
  },
  tipsSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#6b7280',
    marginBottom: 4,
  },
});