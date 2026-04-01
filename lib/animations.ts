/**
 * Animation System
 * 
 * Centralized animation definitions for consistent motion design across the application.
 * All animations respect prefers-reduced-motion setting.
 */

// Animation durations (in ms)
export const DURATIONS = {
  fast: 150,
  base: 300,
  slow: 500,
  slower: 700,
} as const;

// Easing functions
export const EASINGS = {
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  elastic: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
} as const;

// Framer Motion variants for common animations
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 40 },
};

export const slideInRight = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

export const scaleUp = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

export const scaleDown = {
  initial: { opacity: 0, scale: 1.1 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.1 },
};

// Stagger children animation
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// Scroll reveal animation
export const scrollReveal = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.6, ease: [0, 0, 0.2, 1] },
};

// Button hover/tap animations
export const buttonHover = {
  scale: 1.02,
  transition: { duration: DURATIONS.fast / 1000, ease: EASINGS.out },
};

export const buttonTap = {
  scale: 0.98,
  transition: { duration: DURATIONS.fast / 1000 },
};

// Card hover animation
export const cardHover = {
  y: -4,
  boxShadow: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
  transition: { duration: DURATIONS.base / 1000, ease: EASINGS.out },
};

// Modal/Dialog animations
export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: DURATIONS.base / 1000 },
};

export const modalContent = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 },
  transition: { duration: DURATIONS.base / 1000, ease: EASINGS.out },
};

// Loading spinner animation
export const spinnerRotate = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Pulse animation
export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: EASINGS.inOut,
    },
  },
};

// Bounce animation
export const bounce = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: EASINGS.bounce,
    },
  },
};

// Progress bar animation
export const progressBar = {
  initial: { scaleX: 0, originX: 0 },
  animate: { scaleX: 1 },
  transition: { duration: DURATIONS.slow / 1000, ease: EASINGS.out },
};

// Toast notification animation
export const toastSlideIn = {
  initial: { opacity: 0, y: -50, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -20, scale: 0.95 },
  transition: { duration: DURATIONS.base / 1000, ease: EASINGS.bounce },
};

// Page transition animations
export const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: DURATIONS.slow / 1000, ease: EASINGS.out },
};

// Wizard step transition
export const wizardStepTransition = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
  transition: { duration: DURATIONS.base / 1000, ease: EASINGS.out },
};

// Image load animation
export const imageLoad = {
  initial: { opacity: 0, scale: 1.1 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: DURATIONS.slow / 1000, ease: EASINGS.out },
};

// Accordion expand/collapse
export const accordionContent = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: DURATIONS.base / 1000, ease: EASINGS.out },
};

// Drawer slide animations
export const drawerSlideLeft = {
  initial: { x: '-100%' },
  animate: { x: 0 },
  exit: { x: '-100%' },
  transition: { duration: DURATIONS.base / 1000, ease: EASINGS.out },
};

export const drawerSlideRight = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
  transition: { duration: DURATIONS.base / 1000, ease: EASINGS.out },
};

export const drawerSlideUp = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit: { y: '100%' },
  transition: { duration: DURATIONS.base / 1000, ease: EASINGS.out },
};

// Tooltip animation
export const tooltip = {
  initial: { opacity: 0, scale: 0.9, y: 4 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 4 },
  transition: { duration: DURATIONS.fast / 1000, ease: EASINGS.out },
};

/**
 * Custom hook to check if user prefers reduced motion
 */
export const useReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get animation props with reduced motion support
 * 
 * @param variants - Framer Motion variants object
 * @returns Variants object or empty object if reduced motion is preferred
 */
export const getAnimationProps = (variants: any) => {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return {};
  }
  return variants;
};

/**
 * Transition config for button interactions
 */
export const buttonTransition = {
  whileHover: buttonHover,
  whileTap: buttonTap,
};

/**
 * Transition config for card interactions
 */
export const cardTransition = {
  whileHover: cardHover,
};

/**
 * Default spring transition (for bouncy interactions)
 */
export const springTransition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
};

/**
 * Smooth transition (for most animations)
 */
export const smoothTransition = {
  duration: DURATIONS.base / 1000,
  ease: EASINGS.out,
};

/**
 * Fast transition (for quick feedback)
 */
export const fastTransition = {
  duration: DURATIONS.fast / 1000,
  ease: EASINGS.out,
};
