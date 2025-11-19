import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Appbar,
  List,
  RadioButton,
  Text,
  Divider,
  useTheme as usePaperTheme,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useThemeStore, ThemeMode } from "@/store/themeStore";
import { useUserPreferencesStore } from "@/store/userPreferencesStore";
import { BIBLE_TRANSLATIONS, FONT_SIZES } from "@/constants/translations";

export default function SettingsScreen() {
  const router = useRouter();
  const theme = usePaperTheme();
  const { themeMode, setThemeMode } = useThemeStore();
  const { fontSize, setFontSize, preferredTranslation, setPreferredTranslation } =
    useUserPreferencesStore();

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
  };

  const handleTranslationChange = (code: string) => {
    setPreferredTranslation(code);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["bottom"]}
    >
      <Appbar.Header
        style={{ backgroundColor: theme.colors.surface }}
        elevated
      >
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Settings" />
      </Appbar.Header>

      <ScrollView style={styles.scrollView}>
        {/* Theme Section */}
        <List.Section>
          <List.Subheader>Theme</List.Subheader>
          <RadioButton.Group
            onValueChange={(value) => handleThemeChange(value as ThemeMode)}
            value={themeMode}
          >
            <RadioButton.Item
              label="Light"
              value="light"
              labelStyle={{ color: theme.colors.onSurface }}
            />
            <RadioButton.Item
              label="Dark"
              value="dark"
              labelStyle={{ color: theme.colors.onSurface }}
            />
            <RadioButton.Item
              label="System"
              value="system"
              labelStyle={{ color: theme.colors.onSurface }}
            />
          </RadioButton.Group>
        </List.Section>

        <Divider />

        {/* Font Size Section */}
        <List.Section>
          <List.Subheader>Reading Font Size</List.Subheader>
          <RadioButton.Group
            onValueChange={(value) => handleFontSizeChange(parseInt(value, 10))}
            value={fontSize.toString()}
          >
            {FONT_SIZES.map((size) => (
              <RadioButton.Item
                key={size.value}
                label={`${size.label} (${size.value}px)`}
                value={size.value.toString()}
                labelStyle={{ color: theme.colors.onSurface }}
              />
            ))}
          </RadioButton.Group>
        </List.Section>

        <Divider />

        {/* Translation Section */}
        <List.Section>
          <List.Subheader>Bible Translation</List.Subheader>
          <RadioButton.Group
            onValueChange={handleTranslationChange}
            value={preferredTranslation}
          >
            {BIBLE_TRANSLATIONS.map((translation) => (
              <View key={translation.code}>
                <RadioButton.Item
                  label={translation.name}
                  value={translation.code}
                  labelStyle={{ color: theme.colors.onSurface }}
                />
                <Text
                  variant="bodySmall"
                  style={[
                    styles.translationDescription,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {translation.description}
                </Text>
              </View>
            ))}
          </RadioButton.Group>
        </List.Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  translationDescription: {
    marginLeft: 56,
    marginTop: -8,
    marginBottom: 8,
  },
});
