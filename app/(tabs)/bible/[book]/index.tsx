import { View, StyleSheet, FlatList } from "react-native";
import {
  Text,
  Card,
  useTheme as usePaperTheme,
  IconButton,
  Chip,
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
  const { hasReadChapter, isChapterBookmarked } = useBibleReadingStore();
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
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Text>Book not found</Text>
      </SafeAreaView>
    );
  }

  const chapters = Array.from({ length: bookData.chapters }, (_, i) => i + 1);

  const handleChapterPress = (chapter: number) => {
    router.push(`/bible/${book}/${chapter}`);
  };

  const renderChapterItem = ({ item }: { item: number }) => {
    const isRead = hasReadChapter(book, item);
    const isBookmarked = isChapterBookmarked(book, item);

    return (
      <Card
        style={[
          styles.chapterCard,
          isRead && {
            backgroundColor: theme.colors.secondaryContainer,
          },
        ]}
        onPress={() => handleChapterPress(item)}
        mode="elevated"
      >
        <Card.Content style={styles.chapterCardContent}>
          <Text
            variant="titleLarge"
            style={[
              styles.chapterNumber,
              isRead && { color: theme.colors.onSecondaryContainer },
            ]}
          >
            {item}
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
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
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

      <FlatList
        data={chapters}
        renderItem={renderChapterItem}
        keyExtractor={(item) => item.toString()}
        numColumns={4}
        contentContainerStyle={styles.chaptersList}
        showsVerticalScrollIndicator={false}
      />
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
  chaptersList: {
    padding: 12,
  },
  chapterCard: {
    flex: 1,
    margin: 4,
    aspectRatio: 1,
    maxWidth: "23%",
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
});
