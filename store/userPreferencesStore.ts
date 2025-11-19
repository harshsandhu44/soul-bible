import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  HAS_COMPLETED_ONBOARDING: "hasCompletedOnboarding",
  PREFERRED_TRANSLATION: "preferredTranslation",
  FONT_SIZE: "fontSize",
};

type UserPreferencesStore = {
  hasCompletedOnboarding: boolean;
  preferredTranslation: string;
  fontSize: number;
  isLoading: boolean;
  setOnboardingComplete: () => void;
  setPreferredTranslation: (translation: string) => void;
  setFontSize: (size: number) => void;
  loadPreferences: () => Promise<void>;
};

export const useUserPreferencesStore = create<UserPreferencesStore>(
  (set) => ({
    hasCompletedOnboarding: false,
    preferredTranslation: "kjv",
    fontSize: 18,
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

    loadPreferences: async () => {
      try {
        const [onboardingStatus, translation, fontSize] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING),
          AsyncStorage.getItem(STORAGE_KEYS.PREFERRED_TRANSLATION),
          AsyncStorage.getItem(STORAGE_KEYS.FONT_SIZE),
        ]);

        set({
          hasCompletedOnboarding: onboardingStatus === "true",
          preferredTranslation: translation || "kjv",
          fontSize: fontSize ? parseInt(fontSize, 10) : 18,
          isLoading: false,
        });
      } catch (error) {
        console.error("Error loading preferences:", error);
        set({ isLoading: false });
      }
    },
  })
);
