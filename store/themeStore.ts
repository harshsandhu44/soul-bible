import { create } from "zustand";
import { useColorScheme } from "react-native";

type ThemeStore = {
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeStore>((set) => ({
  isDarkMode: false,
  setIsDarkMode: (isDark: boolean) => set({ isDarkMode: isDark }),
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));

// Custom hook to sync with system theme
export const useSystemTheme = () => {
  const systemColorScheme = useColorScheme();
  const { setIsDarkMode } = useThemeStore();

  // Initialize theme based on system preference
  if (systemColorScheme !== null) {
    const isDark = systemColorScheme === "dark";
    const currentTheme = useThemeStore.getState().isDarkMode;
    if (currentTheme !== isDark) {
      setIsDarkMode(isDark);
    }
  }
};
