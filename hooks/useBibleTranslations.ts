import { useFeatureFlagWithPayload } from "posthog-react-native";
import {
  BIBLE_TRANSLATIONS,
  BibleTranslation,
} from "@/constants/translations";

/**
 * Hook to get Bible translations from PostHog feature flag with fallback to local constants
 * Feature flag: "bible-translations"
 * Returns array of BibleTranslation objects
 */
export const useBibleTranslations = (): BibleTranslation[] => {
  const flagPayload = useFeatureFlagWithPayload("bible-translations");

  console.info("[TRANSLATIONS]", flagPayload)

  // If feature flag has a payload, try to use it
  if (flagPayload) {
    try {
      const translations = (flagPayload as any[])[1];

      // Validate that it's an array
      if (Array.isArray(translations)) {
        // Validate each item has required fields
        const isValid = translations.every(
          (t) =>
            typeof t === "object" &&
            t !== null &&
            "code" in t &&
            "name" in t &&
            "description" in t &&
            typeof t.code === "string" &&
            typeof t.name === "string" &&
            typeof t.description === "string"
        );

        if (isValid) {
          return translations as BibleTranslation[];
        }
      }
    } catch (error) {
      console.warn("Failed to parse bible-translations feature flag:", error);
    }
  }

  // Fall back to local constants
  return BIBLE_TRANSLATIONS;
};
