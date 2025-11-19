import { Stack, useRouter, useSegments } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { lightTheme, darkTheme } from "../constants/theme";
import { useThemeStore } from "../store/themeStore";
import { useUserPreferencesStore } from "../store/userPreferencesStore";
import { useBibleReadingStore } from "../store/bibleReadingStore";

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const { isDarkMode, setIsDarkMode } = useThemeStore();
  const {
    hasCompletedOnboarding,
    isLoading,
    loadPreferences,
  } = useUserPreferencesStore();
  const { loadReadingData } = useBibleReadingStore();
  const router = useRouter();
  const segments = useSegments();

  // Load user preferences on mount
  useEffect(() => {
    loadPreferences();
    loadReadingData();
  }, [loadPreferences, loadReadingData]);

  // Sync with system theme on mount and when system theme changes
  useEffect(() => {
    if (systemColorScheme !== null) {
      setIsDarkMode(systemColorScheme === "dark");
    }
  }, [systemColorScheme, setIsDarkMode]);

  // Handle onboarding navigation
  useEffect(() => {
    if (isLoading) return;

    const inOnboarding = segments[0] === "onboarding";

    if (!hasCompletedOnboarding && !inOnboarding) {
      // User hasn't completed onboarding, redirect to welcome screen
      router.replace("/onboarding/welcome");
    } else if (hasCompletedOnboarding && inOnboarding) {
      // User has completed onboarding but is in onboarding flow, redirect to home
      router.replace("/");
    }
  }, [hasCompletedOnboarding, isLoading, segments, router]);

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
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </PaperProvider>
  );
}
