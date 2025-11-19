import { Stack, useRouter } from "expo-router";
import { useTheme as usePaperTheme, IconButton } from "react-native-paper";

export default function BibleLayout() {
  const theme = usePaperTheme();
  const router = useRouter();

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
          headerRight: () => (
            <IconButton
              icon="cog-outline"
              onPress={() => router.push("/settings")}
            />
          ),
        }}
      />
      <Stack.Screen
        name="[book]/index"
        options={{
          title: "Select Chapter",
          headerRight: () => (
            <IconButton
              icon="cog-outline"
              onPress={() => router.push("/settings")}
            />
          ),
        }}
      />
      <Stack.Screen
        name="[book]/[chapter]"
        options={{
          title: "Reading",
          headerRight: () => (
            <IconButton
              icon="cog-outline"
              onPress={() => router.push("/settings")}
            />
          ),
        }}
      />
    </Stack>
  );
}
