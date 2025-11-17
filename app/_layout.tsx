import { Stack, useRouter, useSegments } from "expo-router";
import { PaperProvider, ActivityIndicator } from "react-native-paper";
import { useEffect } from "react";
import { useColorScheme, View, StyleSheet } from "react-native";
import { lightTheme, darkTheme } from "../constants/theme";
import { useThemeStore } from "../store/themeStore";
import { useAuthStore } from "../store/authStore";
import { configureAmplify } from "../config/amplify";

// Configure Amplify on app load
configureAmplify();

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const { isDarkMode, setIsDarkMode } = useThemeStore();
  const { isAuthenticated, isInitializing, checkAuthStatus } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // Sync with system theme on mount and when system theme changes
  useEffect(() => {
    if (systemColorScheme !== null) {
      setIsDarkMode(systemColorScheme === "dark");
    }
  }, [systemColorScheme, setIsDarkMode]);

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Protect routes based on auth status
  useEffect(() => {
    if (isInitializing) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to welcome screen if not authenticated
      router.replace("/(auth)/welcome");
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to home if authenticated and trying to access auth screens
      router.replace("/");
    }
  }, [isAuthenticated, isInitializing, segments]);

  const theme = isDarkMode ? darkTheme : lightTheme;

  // Show loading screen while checking auth status
  if (isInitializing) {
    return (
      <PaperProvider theme={theme}>
        <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </PaperProvider>
    );
  }

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
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
