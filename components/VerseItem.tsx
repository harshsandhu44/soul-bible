import React, { useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import {
  Text,
  useTheme as usePaperTheme,
  Menu,
  IconButton,
  Snackbar,
} from "react-native-paper";
import * as Sharing from "expo-sharing";
import * as Clipboard from "expo-clipboard";
import { BibleVerse, getBibleBooks } from "@/services/bibleService";
import {
  useNotesStore,
  HIGHLIGHT_COLORS,
  HighlightColor,
} from "@/store/notesStore";
import { FontFamily, LineSpacing } from "@/store/userPreferencesStore";
import { useFeatureFlag } from "posthog-react-native";

interface VerseItemProps {
  verse: BibleVerse;
  book: string;
  chapter: number;
  fontSize: number;
  fontFamily: FontFamily;
  lineSpacing: LineSpacing;
  onNotePress: (verseNumber: number) => void;
}

export default function VerseItem({
  verse,
  book,
  chapter,
  fontSize,
  fontFamily,
  lineSpacing,
  onNotePress,
}: VerseItemProps) {
  const theme = usePaperTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const highlightingEnabled = useFeatureFlag("verse-highlighting") ?? false;
  const notesEnabled = useFeatureFlag("verse-notes") ?? false;

  const verseNumber = parseInt(verse.reference, 10);

  // Get book name from slug
  const getBookName = () => {
    const bookData = getBibleBooks().find((b) => b.slug === book);
    return bookData?.name || book;
  };

  // Use reactive selectors for proper UI updates
  // Always call hooks (Rules of Hooks), conditionally use results
  const highlightData = useNotesStore((state) =>
    state.highlights.find(
      (h) =>
        h.book === book &&
        h.chapter === chapter &&
        h.verseNumber === verseNumber,
    ),
  );
  const noteData = useNotesStore((state) =>
    state.notes.find(
      (n) =>
        n.book === book &&
        n.chapter === chapter &&
        n.verseNumber === verseNumber,
    ),
  );
  const { addHighlight, removeHighlight } = useNotesStore();

  // Conditionally display based on feature flags
  const highlight = highlightingEnabled ? highlightData : undefined;
  const note = notesEnabled ? noteData : undefined;

  const handlePress = () => {
    setMenuVisible(true);
  };

  const handleHighlight = async (color: HighlightColor) => {
    await addHighlight(book, chapter, verseNumber, color);
    setMenuVisible(false);
  };

  const handleRemoveHighlight = async () => {
    await removeHighlight(book, chapter, verseNumber);
    setMenuVisible(false);
  };

  const handleAddNote = () => {
    setMenuVisible(false);
    onNotePress(verseNumber);
  };

  const handleShare = async () => {
    setMenuVisible(false);
    try {
      const shareText = `"${verse.text}" - ${getBookName()} ${chapter}:${verseNumber} (${verse.translation})`;

      if (await Sharing.isAvailableAsync()) {
        // Create a temporary text file for sharing
        await Sharing.shareAsync("data:text/plain," + encodeURIComponent(shareText));
      } else {
        setSnackbarMessage("Sharing is not available on this device");
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.error("Error sharing verse:", error);
      setSnackbarMessage("Failed to share verse");
      setSnackbarVisible(true);
    }
  };

  const handleCopy = async () => {
    setMenuVisible(false);
    try {
      const copyText = `"${verse.text}" - ${getBookName()} ${chapter}:${verseNumber} (${verse.translation})`;
      await Clipboard.setStringAsync(copyText);
      setSnackbarMessage("Verse copied to clipboard");
      setSnackbarVisible(true);
    } catch (error) {
      console.error("Error copying verse:", error);
      setSnackbarMessage("Failed to copy verse");
      setSnackbarVisible(true);
    }
  };

  const getFontFamily = () => {
    if (fontFamily === "system") return undefined;
    if (fontFamily === "serif") return "Georgia";
    return "System";
  };

  return (
    <>
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Pressable
            onPress={handlePress}
            style={({ pressed }) => [pressed && { opacity: 0.7 }]}
          >
            <View style={styles.verseContainer}>
              <Text
                style={[
                  styles.verseNumber,
                  {
                    color: highlight
                      ? HIGHLIGHT_COLORS[highlight.color]
                      : theme.colors.onBackground,
                    fontSize: fontSize * 0.75,
                  },
                ]}
              >
                {verse.reference}
              </Text>
              <View style={styles.textContainer}>
                <Text
                  style={[
                    styles.verseText,
                    {
                      color: highlight
                        ? HIGHLIGHT_COLORS[highlight.color]
                        : theme.colors.onSurface,
                      fontSize: fontSize,
                      lineHeight: fontSize * lineSpacing,
                      fontFamily: getFontFamily(),
                    },
                  ]}
                >
                  {verse.text}
                </Text>
                {note && (
                  <IconButton
                    size={16}
                    icon="pencil"
                    onPress={() => onNotePress(verseNumber)}
                    hitSlop={8}
                    style={styles.noteButton}
                  />
                )}
              </View>
            </View>
          </Pressable>
        }
        contentStyle={{ backgroundColor: theme.colors.surface }}
      >
      <Menu.Item
        title="Share"
        leadingIcon="share-variant"
        onPress={handleShare}
      />
      <Menu.Item
        title="Copy"
        leadingIcon="content-copy"
        onPress={handleCopy}
      />
      {notesEnabled && (
        <Menu.Item
          title="Add Note"
          leadingIcon="note-plus"
          onPress={handleAddNote}
        />
      )}
      {highlightingEnabled && highlight && (
        <Menu.Item
          title="Remove Highlight"
          leadingIcon="marker-cancel"
          onPress={handleRemoveHighlight}
        />
      )}
      {highlightingEnabled && (
        <View style={styles.colorSection}>
          <Text
            style={[
              styles.colorLabel,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Highlight Color
          </Text>
          <View style={styles.colorRow}>
            {(Object.keys(HIGHLIGHT_COLORS) as HighlightColor[]).map(
              (color) => (
                <Pressable
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: HIGHLIGHT_COLORS[color] },
                    highlight?.color === color && styles.selectedColor,
                  ]}
                  onPress={() => handleHighlight(color)}
                />
              ),
            )}
          </View>
        </View>
      )}
      </Menu>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        action={{
          label: "OK",
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </>
  );
}

const styles = StyleSheet.create({
  verseContainer: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 4,
  },
  verseNumber: {
    marginTop: 4,
    opacity: 0.5,
    minWidth: 24,
    fontWeight: "600",
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  verseText: {
    flex: 1,
    textAlign: "left",
  },
  noteButton: {
    marginLeft: 8,
    marginTop: 2,
  },
  colorSection: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  colorLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  colorRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: "#333",
  },
});
