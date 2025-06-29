import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { X, BookOpen, Image, Video, Play } from 'lucide-react-native';

interface CreateModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectType: (type: 'recipe' | 'post' | 'video' | 'short') => void;
}

export default function CreateModal({ visible, onClose, onSelectType }: CreateModalProps) {
  const options = [
    {
      id: 'recipe',
      title: 'Add Recipe',
      description: 'Share your cooking recipe',
      icon: BookOpen,
      color: '#22c55e',
      bgColor: '#dcfce7',
    },
    {
      id: 'post',
      title: 'Add Post',
      description: 'Share a photo with caption',
      icon: Image,
      color: '#3b82f6',
      bgColor: '#dbeafe',
    },
    {
      id: 'video',
      title: 'Add Video',
      description: 'Upload a cooking video',
      icon: Video,
      color: '#f59e0b',
      bgColor: '#fef3c7',
    },
    {
      id: 'short',
      title: 'Add Short Video',
      description: 'Create a quick cooking tip',
      icon: Play,
      color: '#ef4444',
      bgColor: '#fee2e2',
    },
  ];

  const handleSelectOption = (type: 'recipe' | 'post' | 'video' | 'short') => {
    console.log('Selected option:', type);
    onSelectType(type);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContainer}>
          <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Create Content</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X color="#6b7280" size={24} />
              </TouchableOpacity>
            </View>

            {/* Options */}
            <View style={styles.optionsContainer}>
              {options.map((option) => {
                const IconComponent = option.icon;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={styles.option}
                    onPress={() => handleSelectOption(option.id as any)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.iconContainer, { backgroundColor: option.bgColor }]}>
                      <IconComponent color={option.color} size={24} />
                    </View>
                    <View style={styles.optionContent}>
                      <Text style={styles.optionTitle}>{option.title}</Text>
                      <Text style={styles.optionDescription}>{option.description}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  optionsContainer: {
    padding: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#6b7280',
  },
});