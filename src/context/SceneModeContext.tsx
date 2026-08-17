import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export type SceneMode = 'normal' | 'night' | 'rain';

interface SceneModeContextType {
  mode: SceneMode;
  setMode: (mode: SceneMode) => void;
}

const LOCAL_STORAGE_MODE_KEY = 'nostalgia_scene_mode';

const SceneModeContext = createContext<SceneModeContextType | undefined>(undefined);

// Procedural Web Audio Rain Synthesizer (Realistic filtered pink noise)
class ProceduralRainEngine {
  private ctx: AudioContext | null = null;
  private noiseSource: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private isRunning = false;

  public start() {
    if (this.isRunning) return;
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      this.ctx = new AudioContextClass();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      // Generate 4-second seamless loop of organic pink noise
      const sampleRate = this.ctx.sampleRate;
      const bufferSize = sampleRate * 4;
      const buffer = this.ctx.createBuffer(2, bufferSize, sampleRate);

      for (let channel = 0; channel < 2; channel++) {
        const data = buffer.getChannelData(channel);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
          b6 = white * 0.115926;
        }
      }

      this.noiseSource = this.ctx.createBufferSource();
      this.noiseSource.buffer = buffer;
      this.noiseSource.loop = true;

      // Filter to simulate soft raindrops pattering on tin roofs & trees
      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(1100, this.ctx.currentTime);

      const highpass = this.ctx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(160, this.ctx.currentTime);

      this.gainNode = this.ctx.createGain();
      // Gentle fade-in over 1.2s
      this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
      this.gainNode.gain.linearRampToValueAtTime(0.14, this.ctx.currentTime + 1.2);

      this.noiseSource.connect(lowpass);
      lowpass.connect(highpass);
      highpass.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      this.noiseSource.start(0);
      this.isRunning = true;
    } catch (err) {
      console.warn('Rain audio synthesis unavailable:', err);
    }
  }

  public stop() {
    if (!this.isRunning || !this.ctx || !this.gainNode) return;
    try {
      const now = this.ctx.currentTime;
      this.gainNode.gain.linearRampToValueAtTime(0.001, now + 0.8);
      const prevCtx = this.ctx;
      setTimeout(() => {
        if (prevCtx && prevCtx.state !== 'closed') {
          prevCtx.close().catch(() => {});
        }
      }, 850);
      this.ctx = null;
      this.noiseSource = null;
      this.gainNode = null;
      this.isRunning = false;
    } catch {
      this.isRunning = false;
    }
  }
}

export const SceneModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<SceneMode>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_MODE_KEY);
      if (saved === 'normal' || saved === 'night' || saved === 'rain') {
        return saved;
      }
    } catch {
      // Fallback
    }
    return 'normal';
  });

  const rainEngineRef = useRef<ProceduralRainEngine | null>(null);

  const setMode = (newMode: SceneMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(LOCAL_STORAGE_MODE_KEY, newMode);
    } catch (e) {
      console.warn('Failed to save scene mode to localStorage:', e);
    }
  };

  // Manage rain audio ambience when mode changes
  useEffect(() => {
    if (!rainEngineRef.current) {
      rainEngineRef.current = new ProceduralRainEngine();
    }

    if (mode === 'rain') {
      rainEngineRef.current.start();
    } else {
      rainEngineRef.current.stop();
    }

    return () => {
      rainEngineRef.current?.stop();
    };
  }, [mode]);

  return (
    <SceneModeContext.Provider value={{ mode, setMode }}>
      {children}
    </SceneModeContext.Provider>
  );
};

export const useSceneMode = (): SceneModeContextType => {
  const context = useContext(SceneModeContext);
  if (!context) {
    throw new Error('useSceneMode must be used within a SceneModeProvider');
  }
  return context;
};
