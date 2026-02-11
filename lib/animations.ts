// Animation utilities and presets

export const easing = {
  smooth: "cubic-bezier(0.16, 1, 0.3, 1)",
  snappy: "cubic-bezier(0.7, 0, 0.84, 0)",
  bouncy: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
};

export const durations = {
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 1000,
};

// Framer Motion animation variants
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

export const slideUp = {
  hidden: { y: 100, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Animation transition presets
export const transition = {
  smooth: {
    duration: durations.normal / 1000,
    ease: easing.smooth,
  },
  snappy: {
    duration: durations.fast / 1000,
    ease: easing.snappy,
  },
  bouncy: {
    duration: durations.slow / 1000,
    ease: easing.bouncy,
  },
};

// Hero entrance sequence timeline
export const heroSequence = {
  background: { delay: 0, duration: 0.5 },
  sphere: { delay: 0.2, duration: 0.6 },
  headline: { delay: 0.4, duration: 0.6 },
  subheadline: { delay: 0.6, duration: 0.6 },
  calculator: { delay: 0.8, duration: 0.6 },
  trustIndicators: { delay: 1.0, duration: 0.5 },
  ctas: { delay: 1.2, duration: 0.5 },
  statsTicker: { delay: 1.4, duration: 0.5 },
};
