import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import CreateModal from '@/components/CreateModal';

export default function CreateScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  // Show modal when this tab is focused
  useFocusEffect(
    React.useCallback(() => {
      setModalVisible(true);
    }, [])
  );

  const handleSelectType = (type: 'recipe' | 'post' | 'video' | 'short') => {
    setModalVisible(false);
    
    // Navigate to specific create page
    switch (type) {
      case 'recipe':
        router.push('/create/recipe');
        break;
      case 'post':
        router.push('/create/post');
        break;
      case 'video':
        router.push('/create/video');
        break;
      case 'short':
        router.push('/create/short');
        break;
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    // Navigate back to home tab
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Create</Text>
        <Text style={styles.subtitle}>Choose what you'd like to create</Text>
      </View>
      
      <CreateModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSelectType={handleSelectType}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Nunito-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#6b7280',
    textAlign: 'center',
  },
});