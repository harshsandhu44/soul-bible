import { View, StyleSheet, FlatList } from "react-native";
import { Text, useTheme as usePaperTheme, Chip } from "react-native-paper";
import { useRouter } from "expo-router";
import { useBibleReadingStore } from "@/store/bibleReadingStore";
import { BookmarkListItem } from "@/components/BookmarkListItem";
import { getBibleBooks } from "@/services/bibleService";
import { useMemo } from "react";

export default function BookmarksScreen() {
  const theme = usePaperTheme();
  const router = useRouter();
  const { bookmarks, removeBookmark, hasReadChapter } = useBibleReadingStore();

  // Sort bookmarks by timestamp (newest first) and enrich with book names
  const sortedBookmarks = useMemo(() => {
    const books = getBibleBooks();
    return [...bookmarks]
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((bookmark) => {
        const book = books.find((b) => b.slug === bookmark.book);
        return {
          ...bookmark,
          bookName: book?.name || bookmark.book,
        };
      });
  }, [bookmarks]);

  const handleBookmarkPress = (book: string, chapter: number) => {
    router.push(`/bible/${book}/${chapter}`);
  };

  const handleRemoveBookmark = (book: string, chapter: number) => {
    removeBookmark(book, chapter);
  };

  // Empty state
  if (bookmarks.length === 0) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.emptyState}>
          <Text
            variant="displaySmall"
            style={[
              styles.emptyIcon,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            📖
          </Text>
          <Text
            variant="headlineSmall"
            style={[
              styles.emptyTitle,
              { color: theme.colors.onSurface },
            ]}
          >
            No bookmarks yet
          </Text>
          <Text
            variant="bodyMedium"
            style={[
              styles.emptyMessage,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Tap the bookmark icon while reading to save chapters for later
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.header}>
        <Text
          variant="titleMedium"
          style={[styles.headerTitle, { color: theme.colors.onSurface }]}
        >
          My Bookmarks
        </Text>
        <Chip
          icon="bookmark"
          style={{
            backgroundColor: theme.colors.primaryContainer,
          }}
          textStyle={{ color: theme.colors.onPrimaryContainer }}
        >
          {bookmarks.length}
        </Chip>
      </View>

      <FlatList
        data={sortedBookmarks}
        keyExtractor={(item) => `${item.book}-${item.chapter}`}
        renderItem={({ item }) => (
          <BookmarkListItem
            bookName={item.bookName}
            chapter={item.chapter}
            isRead={hasReadChapter(item.book, item.chapter)}
            timestamp={item.timestamp}
            onPress={() => handleBookmarkPress(item.book, item.chapter)}
            onRemove={() => handleRemoveBookmark(item.book, item.chapter)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontWeight: "600",
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyMessage: {
    textAlign: "center",
    maxWidth: 300,
  },
});
