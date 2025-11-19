import { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  Button,
  Card,
  useTheme as usePaperTheme,
  Divider,
  ActivityIndicator,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { getRandomBibleVerse, BibleVerse } from "@/services/bibleService";
import { useUserPreferencesStore } from "@/store/userPreferencesStore";

export default function Index() {
  const theme = usePaperTheme();
  const { preferredTranslation } = useUserPreferencesStore();
  const [verse, setVerse] = useState<BibleVerse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetVerse = async () => {
    setLoading(true);
    try {
      const fetchedVerse = await getRandomBibleVerse(preferredTranslation);
      setVerse(fetchedVerse);
    } catch (error) {
      console.error("Error fetching verse:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
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
            <Button
              mode="contained"
              onPress={handleGetVerse}
              loading={loading}
              disabled={loading}
            >
              Get Daily Verse
            </Button>
          </Card.Actions>
        </Card>

        {verse && (
          <Card style={styles.card} elevation={2}>
            <Card.Content>
              <Text
                variant="titleMedium"
                style={[styles.verseReference, { color: theme.colors.primary }]}
              >
                {verse.reference}
              </Text>
              <Divider style={styles.divider} />
              <Text variant="bodyLarge" style={styles.verseText}>
                "{verse.text}"
              </Text>
              <Text
                variant="bodySmall"
                style={[
                  styles.translation,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {verse.translation}
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  verseReference: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  verseText: {
    lineHeight: 28,
    fontStyle: "italic",
    marginBottom: 12,
  },
  translation: {
    textAlign: "right",
    fontSize: 12,
  },
});
