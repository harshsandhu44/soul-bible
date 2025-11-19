import { Stack, usePathname, useRouter, useSegments } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { lightTheme, darkTheme } from "../constants/theme";
import { useThemeStore } from "../store/themeStore";
import { useUserPreferencesStore } from "../store/userPreferencesStore";
import { useBibleReadingStore } from "../store/bibleReadingStore";

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const { isDarkMode, setIsDarkMode, themeMode, loadThemePreferences } = useThemeStore();
  const { hasCompletedOnboarding, isLoading, loadPreferences } =
    useUserPreferencesStore();
  const { loadReadingData, isLoading: isReadingDataLoading } =
    useBibleReadingStore();
  const router = useRouter();
  const path = usePathname();
  const segments = useSegments();

  console.log("[PATH]", path);

  // Load user preferences and theme preferences on mount
  useEffect(() => {
    const initializeStores = async () => {
      await Promise.all([
        loadPreferences(),
        loadReadingData(),
        loadThemePreferences(),
      ]);
    };
    initializeStores();
  }, [loadPreferences, loadReadingData, loadThemePreferences]);

  // Sync with system theme only when themeMode is "system"
  useEffect(() => {
    if (themeMode === "system" && systemColorScheme !== null) {
      setIsDarkMode(systemColorScheme === "dark");
    }
  }, [systemColorScheme, setIsDarkMode, themeMode]);

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
        <Stack.Screen
          name="settings"
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
      </Stack>
    </PaperProvider>
  );
}
