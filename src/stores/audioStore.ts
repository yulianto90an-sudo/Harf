import { create } from 'zustand';
import { logAudioPlay } from '@/services/supabase/queries';

interface AudioState {
  isPlaying: boolean;
  currentWordId: string | null;
  queue: string[];
  volume: number;
  speed: 'normal' | 'slow' | 'very_slow';
  isMuted: boolean;
}

interface AudioActions {
  play: (wordId: string, arabicText?: string) => Promise<void>;
  stop: () => void;
  setSpeed: (speed: AudioState['speed']) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  playSFX: (type: 'correct' | 'incorrect' | 'combo' | 'levelup' | 'tap' | 'battle_hit') => void;
}

type AudioStore = AudioState & AudioActions;

export const useAudioStore = create<AudioStore>()((set, get) => ({
  isPlaying: false,
  currentWordId: null,
  queue: [],
  volume: 1,
  speed: 'normal',
  isMuted: false,

  play: async (wordId, arabicText) => {
    const { isMuted, volume, speed } = get();
    if (isMuted) return;

    set({ isPlaying: true, currentWordId: wordId });

    try {
      const rates = { normal: 1, slow: 0.75, very_slow: 0.5 };
      const text = arabicText || wordId;
      const response = await fetch(`/api/audio/${encodeURIComponent(text)}`);
      if (!response.ok) throw new Error(`TTS fetch failed: ${response.status}`);
      const arrayBuffer = await response.arrayBuffer();

      const audioContext = new AudioContext();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.playbackRate.value = rates[speed];

      const gainNode = audioContext.createGain();
      gainNode.gain.value = volume;

      source.connect(gainNode);
      gainNode.connect(audioContext.destination);

      source.onended = () => {
        set({ isPlaying: false, currentWordId: null });
        audioContext.close();
      };

      source.start(0);

      logAudioPlay('', wordId, speed);
    } catch {
      set({ isPlaying: false, currentWordId: null });
    }
  },

  stop: () => set({ isPlaying: false, currentWordId: null }),

  setSpeed: (speed) => set({ speed }),

  setVolume: (volume) => set({ volume }),

  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

  playSFX: (type) => {
    const { isMuted, volume } = get();
    if (isMuted || volume === 0) return;

    try {
      const ctx = new AudioContext();
      const masterGain = ctx.createGain();
      masterGain.gain.value = volume * 0.3;
      masterGain.connect(ctx.destination);

      const playTone = (freq: number, start: number, duration: number, gain: number = 0.3) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        g.gain.setValueAtTime(gain, start);
        g.gain.exponentialRampToValueAtTime(0.001, start + duration);
        osc.connect(g);
        g.connect(masterGain);
        osc.start(start);
        osc.stop(start + duration);
      };

      const now = ctx.currentTime;

      switch (type) {
        case 'correct':
          playTone(523, now, 0.12);
          playTone(659, now + 0.08, 0.12);
          playTone(784, now + 0.16, 0.18);
          setTimeout(() => ctx.close(), 500);
          break;

        case 'incorrect':
          playTone(330, now, 0.15, 0.2);
          playTone(262, now + 0.1, 0.2, 0.2);
          setTimeout(() => ctx.close(), 500);
          break;

        case 'combo': {
          const notes = [523, 587, 659, 698, 784, 880, 988, 1047];
          const count = Math.min(notes.length, 8);
          const startTimes = Array.from({ length: count }, (_, i) => now + i * 0.06);
          startTimes.forEach((t, i) => playTone(notes[i], t, 0.1 + i * 0.02, 0.25));
          setTimeout(() => ctx.close(), 1000);
          break;
        }

        case 'levelup':
          playTone(262, now, 0.6, 0.25);
          playTone(523, now + 0.15, 0.45, 0.2);
          playTone(784, now + 0.3, 0.35, 0.15);
          playTone(1047, now + 0.45, 0.3, 0.12);
          setTimeout(() => ctx.close(), 1200);
          break;

        case 'tap':
          playTone(800, now, 0.04, 0.1);
          setTimeout(() => ctx.close(), 200);
          break;

        case 'battle_hit':
          playTone(120, now, 0.15, 0.4);
          playTone(80, now + 0.05, 0.15, 0.3);
          setTimeout(() => ctx.close(), 500);
          break;
      }
    } catch {
      // SFX is non-critical — fail silently
    }
  },
}));
