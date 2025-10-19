/**
 * Sound Settings Component
 * Toggle and volume control for sound effects
 */

"use client";
import { useSfx } from "@/hooks/useSfx";

export default function SoundSettings() {
  const { sfxOn, setSfxOn, volume, setVolume, play } = useSfx();

  return (
    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={sfxOn}
          onChange={(e) => setSfxOn(e.target.checked)}
          className="w-4 h-4 rounded"
        />
        <span>🔊 Äänet</span>
      </label>

      {sfxOn && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">🔉</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            onMouseUp={() => play("click")}
            onTouchEnd={() => play("click")}
            className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${volume * 100}%, #4b5563 ${volume * 100}%, #4b5563 100%)`
            }}
          />
          <span className="text-xs text-gray-400">🔊</span>
        </div>
      )}
    </div>
  );
}
