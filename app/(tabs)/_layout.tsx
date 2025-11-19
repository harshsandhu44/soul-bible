import { Tabs, useRouter } from "expo-router";
import { IconButton, useTheme as usePaperTheme } from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function TabsLayout() {
  const theme = usePaperTheme();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outlineVariant,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
          headerShown: true,
          headerRight: () => (
            <IconButton
              icon="cog-outline"
              iconColor={theme.colors.onSurface}
              onPress={() => router.push("/settings")}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bible"
        options={{
          title: "Read Bible",
          tabBarLabel: "Read",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="book-open-page-variant"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: "Bookmarks",
          tabBarLabel: "Bookmarks",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="bookmark" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
