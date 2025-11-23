import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Portal,
  Modal,
  Text,
  Card,
  Button,
  ActivityIndicator,
  useTheme as usePaperTheme,
} from "react-native-paper";
import { BibleVerse } from "@/services/bibleService";

interface TranslationComparisonModalProps {
  visible: boolean;
  onDismiss: () => void;
  book: string;
  chapter: number;
  verseNumber: number;
  bookName: string;
}

interface TranslationData {
  translation: string;
  translationName: string;
  verse: BibleVerse | null;
  loading: boolean;
  error: boolean;
}

// Available translations from bible-api.com
const TRANSLATIONS = [
  { code: "kjv", name: "King James Version" },
  { code: "web", name: "World English Bible" },
  { code: "asv", name: "American Standard Version" },
  { code: "bbe", name: "Bible in Basic English" },
  { code: "clementine", name: "Clementine Vulgate" },
];

export default function TranslationComparisonModal({
  visible,
  onDismiss,
  book,
  chapter,
  verseNumber,
  bookName,
}: TranslationComparisonModalProps) {
  const theme = usePaperTheme();
  const [translations, setTranslations] = useState<TranslationData[]>([]);

  useEffect(() => {
    if (visible) {
      fetchAllTranslations();
    }
  }, [visible, book, chapter, verseNumber]);

  const fetchAllTranslations = async () => {
    // Initialize translation data
    const initialData: TranslationData[] = TRANSLATIONS.map((t) => ({
      translation: t.code,
      translationName: t.name,
      verse: null,
      loading: true,
      error: false,
    }));
    setTranslations(initialData);

    // Fetch all translations in parallel
    const fetchPromises = TRANSLATIONS.map(async (t, index) => {
      try {
        const reference = `${book} ${chapter}:${verseNumber}`;
        const url = `https://bible-api.com/${encodeURIComponent(
          reference
        )}?translation=${t.code}`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch ${t.name}`);
        }

        const data = await response.json();

        return {
          translation: t.code,
          translationName: t.name,
          verse: {
            text: data.text?.trim() || "",
            reference: data.reference || "",
            translation: data.translation_name || t.name,
          },
          loading: false,
          error: false,
        };
      } catch (error) {
        console.error(`Error fetching ${t.name}:`, error);
        return {
          translation: t.code,
          translationName: t.name,
          verse: null,
          loading: false,
          error: true,
        };
      }
    });

    // Wait for all fetches to complete
    const results = await Promise.all(fetchPromises);
    setTranslations(results);
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modalContent,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <View style={styles.header}>
          <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
            Compare Translations
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
          >
            {bookName} {chapter}:{verseNumber}
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={true}
        >
          {translations.map((t) => (
            <Card
              key={t.translation}
              style={[
                styles.translationCard,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
              elevation={1}
            >
              <Card.Content>
                <Text
                  variant="titleMedium"
                  style={[
                    styles.translationTitle,
                    { color: theme.colors.primary },
                  ]}
                >
                  {t.translationName}
                </Text>

                {t.loading && (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" />
                    <Text
                      variant="bodySmall"
                      style={{ color: theme.colors.onSurfaceVariant, marginLeft: 8 }}
                    >
                      Loading...
                    </Text>
                  </View>
                )}

                {t.error && !t.loading && (
                  <Text
                    variant="bodyMedium"
                    style={{ color: theme.colors.error }}
                  >
                    Failed to load this translation
                  </Text>
                )}

                {t.verse && !t.loading && !t.error && (
                  <Text
                    variant="bodyMedium"
                    style={[
                      styles.verseText,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    {t.verse.text}
                  </Text>
                )}
              </Card.Content>
            </Card>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            mode="contained"
            onPress={onDismiss}
            style={styles.closeButton}
          >
            Close
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    marginHorizontal: 20,
    marginVertical: 40,
    borderRadius: 12,
    maxHeight: "90%",
    padding: 20,
  },
  header: {
    marginBottom: 16,
  },
  scrollView: {
    maxHeight: 500,
  },
  translationCard: {
    marginBottom: 12,
  },
  translationTitle: {
    marginBottom: 8,
    fontWeight: "600",
  },
  verseText: {
    lineHeight: 22,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  footer: {
    marginTop: 16,
    alignItems: "center",
  },
  closeButton: {
    minWidth: 120,
  },
});
