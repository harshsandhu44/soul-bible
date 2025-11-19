import React from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Button, useTheme as usePaperTheme } from "react-native-paper";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const theme = usePaperTheme();
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/onboarding/translation");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text
            variant="displayMedium"
            style={[styles.title, { color: theme.colors.onBackground }]}
          >
            Soul Bible
          </Text>
          <Text
            variant="titleMedium"
            style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
          >
            Daily Inspiration from Scripture
          </Text>
        </View>

        <View style={styles.description}>
          <Text
            variant="bodyLarge"
            style={[
              styles.descriptionText,
              { color: theme.colors.onBackground },
            ]}
          >
            Welcome to Soul Bible, your daily source of inspirational Bible
            verses. Let&apos;s personalize your experience by selecting your
            preferred Bible translation.
          </Text>
        </View>

        <View style={styles.footer}>
          <Button
            mode="contained"
            onPress={handleGetStarted}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Get Started
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  header: {
    marginTop: 60,
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
  },
  description: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  descriptionText: {
    textAlign: "center",
    lineHeight: 24,
  },
  footer: {
    marginBottom: 32,
  },
  button: {
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
