import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Card, Text, useTheme as usePaperTheme, Divider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useProgressStore } from "@/store/progressStore";
import { useRouter } from "expo-router";

export default function ProgressCard() {
  const theme = usePaperTheme();
  const router = useRouter();
  const { streakData, getWeeklyStats, getTodayProgress } = useProgressStore();

  const weeklyStats = getWeeklyStats();
  const todayProgress = getTodayProgress();
  const currentStreak = streakData.current;
  const longestStreak = streakData.longest;

  const handlePress = () => {
    router.push("/progress");
  };

  return (
    <Pressable onPress={handlePress}>
      <Card
        style={[
          styles.card,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
        elevation={2}
      >
        <Card.Content>
          {/* Header */}
          <View style={styles.header}>
            <Text
              variant="titleMedium"
              style={[styles.title, { color: theme.colors.onSurface }]}
            >
              Reading Progress
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={theme.colors.onSurfaceVariant}
            />
          </View>

          {/* Streak Section */}
          <View style={styles.streakSection}>
            <View style={styles.streakContainer}>
              <MaterialCommunityIcons
                name="fire"
                size={48}
                color={currentStreak > 0 ? "#FF6B35" : theme.colors.onSurfaceVariant}
                style={styles.fireIcon}
              />
              <View>
                <Text
                  variant="displaySmall"
                  style={[
                    styles.streakNumber,
                    { color: theme.colors.onSurface },
                  ]}
                >
                  {currentStreak}
                </Text>
                <Text
                  variant="bodySmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Day{currentStreak !== 1 ? "s" : ""} Streak
                </Text>
              </View>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text
                variant="labelSmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                This Week
              </Text>
              <Text
                variant="titleLarge"
                style={[styles.statValue, { color: theme.colors.primary }]}
              >
                {weeklyStats.chaptersRead}
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                chapters
              </Text>
            </View>

            <Divider style={styles.verticalDivider} />

            <View style={styles.statItem}>
              <Text
                variant="labelSmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Best Streak
              </Text>
              <Text
                variant="titleLarge"
                style={[styles.statValue, { color: theme.colors.secondary }]}
              >
                {longestStreak}
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                days
              </Text>
            </View>

            <Divider style={styles.verticalDivider} />

            <View style={styles.statItem}>
              <Text
                variant="labelSmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                Today
              </Text>
              <Text
                variant="titleLarge"
                style={[styles.statValue, { color: theme.colors.tertiary }]}
              >
                {todayProgress?.chaptersRead || 0}
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                chapters
              </Text>
            </View>
          </View>

          {/* Encouragement Text */}
          {currentStreak === 0 && (
            <View style={styles.encouragement}>
              <Text
                variant="bodySmall"
                style={[
                  styles.encouragementText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Start your reading streak today!
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontWeight: "600",
  },
  streakSection: {
    alignItems: "center",
    paddingVertical: 8,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  fireIcon: {
    marginBottom: 8,
  },
  streakNumber: {
    fontWeight: "700",
    textAlign: "center",
  },
  divider: {
    marginVertical: 16,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontWeight: "700",
  },
  verticalDivider: {
    width: 1,
    height: 50,
  },
  encouragement: {
    marginTop: 12,
    alignItems: "center",
  },
  encouragementText: {
    fontStyle: "italic",
  },
});
