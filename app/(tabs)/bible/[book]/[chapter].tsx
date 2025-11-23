import { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  useTheme as usePaperTheme,
  FAB,
  ActivityIndicator,
  IconButton,
  Snackbar,
  Button,
  Modal,
  Portal,
  TextInput,
} from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  getChapter,
  getBibleBooks,
  BibleChapter,
} from "@/services/bibleService";
import { useUserPreferencesStore } from "@/store/userPreferencesStore";
import { useBibleReadingStore } from "@/store/bibleReadingStore";
import { useAudioPlayerStore } from "@/store/audioPlayerStore";
import { useNotesStore } from "@/store/notesStore";
import { useProgressStore } from "@/store/progressStore";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AudioPlayer from "@/components/AudioPlayer";
import VerseItem from "@/components/VerseItem";
import { useFeatureFlag } from "posthog-react-native";

export default function ChapterReaderScreen() {
  const theme = usePaperTheme();
  const router = useRouter();
  const navigation = useNavigation();
  const { book, chapter } = useLocalSearchParams<{
    book: string;
    chapter: string;
  }>();
  const { preferredTranslation, fontSize, fontFamily, lineSpacing } =
    useUserPreferencesStore();
  const {
    setLastPosition,
    addToHistory,
    addBookmark,
    removeBookmark,
    isChapterBookmarked,
  } = useBibleReadingStore();
  const { updateDailyProgress } = useProgressStore();
  const showAudioPlayer = useFeatureFlag("audio-player") ?? false;
  const notesEnabled = useFeatureFlag("verse-notes") ?? false;
  const progressTrackingEnabled = useFeatureFlag("reading-progress") ?? false;
  const { stopPlayback } = useAudioPlayerStore();

  const { getNote, addNote, updateNote, removeNote } = useNotesStore();

  const [chapterData, setChapterData] = useState<BibleChapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");

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

  const fetchChapter = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getChapter(book, chapterNum, preferredTranslation);
      // Clean verse text - remove unwanted line breaks
      const cleanedData = {
        ...data,
        verses: data.verses.map((verse) => ({
          ...verse,
          text: verse.text.replace(/\n/g, " ").replace(/\s+/g, " ").trim(),
        })),
      };
      setChapterData(cleanedData);

      // Add to history and update last position
      await addToHistory(book, chapterNum);
      await setLastPosition(book, chapterNum);

      // Update daily progress (1 chapter, number of verses)
      if (progressTrackingEnabled) {
        await updateDailyProgress(1, data.verses.length);
      }
    } catch (err) {
      console.error("Error fetching chapter:", err);
      setError(
        "Failed to load chapter. Please check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book, chapterNum, preferredTranslation]);

  // Pause audio when screen loses focus
  useFocusEffect(
    useCallback(() => {
      return () => {
        // This cleanup function runs when screen loses focus
        stopPlayback();
      };
    }, [stopPlayback]),
  );

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
      router.push(`/bible/${book}/${chapterNum - 1}`);
    }
  };

  const handleNextChapter = () => {
    if (hasNextChapter) {
      router.push(`/bible/${book}/${chapterNum + 1}`);
    }
  };

  const handleNotePress = (verseNumber: number) => {
    setSelectedVerse(verseNumber);
    const existingNote = getNote(book, chapterNum, verseNumber);
    setNoteText(existingNote?.text || "");
    setNoteModalVisible(true);
  };

  const handleSaveNote = async () => {
    if (selectedVerse === null) return;

    const existingNote = getNote(book, chapterNum, selectedVerse);
    if (noteText.trim()) {
      if (existingNote) {
        await updateNote(book, chapterNum, selectedVerse, noteText.trim());
      } else {
        await addNote(book, chapterNum, selectedVerse, noteText.trim());
      }
      setSnackbarMessage("Note saved");
    } else if (existingNote) {
      await removeNote(book, chapterNum, selectedVerse);
      setSnackbarMessage("Note removed");
    }

    setNoteModalVisible(false);
    setSelectedVerse(null);
    setNoteText("");
    setSnackbarVisible(true);
  };

  if (loading) {
    return (
      <View
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
      </View>
    );
  }

  if (error || !chapterData) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.errorContainer}>
          <Text
            variant="titleMedium"
            style={[styles.errorText, { color: theme.colors.error }]}
          >
            {error || "Chapter not found"}
          </Text>
          {error && (
            <Button
              mode="contained"
              onPress={fetchChapter}
              style={styles.retryButton}
              icon="refresh"
            >
              Retry
            </Button>
          )}
        </View>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {showAudioPlayer && (
        <AudioPlayer
          chapterText={chapterData.text}
          book={book}
          chapter={chapterNum}
        />
      )}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.textContainer}>
          {chapterData.verses.map((verse) => (
            <VerseItem
              key={verse.reference}
              verse={verse}
              book={book}
              chapter={chapterNum}
              fontSize={fontSize}
              fontFamily={fontFamily}
              lineSpacing={lineSpacing}
              onNotePress={handleNotePress}
            />
          ))}
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
          {
            backgroundColor: isBookmarked
              ? theme.colors.primary
              : theme.colors.surface,
          },
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

      {notesEnabled && (
        <Portal>
          <Modal
            visible={noteModalVisible}
            onDismiss={() => setNoteModalVisible(false)}
            contentContainerStyle={[
              styles.noteModal,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.onSurface, marginBottom: 16 }}
            >
              {selectedVerse ? `Note for Verse ${selectedVerse}` : "Add Note"}
            </Text>
            <TextInput
              mode="outlined"
              multiline
              numberOfLines={4}
              value={noteText}
              onChangeText={setNoteText}
              placeholder="Write your note here..."
              style={styles.noteInput}
            />
            <View style={styles.noteButtonRow}>
              <Button mode="text" onPress={() => setNoteModalVisible(false)}>
                Cancel
              </Button>
              <Button mode="contained" onPress={handleSaveNote}>
                Save
              </Button>
            </View>
          </Modal>
        </Portal>
      )}
    </View>
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
    marginBottom: 16,
  },
  retryButton: {
    marginTop: 8,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  textContainer: {
    marginBottom: 32,
    gap: 12,
  },
  chapterText: {
    textAlign: "left",
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
  noteModal: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  noteInput: {
    marginBottom: 16,
  },
  noteButtonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
});
