import React, { useState, useRef } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  GestureResponderEvent,
  Dimensions,
} from "react-native";
import {
  Text,
  useTheme as usePaperTheme,
  Menu,
  IconButton,
} from "react-native-paper";
import { BibleVerse } from "@/services/bibleService";
import {
  useNotesStore,
  HIGHLIGHT_COLORS,
  HighlightColor,
} from "@/store/notesStore";
import { FontFamily, LineSpacing } from "@/store/userPreferencesStore";

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
  const [menuAnchor, setMenuAnchor] = useState({ x: 0, y: 0 });
  const containerRef = useRef<View>(null);
  const justOpenedRef = useRef(false);

  const verseNumber = parseInt(verse.reference, 10);

  // Use reactive selectors for proper UI updates
  const highlight = useNotesStore((state) =>
    state.highlights.find(
      (h) =>
        h.book === book && h.chapter === chapter && h.verseNumber === verseNumber
    )
  );
  const note = useNotesStore((state) =>
    state.notes.find(
      (n) =>
        n.book === book && n.chapter === chapter && n.verseNumber === verseNumber
    )
  );
  const { addHighlight, removeHighlight } = useNotesStore();

  const handleLongPress = (event: GestureResponderEvent) => {
    const { pageX, pageY } = event.nativeEvent;
    const { width, height } = Dimensions.get("window");

    // Clamp position to keep menu on screen
    const clampedX = Math.min(Math.max(pageX, 20), width - 20);
    const clampedY = Math.min(Math.max(pageY, 100), height - 200);

    setMenuAnchor({ x: clampedX, y: clampedY });
    justOpenedRef.current = true;
    setMenuVisible(true);
    setTimeout(() => {
      justOpenedRef.current = false;
    }, 150);
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

  const getFontFamily = () => {
    if (fontFamily === "system") return undefined;
    if (fontFamily === "serif") return "Georgia";
    return "System";
  };

  return (
    <>
      <Pressable
        onLongPress={handleLongPress}
        delayLongPress={400}
        style={({ pressed }) => [pressed && { opacity: 0.7 }]}
      >
        <View ref={containerRef} style={styles.verseContainer}>
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

      <Menu
        visible={menuVisible}
        onDismiss={() => {
          if (!justOpenedRef.current) {
            setMenuVisible(false);
          }
        }}
        anchor={menuAnchor}
        contentStyle={{ backgroundColor: theme.colors.surface }}
      >
        <Menu.Item
          title="Add Note"
          leadingIcon="note-plus"
          onPress={handleAddNote}
        />
        {highlight && (
          <Menu.Item
            title="Remove Highlight"
            leadingIcon="marker-cancel"
            onPress={handleRemoveHighlight}
          />
        )}
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
      </Menu>
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
    opacity: 0.5,
    minWidth: 24,
    fontWeight: "600",
  },
  textContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  verseText: {
    flex: 1,
    textAlign: "left",
  },
  noteButton: {
    marginLeft: 4,
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
