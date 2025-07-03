import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable, Image, ScrollView, Alert } from 'react-native';
import { X, Heart, Bookmark, Clock, Users, ChefHat, CheckCircle, CreditCard as Edit, Trash2 } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { useRecipes } from '@/hooks/useRecipes';
import { router } from 'expo-router';

interface RecipeModalProps {
  visible: boolean;
  onClose: () => void;
  recipe: any;
  onLike: (recipeId: string) => void;
  onSave: (recipeId: string) => void;
  onDelete?: (recipeId: string) => void;
}

export default function RecipeModal({ visible, onClose, recipe, onLike, onSave, onDelete }: RecipeModalProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleEdit = () => {
    onClose();
    router.push(`/recipe/edit/${recipe.id}`);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Recipe',
      'Are you sure you want to delete this recipe?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDelete?.(recipe.id);
            onClose();
          }
        }
      ]
    );
  };

  if (!recipe) return null;

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
                  source={{ uri: recipe.profiles?.avatar_url || 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop' }} 
                  style={styles.userAvatar} 
                />
                <View style={styles.userDetails}>
                  <View style={styles.usernameContainer}>
                    <Text style={styles.username}>{recipe.profiles?.username || 'Unknown User'}</Text>
                    {recipe.profiles?.is_verified && (
                      <CheckCircle color="#22c55e" size={16} fill="#22c55e" />
                    )}
                  </View>
                  <Text style={styles.categoryText}>{recipe.category}</Text>
                </View>
              </View>
              <View style={styles.headerActions}>
                {user?.id === recipe.user_id && (
                  <>
                    <TouchableOpacity onPress={handleEdit} style={styles.headerButton}>
                      <Edit color="#3b82f6" size={20} />
                    </TouchableOpacity>
                    {onDelete && (
                      <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
                        <Trash2 color="#ef4444" size={20} />
                      </TouchableOpacity>
                    )}
                  </>
                )}
                <TouchableOpacity onPress={onClose} style={styles.headerButton}>
                  <X color="#6b7280" size={24} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Recipe Image */}
              <Image source={{ uri: recipe.image_url }} style={styles.recipeImage} />

              {/* Recipe Info */}
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeName}>{recipe.name}</Text>
                <Text style={styles.recipeDescription}>{recipe.description}</Text>

                {/* Recipe Meta */}
                <View style={styles.recipeMeta}>
                  <View style={styles.metaItem}>
                    <Clock color="#6b7280" size={16} />
                    <Text style={styles.metaText}>{recipe.prep_time}</Text>
                  </View>
                  {recipe.cook_time && (
                    <View style={styles.metaItem}>
                      <ChefHat color="#6b7280" size={16} />
                      <Text style={styles.metaText}>{recipe.cook_time}</Text>
                    </View>
                  )}
                  {recipe.servings && (
                    <View style={styles.metaItem}>
                      <Users color="#6b7280" size={16} />
                      <Text style={styles.metaText}>{recipe.servings} servings</Text>
                    </View>
                  )}
                  <View style={[styles.vegBadge, { backgroundColor: recipe.is_veg ? '#dcfce7' : '#fef2f2' }]}>
                    <Text style={[styles.vegText, { color: recipe.is_veg ? '#16a34a' : '#dc2626' }]}>
                      {recipe.is_veg ? 'Veg' : 'Non-Veg'}
                    </Text>
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                  <TouchableOpacity style={styles.actionButton} onPress={() => onLike(recipe.id)}>
                    <Heart color="#ef4444" size={20} fill={isLiked ? "#ef4444" : "none"} />
                    <Text style={styles.actionText}>{recipe.likes_count || 0}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton} onPress={() => onSave(recipe.id)}>
                    <Bookmark color="#22c55e" size={20} fill={isSaved ? "#22c55e" : "none"} />
                    <Text style={styles.actionText}>{recipe.saves_count || 0}</Text>
                  </TouchableOpacity>
                </View>

                {/* Ingredients */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Ingredients</Text>
                  {recipe.ingredients.map((ingredient: string, index: number) => (
                    <View key={index} style={styles.ingredientItem}>
                      <View style={styles.bullet} />
                      <Text style={styles.ingredientText}>{ingredient}</Text>
                    </View>
                  ))}
                </View>

                {/* Directions */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Directions</Text>
                  {recipe.directions.map((direction: string, index: number) => (
                    <View key={index} style={styles.directionItem}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.directionText}>{direction}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>
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
  categoryText: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#6b7280',
    textTransform: 'capitalize',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 12,
    padding: 4,
  },
  content: {
    maxHeight: 600,
  },
  recipeImage: {
    width: '100%',
    height: 200,
  },
  recipeInfo: {
    padding: 16,
  },
  recipeName: {
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  recipeDescription: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  recipeMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#6b7280',
    marginLeft: 4,
  },
  vegBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  vegText: {
    fontSize: 10,
    fontFamily: 'Nunito-SemiBold',
  },
  actions: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f3f4f6',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#374151',
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: '#111827',
    marginBottom: 12,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
    marginRight: 12,
  },
  ingredientText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#374151',
    flex: 1,
  },
  directionItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
    color: 'white',
  },
  directionText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
});