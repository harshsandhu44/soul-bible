import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  Button,
  Card,
  IconButton,
  useTheme as usePaperTheme,
  Surface,
  Divider,
  Avatar,
} from "react-native-paper";
import { useThemeStore } from "../store/themeStore";
import { useAuthStore } from "../store/authStore";
import { StatusBar } from "expo-status-bar";

export default function Index() {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { user, signOut } = useAuthStore();
  const theme = usePaperTheme();

  const handleSignOut = async () => {
    await signOut();
  };

  const getInitials = () => {
    if (!user) return "U";
    const firstInitial = user.firstName?.[0] || "";
    const lastInitial = user.lastName?.[0] || "";
    return (firstInitial + lastInitial).toUpperCase() || user.username?.[0]?.toUpperCase() || "U";
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.dark ? "light" : "dark"} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Surface style={styles.header} elevation={0}>
          <Text variant="titleLarge" style={styles.headerText}>
            Soul Bible
          </Text>
          <IconButton
            icon={isDarkMode ? "weather-sunny" : "weather-night"}
            size={28}
            onPress={toggleTheme}
            iconColor={theme.colors.primary}
          />
        </Surface>

        <Card style={styles.userCard} elevation={2}>
          <Card.Content style={styles.userCardContent}>
            <Avatar.Text
              size={64}
              label={getInitials()}
              style={{ backgroundColor: theme.colors.primaryContainer }}
              color={theme.colors.onPrimaryContainer}
            />
            <View style={styles.userInfo}>
              <Text variant="headlineSmall" style={styles.userName}>
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.username || "User"}
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                {user?.email || ""}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card} elevation={2}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.title}>
              Welcome Back!
            </Text>
            <Divider style={styles.divider} />
            <Text variant="bodyLarge" style={styles.subtitle}>
              Your Spiritual Journey
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              Continue your spiritual journey with Soul Bible. Explore sacred texts,
              reflect on daily messages, and grow in your faith.
            </Text>
            <View style={styles.featureList}>
              <Text variant="bodyMedium">📖 Sacred Texts</Text>
              <Text variant="bodyMedium">🙏 Daily Reflections</Text>
              <Text variant="bodyMedium">✨ Personal Journey</Text>
              <Text variant="bodyMedium">🌙 Light & Dark Mode</Text>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button mode="outlined" onPress={handleSignOut}>
              Sign Out
            </Button>
            <Button mode="contained" onPress={() => console.log("Explore")}>
              Explore
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 12,
    marginBottom: 24,
  },
  headerText: {
    fontWeight: "bold",
  },
  userCard: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    marginBottom: 16,
  },
  userCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  userName: {
    fontWeight: "bold",
  },
  card: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    marginBottom: 16,
  },
  title: {
    marginBottom: 16,
    fontWeight: "bold",
  },
  divider: {
    marginVertical: 12,
  },
  subtitle: {
    marginBottom: 8,
    fontWeight: "600",
  },
  description: {
    marginBottom: 16,
    opacity: 0.8,
  },
  featureList: {
    gap: 8,
    marginTop: 8,
  },
});
