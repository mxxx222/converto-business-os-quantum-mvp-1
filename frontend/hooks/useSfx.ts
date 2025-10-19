/**
 * Sound Effects Hook
 * Lightweight audio feedback system with localStorage persistence
 */

"use client";
import { useCallback, useEffect, useRef, useState } from "react";

type SfxKey = "click" | "success" | "levelup" | "achievement";

const SFX_MAP: Record<SfxKey, string> = {
  click: "/sfx/click.mp3",
  success: "/sfx/success.mp3",
  levelup: "/sfx/levelup.mp3",
  achievement: "/sfx/levelup.mp3", // Reuse levelup for achievements
};

interface SfxSettings {
  on: boolean;
  vol: number;
}

export function useSfx() {
  const [enabled, setEnabled] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(0.35);
  const cache = useRef<Map<SfxKey, HTMLAudioElement>>(new Map());

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("sfx");
      if (saved) {
        const { on, vol }: SfxSettings = JSON.parse(saved);
        setEnabled(on);
        setVolume(vol);
      }
    } catch (error) {
      console.warn("Failed to load SFX settings:", error);
    }
  }, []);

  // Save settings to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem("sfx", JSON.stringify({ on: enabled, vol: volume }));

      // Update volume for all cached audio elements
      cache.current.forEach((audio) => {
        audio.volume = volume;
      });
    } catch (error) {
      console.warn("Failed to save SFX settings:", error);
    }
  }, [enabled, volume]);

  const play = useCallback(
    (key: SfxKey) => {
      if (!enabled) return;

      let audio = cache.current.get(key);

      if (!audio) {
        // Create and cache new audio element
        audio = new Audio(SFX_MAP[key]);
        audio.volume = volume;
        audio.preload = "auto";
        cache.current.set(key, audio);
      }

      // Restart from beginning for snappy feedback
      try {
        audio.currentTime = 0;
      } catch (error) {
        // Ignore errors (audio might not be loaded yet)
      }

      // Play audio (ignore autoplay errors)
      audio.play().catch(() => {
        // Silently fail if autoplay is blocked
      });
    },
    [enabled, volume]
  );

  return {
    play,
    sfxOn: enabled,
    setSfxOn: setEnabled,
    volume,
    setVolume,
  };
}
