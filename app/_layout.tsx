import { Stack, usePathname, useRouter, useSegments } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { useEffect, useRef } from "react";
import { useColorScheme, AppState, AppStateStatus } from "react-native";
import { lightTheme, darkTheme } from "../constants/theme";
import { useThemeStore } from "../store/themeStore";
import { useUserPreferencesStore } from "../store/userPreferencesStore";
import { useBibleReadingStore } from "../store/bibleReadingStore";
import { useAudioPlayerStore } from "../store/audioPlayerStore";

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const { isDarkMode, setIsDarkMode, themeMode, loadThemePreferences } =
    useThemeStore();
  const { hasCompletedOnboarding, isLoading, loadPreferences } =
    useUserPreferencesStore();
  const { loadReadingData, isLoading: isReadingDataLoading } =
    useBibleReadingStore();
  const { loadAvailableVoices, stopPlayback } = useAudioPlayerStore();
  const router = useRouter();
  const path = usePathname();
  const segments = useSegments();
  const appState = useRef(AppState.currentState);

  console.log("[PATH]", path);

  // Load user preferences, theme preferences, and available voices on mount
  useEffect(() => {
    const initializeStores = async () => {
      await Promise.all([
        loadPreferences(),
        loadReadingData(),
        loadThemePreferences(),
        loadAvailableVoices(),
      ]);
    };
    initializeStores();
  }, [
    loadPreferences,
    loadReadingData,
    loadThemePreferences,
    loadAvailableVoices,
  ]);

  // Sync with system theme only when themeMode is "system"
  useEffect(() => {
    if (themeMode === "system" && systemColorScheme !== null) {
      setIsDarkMode(systemColorScheme === "dark");
    }
  }, [systemColorScheme, setIsDarkMode, themeMode]);

  // Listen to app state changes to pause audio when app goes to background
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/active/) &&
        (nextAppState === "background" || nextAppState === "inactive")
      ) {
        // App is going to background or inactive - pause audio
        stopPlayback();
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [stopPlayback]);

  // Handle onboarding navigation
  useEffect(() => {
    // Wait for both stores to finish loading
    if (isLoading || isReadingDataLoading) return;

    const inOnboarding = segments[0] === "onboarding";

    if (!hasCompletedOnboarding && !inOnboarding) {
      // User hasn't completed onboarding, redirect to welcome screen
      router.replace("/onboarding/welcome");
    } else if (hasCompletedOnboarding && inOnboarding) {
      // User has completed onboarding but is in onboarding flow, redirect to home
      router.replace("/");
    }
  }, [
    hasCompletedOnboarding,
    isLoading,
    isReadingDataLoading,
    segments,
    router,
  ]);

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
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="settings" />
      </Stack>
    </PaperProvider>
  );
}
