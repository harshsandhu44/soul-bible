import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  Button,
  Card,
  useTheme as usePaperTheme,
  Divider,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const theme = usePaperTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card style={styles.card} elevation={2}>
          <Card.Content>
            <Text variant="headlineMedium" style={styles.title}>
              Welcome!
            </Text>
            <Divider style={styles.divider} />
            <Text variant="bodyLarge" style={styles.subtitle}>
              Your Spiritual Journey
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              Begin your spiritual journey with Soul Bible. Explore sacred
              texts, reflect on daily messages, and grow in your faith.
            </Text>
            <View style={styles.featureList}>
              <Text variant="bodyMedium">📖 Sacred Texts</Text>
              <Text variant="bodyMedium">🙏 Daily Reflections</Text>
              <Text variant="bodyMedium">✨ Personal Journey</Text>
              <Text variant="bodyMedium">🌙 Light & Dark Mode</Text>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={() => console.log("Explore")}>
              Explore
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
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
