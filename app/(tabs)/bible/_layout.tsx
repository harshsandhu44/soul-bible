import { Stack } from "expo-router";
import { useTheme as usePaperTheme } from "react-native-paper";

export default function BibleLayout() {
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
          title: "Read Bible",
        }}
      />
      <Stack.Screen
        name="[book]/index"
        options={{
          title: "Select Chapter",
        }}
      />
      <Stack.Screen
        name="[book]/[chapter]"
        options={{
          title: "Reading",
        }}
      />
    </Stack>
  );
}
