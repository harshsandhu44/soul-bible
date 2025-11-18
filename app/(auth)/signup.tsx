import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Surface, useTheme, Snackbar } from 'react-native-paper';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/store/authStore';

export default function SignUpScreen() {
  const theme = useTheme();
  const { signUp, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = 'Password must include uppercase, lowercase, number, and symbol';
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    const result = await signUp({
      email: formData.email.trim(),
      password: formData.password,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
    });

    if (result.success) {
      // User is auto-authenticated after signup, navigate to home
      router.replace('/');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar style={theme.dark ? 'light' : 'dark'} />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
              Create Account
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
              Join Soul Bible to begin your journey
            </Text>
          </View>

          <Surface style={[styles.form, { backgroundColor: theme.colors.surface }]} elevation={1}>
            <View style={styles.nameRow}>
              <View style={styles.nameField}>
                <TextInput
                  label="First Name"
                  value={formData.firstName}
                  onChangeText={(text) => updateField('firstName', text)}
                  mode="outlined"
                  autoCapitalize="words"
                  autoComplete="name-given"
                  error={!!errors.firstName}
                  disabled={isLoading}
                  style={styles.input}
                />
                {errors.firstName ? (
                  <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.error }]}>
                    {errors.firstName}
                  </Text>
                ) : null}
              </View>

              <View style={styles.nameField}>
                <TextInput
                  label="Last Name"
                  value={formData.lastName}
                  onChangeText={(text) => updateField('lastName', text)}
                  mode="outlined"
                  autoCapitalize="words"
                  autoComplete="name-family"
                  error={!!errors.lastName}
                  disabled={isLoading}
                  style={styles.input}
                />
                {errors.lastName ? (
                  <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.error }]}>
                    {errors.lastName}
                  </Text>
                ) : null}
              </View>
            </View>

            <TextInput
              label="Email"
              value={formData.email}
              onChangeText={(text) => updateField('email', text)}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={!!errors.email}
              disabled={isLoading}
              style={styles.input}
            />
            {errors.email ? (
              <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.email}
              </Text>
            ) : null}

            <TextInput
              label="Password"
              value={formData.password}
              onChangeText={(text) => updateField('password', text)}
              mode="outlined"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password-new"
              error={!!errors.password}
              disabled={isLoading}
              style={styles.input}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
            {errors.password ? (
              <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.password}
              </Text>
            ) : null}

            <TextInput
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(text) => updateField('confirmPassword', text)}
              mode="outlined"
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              error={!!errors.confirmPassword}
              disabled={isLoading}
              style={styles.input}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
            />
            {errors.confirmPassword ? (
              <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.confirmPassword}
              </Text>
            ) : null}

            <Button
              mode="contained"
              onPress={handleSignUp}
              loading={isLoading}
              disabled={isLoading}
              style={styles.signUpButton}
              contentStyle={styles.buttonContent}
            >
              Sign Up
            </Button>

            <Text variant="bodySmall" style={[styles.terms, { color: theme.colors.onSurfaceVariant }]}>
              By signing up, you agree to our Terms of Service and Privacy Policy
            </Text>
          </Surface>

          <View style={styles.footer}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Already have an account?{' '}
            </Text>
            <Button
              mode="text"
              onPress={() => router.push('/(auth)/signin')}
              disabled={isLoading}
              compact
            >
              Sign In
            </Button>
          </View>
        </ScrollView>

        <Snackbar
          visible={!!error}
          onDismiss={clearError}
          duration={4000}
          action={{
            label: 'Dismiss',
            onPress: clearError,
          }}
        >
          {error}
        </Snackbar>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
    gap: 8,
  },
  title: {
    fontWeight: 'bold',
  },
  form: {
    padding: 24,
    borderRadius: 16,
    gap: 16,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nameField: {
    flex: 1,
  },
  input: {
    backgroundColor: 'transparent',
  },
  errorText: {
    marginTop: 4,
    marginLeft: 12,
  },
  signUpButton: {
    marginTop: 8,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  terms: {
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
});
