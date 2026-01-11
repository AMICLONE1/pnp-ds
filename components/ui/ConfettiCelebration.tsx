"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
  scale: number;
}

interface ConfettiCelebrationProps {
  trigger: boolean;
  duration?: number;
  particleCount?: number;
  colors?: string[];
  onComplete?: () => void;
}

export function ConfettiCelebration({
  trigger,
  duration = 3000,
  particleCount = 50,
  colors = ["#FFB800", "#FFD54F", "#4CAF50", "#00BCD4", "#9C27B0", "#E91E63"],
  onComplete,
}: ConfettiCelebrationProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [isActive, setIsActive] = useState(false);

  const generatePieces = useCallback(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage across screen
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.5,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.5,
    }));
  }, [particleCount, colors]);

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true);
      setPieces(generatePieces());

      const timer = setTimeout(() => {
        setIsActive(false);
        setPieces([]);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [trigger, duration, generatePieces, isActive, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{
                x: `${piece.x}vw`,
                y: -20,
                rotate: 0,
                scale: 0,
                opacity: 1,
              }}
              animate={{
                y: "110vh",
                rotate: piece.rotation + 720,
                scale: piece.scale,
                opacity: [1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2 + Math.random(),
                delay: piece.delay,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="absolute"
              style={{ left: `${piece.x}%` }}
            >
              <div
                className="w-3 h-3"
                style={{
                  backgroundColor: piece.color,
                  clipPath: Math.random() > 0.5 
                    ? "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" // diamond
                    : Math.random() > 0.5 
                      ? "circle(50%)" // circle
                      : "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)", // star
                }}
              />
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

// Sparkle burst effect for inline celebrations
interface SparkleBurstProps {
  trigger: boolean;
  className?: string;
}

export function SparkleBurst({ trigger, className = "" }: SparkleBurstProps) {
  const [sparkles, setSparkles] = useState<Array<{ id: number; angle: number; distance: number }>>([]);

  useEffect(() => {
    if (trigger) {
      const newSparkles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        angle: i * 45,
        distance: 30 + Math.random() * 20,
      }));
      setSparkles(newSparkles);

      const timer = setTimeout(() => setSparkles([]), 600);
      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{ 
              x: "50%", 
              y: "50%", 
              scale: 0, 
              opacity: 1,
            }}
            animate={{
              x: `calc(50% + ${Math.cos(sparkle.angle * Math.PI / 180) * sparkle.distance}px)`,
              y: `calc(50% + ${Math.sin(sparkle.angle * Math.PI / 180) * sparkle.distance}px)`,
              scale: [0, 1, 0],
              opacity: [1, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute w-2 h-2 bg-gold rounded-full"
            style={{
              left: 0,
              top: 0,
              boxShadow: "0 0 6px 2px rgba(255, 184, 0, 0.5)",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Success celebration with message
interface SuccessCelebrationProps {
  show: boolean;
  message?: string;
  subMessage?: string;
  onClose?: () => void;
}

export function SuccessCelebration({ 
  show, 
  message = "🎉 Amazing Savings!", 
  subMessage,
  onClose 
}: SuccessCelebrationProps) {
  useEffect(() => {
    if (show && onClose) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <>
          <ConfettiCelebration trigger={show} />
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.5, repeat: 2 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-auto border-4 border-gold"
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h3 className="text-2xl font-bold text-charcoal mb-2">{message}</h3>
              {subMessage && (
                <p className="text-gray-600">{subMessage}</p>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
