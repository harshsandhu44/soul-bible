import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  Card,
  useTheme as usePaperTheme,
  IconButton,
  Chip,
  ActivityIndicator,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getBibleBooks } from "@/services/bibleService";
import { useBibleReadingStore } from "@/store/bibleReadingStore";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

export default function ChapterSelectionScreen() {
  const theme = usePaperTheme();
  const router = useRouter();
  const { book } = useLocalSearchParams<{ book: string }>();
  const { hasReadChapter, isChapterBookmarked, isLoading } =
    useBibleReadingStore();
  const navigation = useNavigation();

  const books = getBibleBooks();
  const bookData = books.find((b) => b.slug === book);

  console.log("[DATA]", bookData);

  useEffect(() => {
    if (bookData) {
      navigation.setOptions({ title: bookData.name });
    }
  }, [bookData, navigation]);

  if (!bookData) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Text>Book not found</Text>
      </SafeAreaView>
    );
  }

  const chapters = Array.from({ length: bookData.chapters }, (_, i) => i + 1);

  console.log("Book:", book);
  console.log("Book Data:", bookData);
  console.log("Chapters array:", chapters);
  console.log("Is Loading:", isLoading);

  const handleChapterPress = (chapter: number) => {
    console.log("Navigating to:", `/bible/${book}/${chapter}`);
    router.push(`/bible/${book}/${chapter}`);
  };

  return (
    <SafeAreaView
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
            <Text
              variant="headlineSmall"
              style={[styles.bookTitle, { color: theme.colors.primary }]}
            >
              {bookData.name}
            </Text>
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
                  <Card
                    key={chapter}
                    style={[
                      styles.chapterCard,
                      {
                        backgroundColor: isRead
                          ? theme.colors.secondaryContainer
                          : theme.colors.surfaceVariant,
                      },
                    ]}
                    onPress={() => handleChapterPress(chapter)}
                    mode="elevated"
                  >
                    <Card.Content style={styles.chapterCardContent}>
                      <Text
                        variant="titleLarge"
                        style={[
                          styles.chapterNumber,
                          {
                            color: isRead
                              ? theme.colors.onSecondaryContainer
                              : theme.colors.onSurface,
                          },
                        ]}
                      >
                        {chapter}
                      </Text>
                      {isBookmarked && (
                        <IconButton
                          icon="bookmark"
                          size={20}
                          iconColor={theme.colors.primary}
                          style={styles.bookmarkIcon}
                        />
                      )}
                    </Card.Content>
                  </Card>
                );
              })}
            </View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
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
  bookTitle: {
    fontWeight: "bold",
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
  chapterCard: {
    width: "23%",
    margin: "1%",
    minHeight: 80,
    aspectRatio: 1,
  },
  chapterCardContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  chapterNumber: {
    fontWeight: "bold",
  },
  bookmarkIcon: {
    position: "absolute",
    top: -8,
    right: -8,
    margin: 0,
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
