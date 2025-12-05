/**
 * QuarkTUI Theme Types
 *
 * Defines the structure for themes in QuarkTUI.
 * Applications can create their own themes implementing these interfaces.
 */
/**
 * Core color palette for a theme.
 * All colors should be ANSI escape sequences.
 */
export interface ThemeColors {
    /** Color for borders and frames */
    border: string;
    /** Primary accent color for highlights and important elements */
    accent: string;
    /** Secondary highlight color for selection indicators */
    highlight: string;
    /** Default text color */
    text: string;
    /** Bold text color */
    textBold: string;
    /** Dimmed text color */
    textDim: string;
    /** Muted/subtle text color */
    textMuted: string;
    /** Success/positive color (e.g., green) */
    success: string;
    /** Error/negative color (e.g., red) */
    error: string;
    /** Warning/caution color (e.g., yellow) */
    warning: string;
    /** Informational color (e.g., blue) */
    info: string;
    /** Cursor/caret color */
    cursor: string;
    /** Selection highlight color */
    selection: string;
}
/**
 * Complete theme definition.
 */
export interface Theme {
    /** Human-readable theme name */
    name: string;
    /** Unique identifier for the theme */
    id: string;
    /** Color palette */
    colors: ThemeColors;
}
/**
 * Interface for theme management.
 * Applications implement this to control theme loading and switching.
 */
export interface ThemeProvider {
    /** Get the currently active theme */
    getCurrentTheme(): Theme;
    /** Set the active theme by ID */
    setTheme?(themeId: string): void | Promise<void>;
    /** List available themes */
    getAvailableThemes?(): Theme[];
}
//# sourceMappingURL=theme.d.ts.map