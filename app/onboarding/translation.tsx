import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  Button,
  RadioButton,
  Card,
  useTheme as usePaperTheme,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useUserPreferencesStore } from "@/store/userPreferencesStore";
import { useBibleTranslations } from "@/hooks/useBibleTranslations";

export default function TranslationScreen() {
  const theme = usePaperTheme();
  const router = useRouter();
  const { setPreferredTranslation, setOnboardingComplete } =
    useUserPreferencesStore();
  const bibleTranslations = useBibleTranslations();

  const [selectedTranslation, setSelectedTranslation] = useState("kjv");

  const handleContinue = async () => {
    await setPreferredTranslation(selectedTranslation);
    await setOnboardingComplete();
    router.replace("/");
  };

  const handleSkip = async () => {
    // Keep default KJV translation
    await setPreferredTranslation("kjv");
    await setOnboardingComplete();
    router.replace("/");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text
            variant="headlineMedium"
            style={[styles.title, { color: theme.colors.onSurface }]}
          >
            Choose Your Translation
          </Text>
          <Text
            variant="bodyMedium"
            style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
          >
            Select the Bible translation you prefer for your daily verses
          </Text>
        </View>

        <RadioButton.Group
          onValueChange={(value) => setSelectedTranslation(value)}
          value={selectedTranslation}
        >
          {bibleTranslations.map((translation) => (
            <Card
              key={translation.code}
              style={[
                styles.card,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor:
                    selectedTranslation === translation.code
                      ? theme.colors.primary
                      : theme.colors.outline,
                },
              ]}
              onPress={() => setSelectedTranslation(translation.code)}
            >
              <Card.Content style={styles.cardContent}>
                <View style={styles.cardText}>
                  <Text
                    variant="titleMedium"
                    style={{ color: theme.colors.onSurface }}
                  >
                    {translation.name}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{
                      color: theme.colors.onSurfaceVariant,
                      marginTop: 4,
                    }}
                  >
                    {translation.description}
                  </Text>
                </View>
                <RadioButton value={translation.code} />
              </Card.Content>
            </Card>
          ))}
        </RadioButton.Group>

        <View style={styles.footer}>
          <Button
            mode="contained"
            onPress={handleContinue}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Continue
          </Button>
          <Button
            mode="text"
            onPress={handleSkip}
            style={styles.skipButton}
            contentStyle={styles.buttonContent}
          >
            Skip for now
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    lineHeight: 20,
  },
  card: {
    marginBottom: 12,
    borderWidth: 2,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  cardText: {
    flex: 1,
    marginRight: 8,
  },
  footer: {
    marginTop: 32,
    marginBottom: 16,
  },
  button: {
    borderRadius: 12,
    marginBottom: 12,
  },
  skipButton: {
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
