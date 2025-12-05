/**
 * QuarkTUI - Theme System
 *
 * Provides theme management for consistent styling across the TUI.
 * Applications register their themes and QuarkTUI uses them for all rendering.
 */

import type { Theme, ThemeColors } from "../types/theme";

// =============================================================================
// ANSI Escape Codes
// =============================================================================

/** Reset all styling */
export const RESET = "\x1b[0m";

/** Bold text */
export const BOLD = "\x1b[1m";

/** Dim/faint text */
export const DIM = "\x1b[2m";

/** Italic text */
export const ITALIC = "\x1b[3m";

/** Underlined text */
export const UNDERLINE = "\x1b[4m";

/** Inverted colors */
export const INVERSE = "\x1b[7m";

/** Hidden text */
export const HIDDEN = "\x1b[8m";

/** Strikethrough text */
export const STRIKETHROUGH = "\x1b[9m";

// =============================================================================
// Color Helpers
// =============================================================================

/**
 * Create a foreground color using 256-color mode.
 * @param n - Color number (0-255)
 */
export function fg(n: number): string {
  return `\x1b[38;5;${n}m`;
}

/**
 * Create a background color using 256-color mode.
 * @param n - Color number (0-255)
 */
export function bg(n: number): string {
  return `\x1b[48;5;${n}m`;
}

/**
 * Create a foreground color using RGB (true color).
 */
export function fgRgb(r: number, g: number, b: number): string {
  return `\x1b[38;2;${r};${g};${b}m`;
}

/**
 * Create a background color using RGB (true color).
 */
export function bgRgb(r: number, g: number, b: number): string {
  return `\x1b[48;2;${r};${g};${b}m`;
}

/**
 * Standard ANSI colors for convenience.
 */
export const ANSI = {
  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  gray: "\x1b[90m",
  brightRed: "\x1b[91m",
  brightGreen: "\x1b[92m",
  brightYellow: "\x1b[93m",
  brightBlue: "\x1b[94m",
  brightMagenta: "\x1b[95m",
  brightCyan: "\x1b[96m",
  brightWhite: "\x1b[97m",
} as const;

/**
 * Standard ANSI background colors.
 */
export const ANSI_BG = {
  black: "\x1b[40m",
  red: "\x1b[41m",
  green: "\x1b[42m",
  yellow: "\x1b[43m",
  blue: "\x1b[44m",
  magenta: "\x1b[45m",
  cyan: "\x1b[46m",
  white: "\x1b[47m",
  gray: "\x1b[100m",
  brightRed: "\x1b[101m",
  brightGreen: "\x1b[102m",
  brightYellow: "\x1b[103m",
  brightBlue: "\x1b[104m",
  brightMagenta: "\x1b[105m",
  brightCyan: "\x1b[106m",
  brightWhite: "\x1b[107m",
} as const;

// =============================================================================
// Default Theme
// =============================================================================

/**
 * Default theme colors used when no theme is registered.
 */
const DEFAULT_COLORS: ThemeColors = {
  border: ANSI.cyan,
  accent: ANSI.magenta,
  highlight: ANSI.cyan,
  text: ANSI.white,
  textBold: BOLD + ANSI.white,
  textDim: DIM,
  textMuted: ANSI.gray,
  success: ANSI.green,
  error: ANSI.red,
  warning: ANSI.yellow,
  info: ANSI.blue,
  cursor: ANSI.cyan,
  selection: ANSI.cyan,
};

/**
 * Built-in default theme.
 */
const DEFAULT_THEME: Theme = {
  name: "Default",
  id: "default",
  colors: DEFAULT_COLORS,
};

// =============================================================================
// Theme State
// =============================================================================

/** Currently active theme */
let currentTheme: Theme = DEFAULT_THEME;

/** Theme change listeners */
type ThemeChangeListener = (theme: Theme) => void;
const themeListeners: Set<ThemeChangeListener> = new Set();

// =============================================================================
// Theme API
// =============================================================================

/**
 * Get the currently active theme.
 */
export function getCurrentTheme(): Theme {
  return currentTheme;
}

/**
 * Set the active theme.
 * @param theme - The theme to activate
 */
export function setTheme(theme: Theme): void {
  currentTheme = theme;
  // Notify listeners
  for (const listener of themeListeners) {
    listener(theme);
  }
}

/**
 * Subscribe to theme changes.
 * @param listener - Callback invoked when theme changes
 * @returns Unsubscribe function
 */
export function onThemeChange(listener: ThemeChangeListener): () => void {
  themeListeners.add(listener);
  return () => {
    themeListeners.delete(listener);
  };
}

/**
 * Get the current theme's colors.
 * Convenience function to avoid `getCurrentTheme().colors`.
 */
export function getColors(): ThemeColors {
  return currentTheme.colors;
}

/**
 * Reset to the default theme.
 */
export function resetTheme(): void {
  setTheme(DEFAULT_THEME);
}

/**
 * Create a custom theme with partial color overrides.
 * @param id - Unique theme ID
 * @param name - Human-readable theme name
 * @param colors - Partial color overrides (merged with defaults)
 */
export function createTheme(
  id: string,
  name: string,
  colors: Partial<ThemeColors>,
): Theme {
  return {
    id,
    name,
    colors: {
      ...DEFAULT_COLORS,
      ...colors,
    },
  };
}

// =============================================================================
// Re-exports
// =============================================================================

export type { Theme, ThemeColors } from "../types/theme";
