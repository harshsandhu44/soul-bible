import React from "react";
import { View, StyleSheet } from "react-native";
import {
  Surface,
  IconButton,
  Text,
  useTheme as usePaperTheme,
} from "react-native-paper";
import { useAudioPlayerStore } from "@/store/audioPlayerStore";

interface AudioPlayerProps {
  chapterText: string;
  book: string;
  chapter: number;
}

export default function AudioPlayer({
  chapterText,
  book,
  chapter,
}: AudioPlayerProps) {
  const theme = usePaperTheme();
  const { isPlaying, playChapter, stopPlayback } = useAudioPlayerStore();

  const handlePlayPause = async () => {
    if (isPlaying) {
      await stopPlayback();
    } else {
      await playChapter(chapterText, book, chapter);
    }
  };

  const handleStop = async () => {
    await stopPlayback();
  };

  return (
    <Surface
      style={[
        styles.container,
        { backgroundColor: theme.colors.surfaceVariant },
      ]}
      elevation={1}
    >
      {/* Status Text */}
      <Text
        variant="labelSmall"
        style={[styles.statusText, { color: theme.colors.onSurfaceVariant }]}
      >
        {isPlaying ? "Playing..." : "Ready to play"}
      </Text>

      {/* Playback Controls */}
      <View style={styles.controlRow}>
        <IconButton
          icon={isPlaying ? "pause" : "play"}
          mode="contained"
          size={32}
          onPress={handlePlayPause}
          containerColor={theme.colors.primaryContainer}
          iconColor={theme.colors.onPrimaryContainer}
        />
        <IconButton
          icon="stop"
          mode="contained"
          size={28}
          onPress={handleStop}
          disabled={!isPlaying}
          containerColor={theme.colors.secondaryContainer}
          iconColor={theme.colors.onSecondaryContainer}
        />
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    gap: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  controlRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  statusText: {
    textAlign: "center",
  },
});
