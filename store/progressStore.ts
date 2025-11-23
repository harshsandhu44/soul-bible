import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  DAILY_PROGRESS: "dailyProgress",
  STREAK_DATA: "streakData",
};

export interface DailyProgress {
  date: string; // YYYY-MM-DD format
  chaptersRead: number;
  versesRead: number;
  timestamp: number;
}

export interface Streak {
  current: number; // Current consecutive days
  longest: number; // All-time best streak
  lastReadDate: string; // YYYY-MM-DD format
}

type ProgressStore = {
  dailyProgress: DailyProgress[];
  streakData: Streak;
  isLoading: boolean;

  // Actions
  updateDailyProgress: (chaptersRead: number, versesRead: number) => Promise<void>;
  calculateStreak: () => void;
  getCurrentStreak: () => number;
  getLongestStreak: () => number;
  getWeeklyStats: () => { chaptersRead: number; versesRead: number };
  getMonthlyStats: () => { chaptersRead: number; versesRead: number };
  getTodayProgress: () => DailyProgress | null;
  loadProgressData: () => Promise<void>;
};

// Helper: Get today's date in YYYY-MM-DD format
const getTodayDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

// Helper: Parse date string to Date object
const parseDate = (dateStr: string): Date => {
  return new Date(dateStr + "T00:00:00");
};

// Helper: Get number of days between two dates
const daysDifference = (date1: string, date2: string): number => {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export const useProgressStore = create<ProgressStore>((set, get) => ({
  dailyProgress: [],
  streakData: {
    current: 0,
    longest: 0,
    lastReadDate: "",
  },
  isLoading: true,

  updateDailyProgress: async (chaptersRead: number, versesRead: number) => {
    try {
      const state = get();
      const today = getTodayDate();

      // Find or create today's progress
      const existingProgressIndex = state.dailyProgress.findIndex(
        (p) => p.date === today
      );

      let newDailyProgress: DailyProgress[];

      if (existingProgressIndex >= 0) {
        // Update existing progress
        newDailyProgress = [...state.dailyProgress];
        newDailyProgress[existingProgressIndex] = {
          date: today,
          chaptersRead:
            newDailyProgress[existingProgressIndex].chaptersRead + chaptersRead,
          versesRead:
            newDailyProgress[existingProgressIndex].versesRead + versesRead,
          timestamp: Date.now(),
        };
      } else {
        // Create new progress entry
        newDailyProgress = [
          ...state.dailyProgress,
          {
            date: today,
            chaptersRead,
            versesRead,
            timestamp: Date.now(),
          },
        ];
      }

      // Save to AsyncStorage
      await AsyncStorage.setItem(
        STORAGE_KEYS.DAILY_PROGRESS,
        JSON.stringify(newDailyProgress)
      );

      set({ dailyProgress: newDailyProgress });

      // Recalculate streaks
      get().calculateStreak();
    } catch (error) {
      console.error("Error updating daily progress:", error);
    }
  },

  calculateStreak: () => {
    const state = get();
    const today = getTodayDate();

    // Get all unique dates sorted descending (most recent first)
    const uniqueDates = Array.from(
      new Set(state.dailyProgress.map((p) => p.date))
    ).sort((a, b) => b.localeCompare(a));

    if (uniqueDates.length === 0) {
      const newStreakData: Streak = {
        current: 0,
        longest: 0,
        lastReadDate: "",
      };
      set({ streakData: newStreakData });
      AsyncStorage.setItem(STORAGE_KEYS.STREAK_DATA, JSON.stringify(newStreakData));
      return;
    }

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastReadDate = uniqueDates[0];

    // Check if user read today or yesterday to start counting current streak
    const daysSinceLastRead = daysDifference(today, lastReadDate);

    if (daysSinceLastRead > 1) {
      // Streak is broken
      currentStreak = 0;
    } else {
      // Start counting from the most recent date
      tempStreak = 1;

      for (let i = 1; i < uniqueDates.length; i++) {
        const daysDiff = daysDifference(uniqueDates[i], uniqueDates[i - 1]);

        if (daysDiff === 1) {
          // Consecutive day
          tempStreak++;
        } else {
          // Gap found, check if this was the longest streak so far
          if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
          }

          // Start new streak count
          tempStreak = 1;
        }
      }

      // Check final streak
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }

      currentStreak = daysSinceLastRead <= 1 ? tempStreak : 0;
    }

    // Ensure longest is at least as high as current
    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }

    // Update existing longest if we have a stored value
    if (state.streakData.longest > longestStreak) {
      longestStreak = state.streakData.longest;
    }

    const newStreakData: Streak = {
      current: currentStreak,
      longest: longestStreak,
      lastReadDate,
    };

    set({ streakData: newStreakData });
    AsyncStorage.setItem(STORAGE_KEYS.STREAK_DATA, JSON.stringify(newStreakData));
  },

  getCurrentStreak: () => {
    return get().streakData.current;
  },

  getLongestStreak: () => {
    return get().streakData.longest;
  },

  getWeeklyStats: () => {
    const state = get();
    const today = getTodayDate();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];

    const weeklyProgress = state.dailyProgress.filter(
      (p) => p.date >= sevenDaysAgoStr && p.date <= today
    );

    return {
      chaptersRead: weeklyProgress.reduce((sum, p) => sum + p.chaptersRead, 0),
      versesRead: weeklyProgress.reduce((sum, p) => sum + p.versesRead, 0),
    };
  },

  getMonthlyStats: () => {
    const state = get();
    const today = getTodayDate();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split("T")[0];

    const monthlyProgress = state.dailyProgress.filter(
      (p) => p.date >= thirtyDaysAgoStr && p.date <= today
    );

    return {
      chaptersRead: monthlyProgress.reduce((sum, p) => sum + p.chaptersRead, 0),
      versesRead: monthlyProgress.reduce((sum, p) => sum + p.versesRead, 0),
    };
  },

  getTodayProgress: () => {
    const state = get();
    const today = getTodayDate();
    return state.dailyProgress.find((p) => p.date === today) || null;
  },

  loadProgressData: async () => {
    try {
      const [dailyProgressJson, streakDataJson] = await AsyncStorage.multiGet([
        STORAGE_KEYS.DAILY_PROGRESS,
        STORAGE_KEYS.STREAK_DATA,
      ]);

      const dailyProgress: DailyProgress[] = dailyProgressJson[1]
        ? JSON.parse(dailyProgressJson[1])
        : [];

      const streakData: Streak = streakDataJson[1]
        ? JSON.parse(streakDataJson[1])
        : { current: 0, longest: 0, lastReadDate: "" };

      set({
        dailyProgress,
        streakData,
        isLoading: false,
      });

      // Recalculate streaks to ensure accuracy
      get().calculateStreak();
    } catch (error) {
      console.error("Error loading progress data:", error);
      set({ isLoading: false });
    }
  },
}));
