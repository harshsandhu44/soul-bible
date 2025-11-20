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

// Helper function to split text into chunks at sentence boundaries
const splitTextIntoChunks = (text: string, maxLength: number = 3900): string[] => {
  if (text.length <= maxLength) {
    return [text];
  }

  const chunks: string[] = [];
  let remainingText = text;

  while (remainingText.length > 0) {
    if (remainingText.length <= maxLength) {
      chunks.push(remainingText);
      break;
    }

    // Try to find a sentence boundary within the max length
    let splitIndex = maxLength;
    const sentenceEndings = [". ", "! ", "? "];

    // Look for the last sentence ending before maxLength
    let lastSentenceEnd = -1;
    for (const ending of sentenceEndings) {
      const index = remainingText.lastIndexOf(ending, maxLength);
      if (index > lastSentenceEnd) {
        lastSentenceEnd = index + ending.length;
      }
    }

    if (lastSentenceEnd > 0) {
      splitIndex = lastSentenceEnd;
    } else {
      // No sentence boundary found, try to split at last space
      const lastSpace = remainingText.lastIndexOf(" ", maxLength);
      if (lastSpace > 0) {
        splitIndex = lastSpace + 1;
      }
    }

    chunks.push(remainingText.substring(0, splitIndex).trim());
    remainingText = remainingText.substring(splitIndex).trim();
  }

  return chunks;
};

interface AudioPlayerState {
  isPlaying: boolean;
  speed: number;
  pitch: number;
  currentBook: string | null;
  currentChapter: number | null;
  selectedVoice: string | null;
  availableVoices: Voice[];
  currentChunks: string[];
  currentChunkIndex: number;

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
      currentChunks: [],
      currentChunkIndex: 0,

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

        // Split text into chunks
        const chunks = splitTextIntoChunks(text);
        console.log(`Split chapter into ${chunks.length} chunks`);

        // Set playing state
        set({
          isPlaying: true,
          currentBook: book,
          currentChapter: chapter,
          currentChunks: chunks,
          currentChunkIndex: 0,
        });

        // Function to play a single chunk
        const playChunk = (chunkIndex: number) => {
          const state = get();
          if (!state.isPlaying || chunkIndex >= state.currentChunks.length) {
            // Playback was stopped or all chunks are done
            set({ isPlaying: false, currentChunks: [], currentChunkIndex: 0 });
            onDone?.();
            return;
          }

          const chunk = state.currentChunks[chunkIndex];
          console.log(`Playing chunk ${chunkIndex + 1}/${state.currentChunks.length}`);

          Speech.speak(chunk, {
            rate: state.speed,
            pitch: state.pitch,
            voice: state.selectedVoice || undefined,
            onDone: () => {
              const nextIndex = chunkIndex + 1;
              if (nextIndex < state.currentChunks.length) {
                // Play next chunk
                set({ currentChunkIndex: nextIndex });
                playChunk(nextIndex);
              } else {
                // All chunks completed
                set({ isPlaying: false, currentChunks: [], currentChunkIndex: 0 });
                onDone?.();
              }
            },
            onStopped: () => {
              set({ isPlaying: false, currentChunks: [], currentChunkIndex: 0 });
            },
            onError: (error) => {
              console.error("Speech error:", error);
              set({ isPlaying: false, currentChunks: [], currentChunkIndex: 0 });
            },
          });
        };

        // Start playing from first chunk
        playChunk(0);
      },

      stopPlayback: async () => {
        await Speech.stop();
        set({ isPlaying: false, currentChunks: [], currentChunkIndex: 0 });
      },

      resetPlayer: () => {
        set({
          isPlaying: false,
          currentBook: null,
          currentChapter: null,
          currentChunks: [],
          currentChunkIndex: 0,
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
