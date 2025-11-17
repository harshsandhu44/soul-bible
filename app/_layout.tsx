import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { lightTheme, darkTheme } from "../constants/theme";
import { useThemeStore } from "../store/themeStore";

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const { isDarkMode, setIsDarkMode } = useThemeStore();

  // Sync with system theme on mount and when system theme changes
  useEffect(() => {
    if (systemColorScheme !== null) {
      setIsDarkMode(systemColorScheme === "dark");
    }
  }, [systemColorScheme, setIsDarkMode]);

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.onSurface,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      />
    </PaperProvider>
  );
}
