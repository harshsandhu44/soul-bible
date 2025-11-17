import { View, StyleSheet } from "react-native";
import { Text, Button, Card } from "react-native-paper";

export default function Index() {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>
            Welcome to Soul Bible
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            React Native Paper is now set up and ready to use!
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={() => console.log("Pressed")}>
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
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 400,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginTop: 8,
  },
});
