import { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  useTheme as usePaperTheme,
  FAB,
  ActivityIndicator,
  IconButton,
  Snackbar,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getChapter, getBibleBooks, BibleChapter } from "@/services/bibleService";
import { useUserPreferencesStore } from "@/store/userPreferencesStore";
import { useBibleReadingStore } from "@/store/bibleReadingStore";
import { useNavigation } from "@react-navigation/native";

export default function ChapterReaderScreen() {
  const theme = usePaperTheme();
  const router = useRouter();
  const navigation = useNavigation();
  const { book, chapter } = useLocalSearchParams<{
    book: string;
    chapter: string;
  }>();
  const { preferredTranslation } = useUserPreferencesStore();
  const {
    setLastPosition,
    addToHistory,
    addBookmark,
    removeBookmark,
    isChapterBookmarked,
  } = useBibleReadingStore();

  const [chapterData, setChapterData] = useState<BibleChapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const chapterNum = parseInt(chapter, 10);
  const isBookmarked = isChapterBookmarked(book, chapterNum);

  const books = getBibleBooks();
  const bookData = books.find((b) => b.slug === book);
  const hasNextChapter = bookData && chapterNum < bookData.chapters;
  const hasPreviousChapter = chapterNum > 1;

  useEffect(() => {
    if (bookData) {
      navigation.setOptions({
        title: `${bookData.name} ${chapter}`,
      });
    }
  }, [bookData, chapter, navigation]);

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getChapter(book, chapterNum, preferredTranslation);
        setChapterData(data);

        // Add to history and update last position
        await addToHistory(book, chapterNum);
        await setLastPosition(book, chapterNum);
      } catch (err) {
        console.error("Error fetching chapter:", err);
        setError("Failed to load chapter. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [book, chapterNum, preferredTranslation, addToHistory, setLastPosition]);

  const handleBookmarkToggle = async () => {
    if (isBookmarked) {
      await removeBookmark(book, chapterNum);
      setSnackbarMessage("Bookmark removed");
    } else {
      await addBookmark({
        book,
        chapter: chapterNum,
        timestamp: Date.now(),
      });
      setSnackbarMessage("Chapter bookmarked");
    }
    setSnackbarVisible(true);
  };

  const handlePreviousChapter = () => {
    if (hasPreviousChapter) {
      router.setParams({ chapter: (chapterNum - 1).toString() });
    }
  };

  const handleNextChapter = () => {
    if (hasNextChapter) {
      router.setParams({ chapter: (chapterNum + 1).toString() });
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text
            variant="bodyLarge"
            style={[
              styles.loadingText,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Loading chapter...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !chapterData) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.errorContainer}>
          <Text
            variant="titleMedium"
            style={[styles.errorText, { color: theme.colors.error }]}
          >
            {error || "Chapter not found"}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text
            variant="headlineSmall"
            style={[styles.chapterTitle, { color: theme.colors.primary }]}
          >
            {bookData?.name} {chapter}
          </Text>
        </View>

        <View style={styles.textContainer}>
          <Text
            variant="bodyLarge"
            style={[styles.chapterText, { color: theme.colors.onSurface }]}
          >
            {chapterData.text}
          </Text>
        </View>

        <View style={styles.navigationContainer}>
          {hasPreviousChapter && (
            <IconButton
              icon="chevron-left"
              mode="contained"
              size={24}
              onPress={handlePreviousChapter}
              style={styles.navButton}
            />
          )}
          {hasNextChapter && (
            <IconButton
              icon="chevron-right"
              mode="contained"
              size={24}
              onPress={handleNextChapter}
              style={styles.navButton}
            />
          )}
        </View>
      </ScrollView>

      <FAB
        icon={isBookmarked ? "bookmark" : "bookmark-outline"}
        style={[
          styles.fab,
          { backgroundColor: isBookmarked ? theme.colors.primary : theme.colors.surface },
        ]}
        color={isBookmarked ? theme.colors.onPrimary : theme.colors.onSurface}
        onPress={handleBookmarkToggle}
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
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
    padding: 16,
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    textAlign: "center",
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  chapterTitle: {
    fontWeight: "bold",
  },
  textContainer: {
    marginBottom: 32,
  },
  chapterText: {
    lineHeight: 32,
    fontSize: 18,
    textAlign: "justify",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  navButton: {
    margin: 0,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
  snackbar: {
    marginBottom: 16,
  },
});
