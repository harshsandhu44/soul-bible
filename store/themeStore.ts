import { create } from "zustand";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "themeMode";

export type ThemeMode = "light" | "dark" | "system";

type ThemeStore = {
  themeMode: ThemeMode;
  isDarkMode: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  setIsDarkMode: (isDark: boolean) => void;
  toggleTheme: () => void;
  loadThemePreferences: () => Promise<void>;
};

export const useThemeStore = create<ThemeStore>((set, get) => ({
  themeMode: "system",
  isDarkMode: false,

  setThemeMode: async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, mode);
      set({ themeMode: mode });

      // If not system mode, immediately update isDarkMode
      if (mode !== "system") {
        set({ isDarkMode: mode === "dark" });
      }
    } catch (error) {
      console.error("Error saving theme mode:", error);
    }
  },

  setIsDarkMode: (isDark: boolean) => set({ isDarkMode: isDark }),

  toggleTheme: () =>
    set((state) => {
      const newIsDark = !state.isDarkMode;
      const newMode: ThemeMode = newIsDark ? "dark" : "light";

      // Save the new mode
      AsyncStorage.setItem(STORAGE_KEY, newMode).catch((error) =>
        console.error("Error saving theme mode:", error)
      );

      return { isDarkMode: newIsDark, themeMode: newMode };
    }),

  loadThemePreferences: async () => {
    try {
      const savedMode = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedMode && (savedMode === "light" || savedMode === "dark" || savedMode === "system")) {
        set({ themeMode: savedMode as ThemeMode });

        // If not system mode, set isDarkMode immediately
        if (savedMode !== "system") {
          set({ isDarkMode: savedMode === "dark" });
        }
      }
    } catch (error) {
      console.error("Error loading theme preferences:", error);
    }
  },
}));

// Custom hook to sync with system theme
export const useSystemTheme = () => {
  const systemColorScheme = useColorScheme();
  const { setIsDarkMode, themeMode } = useThemeStore();

  // Only sync with system if themeMode is "system"
  if (themeMode === "system" && systemColorScheme !== null) {
    const isDark = systemColorScheme === "dark";
    const currentTheme = useThemeStore.getState().isDarkMode;
    if (currentTheme !== isDark) {
      setIsDarkMode(isDark);
    }
  }
};
