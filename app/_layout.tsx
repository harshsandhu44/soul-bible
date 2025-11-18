import { Stack, useRouter, useSegments } from "expo-router";
import { PaperProvider, ActivityIndicator } from "react-native-paper";
import { useEffect, useRef } from "react";
import { useColorScheme, View, StyleSheet, AppState } from "react-native";
import { lightTheme, darkTheme } from "../constants/theme";
import { useThemeStore } from "../store/themeStore";
import { useAuthStore } from "../store/authStore";
import { isTokenExpiring } from "../services/authService";

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const { isDarkMode, setIsDarkMode } = useThemeStore();
  const { isAuthenticated, isInitializing, checkAuthStatus, refreshToken } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const tokenRefreshInterval = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // Set up automatic token refresh
  useEffect(() => {
    if (!isAuthenticated) {
      // Clear interval if user is not authenticated
      if (tokenRefreshInterval.current) {
        clearInterval(tokenRefreshInterval.current);
        tokenRefreshInterval.current = null;
      }
      return;
    }

    // Check token expiration every minute
    const checkAndRefresh = async () => {
      const isExpiring = await isTokenExpiring();
      if (isExpiring) {
        console.log('Token expiring, refreshing...');
        await refreshToken();
      }
    };

    // Run immediately
    checkAndRefresh();

    // Set up interval to check every minute
    tokenRefreshInterval.current = setInterval(checkAndRefresh, 60 * 1000);

    // Cleanup on unmount or when auth status changes
    return () => {
      if (tokenRefreshInterval.current) {
        clearInterval(tokenRefreshInterval.current);
        tokenRefreshInterval.current = null;
      }
    };
  }, [isAuthenticated, refreshToken]);

  // Handle app state changes (foreground/background)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'active' && isAuthenticated) {
        // App came to foreground - check if token needs refresh
        const isExpiring = await isTokenExpiring();
        if (isExpiring) {
          console.log('App foregrounded, token expiring - refreshing...');
          await refreshToken();
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isAuthenticated, refreshToken]);

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
