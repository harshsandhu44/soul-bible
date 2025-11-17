import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, Surface, useTheme, Snackbar } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/store/authStore';

export default function ResetPasswordScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams<{ email?: string }>();
  const { confirmResetPassword, isLoading, error, clearError } = useAuthStore();

  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const email = params.email || '';

  const updateField = (field: string, value: string) => {
    if (field === 'code') setCode(value);
    if (field === 'newPassword') setNewPassword(value);
    if (field === 'confirmPassword') setConfirmPassword(value);

    // Clear error for this field
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate code
    if (!code.trim()) {
      newErrors.code = 'Verification code is required';
    } else if (code.trim().length !== 6) {
      newErrors.code = 'Code must be 6 digits';
    }

    // Validate new password
    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(newPassword)) {
      newErrors.newPassword = 'Password must include uppercase, lowercase, number, and symbol';
    }

    // Validate confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    const result = await confirmResetPassword(email, code.trim(), newPassword);

    if (result.success) {
      setSuccess(true);
      // Navigate to sign in screen after short delay
      setTimeout(() => {
        router.replace('/(auth)/signin');
      }, 1500);
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
              Reset Password
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
              Enter the code sent to
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.primary, fontWeight: '600' }}>
              {email}
            </Text>
          </View>

          <Surface style={[styles.form, { backgroundColor: theme.colors.surface }]} elevation={1}>
            <TextInput
              label="Verification Code"
              value={code}
              onChangeText={(text) => {
                // Only allow numbers
                const numericCode = text.replace(/[^0-9]/g, '');
                updateField('code', numericCode);
              }}
              mode="outlined"
              keyboardType="number-pad"
              maxLength={6}
              error={!!errors.code}
              disabled={isLoading}
              style={styles.input}
            />
            {errors.code ? (
              <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.code}
              </Text>
            ) : null}

            <TextInput
              label="New Password"
              value={newPassword}
              onChangeText={(text) => updateField('newPassword', text)}
              mode="outlined"
              secureTextEntry={!showNewPassword}
              autoCapitalize="none"
              autoComplete="password-new"
              error={!!errors.newPassword}
              disabled={isLoading}
              style={styles.input}
              right={
                <TextInput.Icon
                  icon={showNewPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                />
              }
            />
            {errors.newPassword ? (
              <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.error }]}>
                {errors.newPassword}
              </Text>
            ) : null}

            <TextInput
              label="Confirm New Password"
              value={confirmPassword}
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
              onPress={handleResetPassword}
              loading={isLoading}
              disabled={isLoading}
              style={styles.resetButton}
              contentStyle={styles.buttonContent}
            >
              Reset Password
            </Button>
          </Surface>

          <Button
            mode="text"
            onPress={() => router.back()}
            disabled={isLoading}
            style={styles.backButton}
          >
            Back
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
          Password reset successfully!
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
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
  },
  form: {
    padding: 24,
    borderRadius: 16,
    gap: 16,
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
