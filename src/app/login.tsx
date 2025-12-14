import { Button } from '@/components/ui/button';
import { authService } from '@/services/auth.service';
import { setAuthenticated } from '@/store/slices/authSlice';
import { useAppDispatch } from '@/store/store';
import { Ionicons } from '@expo/vector-icons';
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

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setIsLoading(true);
    
    try {
      // Sign in with Supabase
      const { user, profile } = await authService.signIn({
        email,
        password,
      });
      
      // Update Redux auth state
      dispatch(setAuthenticated({
        user: {
          id: user.id,
          name: profile.name,
          email: user.email || email,
          household_id: profile.household_id,
        },
      }));
      
      setIsLoading(false);
      
      // Navigate to main app
      router.replace('/(tabs)');
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert('Error', error.message || 'Failed to sign in');
    }
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password reset feature coming soon!');
  };

  const handlePrivacyPolicy = () => {
    router.push('/privacy-policy');
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
            <Text style={styles.logo}>🛒</Text>
            <Text style={styles.title}>Shop App</Text>
            <Text style={styles.subtitle}>Welcome back!</Text>
          </View>

          {/* Login Form */}
          <View style={styles.form}>
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
              <View style={{ position: 'relative' }}>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword((prev) => !prev)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={22}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
              disabled={isLoading}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              title={isLoading ? 'Signing in...' : 'Sign In'}
              variant="primary"
              onPress={handleLogin}
              style={styles.loginButton}
            />

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              <Text style={styles.signupButtonText}>
                Don&apos;t have an account? <Text style={styles.signupLink}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our
              <TouchableOpacity onPress={handlePrivacyPolicy} style={styles.privacyLink}>
                <Text style={styles.link}>Privacy Policy</Text>
              </TouchableOpacity>
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
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
    zIndex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  loginButton: {
    marginBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  signupButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  signupButtonText: {
    fontSize: 14,
    color: '#666',
  },
  signupLink: {
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
  },
  link: {
    marginLeft: 3,
        fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  privacyLink: {
    display: 'flex',
  },
});
