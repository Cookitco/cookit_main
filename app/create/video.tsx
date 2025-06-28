import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Video, Save, Clock } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { usePosts } from '@/hooks/usePosts';

export default function CreateVideoScreen() {
  const { user } = useAuth();
  const { createPost } = usePosts();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user || !videoUrl || !title) {
      Alert.alert('Error', 'Please fill in the required fields (title and video URL)');
      return;
    }

    setLoading(true);

    const { error } = await createPost({
      user_id: user.id,
      type: 'video',
      media_url: videoUrl,
      caption: `${title}\n\n${description}`,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error', 'Failed to create video');
    } else {
      Alert.alert('Success', 'Video uploaded successfully!', [
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
        <Text style={styles.title}>Upload Video</Text>
        <TouchableOpacity 
          onPress={handleSave} 
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          disabled={loading}
        >
          <Save color="white" size={20} />
          <Text style={styles.saveButtonText}>
            {loading ? 'Uploading...' : 'Upload'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Video Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Video URL</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter video URL"
            value={videoUrl}
            onChangeText={setVideoUrl}
            placeholderTextColor="#9ca3af"
          />
          {!videoUrl && (
            <View style={styles.videoPlaceholder}>
              <Video color="#9ca3af" size={48} />
              <Text style={styles.placeholderText}>Add your cooking video URL</Text>
            </View>
          )}
        </View>

        {/* Thumbnail Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thumbnail (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter thumbnail image URL"
            value={thumbnailUrl}
            onChangeText={setThumbnailUrl}
            placeholderTextColor="#9ca3af"
          />
          {thumbnailUrl && (
            <Image source={{ uri: thumbnailUrl }} style={styles.previewImage} />
          )}
        </View>

        {/* Video Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Video Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Video Title *"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#9ca3af"
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Video Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholderTextColor="#9ca3af"
          />
          <View style={styles.durationContainer}>
            <Clock color="#6b7280" size={20} />
            <TextInput
              style={[styles.input, styles.durationInput]}
              placeholder="Duration (e.g., 5:30)"
              value={duration}
              onChangeText={setDuration}
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>

        {/* Video Guidelines */}
        <View style={styles.guidelinesSection}>
          <Text style={styles.guidelinesTitle}>📹 Video Guidelines:</Text>
          <Text style={styles.guidelineText}>• Keep videos under 10 minutes for better engagement</Text>
          <Text style={styles.guidelineText}>• Use good lighting and clear audio</Text>
          <Text style={styles.guidelineText}>• Show step-by-step cooking process</Text>
          <Text style={styles.guidelineText}>• Include ingredient list in description</Text>
          <Text style={styles.guidelineText}>• Add cooking tips and tricks</Text>
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
    backgroundColor: '#f59e0b',
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
    height: 100,
    textAlignVertical: 'top',
  },
  videoPlaceholder: {
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
  placeholderText: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 12,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  durationInput: {
    flex: 1,
    marginLeft: 12,
    marginBottom: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  guidelinesSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  guidelinesTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  guidelineText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#6b7280',
    marginBottom: 4,
  },
});