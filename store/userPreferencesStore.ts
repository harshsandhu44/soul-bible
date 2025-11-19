import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  HAS_COMPLETED_ONBOARDING: "hasCompletedOnboarding",
  PREFERRED_TRANSLATION: "preferredTranslation",
};

type UserPreferencesStore = {
  hasCompletedOnboarding: boolean;
  preferredTranslation: string;
  isLoading: boolean;
  setOnboardingComplete: () => void;
  setPreferredTranslation: (translation: string) => void;
  loadPreferences: () => Promise<void>;
};

export const useUserPreferencesStore = create<UserPreferencesStore>(
  (set) => ({
    hasCompletedOnboarding: false,
    preferredTranslation: "kjv",
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

    loadPreferences: async () => {
      try {
        const [onboardingStatus, translation] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.HAS_COMPLETED_ONBOARDING),
          AsyncStorage.getItem(STORAGE_KEYS.PREFERRED_TRANSLATION),
        ]);

        set({
          hasCompletedOnboarding: onboardingStatus === "true",
          preferredTranslation: translation || "kjv",
          isLoading: false,
        });
      } catch (error) {
        console.error("Error loading preferences:", error);
        set({ isLoading: false });
      }
    },
  })
);
