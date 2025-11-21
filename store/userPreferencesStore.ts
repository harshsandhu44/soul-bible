import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  HAS_COMPLETED_ONBOARDING: "hasCompletedOnboarding",
  PREFERRED_TRANSLATION: "preferredTranslation",
  FONT_SIZE: "fontSize",
  FONT_FAMILY: "fontFamily",
  LINE_SPACING: "lineSpacing",
};

export type FontFamily = "system" | "serif" | "sans-serif";
export type LineSpacing = 1.5 | 1.78 | 2.0;

type UserPreferencesStore = {
  hasCompletedOnboarding: boolean;
  preferredTranslation: string;
  fontSize: number;
  fontFamily: FontFamily;
  lineSpacing: LineSpacing;
  isLoading: boolean;
  setOnboardingComplete: () => void;
  setPreferredTranslation: (translation: string) => void;
  setFontSize: (size: number) => void;
  setFontFamily: (family: FontFamily) => void;
  setLineSpacing: (spacing: LineSpacing) => void;
  loadPreferences: () => Promise<void>;
};

export const useUserPreferencesStore = create<UserPreferencesStore>(
  (set) => ({
    hasCompletedOnboarding: false,
    preferredTranslation: "kjv",
    fontSize: 18,
    fontFamily: "system",
    lineSpacing: 1.78,
    isLoading: true,

    setOnboardingComplete: async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEYS.HAS_COMPLETED_ONBOARDING,
          "true"
        );
        set({ hasCompletedOnboarding: true });
      } catch (error) {
        console.error("Error saving onboarding status:", error);
      }
    },

    setPreferredTranslation: async (translation: string) => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEYS.PREFERRED_TRANSLATION,
          translation
        );
        set({ preferredTranslation: translation });
      } catch (error) {
        console.error("Error saving translation preference:", error);
      }
    },

    setFontSize: async (size: number) => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.FONT_SIZE, size.toString());
        set({ fontSize: size });
      } catch (error) {
        console.error("Error saving font size:", error);
      }
    },

    setFontFamily: async (family: FontFamily) => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.FONT_FAMILY, family);
        set({ fontFamily: family });
      } catch (error) {
        console.error("Error saving font family:", error);
      }
    },

    setLineSpacing: async (spacing: LineSpacing) => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEYS.LINE_SPACING,
          spacing.toString()
        );
        set({ lineSpacing: spacing });
      } catch (error) {
        console.error("Error saving line spacing:", error);
      }
    },

    loadPreferences: async () => {
      try {
        const [onboardingStatus, translation, fontSize, fontFamily, lineSpacing] =
          await Promise.all([
            AsyncStorage.getItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING),
            AsyncStorage.getItem(STORAGE_KEYS.PREFERRED_TRANSLATION),
            AsyncStorage.getItem(STORAGE_KEYS.FONT_SIZE),
            AsyncStorage.getItem(STORAGE_KEYS.FONT_FAMILY),
            AsyncStorage.getItem(STORAGE_KEYS.LINE_SPACING),
          ]);

        set({
          hasCompletedOnboarding: onboardingStatus === "true",
          preferredTranslation: translation || "kjv",
          fontSize: fontSize ? parseInt(fontSize, 10) : 18,
          fontFamily: (fontFamily as FontFamily) || "system",
          lineSpacing: lineSpacing ? (parseFloat(lineSpacing) as LineSpacing) : 1.78,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error loading preferences:", error);
        set({ isLoading: false });
      }
    },
  })
);
