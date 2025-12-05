/**
 * QuarkTUI - Theme System
 *
 * Provides theme management for consistent styling across the TUI.
 * Applications register their themes and QuarkTUI uses them for all rendering.
 */
import type { Theme, ThemeColors } from "../types/theme";
/** Reset all styling */
export declare const RESET = "\u001B[0m";
/** Bold text */
export declare const BOLD = "\u001B[1m";
/** Dim/faint text */
export declare const DIM = "\u001B[2m";
/** Italic text */
export declare const ITALIC = "\u001B[3m";
/** Underlined text */
export declare const UNDERLINE = "\u001B[4m";
/** Inverted colors */
export declare const INVERSE = "\u001B[7m";
/** Hidden text */
export declare const HIDDEN = "\u001B[8m";
/** Strikethrough text */
export declare const STRIKETHROUGH = "\u001B[9m";
/**
 * Create a foreground color using 256-color mode.
 * @param n - Color number (0-255)
 */
export declare function fg(n: number): string;
/**
 * Create a background color using 256-color mode.
 * @param n - Color number (0-255)
 */
export declare function bg(n: number): string;
/**
 * Create a foreground color using RGB (true color).
 */
export declare function fgRgb(r: number, g: number, b: number): string;
/**
 * Create a background color using RGB (true color).
 */
export declare function bgRgb(r: number, g: number, b: number): string;
/**
 * Standard ANSI colors for convenience.
 */
export declare const ANSI: {
    readonly black: "\u001B[30m";
    readonly red: "\u001B[31m";
    readonly green: "\u001B[32m";
    readonly yellow: "\u001B[33m";
    readonly blue: "\u001B[34m";
    readonly magenta: "\u001B[35m";
    readonly cyan: "\u001B[36m";
    readonly white: "\u001B[37m";
    readonly gray: "\u001B[90m";
    readonly brightRed: "\u001B[91m";
    readonly brightGreen: "\u001B[92m";
    readonly brightYellow: "\u001B[93m";
    readonly brightBlue: "\u001B[94m";
    readonly brightMagenta: "\u001B[95m";
    readonly brightCyan: "\u001B[96m";
    readonly brightWhite: "\u001B[97m";
};
/**
 * Standard ANSI background colors.
 */
export declare const ANSI_BG: {
    readonly black: "\u001B[40m";
    readonly red: "\u001B[41m";
    readonly green: "\u001B[42m";
    readonly yellow: "\u001B[43m";
    readonly blue: "\u001B[44m";
    readonly magenta: "\u001B[45m";
    readonly cyan: "\u001B[46m";
    readonly white: "\u001B[47m";
    readonly gray: "\u001B[100m";
    readonly brightRed: "\u001B[101m";
    readonly brightGreen: "\u001B[102m";
    readonly brightYellow: "\u001B[103m";
    readonly brightBlue: "\u001B[104m";
    readonly brightMagenta: "\u001B[105m";
    readonly brightCyan: "\u001B[106m";
    readonly brightWhite: "\u001B[107m";
};
/** Theme change listeners */
type ThemeChangeListener = (theme: Theme) => void;
/**
 * Get the currently active theme.
 */
export declare function getCurrentTheme(): Theme;
/**
 * Set the active theme.
 * @param theme - The theme to activate
 */
export declare function setTheme(theme: Theme): void;
/**
 * Subscribe to theme changes.
 * @param listener - Callback invoked when theme changes
 * @returns Unsubscribe function
 */
export declare function onThemeChange(listener: ThemeChangeListener): () => void;
/**
 * Get the current theme's colors.
 * Convenience function to avoid `getCurrentTheme().colors`.
 */
export declare function getColors(): ThemeColors;
/**
 * Reset to the default theme.
 */
export declare function resetTheme(): void;
/**
 * Create a custom theme with partial color overrides.
 * @param id - Unique theme ID
 * @param name - Human-readable theme name
 * @param colors - Partial color overrides (merged with defaults)
 */
export declare function createTheme(id: string, name: string, colors: Partial<ThemeColors>): Theme;
export type { Theme, ThemeColors } from "../types/theme";
//# sourceMappingURL=theme.d.ts.map