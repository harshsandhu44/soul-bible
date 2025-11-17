import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Surface, useTheme, Snackbar } from 'react-native-paper';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/store/authStore';

export default function ForgotPasswordScreen() {
  const theme = useTheme();
  const { resetPassword, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    return true;
  };

  const handleResetRequest = async () => {
    if (!validateEmail()) return;

    const result = await resetPassword(email.trim());

    if (result.success) {
      setSuccess(true);
      // Navigate to reset password screen after short delay
      setTimeout(() => {
        router.push({
          pathname: '/(auth)/reset-password',
          params: { email: email.trim() },
        });
      }, 1500);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
            Forgot Password?
          </Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
            No worries, we'll send you reset instructions
          </Text>
        </View>

        <Surface style={[styles.form, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="bodyMedium" style={[styles.instruction, { color: theme.colors.onSurface }]}>
            Enter the email address associated with your account
          </Text>

          <TextInput
            label="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError('');
            }}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={!!emailError}
            disabled={isLoading}
            style={styles.input}
          />
          {emailError ? (
            <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.error }]}>
              {emailError}
            </Text>
          ) : null}

          <Button
            mode="contained"
            onPress={handleResetRequest}
            loading={isLoading}
            disabled={isLoading}
            style={styles.resetButton}
            contentStyle={styles.buttonContent}
          >
            Send Reset Code
          </Button>
        </Surface>

        <Button
          mode="text"
          onPress={() => router.back()}
          disabled={isLoading}
          style={styles.backButton}
          icon="arrow-left"
        >
          Back to Sign In
        </Button>
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

      <Snackbar
        visible={success}
        onDismiss={() => setSuccess(false)}
        duration={3000}
      >
        Reset code sent to your email!
      </Snackbar>
    </View>
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
  instruction: {
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'transparent',
  },
  errorText: {
    marginTop: -12,
    marginLeft: 12,
  },
  resetButton: {
    marginTop: 8,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  backButton: {
    marginTop: 24,
  },
});
