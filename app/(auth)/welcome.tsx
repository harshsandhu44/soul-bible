import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Surface, useTheme } from 'react-native-paper';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function WelcomeScreen() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Surface style={[styles.hero, { backgroundColor: theme.colors.surface }]} elevation={0}>
          <Text variant="displaySmall" style={[styles.title, { color: theme.colors.primary }]}>
            Soul Bible
          </Text>
          <Text variant="titleMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Your spiritual companion
          </Text>
        </Surface>

        <View style={styles.content}>
          <Text variant="bodyLarge" style={[styles.description, { color: theme.colors.onSurface }]}>
            Connect with your faith, explore sacred texts, and grow spiritually with Soul Bible.
          </Text>

          <View style={styles.features}>
            <FeatureItem
              icon="📖"
              title="Sacred Texts"
              description="Access and study religious texts"
              theme={theme}
            />
            <FeatureItem
              icon="🙏"
              title="Daily Reflections"
              description="Inspirational messages every day"
              theme={theme}
            />
            <FeatureItem
              icon="✨"
              title="Personal Journey"
              description="Track your spiritual growth"
              theme={theme}
            />
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            mode="contained"
            onPress={() => router.push('/(auth)/signup')}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Get Started
          </Button>
          <Button
            mode="outlined"
            onPress={() => router.push('/(auth)/signin')}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Sign In
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
  theme: any;
}

function FeatureItem({ icon, title, description, theme }: FeatureItemProps) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <View style={styles.featureText}>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
          {title}
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 24,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 48,
    borderRadius: 16,
    marginBottom: 32,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  description: {
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  features: {
    gap: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  featureIcon: {
    fontSize: 32,
  },
  featureText: {
    flex: 1,
    gap: 4,
  },
  actions: {
    gap: 12,
    marginTop: 32,
  },
  button: {
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
