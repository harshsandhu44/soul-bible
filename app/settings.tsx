import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Appbar,
  List,
  RadioButton,
  Text,
  Divider,
  useTheme as usePaperTheme,
  Modal,
  IconButton,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { useThemeStore, ThemeMode } from "@/store/themeStore";
import { useUserPreferencesStore } from "@/store/userPreferencesStore";
import { useAudioPlayerStore } from "@/store/audioPlayerStore";
import { BIBLE_TRANSLATIONS, FONT_SIZES } from "@/constants/translations";
import { useFeatureFlag } from "posthog-react-native";

export default function SettingsScreen() {
  const router = useRouter();
  const theme = usePaperTheme();
  const { themeMode, setThemeMode } = useThemeStore();
  const showAudioPlayer = useFeatureFlag("audio-player") ?? false;
  const {
    fontSize,
    setFontSize,
    preferredTranslation,
    setPreferredTranslation,
  } = useUserPreferencesStore();
  const {
    speed,
    pitch,
    selectedVoice,
    availableVoices,
    setSpeed,
    setPitch,
    setSelectedVoice,
  } = useAudioPlayerStore();

  const [showVoiceSheet, setShowVoiceSheet] = useState(false);

  const handleThemeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  const handleFontSizeChange = (size: number) => {
    setFontSize(size);
  };

  const handleTranslationChange = (code: string) => {
    setPreferredTranslation(code);
  };

  const handleSpeedChange = (value: string) => {
    setSpeed(parseFloat(value));
  };

  const handlePitchChange = (value: string) => {
    setPitch(parseFloat(value));
  };

  const handleVoiceChange = (voiceId: string) => {
    setSelectedVoice(voiceId === "default" ? null : voiceId);
    setShowVoiceSheet(false);
  };

  const getSelectedVoiceName = () => {
    if (!selectedVoice) return "Default";
    const voice = availableVoices.find((v) => v.identifier === selectedVoice);
    return voice ? voice.name : "Default";
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["bottom"]}
    >
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }} elevated>
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

        <Divider />

        {/* Audio Settings Section */}
        {showAudioPlayer && (
          <List.Section>
            <List.Subheader>Audio Settings</List.Subheader>

            {/* Voice Selection */}
            <List.Item
              title="Voice"
              description={getSelectedVoiceName()}
              left={(props) => <List.Icon {...props} icon="account-voice" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => setShowVoiceSheet(true)}
              style={{ backgroundColor: theme.colors.surface }}
            />

            {/* Speed Control */}
            <Text
              variant="titleSmall"
              style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
            >
              Speed
            </Text>
            <RadioButton.Group
              onValueChange={handleSpeedChange}
              value={speed.toString()}
            >
              <RadioButton.Item
                label="0.5x (Very Slow)"
                value="0.5"
                labelStyle={{ color: theme.colors.onSurface }}
              />
              <RadioButton.Item
                label="0.75x (Slow)"
                value="0.75"
                labelStyle={{ color: theme.colors.onSurface }}
              />
              <RadioButton.Item
                label="1x (Normal)"
                value="1"
                labelStyle={{ color: theme.colors.onSurface }}
              />
              <RadioButton.Item
                label="1.25x (Slightly Fast)"
                value="1.25"
                labelStyle={{ color: theme.colors.onSurface }}
              />
              <RadioButton.Item
                label="1.5x (Fast)"
                value="1.5"
                labelStyle={{ color: theme.colors.onSurface }}
              />
              <RadioButton.Item
                label="2x (Very Fast)"
                value="2"
                labelStyle={{ color: theme.colors.onSurface }}
              />
            </RadioButton.Group>

            {/* Pitch Control */}
            <Text
              variant="titleSmall"
              style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
            >
              Pitch
            </Text>
            <RadioButton.Group
              onValueChange={handlePitchChange}
              value={pitch.toString()}
            >
              <RadioButton.Item
                label="0.5 (Very Low)"
                value="0.5"
                labelStyle={{ color: theme.colors.onSurface }}
              />
              <RadioButton.Item
                label="0.75 (Low)"
                value="0.75"
                labelStyle={{ color: theme.colors.onSurface }}
              />
              <RadioButton.Item
                label="1.0 (Normal)"
                value="1"
                labelStyle={{ color: theme.colors.onSurface }}
              />
              <RadioButton.Item
                label="1.25 (Slightly High)"
                value="1.25"
                labelStyle={{ color: theme.colors.onSurface }}
              />
              <RadioButton.Item
                label="1.5 (High)"
                value="1.5"
                labelStyle={{ color: theme.colors.onSurface }}
              />
              <RadioButton.Item
                label="2.0 (Very High)"
                value="2"
                labelStyle={{ color: theme.colors.onSurface }}
              />
            </RadioButton.Group>
          </List.Section>
        )}
      </ScrollView>

      {/* Voice Selection Bottom Sheet */}
      <Modal
        visible={showVoiceSheet}
        onDismiss={() => setShowVoiceSheet(false)}
        contentContainerStyle={[
          styles.bottomSheet,
          { backgroundColor: theme.colors.surface },
        ]}
      >
        <View style={styles.bottomSheetHeader}>
          <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>
            Select Voice
          </Text>
          <IconButton
            icon="close"
            size={24}
            onPress={() => setShowVoiceSheet(false)}
          />
        </View>
        <Divider />
        <ScrollView style={styles.bottomSheetContent}>
          <RadioButton.Group
            onValueChange={handleVoiceChange}
            value={selectedVoice || "default"}
          >
            <RadioButton.Item
              label="Default"
              value="default"
              labelStyle={{ color: theme.colors.onSurface }}
            />
            {availableVoices.map((voice) => (
              <View key={voice.identifier}>
                <RadioButton.Item
                  label={voice.name}
                  value={voice.identifier}
                  labelStyle={{ color: theme.colors.onSurface }}
                />
                <Text
                  variant="bodySmall"
                  style={[
                    styles.voiceDescription,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {voice.language} • {voice.quality}
                </Text>
              </View>
            ))}
          </RadioButton.Group>
        </ScrollView>
      </Modal>
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
  voiceDescription: {
    marginLeft: 56,
    marginTop: -8,
    marginBottom: 8,
  },
  sectionTitle: {
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
  bottomSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 24,
    paddingRight: 8,
    paddingTop: 16,
    paddingBottom: 16,
  },
  bottomSheetContent: {
    maxHeight: 500,
  },
});
