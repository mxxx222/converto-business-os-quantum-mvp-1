/**
 * Gamify Level Up Animation
 * Triggered when user levels up with sound effect
 */

"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";
import { useSfx } from "@/hooks/useSfx";

interface GamifyLevelUpProps {
  show: boolean;
  level: number;
  onClose: () => void;
}

export default function GamifyLevelUp({ show, level, onClose }: GamifyLevelUpProps) {
  const { play } = useSfx();

  useEffect(() => {
    if (show) {
      // Play level up sound
      play("levelup");
      
      // Haptic feedback (if supported)
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200]);
      }

      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, play, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Level Up Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -100 }}
            transition={{
              type: "spring",
              damping: 15,
              stiffness: 200
            }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[201]"
          >
            <div className="bg-gradient-to-br from-amber-400 via-orange-500 to-pink-600 p-8 rounded-3xl shadow-2xl text-center min-w-[300px]">
              {/* Trophy Icon */}
              <motion.div
                animate={{
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1, 1.1, 1]
                }}
                transition={{
                  duration: 0.8,
                  repeat: 2
                }}
                className="mb-4"
              >
                <Trophy className="w-20 h-20 mx-auto text-white drop-shadow-lg" />
              </motion.div>

              {/* Text */}
              <h2 className="text-3xl font-bold text-white mb-2">
                Tason nousu!
              </h2>
              <p className="text-white/90 text-lg mb-4">
                Olet nyt tasolla <span className="font-bold text-2xl">{level}</span>
              </p>

              {/* Particles effect */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: [1, 0],
                    scale: [0, 1.5],
                    x: Math.cos((i / 8) * Math.PI * 2) * 100,
                    y: Math.sin((i / 8) * Math.PI * 2) * 100
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1
                  }}
                  className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full"
                  style={{ pointerEvents: "none" }}
                />
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

