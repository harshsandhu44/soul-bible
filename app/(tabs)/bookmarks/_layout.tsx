import { Stack } from "expo-router";
import { useTheme as usePaperTheme } from "react-native-paper";

export default function BookmarksLayout() {
  const theme = usePaperTheme();

  return (
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
          title: "Bookmarks",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
