import { Pressable, View, StyleSheet } from "react-native";
import {
  Text,
  IconButton,
  Chip,
  useTheme as usePaperTheme,
} from "react-native-paper";

export interface BookmarkListItemProps {
  bookName: string;
  chapter: number;
  verse?: number;
  isRead: boolean;
  timestamp: number;
  onPress: () => void;
  onRemove: () => void;
}

// Format timestamp as relative time
function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (weeks < 4) return `${weeks}w ago`;
  return `${months}mo ago`;
}

export function BookmarkListItem({
  bookName,
  chapter,
  verse,
  isRead,
  timestamp,
  onPress,
  onRemove,
}: BookmarkListItemProps) {
  const theme = usePaperTheme();

  const displayText = verse ? `${bookName} ${chapter}:${verse}` : `${bookName} ${chapter}`;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: theme.colors.surfaceVariant,
          elevation: pressed ? 2 : 1,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <Text
            variant="titleMedium"
            style={[styles.title, { color: theme.colors.onSurface }]}
          >
            {displayText}
          </Text>
          <Text
            variant="bodySmall"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            {formatRelativeTime(timestamp)}
          </Text>
        </View>

        <View style={styles.rightSection}>
          <Chip
            compact
            style={[
              styles.statusChip,
              {
                backgroundColor: isRead
                  ? theme.colors.secondaryContainer
                  : theme.colors.surface,
              },
            ]}
            textStyle={{
              color: isRead
                ? theme.colors.onSecondaryContainer
                : theme.colors.onSurface,
              fontSize: 12,
            }}
          >
            {isRead ? "Read" : "Unread"}
          </Chip>
          <IconButton
            icon="bookmark-remove"
            size={20}
            iconColor={theme.colors.error}
            onPress={onRemove}
            style={styles.removeButton}
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 6,
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 1.5,
    // Android elevation (dynamic in Pressable)
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  leftSection: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontWeight: "600",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusChip: {
    height: 28,
  },
  removeButton: {
    margin: 0,
  },
});
