import { Button } from '@/components/ui/button';
import { authService } from '@/services/auth.service';
import { setAuthenticated } from '@/store/slices/authSlice';
import { useAppDispatch } from '@/store/store';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SignUpScreen() {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    
    try {
      // Sign up with Supabase
      const { user, profile } = await authService.signUp({
        email,
        password,
        name,
      });
      
      // Update Redux auth state
      dispatch(setAuthenticated({
        user: {
          id: user.id,
          name: name,
          email: email,
          household_id: profile.household_id,
        },
      }));
      
      setIsLoading(false);
      
      Alert.alert('Success', 'Account created successfully!', [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)'),
        },
      ]);
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert('Error', error.message || 'Failed to create account');
    }
  };

  const handleBackToLogin = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBackToLogin} style={styles.backButton}>
              <Text style={styles.backIcon}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.logo}>🛒</Text>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
          </View>

          {/* Sign Up Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                autoCapitalize="words"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Create a password"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              <Text style={styles.hint}>Must be at least 6 characters</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            <Button
              title={isLoading ? 'Creating Account...' : 'Sign Up'}
              variant="primary"
              onPress={handleSignUp}
              style={styles.signupButton}
            />

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleBackToLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                Already have an account? <Text style={styles.loginLink}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By signing up, you agree to our{'\n'}
              <Text style={styles.link}>Terms of Service</Text> and{' '}
              <Text style={styles.link}>Privacy Policy</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 4,
  },
  backIcon: {
    fontSize: 32,
    color: '#333',
    fontWeight: '300',
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
    marginTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  signupButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  loginButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  loginButtonText: {
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
