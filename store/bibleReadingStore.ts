import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  LAST_BOOK: "lastBook",
  LAST_CHAPTER: "lastChapter",
  READING_HISTORY: "readingHistory",
  BOOKMARKS: "bookmarks",
};

export interface ReadingHistoryItem {
  book: string;
  chapter: number;
  timestamp: number;
}

export interface Bookmark {
  book: string;
  chapter: number;
  verse?: number;
  note?: string;
  timestamp: number;
}

type BibleReadingStore = {
  lastBook: string | null;
  lastChapter: number | null;
  readingHistory: ReadingHistoryItem[];
  bookmarks: Bookmark[];
  isLoading: boolean;
  setLastPosition: (book: string, chapter: number) => Promise<void>;
  addToHistory: (book: string, chapter: number) => Promise<void>;
  addBookmark: (bookmark: Bookmark) => Promise<void>;
  removeBookmark: (book: string, chapter: number) => Promise<void>;
  isChapterBookmarked: (book: string, chapter: number) => boolean;
  hasReadChapter: (book: string, chapter: number) => boolean;
  loadReadingData: () => Promise<void>;
};

export const useBibleReadingStore = create<BibleReadingStore>((set, get) => ({
  lastBook: null,
  lastChapter: null,
  readingHistory: [],
  bookmarks: [],
  isLoading: true,

  setLastPosition: async (book: string, chapter: number) => {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.LAST_BOOK, book],
        [STORAGE_KEYS.LAST_CHAPTER, chapter.toString()],
      ]);
      set({ lastBook: book, lastChapter: chapter });
    } catch (error) {
      console.error("Error saving last position:", error);
    }
  },

  addToHistory: async (book: string, chapter: number) => {
    try {
      const state = get();
      // Check if this chapter is already in history
      const exists = state.readingHistory.some(
        (item) => item.book === book && item.chapter === chapter
      );

      if (!exists) {
        const newHistory: ReadingHistoryItem[] = [
          ...state.readingHistory,
          {
            book,
            chapter,
            timestamp: Date.now(),
          },
        ];

        await AsyncStorage.setItem(
          STORAGE_KEYS.READING_HISTORY,
          JSON.stringify(newHistory)
        );
        set({ readingHistory: newHistory });
      }
    } catch (error) {
      console.error("Error adding to history:", error);
    }
  },

  addBookmark: async (bookmark: Bookmark) => {
    try {
      const state = get();
      // Remove existing bookmark for this chapter if exists
      const filteredBookmarks = state.bookmarks.filter(
        (b) => !(b.book === bookmark.book && b.chapter === bookmark.chapter)
      );

      const newBookmarks = [...filteredBookmarks, bookmark];

      await AsyncStorage.setItem(
        STORAGE_KEYS.BOOKMARKS,
        JSON.stringify(newBookmarks)
      );
      set({ bookmarks: newBookmarks });
    } catch (error) {
      console.error("Error adding bookmark:", error);
    }
  },

  removeBookmark: async (book: string, chapter: number) => {
    try {
      const state = get();
      const filteredBookmarks = state.bookmarks.filter(
        (b) => !(b.book === book && b.chapter === chapter)
      );

      await AsyncStorage.setItem(
        STORAGE_KEYS.BOOKMARKS,
        JSON.stringify(filteredBookmarks)
      );
      set({ bookmarks: filteredBookmarks });
    } catch (error) {
      console.error("Error removing bookmark:", error);
    }
  },

  isChapterBookmarked: (book: string, chapter: number) => {
    const state = get();
    return state.bookmarks.some(
      (b) => b.book === book && b.chapter === chapter
    );
  },

  hasReadChapter: (book: string, chapter: number) => {
    const state = get();
    return state.readingHistory.some(
      (item) => item.book === book && item.chapter === chapter
    );
  },

  loadReadingData: async () => {
    try {
      const [lastBook, lastChapter, historyJson, bookmarksJson] =
        await AsyncStorage.multiGet([
          STORAGE_KEYS.LAST_BOOK,
          STORAGE_KEYS.LAST_CHAPTER,
          STORAGE_KEYS.READING_HISTORY,
          STORAGE_KEYS.BOOKMARKS,
        ]);

      set({
        lastBook: lastBook[1],
        lastChapter: lastChapter[1] ? parseInt(lastChapter[1], 10) : null,
        readingHistory: historyJson[1] ? JSON.parse(historyJson[1]) : [],
        bookmarks: bookmarksJson[1] ? JSON.parse(bookmarksJson[1]) : [],
        isLoading: false,
      });
    } catch (error) {
      console.error("Error loading reading data:", error);
      set({ isLoading: false });
    }
  },
}));
