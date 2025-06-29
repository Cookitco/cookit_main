import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Camera, Plus, X, Save, Clock, Users } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useRecipes } from '@/hooks/useRecipes';

export default function CreateRecipeScreen() {
  const { user } = useAuth();
  const { createRecipe } = useRecipes();
  
  const [recipeName, setRecipeName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [directions, setDirections] = useState(['']);
  const [prepTime, setPrepTime] = useState('');
  const [calories, setCalories] = useState('');
  const [isVeg, setIsVeg] = useState(true);
  const [category, setCategory] = useState('dinner');
  const [isPrivate, setIsPrivate] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = ['breakfast', 'brunch', 'lunch', 'snacks', 'dinner', 'bakery', 'dessert'];

  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addDirection = () => {
    setDirections([...directions, '']);
  };

  const removeDirection = (index: number) => {
    if (directions.length > 1) {
      setDirections(directions.filter((_, i) => i !== index));
    }
  };

  const updateDirection = (index: number, value: string) => {
    const newDirections = [...directions];
    newDirections[index] = value;
    setDirections(newDirections);
  };

  const handleSave = async () => {
    if (!user || !recipeName || !description || !imageUrl) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const filteredIngredients = ingredients.filter(ingredient => ingredient.trim() !== '');
    const filteredDirections = directions.filter(direction => direction.trim() !== '');

    if (filteredIngredients.length === 0 || filteredDirections.length === 0) {
      Alert.alert('Error', 'Please add at least one ingredient and one direction');
      return;
    }

    setLoading(true);

    const { error } = await createRecipe({
      user_id: user.id,
      name: recipeName,
      description,
      image_url: imageUrl,
      ingredients: filteredIngredients,
      directions: filteredDirections,
      prep_time: prepTime,
      calories: calories ? parseInt(calories) : null,
      is_veg: isVeg,
      category,
      is_private: isPrivate,
    });

    setLoading(false);

    if (error) {
      Alert.alert('Error', 'Failed to create recipe');
    } else {
      Alert.alert('Success', 'Recipe created successfully!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.backButton}>
          <ArrowLeft color="#374151" size={24} />
        </TouchableOpacity>
        <Text style={styles.title}>Create Recipe</Text>
        <TouchableOpacity 
          onPress={handleSave} 
          style={[styles.saveButton, loading && styles.saveButtonDisabled]}
          disabled={loading}
        >
          <Save color="white" size={20} />
          <Text style={styles.saveButtonText}>
            {loading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Photo URL */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recipe Photo URL</Text>
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

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <TextInput
            style={styles.input}
            placeholder="Recipe Name"
            value={recipeName}
            onChangeText={setRecipeName}
            placeholderTextColor="#9ca3af"
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Recipe Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Prep Time (e.g., 30 min)"
              value={prepTime}
              onChangeText={setPrepTime}
              placeholderTextColor="#9ca3af"
            />
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Calories (optional)"
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
              placeholderTextColor="#9ca3af"
            />
          </View>
          
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.label}>Type</Text>
              <View style={styles.segmentedControl}>
                <TouchableOpacity
                  style={[styles.segment, isVeg && styles.activeSegment]}
                  onPress={() => setIsVeg(true)}
                >
                  <Text style={[styles.segmentText, isVeg && styles.activeSegmentText]}>
                    Vegetarian
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.segment, !isVeg && styles.activeSegment]}
                  onPress={() => setIsVeg(false)}
                >
                  <Text style={[styles.segmentText, !isVeg && styles.activeSegmentText]}>
                    Non-Veg
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.halfInput}>
              <Text style={styles.label}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categoryContainer}>
                  {categories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[styles.categoryButton, category === cat && styles.activeCategoryButton]}
                      onPress={() => setCategory(cat)}
                    >
                      <Text style={[styles.categoryButtonText, category === cat && styles.activeCategoryButtonText]}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <TouchableOpacity onPress={addIngredient} style={styles.addButton}>
              <Plus color="#22c55e" size={20} />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          {ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientRow}>
              <TextInput
                style={[styles.input, styles.ingredientInput]}
                placeholder={`Ingredient ${index + 1}`}
                value={ingredient}
                onChangeText={(value) => updateIngredient(index, value)}
                placeholderTextColor="#9ca3af"
              />
              {ingredients.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeIngredient(index)}
                  style={styles.removeButton}
                >
                  <X color="#ef4444" size={20} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Directions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cooking Directions</Text>
            <TouchableOpacity onPress={addDirection} style={styles.addButton}>
              <Plus color="#22c55e" size={20} />
              <Text style={styles.addButtonText}>Add Step</Text>
            </TouchableOpacity>
          </View>
          {directions.map((direction, index) => (
            <View key={index} style={styles.directionRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <TextInput
                style={[styles.input, styles.directionInput]}
                placeholder={`Step ${index + 1} instructions`}
                value={direction}
                onChangeText={(value) => updateDirection(index, value)}
                multiline
                numberOfLines={2}
                placeholderTextColor="#9ca3af"
              />
              {directions.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeDirection(index)}
                  style={styles.removeButton}
                >
                  <X color="#ef4444" size={20} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <TouchableOpacity
            style={styles.privacyOption}
            onPress={() => setIsPrivate(!isPrivate)}
          >
            <View style={styles.privacyInfo}>
              <Users color="#6b7280" size={20} />
              <View style={styles.privacyText}>
                <Text style={styles.privacyTitle}>
                  {isPrivate ? 'Private Recipe' : 'Public Recipe'}
                </Text>
                <Text style={styles.privacyDescription}>
                  {isPrivate ? 'Only you can see this recipe' : 'Everyone can see this recipe'}
                </Text>
              </View>
            </View>
            <View style={[styles.toggle, isPrivate && styles.toggleActive]}>
              <View style={[styles.toggleThumb, isPrivate && styles.toggleThumbActive]} />
            </View>
          </TouchableOpacity>
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
    backgroundColor: '#22c55e',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 12,
  },
  photoPlaceholder: {
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
  photoPlaceholderText: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#9ca3af',
    marginTop: 8,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  label: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 2,
  },
  segment: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeSegment: {
    backgroundColor: '#22c55e',
  },
  segmentText: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#6b7280',
  },
  activeSegmentText: {
    color: 'white',
  },
  categoryContainer: {
    flexDirection: 'row',
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  activeCategoryButton: {
    backgroundColor: '#22c55e',
  },
  categoryButtonText: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#6b7280',
  },
  activeCategoryButtonText: {
    color: 'white',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#dcfce7',
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#22c55e',
    marginLeft: 4,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ingredientInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: 8,
  },
  removeButton: {
    padding: 8,
  },
  directionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 8,
  },
  stepNumberText: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    color: 'white',
  },
  directionInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: 8,
    height: 60,
    textAlignVertical: 'top',
  },
  privacyOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  privacyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  privacyText: {
    marginLeft: 12,
    flex: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#111827',
  },
  privacyDescription: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#6b7280',
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#22c55e',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
});