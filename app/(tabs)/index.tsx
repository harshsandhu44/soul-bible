import { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  Button,
  Card,
  useTheme as usePaperTheme,
  Divider,
  ActivityIndicator,
} from "react-native-paper";
import { useRouter } from "expo-router";
import {
  getRandomBibleVerse,
  BibleVerse,
  getBibleBooks,
} from "@/services/bibleService";
import { useUserPreferencesStore } from "@/store/userPreferencesStore";
import { useBibleReadingStore } from "@/store/bibleReadingStore";
import { useFeatureFlags } from "posthog-react-native";
import ProgressCard from "@/components/ProgressCard";

export default function Index() {
  const theme = usePaperTheme();
  const router = useRouter();
  const featureFlags = useFeatureFlags();
  const { preferredTranslation } = useUserPreferencesStore();
  const { lastBook, lastChapter } = useBibleReadingStore();
  const [verse, setVerse] = useState<BibleVerse | null>(null);
  const [loading, setLoading] = useState(false);

  const books = getBibleBooks();
  const lastBookData = lastBook ? books.find((b) => b.slug === lastBook) : null;

  console.info("[FEATURE FLAGS]", featureFlags);

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

  useEffect(() => {
    handleGetVerse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartReading = () => {
    if (lastBook && lastChapter) {
      // Continue from last position
      router.push(`/bible/${lastBook}/${lastChapter}`);
    } else {
      // Start fresh - go to book selection
      router.push("/bible");
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card style={styles.card} elevation={2}>
          <Card.Content>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text
                  variant="bodyMedium"
                  style={[
                    styles.loadingText,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Loading verse...
                </Text>
              </View>
            ) : verse ? (
              <>
                <Text
                  variant="titleMedium"
                  style={[
                    styles.verseReference,
                    { color: theme.colors.primary },
                  ]}
                >
                  {verse.reference}
                </Text>
                <Divider style={styles.divider} />
                <Text variant="bodyLarge" style={styles.verseText}>
                  &quot;{verse.text}&quot;
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
              </>
            ) : null}
          </Card.Content>
        </Card>

        {/* Progress Card */}
        <ProgressCard />

        <Divider style={styles.sectionDivider} />

        <Card style={styles.readingCard} elevation={3}>
          <Card.Content style={styles.readingCardContainer}>
            <View style={styles.readingCardTextContainer}>
              <Text
                variant="titleLarge"
                style={[styles.readingTitle, { color: theme.colors.primary }]}
              >
                {lastBook && lastChapter && lastBookData
                  ? "Continue Reading"
                  : "Start Reading"}
              </Text>
              {lastBook && lastChapter && lastBookData && (
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  {lastBookData.name} Chapter {lastChapter}
                </Text>
              )}
              {!lastBook && (
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Begin your journey through the Bible
                </Text>
              )}
            </View>
            <Button
              mode="contained"
              icon={lastBook ? "book-open-page-variant" : "book"}
              onPress={handleStartReading}
            >
              {lastBook ? "Resume" : "Start"}
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.buttonsGroup}>
          <Button
            mode="contained-tonal"
            icon="bookmark"
            contentStyle={{ paddingVertical: 6 }}
            onPress={() => router.push("/(tabs)/bookmarks")}
          >
            Bookmarks
          </Button>

          <Button
            mode="contained-tonal"
            icon="cog"
            contentStyle={{ paddingVertical: 6 }}
            onPress={() => router.push("/settings")}
          >
            Settings
          </Button>
        </View>
      </ScrollView>
    </View>
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
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 16,
  },
  cardTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  continueText: {
    fontWeight: "600",
  },
  readingCard: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    padding: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  readingCardContainer: {
    rowGap: 8,
    columnGap: 16,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  readingCardTextContainer: {
    marginBottom: 16,
    gap: 4,
  },
  readingTitle: {
    fontWeight: "800",
  },
  sectionDivider: {
    marginVertical: 16,
    maxWidth: 600,
    alignSelf: "center",
    width: "100%",
  },
  buttonsGroup: {
    marginTop: 16,
    gap: 12,
    maxWidth: 600,
  },
});
