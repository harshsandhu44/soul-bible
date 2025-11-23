import React, { useState, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { Text, useTheme as usePaperTheme, Portal, Modal, Button } from "react-native-paper";
import { DailyProgress } from "@/store/progressStore";

interface ReadingCalendarProps {
  dailyProgress: DailyProgress[];
}

export default function ReadingCalendar({ dailyProgress }: ReadingCalendarProps) {
  const theme = usePaperTheme();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Get intensity color based on chapters read
  const getIntensityColor = (chaptersRead: number): string => {
    if (chaptersRead === 0) return theme.colors.surface;
    if (chaptersRead <= 2) return theme.colors.primaryContainer;
    if (chaptersRead <= 4) return theme.colors.primary;
    // For 5+ chapters, use a darker shade
    return theme.dark ? "#005CAA" : "#0046AA"; // Darker primary for high activity
  };

  // Transform dailyProgress into calendar marking format
  const markedDates = useMemo(() => {
    const marks: { [key: string]: any } = {};

    dailyProgress.forEach((progress) => {
      marks[progress.date] = {
        customStyles: {
          container: {
            backgroundColor: getIntensityColor(progress.chaptersRead),
            borderRadius: 8,
          },
          text: {
            color:
              progress.chaptersRead > 0
                ? theme.colors.onPrimary
                : theme.colors.onSurface,
            fontWeight: progress.chaptersRead > 0 ? "600" : "normal",
          },
        },
      };
    });

    // Mark today
    const today = new Date().toISOString().split("T")[0];
    if (!marks[today]) {
      marks[today] = {
        customStyles: {
          container: {
            borderWidth: 2,
            borderColor: theme.colors.primary,
            borderRadius: 8,
          },
          text: {
            color: theme.colors.onSurface,
          },
        },
      };
    } else {
      // Add border to today if it has data
      marks[today].customStyles.container.borderWidth = 2;
      marks[today].customStyles.container.borderColor = theme.colors.secondary;
    }

    return marks;
  }, [dailyProgress, theme]);

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  const getSelectedDayData = () => {
    if (!selectedDate) return null;
    return dailyProgress.find((p) => p.date === selectedDate);
  };

  const selectedDayData = getSelectedDayData();

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <Calendar
        markingType="custom"
        markedDates={markedDates}
        onDayPress={handleDayPress}
        theme={{
          backgroundColor: theme.colors.surface,
          calendarBackground: theme.colors.surface,
          textSectionTitleColor: theme.colors.onSurfaceVariant,
          selectedDayBackgroundColor: theme.colors.primary,
          selectedDayTextColor: theme.colors.onPrimary,
          todayTextColor: theme.colors.primary,
          dayTextColor: theme.colors.onSurface,
          textDisabledColor: theme.colors.onSurfaceVariant,
          dotColor: theme.colors.primary,
          selectedDotColor: theme.colors.onPrimary,
          arrowColor: theme.colors.primary,
          monthTextColor: theme.colors.onSurface,
          indicatorColor: theme.colors.primary,
          textDayFontWeight: "400",
          textMonthFontWeight: "600",
          textDayHeaderFontWeight: "600",
          textDayFontSize: 14,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 12,
        }}
        style={{
          borderRadius: 12,
          padding: 8,
        }}
      />

      {/* Legend */}
      <View style={styles.legend}>
        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
          Activity:
        </Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendBox,
                { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.outline },
              ]}
            />
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
              None
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendBox,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
            />
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
              1-2
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendBox,
                { backgroundColor: theme.colors.primary },
              ]}
            />
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
              3-4
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendBox,
                { backgroundColor: theme.dark ? "#005CAA" : "#0046AA" },
              ]}
            />
            <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
              5+
            </Text>
          </View>
        </View>
      </View>

      {/* Day Details Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={[
            styles.modalContent,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          {selectedDate && (
            <>
              <Text
                variant="titleLarge"
                style={[styles.modalTitle, { color: theme.colors.onSurface }]}
              >
                {formatDate(selectedDate)}
              </Text>

              {selectedDayData ? (
                <View style={styles.modalStats}>
                  <View style={styles.modalStat}>
                    <Text
                      variant="displaySmall"
                      style={[
                        styles.modalStatNumber,
                        { color: theme.colors.primary },
                      ]}
                    >
                      {selectedDayData.chaptersRead}
                    </Text>
                    <Text
                      variant="bodyMedium"
                      style={{ color: theme.colors.onSurfaceVariant }}
                    >
                      Chapter{selectedDayData.chaptersRead !== 1 ? "s" : ""} Read
                    </Text>
                  </View>

                  <View style={styles.modalStat}>
                    <Text
                      variant="displaySmall"
                      style={[
                        styles.modalStatNumber,
                        { color: theme.colors.secondary },
                      ]}
                    >
                      {selectedDayData.versesRead}
                    </Text>
                    <Text
                      variant="bodyMedium"
                      style={{ color: theme.colors.onSurfaceVariant }}
                    >
                      Verse{selectedDayData.versesRead !== 1 ? "s" : ""} Read
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.modalEmpty}>
                  <Text
                    variant="bodyLarge"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    No reading activity on this day
                  </Text>
                </View>
              )}

              <Button
                mode="contained"
                onPress={() => setModalVisible(false)}
                style={styles.modalButton}
              >
                Close
              </Button>
            </>
          )}
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  legend: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    gap: 12,
  },
  legendItems: {
    flexDirection: "row",
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  modalContent: {
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 16,
  },
  modalTitle: {
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  modalStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  modalStat: {
    alignItems: "center",
    gap: 8,
  },
  modalStatNumber: {
    fontWeight: "700",
  },
  modalEmpty: {
    alignItems: "center",
    paddingVertical: 24,
  },
  modalButton: {
    marginTop: 8,
  },
});
