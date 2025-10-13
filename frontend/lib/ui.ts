/**
 * UI Utility Functions
 * Reusable styling patterns and helpers
 */

/**
 * Pressable button styles with hover and active states
 */
export function pressable(variant: "primary" | "secondary" | "tertiary" = "primary") {
  const base = "transition-all duration-150 active:scale-98 font-medium rounded-xl";
  
  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-blue-700",
    secondary: "bg-white text-gray-900 border-2 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50",
    tertiary: "text-indigo-600 hover:text-indigo-700 hover:underline"
  };
  
  return `${base} ${variants[variant]}`;
}

/**
 * Card styles with hover effects
 */
export function card(interactive: boolean = false) {
  const base = "rounded-2xl bg-white border border-gray-200 shadow-sm";
  const hover = interactive ? "hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer" : "";
  
  return `${base} ${hover}`;
}

/**
 * Screen reader only (visually hidden)
 */
export function visuallyHidden() {
  return "sr-only absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0";
}

/**
 * Focus ring (accessibility)
 */
export function focusRing() {
  return "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2";
}

/**
 * Skeleton loader shimmer effect
 */
export function skeleton() {
  return "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]";
}

/**
 * Container max-width
 */
export function container() {
  return "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";
}

/**
 * 8pt spacing scale
 */
export const spacing = {
  xs: "8px",    // 1 unit
  sm: "16px",   // 2 units
  md: "24px",   // 3 units
  lg: "32px",   // 4 units
  xl: "48px",   // 6 units
  xxl: "64px"   // 8 units
};

/**
 * Status colors
 */
export const statusColors = {
  success: "bg-green-100 text-green-800 border-green-200",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
  error: "bg-red-100 text-red-800 border-red-200",
  info: "bg-blue-100 text-blue-800 border-blue-200",
  neutral: "bg-gray-100 text-gray-800 border-gray-200"
};

/**
 * Truncate text with ellipsis
 */
export function truncate(lines: number = 1) {
  if (lines === 1) {
    return "truncate overflow-hidden text-ellipsis whitespace-nowrap";
  }
  return `line-clamp-${lines} overflow-hidden`;
}

/**
 * Responsive text sizes
 */
export const text = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl sm:text-2xl",
  "2xl": "text-2xl sm:text-3xl",
  "3xl": "text-3xl sm:text-4xl lg:text-5xl"
};

/**
 * Grid layouts
 */
export const grid = {
  auto: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
  two: "grid grid-cols-1 md:grid-cols-2 gap-6",
  three: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  four: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
};

/**
 * Aspect ratios
 */
export const aspect = {
  square: "aspect-square",
  video: "aspect-video",
  "4/3": "aspect-[4/3]",
  "16/9": "aspect-[16/9]"
};

/**
 * Safe area insets (for mobile notches)
 */
export function safeArea() {
  return "pt-safe pb-safe pl-safe pr-safe";
}

/**
 * Backdrop blur
 */
export function backdrop() {
  return "backdrop-blur-md bg-white/80";
}

/**
 * Gradient backgrounds
 */
export const gradients = {
  primary: "bg-gradient-to-r from-indigo-600 to-blue-600",
  secondary: "bg-gradient-to-r from-purple-600 to-pink-600",
  success: "bg-gradient-to-r from-green-500 to-emerald-600",
  dark: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
};

/**
 * Animation prefers-reduced-motion
 */
export function motion() {
  return "motion-safe:animate-fadeIn motion-reduce:animate-none";
}

