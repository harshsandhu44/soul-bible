import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Speech from "expo-speech";

export interface Voice {
  identifier: string;
  language: string;
  name: string;
  quality: string;
}

interface AudioPlayerState {
  isPlaying: boolean;
  speed: number;
  pitch: number;
  currentBook: string | null;
  currentChapter: number | null;
  selectedVoice: string | null;
  availableVoices: Voice[];

  // Actions
  setIsPlaying: (isPlaying: boolean) => void;
  setSpeed: (speed: number) => void;
  setPitch: (pitch: number) => void;
  setSelectedVoice: (voiceId: string | null) => void;
  loadAvailableVoices: () => Promise<void>;
  playChapter: (
    text: string,
    book: string,
    chapter: number,
    onDone?: () => void,
  ) => Promise<void>;
  stopPlayback: () => Promise<void>;
  resetPlayer: () => void;
}

export const useAudioPlayerStore = create<AudioPlayerState>()(
  persist(
    (set, get) => ({
      isPlaying: false,
      speed: 1.0,
      pitch: 1.0,
      currentBook: null,
      currentChapter: null,
      selectedVoice: null,
      availableVoices: [],

      setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),

      setSpeed: (speed: number) => set({ speed }),

      setPitch: (pitch: number) => set({ pitch }),

      setSelectedVoice: (voiceId: string | null) => set({ selectedVoice: voiceId }),

      loadAvailableVoices: async () => {
        try {
          const voices = await Speech.getAvailableVoicesAsync();
          set({ availableVoices: voices });
        } catch (error) {
          console.error("Error loading voices:", error);
          set({ availableVoices: [] });
        }
      },

      playChapter: async (
        text: string,
        book: string,
        chapter: number,
        onDone?: () => void,
      ) => {
        const { speed, pitch, selectedVoice } = get();

        // Stop any current playback
        await Speech.stop();

        // Set playing state
        set({ isPlaying: true, currentBook: book, currentChapter: chapter });

        // Start speaking with current settings
        Speech.speak(text, {
          rate: speed,
          pitch: pitch,
          voice: selectedVoice || undefined,
          onDone: () => {
            set({ isPlaying: false });
            onDone?.();
          },
          onStopped: () => {
            set({ isPlaying: false });
          },
          onError: (error) => {
            console.error("Speech error:", error);
            set({ isPlaying: false });
          },
        });
      },

      stopPlayback: async () => {
        await Speech.stop();
        set({ isPlaying: false });
      },

      resetPlayer: () => {
        set({
          isPlaying: false,
          currentBook: null,
          currentChapter: null,
        });
      },
    }),
    {
      name: "audio-player-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist speed, pitch, and voice preferences
      partialize: (state) => ({
        speed: state.speed,
        pitch: state.pitch,
        selectedVoice: state.selectedVoice,
      }),
    },
  ),
);
