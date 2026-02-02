
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PlayerState {
  currentMedia: string | null;
  setCurrentMedia: (path: string | null) => void;
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  stop: () => void;
  currentTime: number;
  duration: number;
  seek: (time: number) => void;
  setDuration: (duration: number) => void;
  volume: number;
  setVolume: (volume: number) => void;
  muted: boolean;
  toggleMute: () => void;
  playbackRate: number;
  setPlaybackRate: (rate: number) => void;
  loop: boolean;
  toggleLoop: () => void;
  shuffle: boolean;
  toggleShuffle: () => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      currentMedia: null,
      setCurrentMedia: (path) => set({ currentMedia: path }),
      isPlaying: false,
      play: () => set({ isPlaying: true }),
      pause: () => set({ isPlaying: false }),
      stop: () => set({ isPlaying: false, currentTime: 0 }),
      currentTime: 0,
      duration: 0,
      seek: (time) => set({ currentTime: time }),
      setDuration: (duration) => set({ duration }),
      volume: 0.8,
      setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
      muted: false,
      toggleMute: () => set((state) => ({ muted: !state.muted })),
      playbackRate: 1,
      setPlaybackRate: (rate) => set({ playbackRate: Math.max(0.25, Math.min(4, rate)) }),
      loop: false,
      toggleLoop: () => set((state) => ({ loop: !state.loop })),
      shuffle: false,
      toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
    }),
    {
      name: 'knoux-player-store',
      partialize: (state) => ({
        volume: state.volume,
        muted: state.muted,
        loop: state.loop,
        shuffle: state.shuffle,
      }),
    }
  )
);
