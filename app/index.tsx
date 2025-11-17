import { View, StyleSheet } from "react-native";
import {
  Text,
  Button,
  Card,
  IconButton,
  useTheme as usePaperTheme,
  Surface,
  Divider,
} from "react-native-paper";
import { useThemeStore } from "../store/themeStore";

export default function Index() {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const theme = usePaperTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
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

      <Card style={styles.card} elevation={2}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>
            Welcome to Soul Bible
          </Text>
          <Divider style={styles.divider} />
          <Text variant="bodyLarge" style={styles.subtitle}>
            Material Design 3 Theme
          </Text>
          <Text variant="bodyMedium" style={styles.description}>
            React Native Paper with MD3 is now configured with both light and
            dark mode support. Toggle the theme using the button above!
          </Text>
          <View style={styles.featureList}>
            <Text variant="bodyMedium">✓ Material Design 3</Text>
            <Text variant="bodyMedium">✓ Light & Dark Mode</Text>
            <Text variant="bodyMedium">✓ Custom Color Palette</Text>
            <Text variant="bodyMedium">✓ System Theme Detection</Text>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button mode="outlined" onPress={() => console.log("Learn More")}>
            Learn More
          </Button>
          <Button mode="contained" onPress={() => console.log("Get Started")}>
            Get Started
          </Button>
        </Card.Actions>
      </Card>
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
  card: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
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
