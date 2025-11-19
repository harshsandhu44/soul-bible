import { Pressable, View, StyleSheet } from "react-native";
import {
  Text,
  IconButton,
  useTheme as usePaperTheme,
} from "react-native-paper";

export interface ChapterCardProps {
  chapter: number;
  isRead: boolean;
  isBookmarked: boolean;
  onPress: () => void;
}

export function ChapterCard({
  chapter,
  isRead,
  isBookmarked,
  onPress,
}: ChapterCardProps) {
  const theme = usePaperTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: isRead
            ? theme.colors.secondaryContainer
            : theme.colors.surfaceVariant,
          elevation: pressed ? 3 : 1,
        },
      ]}
    >
      <View style={styles.content}>
        <Text
          variant="titleLarge"
          style={[
            styles.chapterNumber,
            {
              color: isRead
                ? theme.colors.onSecondaryContainer
                : theme.colors.onSurface,
            },
          ]}
        >
          {chapter}
        </Text>
        {isBookmarked && (
          <IconButton
            icon="bookmark"
            size={16}
            iconColor={theme.colors.primary}
            style={styles.bookmarkIcon}
          />
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "23%",
    aspectRatio: 1,
    margin: "1%",
    minHeight: 80,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    // Android elevation (dynamic in Pressable)
  },
  content: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  chapterNumber: {
    fontWeight: "600",
    fontSize: 28,
    lineHeight: 32,
  },
  bookmarkIcon: {
    position: "absolute",
    top: 0,
    right: 0,
    margin: 0,
  },
});
