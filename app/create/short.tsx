import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Play, Save, Zap, Clock } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { usePosts } from '@/hooks/usePosts';

export default function CreateShortScreen() {
  const { user } = useAuth();
  const { createPost } = usePosts();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user || !videoUrl || !title) {
      Alert.alert('Error', 'Please fill in the required fields (title and video URL)');
      return;
    }

    setLoading(true);

    const caption = `${title}\n\n${description}${hashtags ? `\n\n${hashtags}` : ''}`;

    const { error } = await createPost({
      user_id: user.id,
      type: 'short',
      media_url: videoUrl,
      caption: caption,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error', 'Failed to create short video');
    } else {
      Alert.alert('Success', 'Short video created successfully!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    }
  };

  const suggestedHashtags = [
    '#cooking', '#recipe', '#foodie', '#quickrecipe', '#cookingtips',
    '#foodhack', '#kitchen', '#homecooking', '#delicious', '#yummy'
  ];

  const addHashtag = (tag: string) => {
    if (!hashtags.includes(tag)) {
      setHashtags(hashtags ? `${hashtags} ${tag}` : tag);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#374151" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Create Short</Text>
        <TouchableOpacity 
          onPress={handleSave} 
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          disabled={loading}
        >
          <Save color="white" size={20} />
          <Text style={styles.saveButtonText}>
            {loading ? 'Creating...' : 'Create'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Video Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Short Video URL</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter short video URL"
            value={videoUrl}
            onChangeText={setVideoUrl}
            placeholderTextColor="#9ca3af"
          />
          {!videoUrl && (
            <View style={styles.videoPlaceholder}>
              <Play color="#9ca3af" size={48} />
              <Text style={styles.placeholderText}>Add your short cooking video</Text>
              <Text style={styles.placeholderSubtext}>Perfect for quick tips and tricks!</Text>
            </View>
          )}
        </View>

        {/* Content Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Short Title *"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#9ca3af"
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description (keep it short and engaging)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Hashtags Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hashtags</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add hashtags to reach more people..."
            value={hashtags}
            onChangeText={setHashtags}
            multiline
            numberOfLines={2}
            placeholderTextColor="#9ca3af"
          />
          
          <Text style={styles.suggestedTitle}>Suggested hashtags:</Text>
          <View style={styles.hashtagContainer}>
            {suggestedHashtags.map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={styles.hashtagButton}
                onPress={() => addHashtag(tag)}
              >
                <Text style={styles.hashtagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Short Video Tips */}
        <View style={styles.tipsSection}>
          <View style={styles.tipsHeader}>
            <Zap color="#ef4444" size={20} />
            <Text style={styles.tipsTitle}>Short Video Tips:</Text>
          </View>
          <View style={styles.tipItem}>
            <Clock color="#6b7280" size={16} />
            <Text style={styles.tipText}>Keep it under 60 seconds for maximum engagement</Text>
          </View>
          <Text style={styles.tipText}>• Start with a hook in the first 3 seconds</Text>
          <Text style={styles.tipText}>• Show the final result first, then the process</Text>
          <Text style={styles.tipText}>• Use trending sounds and music</Text>
          <Text style={styles.tipText}>• Add text overlays for key information</Text>
          <Text style={styles.tipText}>• Film vertically (9:16 aspect ratio)</Text>
          <Text style={styles.tipText}>• Use good lighting and clear audio</Text>
        </View>

        {/* Content Ideas */}
        <View style={styles.ideasSection}>
          <Text style={styles.ideasTitle}>💡 Content Ideas:</Text>
          <Text style={styles.ideaText}>• Quick cooking hacks and shortcuts</Text>
          <Text style={styles.ideaText}>• 30-second recipe tutorials</Text>
          <Text style={styles.ideaText}>• Kitchen tool demonstrations</Text>
          <Text style={styles.ideaText}>• Before and after transformations</Text>
          <Text style={styles.ideaText}>• Ingredient substitution tips</Text>
          <Text style={styles.ideaText}>• Food styling techniques</Text>
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
    backgroundColor: '#ef4444',
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
    height: 80,
    textAlignVertical: 'top',
  },
  videoPlaceholder: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  placeholderText: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
  placeholderSubtext: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
  suggestedTitle: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hashtagButton: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  hashtagText: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#ef4444',
  },
  tipsSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#111827',
    marginLeft: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#6b7280',
    marginBottom: 4,
    marginLeft: 4,
  },
  ideasSection: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  ideasTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  ideaText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#6b7280',
    marginBottom: 4,
  },
});