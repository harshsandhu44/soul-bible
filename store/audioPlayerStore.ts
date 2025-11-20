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

// Helper to check if TTS is available
const isSpeechAvailable = async (): Promise<boolean> => {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    return voices.length > 0;
  } catch (error) {
    console.error("TTS availability check failed:", error);
    return false;
  }
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
  errorMessage: string | null;
  hasRetriedWithDefaultVoice: boolean;

  // Actions
  setIsPlaying: (isPlaying: boolean) => void;
  setSpeed: (speed: number) => void;
  setPitch: (pitch: number) => void;
  setSelectedVoice: (voiceId: string | null) => void;
  setErrorMessage: (message: string | null) => void;
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
      errorMessage: null,
      hasRetriedWithDefaultVoice: false,

      setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),

      setSpeed: (speed: number) => set({ speed }),

      setPitch: (pitch: number) => set({ pitch }),

      setSelectedVoice: (voiceId: string | null) => set({ selectedVoice: voiceId }),

      setErrorMessage: (message: string | null) => set({ errorMessage: message }),

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
        // Check if TTS is available
        const isAvailable = await isSpeechAvailable();
        if (!isAvailable) {
          set({
            errorMessage: "Text-to-speech is not available on this device. Please ensure your device has TTS enabled.",
            isPlaying: false,
          });
          console.error("TTS not available");
          return;
        }

        const state = get();
        const { speed, pitch, selectedVoice, availableVoices } = state;

        // Validate selected voice exists
        let voiceToUse: string | undefined = undefined;
        if (selectedVoice) {
          const voiceExists = availableVoices.some((v) => v.identifier === selectedVoice);
          if (voiceExists) {
            voiceToUse = selectedVoice;
            console.log(`Using selected voice: ${selectedVoice}`);
          } else {
            console.warn(`Selected voice ${selectedVoice} not found, using system default`);
            voiceToUse = undefined;
          }
        }

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
          errorMessage: null,
          hasRetriedWithDefaultVoice: false,
        });

        // Function to play a single chunk
        const playChunk = (chunkIndex: number, useDefaultVoice: boolean = false) => {
          const currentState = get();
          if (!currentState.isPlaying || chunkIndex >= currentState.currentChunks.length) {
            // Playback was stopped or all chunks are done
            set({ isPlaying: false, currentChunks: [], currentChunkIndex: 0, hasRetriedWithDefaultVoice: false });
            onDone?.();
            return;
          }

          const chunk = currentState.currentChunks[chunkIndex];
          const voiceOption = useDefaultVoice ? undefined : voiceToUse;
          console.log(`Playing chunk ${chunkIndex + 1}/${currentState.currentChunks.length}${useDefaultVoice ? " (with default voice)" : ""}`);

          Speech.speak(chunk, {
            rate: currentState.speed,
            pitch: currentState.pitch,
            voice: voiceOption,
            onDone: () => {
              const nextIndex = chunkIndex + 1;
              if (nextIndex < currentState.currentChunks.length) {
                // Play next chunk
                set({ currentChunkIndex: nextIndex });
                playChunk(nextIndex, useDefaultVoice);
              } else {
                // All chunks completed
                set({ isPlaying: false, currentChunks: [], currentChunkIndex: 0, hasRetriedWithDefaultVoice: false });
                onDone?.();
              }
            },
            onStopped: () => {
              set({ isPlaying: false, currentChunks: [], currentChunkIndex: 0, hasRetriedWithDefaultVoice: false });
            },
            onError: (error) => {
              console.error(`Speech error on chunk ${chunkIndex + 1}:`, error, `Voice: ${voiceOption || "default"}`);

              // Retry with default voice if this is first error and we were using a custom voice
              if (!useDefaultVoice && voiceToUse && !currentState.hasRetriedWithDefaultVoice) {
                console.log("Retrying with system default voice...");
                set({ hasRetriedWithDefaultVoice: true });
                playChunk(chunkIndex, true);
              } else {
                // Give up on this chunk, try next one or stop
                const nextIndex = chunkIndex + 1;
                if (nextIndex < currentState.currentChunks.length) {
                  console.log("Moving to next chunk...");
                  set({ currentChunkIndex: nextIndex });
                  playChunk(nextIndex, useDefaultVoice);
                } else {
                  set({
                    isPlaying: false,
                    currentChunks: [],
                    currentChunkIndex: 0,
                    hasRetriedWithDefaultVoice: false,
                    errorMessage: "Audio playback encountered an error. Try selecting a different voice in settings.",
                  });
                }
              }
            },
          });
        };

        // Start playing from first chunk
        playChunk(0);
      },

      stopPlayback: async () => {
        await Speech.stop();
        set({ isPlaying: false, currentChunks: [], currentChunkIndex: 0, hasRetriedWithDefaultVoice: false });
      },

      resetPlayer: () => {
        set({
          isPlaying: false,
          currentBook: null,
          currentChapter: null,
          currentChunks: [],
          currentChunkIndex: 0,
          errorMessage: null,
          hasRetriedWithDefaultVoice: false,
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
