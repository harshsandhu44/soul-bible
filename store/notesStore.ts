import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  HIGHLIGHTS: "highlights",
  NOTES: "notes",
};

export type HighlightColor = "yellow" | "green" | "blue" | "pink" | "orange";

export const HIGHLIGHT_COLORS: Record<HighlightColor, string> = {
  yellow: "#FFF59D",
  green: "#A5D6A7",
  blue: "#90CAF9",
  pink: "#F48FB1",
  orange: "#FFCC80",
};

export interface Highlight {
  id: string;
  book: string;
  chapter: number;
  verseNumber: number;
  color: HighlightColor;
  timestamp: number;
}

export interface Note {
  id: string;
  book: string;
  chapter: number;
  verseNumber: number;
  text: string;
  timestamp: number;
}

type NotesStore = {
  highlights: Highlight[];
  notes: Note[];
  isLoading: boolean;

  // Highlight actions
  addHighlight: (
    book: string,
    chapter: number,
    verseNumber: number,
    color: HighlightColor
  ) => Promise<void>;
  removeHighlight: (
    book: string,
    chapter: number,
    verseNumber: number
  ) => Promise<void>;
  getHighlight: (
    book: string,
    chapter: number,
    verseNumber: number
  ) => Highlight | undefined;
  getChapterHighlights: (book: string, chapter: number) => Highlight[];

  // Note actions
  addNote: (
    book: string,
    chapter: number,
    verseNumber: number,
    text: string
  ) => Promise<void>;
  updateNote: (
    book: string,
    chapter: number,
    verseNumber: number,
    text: string
  ) => Promise<void>;
  removeNote: (
    book: string,
    chapter: number,
    verseNumber: number
  ) => Promise<void>;
  getNote: (
    book: string,
    chapter: number,
    verseNumber: number
  ) => Note | undefined;
  getChapterNotes: (book: string, chapter: number) => Note[];

  // Load data
  loadNotesData: () => Promise<void>;
};

export const useNotesStore = create<NotesStore>((set, get) => ({
  highlights: [],
  notes: [],
  isLoading: true,

  addHighlight: async (book, chapter, verseNumber, color) => {
    try {
      const { highlights } = get();
      const existingIndex = highlights.findIndex(
        (h) =>
          h.book === book && h.chapter === chapter && h.verseNumber === verseNumber
      );

      const newHighlight: Highlight = {
        id: `${book}-${chapter}-${verseNumber}`,
        book,
        chapter,
        verseNumber,
        color,
        timestamp: Date.now(),
      };

      let updatedHighlights: Highlight[];
      if (existingIndex >= 0) {
        updatedHighlights = [...highlights];
        updatedHighlights[existingIndex] = newHighlight;
      } else {
        updatedHighlights = [...highlights, newHighlight];
      }

      await AsyncStorage.setItem(
        STORAGE_KEYS.HIGHLIGHTS,
        JSON.stringify(updatedHighlights)
      );
      set({ highlights: updatedHighlights });
    } catch (error) {
      console.error("Error adding highlight:", error);
    }
  },

  removeHighlight: async (book, chapter, verseNumber) => {
    try {
      const { highlights } = get();
      const updatedHighlights = highlights.filter(
        (h) =>
          !(h.book === book && h.chapter === chapter && h.verseNumber === verseNumber)
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.HIGHLIGHTS,
        JSON.stringify(updatedHighlights)
      );
      set({ highlights: updatedHighlights });
    } catch (error) {
      console.error("Error removing highlight:", error);
    }
  },

  getHighlight: (book, chapter, verseNumber) => {
    const { highlights } = get();
    return highlights.find(
      (h) =>
        h.book === book && h.chapter === chapter && h.verseNumber === verseNumber
    );
  },

  getChapterHighlights: (book, chapter) => {
    const { highlights } = get();
    return highlights.filter((h) => h.book === book && h.chapter === chapter);
  },

  addNote: async (book, chapter, verseNumber, text) => {
    try {
      const { notes } = get();
      const newNote: Note = {
        id: `${book}-${chapter}-${verseNumber}`,
        book,
        chapter,
        verseNumber,
        text,
        timestamp: Date.now(),
      };

      const updatedNotes = [...notes, newNote];
      await AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updatedNotes));
      set({ notes: updatedNotes });
    } catch (error) {
      console.error("Error adding note:", error);
    }
  },

  updateNote: async (book, chapter, verseNumber, text) => {
    try {
      const { notes } = get();
      const updatedNotes = notes.map((n) =>
        n.book === book && n.chapter === chapter && n.verseNumber === verseNumber
          ? { ...n, text, timestamp: Date.now() }
          : n
      );
      await AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updatedNotes));
      set({ notes: updatedNotes });
    } catch (error) {
      console.error("Error updating note:", error);
    }
  },

  removeNote: async (book, chapter, verseNumber) => {
    try {
      const { notes } = get();
      const updatedNotes = notes.filter(
        (n) =>
          !(n.book === book && n.chapter === chapter && n.verseNumber === verseNumber)
      );
      await AsyncStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updatedNotes));
      set({ notes: updatedNotes });
    } catch (error) {
      console.error("Error removing note:", error);
    }
  },

  getNote: (book, chapter, verseNumber) => {
    const { notes } = get();
    return notes.find(
      (n) =>
        n.book === book && n.chapter === chapter && n.verseNumber === verseNumber
    );
  },

  getChapterNotes: (book, chapter) => {
    const { notes } = get();
    return notes.filter((n) => n.book === book && n.chapter === chapter);
  },

  loadNotesData: async () => {
    try {
      const [highlightsData, notesData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.HIGHLIGHTS),
        AsyncStorage.getItem(STORAGE_KEYS.NOTES),
      ]);

      set({
        highlights: highlightsData ? JSON.parse(highlightsData) : [],
        notes: notesData ? JSON.parse(notesData) : [],
        isLoading: false,
      });
    } catch (error) {
      console.error("Error loading notes data:", error);
      set({ isLoading: false });
    }
  },
}));
