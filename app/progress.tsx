import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  Card,
  useTheme as usePaperTheme,
  Divider,
  IconButton,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useProgressStore } from "@/store/progressStore";
import { useRouter } from "expo-router";

// Format relative time
const formatRelativeTime = (dateStr: string): string => {
  const date = new Date(dateStr + "T00:00:00");
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
};

// Format date nicely
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function ProgressScreen() {
  const theme = usePaperTheme();
  const router = useRouter();
  const { dailyProgress, streakData, getWeeklyStats, getMonthlyStats } =
    useProgressStore();

  // Calculate lifetime stats
  const lifetimeChapters = dailyProgress.reduce(
    (sum, p) => sum + p.chaptersRead,
    0
  );
  const lifetimeVerses = dailyProgress.reduce(
    (sum, p) => sum + p.versesRead,
    0
  );
  const daysActive = dailyProgress.length;

  const weeklyStats = getWeeklyStats();
  const monthlyStats = getMonthlyStats();

  // Get last 7 days for breakdown
  const getLast7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const progressData = dailyProgress.find((p) => p.date === dateStr);
      days.push({
        date: dateStr,
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
        chaptersRead: progressData?.chaptersRead || 0,
      });
    }
    return days;
  };

  const last7Days = getLast7Days();

  // Get recent activity (last 10 days with reading)
  const recentActivity = [...dailyProgress]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);

  // Calculate daily average for current month
  const currentMonthDays = dailyProgress.filter((p) => {
    const month = new Date(p.date).getMonth();
    const currentMonth = new Date().getMonth();
    return month === currentMonth;
  }).length;
  const monthlyAverage =
    currentMonthDays > 0
      ? (monthlyStats.chaptersRead / currentMonthDays).toFixed(1)
      : "0";

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => router.back()}
        />
        <Text
          variant="headlineSmall"
          style={[styles.headerTitle, { color: theme.colors.onSurface }]}
        >
          Reading Progress
        </Text>
        <View style={{ width: 48 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Lifetime Stats Card */}
        <Card
          style={[
            styles.card,
            { backgroundColor: theme.colors.primaryContainer },
          ]}
          elevation={2}
        >
          <Card.Content>
            <Text
              variant="titleMedium"
              style={[
                styles.cardTitle,
                { color: theme.colors.onPrimaryContainer },
              ]}
            >
              Lifetime Stats
            </Text>
            <View style={styles.lifetimeStatsRow}>
              <View style={styles.lifetimeStat}>
                <Text
                  variant="displaySmall"
                  style={[
                    styles.lifetimeNumber,
                    { color: theme.colors.onPrimaryContainer },
                  ]}
                >
                  {lifetimeChapters}
                </Text>
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.onPrimaryContainer }}
                >
                  Chapters
                </Text>
              </View>
              <View style={styles.lifetimeStat}>
                <Text
                  variant="displaySmall"
                  style={[
                    styles.lifetimeNumber,
                    { color: theme.colors.onPrimaryContainer },
                  ]}
                >
                  {lifetimeVerses}
                </Text>
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.onPrimaryContainer }}
                >
                  Verses
                </Text>
              </View>
              <View style={styles.lifetimeStat}>
                <Text
                  variant="displaySmall"
                  style={[
                    styles.lifetimeNumber,
                    { color: theme.colors.onPrimaryContainer },
                  ]}
                >
                  {daysActive}
                </Text>
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.onPrimaryContainer }}
                >
                  Days Active
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Current Streak Card */}
        <Card
          style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}
          elevation={2}
        >
          <Card.Content>
            <View style={styles.streakHeader}>
              <MaterialCommunityIcons
                name="fire"
                size={32}
                color={
                  streakData.current > 0 ? "#FF6B35" : theme.colors.onSurfaceVariant
                }
              />
              <Text
                variant="titleLarge"
                style={[styles.cardTitle, { color: theme.colors.onSurface }]}
              >
                Current Streak
              </Text>
            </View>
            <View style={styles.streakContent}>
              <Text
                variant="displayLarge"
                style={[styles.streakNumber, { color: theme.colors.primary }]}
              >
                {streakData.current}
              </Text>
              <Text
                variant="titleMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                consecutive day{streakData.current !== 1 ? "s" : ""}
              </Text>
            </View>
            {streakData.lastReadDate && (
              <Text
                variant="bodySmall"
                style={[
                  styles.lastReadText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Last read: {formatRelativeTime(streakData.lastReadDate)}
              </Text>
            )}
            {streakData.current === 0 && daysActive > 0 && (
              <Text
                variant="bodyMedium"
                style={[
                  styles.motivationText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Read today to start a new streak! 📖
              </Text>
            )}
            {streakData.current > 0 && (
              <Text
                variant="bodyMedium"
                style={[
                  styles.motivationText,
                  { color: theme.colors.primary },
                ]}
              >
                Keep it up! Don't break the chain! 🔥
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Best Streak Card */}
        <Card
          style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}
          elevation={2}
        >
          <Card.Content>
            <View style={styles.streakHeader}>
              <MaterialCommunityIcons
                name="trophy"
                size={32}
                color={theme.colors.secondary}
              />
              <Text
                variant="titleLarge"
                style={[styles.cardTitle, { color: theme.colors.onSurface }]}
              >
                Best Streak
              </Text>
            </View>
            <View style={styles.streakContent}>
              <Text
                variant="displayLarge"
                style={[styles.streakNumber, { color: theme.colors.secondary }]}
              >
                {streakData.longest}
              </Text>
              <Text
                variant="titleMedium"
                style={{ color: theme.colors.onSurfaceVariant }}
              >
                day{streakData.longest !== 1 ? "s" : ""} (all-time best)
              </Text>
            </View>
            {streakData.current === streakData.longest &&
              streakData.current > 0 && (
                <Text
                  variant="bodyMedium"
                  style={[
                    styles.motivationText,
                    { color: theme.colors.secondary },
                  ]}
                >
                  You're at your personal best! 🏆
                </Text>
              )}
          </Card.Content>
        </Card>

        {/* Weekly Breakdown */}
        <Card
          style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}
          elevation={2}
        >
          <Card.Content>
            <Text
              variant="titleLarge"
              style={[styles.cardTitle, { color: theme.colors.onSurface }]}
            >
              Last 7 Days
            </Text>
            <View style={styles.weeklyBreakdown}>
              {last7Days.map((day) => (
                <View key={day.date} style={styles.dayRow}>
                  <Text
                    variant="bodyMedium"
                    style={[
                      styles.dayName,
                      { color: theme.colors.onSurfaceVariant },
                    ]}
                  >
                    {day.dayName}
                  </Text>
                  <View
                    style={[
                      styles.barContainer,
                      { backgroundColor: theme.colors.surface },
                    ]}
                  >
                    <View
                      style={[
                        styles.bar,
                        {
                          width: `${Math.min((day.chaptersRead / 5) * 100, 100)}%`,
                          backgroundColor:
                            day.chaptersRead > 0
                              ? theme.colors.primary
                              : "transparent",
                        },
                      ]}
                    />
                  </View>
                  <Text
                    variant="bodyMedium"
                    style={[
                      styles.chaptersCount,
                      { color: theme.colors.onSurface },
                    ]}
                  >
                    {day.chaptersRead}
                  </Text>
                </View>
              ))}
            </View>
            <Divider style={styles.sectionDivider} />
            <View style={styles.totalRow}>
              <Text
                variant="titleMedium"
                style={{ color: theme.colors.onSurface }}
              >
                Total this week:
              </Text>
              <Text
                variant="titleMedium"
                style={[styles.totalValue, { color: theme.colors.primary }]}
              >
                {weeklyStats.chaptersRead} chapters
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Monthly Summary */}
        <Card
          style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}
          elevation={2}
        >
          <Card.Content>
            <Text
              variant="titleLarge"
              style={[styles.cardTitle, { color: theme.colors.onSurface }]}
            >
              This Month
            </Text>
            <View style={styles.monthlyStats}>
              <View style={styles.monthlyStat}>
                <Text
                  variant="displaySmall"
                  style={[
                    styles.monthlyNumber,
                    { color: theme.colors.primary },
                  ]}
                >
                  {monthlyStats.chaptersRead}
                </Text>
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Total Chapters
                </Text>
              </View>
              <View style={styles.monthlyStat}>
                <Text
                  variant="displaySmall"
                  style={[
                    styles.monthlyNumber,
                    { color: theme.colors.secondary },
                  ]}
                >
                  {monthlyAverage}
                </Text>
                <Text
                  variant="bodyMedium"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Daily Average
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <Card
            style={[
              styles.card,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
            elevation={2}
          >
            <Card.Content>
              <Text
                variant="titleLarge"
                style={[styles.cardTitle, { color: theme.colors.onSurface }]}
              >
                Recent Activity
              </Text>
              {recentActivity.map((activity, index) => (
                <View key={activity.date}>
                  <View style={styles.activityRow}>
                    <View style={styles.activityLeft}>
                      <MaterialCommunityIcons
                        name="book-open-page-variant"
                        size={24}
                        color={theme.colors.primary}
                      />
                      <View style={styles.activityText}>
                        <Text
                          variant="bodyLarge"
                          style={{ color: theme.colors.onSurface }}
                        >
                          {activity.chaptersRead} chapter
                          {activity.chaptersRead !== 1 ? "s" : ""}
                        </Text>
                        <Text
                          variant="bodySmall"
                          style={{ color: theme.colors.onSurfaceVariant }}
                        >
                          {formatDate(activity.date)} •{" "}
                          {formatRelativeTime(activity.date)}
                        </Text>
                      </View>
                    </View>
                    <Text
                      variant="bodyMedium"
                      style={{ color: theme.colors.onSurfaceVariant }}
                    >
                      {activity.versesRead} verses
                    </Text>
                  </View>
                  {index < recentActivity.length - 1 && (
                    <Divider style={styles.activityDivider} />
                  )}
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Empty State */}
        {daysActive === 0 && (
          <Card
            style={[
              styles.card,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
            elevation={2}
          >
            <Card.Content style={styles.emptyState}>
              <MaterialCommunityIcons
                name="book-open-blank-variant"
                size={64}
                color={theme.colors.onSurfaceVariant}
              />
              <Text
                variant="headlineSmall"
                style={[
                  styles.emptyTitle,
                  { color: theme.colors.onSurface },
                ]}
              >
                Start Your Journey
              </Text>
              <Text
                variant="bodyMedium"
                style={[
                  styles.emptyMessage,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Begin reading to track your progress and build your streak!
              </Text>
            </Card.Content>
          </Card>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontWeight: "600",
  },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
  },
  cardTitle: {
    fontWeight: "600",
    marginBottom: 16,
  },
  lifetimeStatsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  lifetimeStat: {
    alignItems: "center",
    gap: 4,
  },
  lifetimeNumber: {
    fontWeight: "700",
  },
  streakHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  streakContent: {
    alignItems: "center",
    paddingVertical: 16,
  },
  streakNumber: {
    fontWeight: "700",
    marginBottom: 8,
  },
  lastReadText: {
    textAlign: "center",
    marginTop: 8,
  },
  motivationText: {
    textAlign: "center",
    marginTop: 12,
    fontWeight: "500",
  },
  weeklyBreakdown: {
    gap: 12,
  },
  dayRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dayName: {
    width: 40,
    fontWeight: "500",
  },
  barContainer: {
    flex: 1,
    height: 24,
    borderRadius: 4,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: 4,
  },
  chaptersCount: {
    width: 30,
    textAlign: "right",
    fontWeight: "600",
  },
  sectionDivider: {
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalValue: {
    fontWeight: "700",
  },
  monthlyStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
  },
  monthlyStat: {
    alignItems: "center",
    gap: 8,
  },
  monthlyNumber: {
    fontWeight: "700",
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  activityLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  activityText: {
    gap: 4,
  },
  activityDivider: {
    marginVertical: 4,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 16,
  },
  emptyTitle: {
    fontWeight: "600",
  },
  emptyMessage: {
    textAlign: "center",
    maxWidth: 300,
  },
  bottomPadding: {
    height: 32,
  },
});
