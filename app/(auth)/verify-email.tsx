import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Surface, useTheme, Snackbar } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '@/store/authStore';

export default function VerifyEmailScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams<{ email?: string }>();
  const { confirmSignUp, resendCode, isLoading, error, clearError } = useAuthStore();

  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);

  const email = params.email || '';

  const validateCode = () => {
    if (!code.trim()) {
      setCodeError('Verification code is required');
      return false;
    }
    if (code.trim().length !== 6) {
      setCodeError('Code must be 6 digits');
      return false;
    }
    return true;
  };

  const handleVerify = async () => {
    if (!validateCode()) return;

    const result = await confirmSignUp(email, code.trim());

    if (result.success) {
      // Navigate to sign in screen
      router.replace('/(auth)/signin');
    }
  };

  const handleResendCode = async () => {
    const result = await resendCode(email);
    if (result.success) {
      setResendSuccess(true);
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
            Verify Your Email
          </Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
            We sent a verification code to
          </Text>
          <Text variant="bodyLarge" style={{ color: theme.colors.primary, fontWeight: '600' }}>
            {email}
          </Text>
        </View>

        <Surface style={[styles.form, { backgroundColor: theme.colors.surface }]} elevation={1}>
          <Text variant="bodyMedium" style={[styles.instruction, { color: theme.colors.onSurface }]}>
            Enter the 6-digit code from your email
          </Text>

          <TextInput
            label="Verification Code"
            value={code}
            onChangeText={(text) => {
              // Only allow numbers
              const numericCode = text.replace(/[^0-9]/g, '');
              setCode(numericCode);
              setCodeError('');
            }}
            mode="outlined"
            keyboardType="number-pad"
            maxLength={6}
            error={!!codeError}
            disabled={isLoading}
            style={styles.input}
          />
          {codeError ? (
            <Text variant="bodySmall" style={[styles.errorText, { color: theme.colors.error }]}>
              {codeError}
            </Text>
          ) : null}

          <Button
            mode="contained"
            onPress={handleVerify}
            loading={isLoading}
            disabled={isLoading || code.length !== 6}
            style={styles.verifyButton}
            contentStyle={styles.buttonContent}
          >
            Verify Email
          </Button>

          <View style={styles.resendSection}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              Didn't receive the code?
            </Text>
            <Button
              mode="text"
              onPress={handleResendCode}
              disabled={isLoading}
              compact
            >
              Resend Code
            </Button>
          </View>
        </Surface>

        <Button
          mode="text"
          onPress={() => router.back()}
          disabled={isLoading}
          style={styles.backButton}
        >
          Back to Sign Up
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
        visible={resendSuccess}
        onDismiss={() => setResendSuccess(false)}
        duration={3000}
      >
        Verification code sent successfully!
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
  instruction: {
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'transparent',
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 8,
  },
  errorText: {
    marginTop: -12,
    marginLeft: 12,
  },
  verifyButton: {
    marginTop: 8,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  resendSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  backButton: {
    marginTop: 24,
  },
});
