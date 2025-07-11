import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { ChefHat, Mail, Lock, User, Eye, EyeOff } from 'lucide-react-native';

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { signIn, signUp } = useAuth();

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Email validation - more flexible
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!email.includes('@') || !email.includes('.')) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Sign up specific validations
    if (isSignUp) {
      if (!username) {
        newErrors.username = 'Username is required';
      } else if (username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        newErrors.username = 'Username can only contain letters, numbers, and underscores';
      }

      if (!fullName) {
        newErrors.fullName = 'Full name is required';
      } else if (fullName.length < 2) {
        newErrors.fullName = 'Full name must be at least 2 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuth = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      if (isSignUp) {
        console.log('Signing up user...');
        const { data, error } = await signUp(email, password, username, fullName);
        
        if (error) {
          console.log('Signup error:', error);
          setErrors({ general: error.message });
        } else {
          console.log('Signup successful:', data);
          // User should be automatically signed in with email confirmation disabled
          Alert.alert(
            'Welcome to CooKit!', 
            'Your account has been created successfully and you are now signed in.',
            [{ text: 'OK' }]
          );
        }
      } else {
        console.log('Signing in user...');
        const { data, error } = await signIn(email, password);
        
        if (error) {
          console.log('Sign in error:', error);
          setErrors({ general: error.message });
        } else {
          console.log('Sign in successful:', data);
          // The auth state change will automatically redirect to home
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setErrors({});
    setPassword('');
    if (!isSignUp) {
      setUsername('');
      setFullName('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <ChefHat color="#22c55e" size={64} />
            <Text style={styles.logoText}>CooKit</Text>
            <Text style={styles.tagline}>Share your culinary journey</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* General Error */}
            {errors.general && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors.general}</Text>
              </View>
            )}

            {isSignUp && (
              <>
                <View style={styles.inputContainer}>
                  <User color="#9ca3af" size={20} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, errors.fullName && styles.inputError]}
                    placeholder="Full Name"
                    value={fullName}
                    onChangeText={(text) => {
                      setFullName(text);
                      if (errors.fullName) {
                        setErrors(prev => ({ ...prev, fullName: '' }));
                      }
                    }}
                    placeholderTextColor="#9ca3af"
                    autoCapitalize="words"
                  />
                </View>
                {errors.fullName && <Text style={styles.fieldError}>{errors.fullName}</Text>}

                <View style={styles.inputContainer}>
                  <User color="#9ca3af" size={20} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, errors.username && styles.inputError]}
                    placeholder="Username (letters, numbers, underscore only)"
                    value={username}
                    onChangeText={(text) => {
                      setUsername(text);
                      if (errors.username) {
                        setErrors(prev => ({ ...prev, username: '' }));
                      }
                    }}
                    placeholderTextColor="#9ca3af"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {errors.username && <Text style={styles.fieldError}>{errors.username}</Text>}
              </>
            )}

            <View style={styles.inputContainer}>
              <Mail color="#9ca3af" size={20} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Email address"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) {
                    setErrors(prev => ({ ...prev, email: '' }));
                  }
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#9ca3af"
              />
            </View>
            {errors.email && <Text style={styles.fieldError}>{errors.email}</Text>}

            <View style={styles.inputContainer}>
              <Lock color="#9ca3af" size={20} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.passwordInput, errors.password && styles.inputError]}
                placeholder="Password (minimum 6 characters)"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) {
                    setErrors(prev => ({ ...prev, password: '' }));
                  }
                }}
                secureTextEntry={!showPassword}
                placeholderTextColor="#9ca3af"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff color="#9ca3af" size={20} />
                ) : (
                  <Eye color="#9ca3af" size={20} />
                )}
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.fieldError}>{errors.password}</Text>}

            {/* Tips */}
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>💡 Tips:</Text>
              <Text style={styles.tipsText}>• Use any valid email format (e.g., user@domain.com)</Text>
              <Text style={styles.tipsText}>• Password must be at least 6 characters</Text>
              {isSignUp && <Text style={styles.tipsText}>• Username can only contain letters, numbers, and underscores</Text>}
              <Text style={styles.tipsText}>• No email confirmation required - instant access!</Text>
              <Text style={styles.tipsText}>• If you see "too many requests", wait 1-2 minutes</Text>
            </View>

            <TouchableOpacity
              style={[styles.authButton, loading && styles.authButtonDisabled]}
              onPress={handleAuth}
              disabled={loading}
            >
              <Text style={styles.authButtonText}>
                {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchButton}
              onPress={switchMode}
              disabled={loading}
            >
              <Text style={styles.switchButtonText}>
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoText: {
    fontSize: 32,
    fontFamily: 'Nunito-Bold',
    color: '#22c55e',
    marginTop: 16,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#6b7280',
    marginTop: 8,
  },
  form: {
    width: '100%',
  },
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    textAlign: 'center',
  },
  tipsContainer: {
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bae6fd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  tipsTitle: {
    color: '#0369a1',
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    marginBottom: 4,
  },
  tipsText: {
    color: '#0369a1',
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    marginBottom: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#111827',
  },
  passwordInput: {
    paddingRight: 40,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  fieldError: {
    color: '#ef4444',
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    marginBottom: 12,
    marginLeft: 4,
  },
  authButton: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  authButtonDisabled: {
    opacity: 0.6,
  },
  authButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: 'white',
  },
  switchButton: {
    alignItems: 'center',
    marginTop: 24,
  },
  switchButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#22c55e',
  },
});