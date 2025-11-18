import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  Button,
  Card,
  useTheme as usePaperTheme,
  Divider,
  ActivityIndicator,
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { getRandomBibleVerse, BibleVerse } from "../services/bibleService";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const theme = usePaperTheme();

  // Bible verse state
  const [verse, setVerse] = useState<BibleVerse | null>(null);
  const [isLoadingVerse, setIsLoadingVerse] = useState(true);

  // Fetch random Bible verse on mount
  useEffect(() => {
    const fetchVerse = async () => {
      setIsLoadingVerse(true);
      const bibleVerse = await getRandomBibleVerse();
      setVerse(bibleVerse);
      setIsLoadingVerse(false);
    };

    fetchVerse();
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar style={theme.dark ? "light" : "dark"} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Coming Soon Card with Bible Verse */}
        <Card style={styles.comingSoonCard} elevation={3}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.comingSoonTitle}>
              ✨ Coming Soon
            </Text>
            <Divider style={styles.divider} />
            {isLoadingVerse ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text
                  variant="bodyMedium"
                  style={[
                    styles.loadingText,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Loading inspiration...
                </Text>
              </View>
            ) : verse ? (
              <View style={styles.verseContainer}>
                <Text
                  variant="bodyLarge"
                  style={[styles.verseText, { color: theme.colors.onSurface }]}
                >
                  &ldquo;{verse.text}&rdquo;
                </Text>
                <Text
                  variant="bodyMedium"
                  style={[
                    styles.verseReference,
                    { color: theme.colors.primary },
                  ]}
                >
                  — {verse.reference} ({verse.translation})
                </Text>
              </View>
            ) : null}
          </Card.Content>
        </Card>

        <Card style={styles.card} elevation={2}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.title}>
              Welcome!
            </Text>
            <Divider style={styles.divider} />
            <Text variant="bodyLarge" style={styles.subtitle}>
              Your Spiritual Journey
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              Begin your spiritual journey with Soul Bible. Explore sacred
              texts, reflect on daily messages, and grow in your faith.
            </Text>
            <View style={styles.featureList}>
              <Text variant="bodyMedium">📖 Sacred Texts</Text>
              <Text variant="bodyMedium">🙏 Daily Reflections</Text>
              <Text variant="bodyMedium">✨ Personal Journey</Text>
              <Text variant="bodyMedium">🌙 Light & Dark Mode</Text>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={() => console.log("Explore")}>
              Explore
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 24,
    paddingHorizontal: 8,
  },
  card: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    marginBottom: 16,
  },
  title: {
    marginBottom: 16,
    fontWeight: "bold",
  },
  divider: {
    marginVertical: 12,
  },
  subtitle: {
    marginBottom: 8,
    fontWeight: "600",
  },
  description: {
    marginBottom: 16,
    opacity: 0.8,
  },
  featureList: {
    gap: 8,
    marginTop: 8,
  },
  comingSoonCard: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    marginBottom: 16,
  },
  comingSoonTitle: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 16,
  },
  loadingText: {
    fontStyle: "italic",
  },
  verseContainer: {
    gap: 12,
    paddingVertical: 8,
  },
  verseText: {
    fontStyle: "italic",
    lineHeight: 24,
    textAlign: "center",
  },
  verseReference: {
    fontWeight: "600",
    textAlign: "right",
    marginTop: 4,
  },
});
