import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  Card,
  useTheme as usePaperTheme,
  Chip,
  Button,
  Divider,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { getBibleBooks } from "@/services/bibleService";
import { useBibleReadingStore } from "@/store/bibleReadingStore";

export default function BibleBooksScreen() {
  const theme = usePaperTheme();
  const router = useRouter();
  const { lastBook, lastChapter } = useBibleReadingStore();

  const books = getBibleBooks();
  const oldTestament = books.slice(0, 39);
  const newTestament = books.slice(39);

  const handleBookPress = (bookSlug: string) => {
    router.push(`/bible/${bookSlug}`);
  };

  const handleContinueReading = () => {
    if (lastBook && lastChapter) {
      router.push(`/bible/${lastBook}/${lastChapter}`);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {lastBook && lastChapter && (
          <>
            <Card style={styles.continueCard} elevation={2}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.continueTitle}>
                  Continue Reading
                </Text>
                <Text
                  variant="bodyLarge"
                  style={[
                    styles.continueReference,
                    { color: theme.colors.primary },
                  ]}
                >
                  {books.find((b) => b.slug === lastBook)?.name} Chapter{" "}
                  {lastChapter}
                </Text>
              </Card.Content>
              <Card.Actions>
                <Button mode="contained" onPress={handleContinueReading}>
                  Resume
                </Button>
              </Card.Actions>
            </Card>
            <Divider style={styles.divider} />
          </>
        )}

        <View style={styles.section}>
          <Text
            variant="titleLarge"
            style={[styles.sectionTitle, { color: theme.colors.primary }]}
          >
            Old Testament
          </Text>
          <Text
            variant="bodyMedium"
            style={[
              styles.sectionSubtitle,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {oldTestament.length} books
          </Text>
          <View style={styles.booksGrid}>
            {oldTestament.map((book) => (
              <Card
                key={book.slug}
                style={styles.bookCard}
                onPress={() => handleBookPress(book.slug)}
                mode="elevated"
              >
                <Card.Content style={styles.bookCardContent}>
                  <Text variant="titleMedium" style={styles.bookName}>
                    {book.name}
                  </Text>
                  <Chip
                    compact
                    style={[
                      styles.chapterChip,
                      { backgroundColor: theme.colors.secondaryContainer },
                    ]}
                  >
                    {book.chapters} {book.chapters === 1 ? "ch" : "chs"}
                  </Chip>
                </Card.Content>
              </Card>
            ))}
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.section}>
          <Text
            variant="titleLarge"
            style={[styles.sectionTitle, { color: theme.colors.primary }]}
          >
            New Testament
          </Text>
          <Text
            variant="bodyMedium"
            style={[
              styles.sectionSubtitle,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            {newTestament.length} books
          </Text>
          <View style={styles.booksGrid}>
            {newTestament.map((book) => (
              <Card
                key={book.slug}
                style={styles.bookCard}
                onPress={() => handleBookPress(book.slug)}
                mode="elevated"
              >
                <Card.Content style={styles.bookCardContent}>
                  <Text variant="titleMedium" style={styles.bookName}>
                    {book.name}
                  </Text>
                  <Chip
                    compact
                    style={[
                      styles.chapterChip,
                      { backgroundColor: theme.colors.secondaryContainer },
                    ]}
                    textStyle={{ color: theme.colors.onSecondaryContainer }}
                  >
                    {book.chapters} {book.chapters === 1 ? "ch" : "chs"}
                  </Chip>
                </Card.Content>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  continueCard: {
    margin: 16,
    marginBottom: 8,
  },
  continueTitle: {
    marginBottom: 8,
  },
  continueReference: {
    fontWeight: "bold",
  },
  divider: {
    marginVertical: 16,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  sectionSubtitle: {
    marginBottom: 16,
  },
  booksGrid: {
    gap: 12,
  },
  bookCard: {
    marginBottom: 8,
  },
  bookCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  bookName: {
    flex: 1,
    fontWeight: "600",
  },
  chapterChip: {
    height: 34,
  },
});
