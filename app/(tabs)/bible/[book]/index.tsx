import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  useTheme as usePaperTheme,
  Chip,
  ActivityIndicator,
} from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getBibleBooks } from "@/services/bibleService";
import { useBibleReadingStore } from "@/store/bibleReadingStore";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { ChapterCard } from "@/components/ChapterCard";

export default function ChapterSelectionScreen() {
  const theme = usePaperTheme();
  const router = useRouter();
  const { book } = useLocalSearchParams<{ book: string }>();
  const { hasReadChapter, isChapterBookmarked, isLoading } =
    useBibleReadingStore();
  const navigation = useNavigation();

  const books = getBibleBooks();
  const bookData = books.find((b) => b.slug === book);

  useEffect(() => {
    if (bookData) {
      navigation.setOptions({ title: bookData.name });
    }
  }, [bookData, navigation]);

  if (!bookData) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Text>Book not found</Text>
      </View>
    );
  }

  const chapters = Array.from({ length: bookData.chapters }, (_, i) => i + 1);

  const handleChapterPress = (chapter: number) => {
    console.info("Navigating to:", `/bible/${book}/${chapter}`);
    router.push(`/bible/${book}/${chapter}`);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text
            variant="bodyMedium"
            style={[
              styles.loadingText,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Loading reading data...
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Chip
              icon="book-open-variant"
              style={[
                styles.chapterCountChip,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
              textStyle={{ color: theme.colors.onPrimaryContainer }}
            >
              {bookData.chapters} Chapters
            </Chip>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.chaptersGrid}>
              {chapters.map((chapter) => {
                const isRead = hasReadChapter(book, chapter);
                const isBookmarked = isChapterBookmarked(book, chapter);

                return (
                  <ChapterCard
                    key={chapter}
                    chapter={chapter}
                    isRead={isRead}
                    isBookmarked={isBookmarked}
                    onPress={() => handleChapterPress(chapter)}
                  />
                );
              })}
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
    alignItems: "center",
    gap: 8,
  },
  chapterCountChip: {
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
  },
  chaptersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
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
});
