/**
 * QuarkTUI - Shared Dialog Utilities
 *
 * Common UI patterns used across all dialog components.
 * Provides consistent header and footer rendering.
 */
/**
 * Options for rendering a standard dialog header.
 */
export interface DialogHeaderOptions {
    /** Main title text */
    title: string;
    /** Optional app name (displayed before title) */
    appName?: string;
    /** Optional subtitle (displayed after app name, dimmed) */
    subtitle?: string;
    /** Optional description (displayed on line 3) */
    description?: string;
    /** Optional icon to display before title */
    icon?: string;
    /** Color for the title (default: accent) */
    titleColor?: string;
}
/**
 * Options for rendering a standard dialog footer.
 */
export interface DialogFooterOptions {
    /** Hint strings to display (e.g., ["↑↓ Navigate", "⏎ Select", "q Back"]) */
    hints: string[];
    /** Whether to center the hints (default: true) */
    centered?: boolean;
}
/**
 * Format hint strings with dimmed keys.
 * Input: ["Space Action", "↑↓ Navigate"]
 * Output: "Space Action  ↑↓ Navigate" with first word/symbol dimmed
 *
 * @param hints - Array of hint strings
 * @returns Formatted hint string
 */
export declare function formatHints(hints: string[]): string;
/**
 * Draw a standard 4-line dialog header.
 *
 * Structure:
 * - Line 1: Empty line
 * - Line 2: Title (with optional app name, icon)
 * - Line 3: Description OR empty line
 * - Line 4: Empty line
 *
 * @param innerWidth - Width inside the frame borders
 * @param options - Header configuration options
 */
export declare function drawDialogHeader(innerWidth: number, options: DialogHeaderOptions): void;
/**
 * Draw a standard 3-line dialog footer (inside the divider).
 *
 * Structure:
 * - Line 1: Empty line
 * - Line 2: Hints
 * - Line 3: Empty line
 *
 * Note: The divider before the footer should be drawn separately.
 *
 * @param innerWidth - Width inside the frame borders
 * @param options - Footer configuration options
 */
export declare function drawDialogFooter(innerWidth: number, options: DialogFooterOptions): void;
/**
 * Draw a simple header with just a title.
 *
 * @param innerWidth - Width inside the frame borders
 * @param title - Title text
 */
export declare function drawSimpleHeader(innerWidth: number, title: string): void;
/**
 * Draw a header with an icon prefix.
 *
 * @param innerWidth - Width inside the frame borders
 * @param title - Title text
 * @param icon - Icon string (already styled)
 */
export declare function drawIconHeader(innerWidth: number, title: string, icon: string): void;
/**
 * Draw a simple footer with hint strings.
 *
 * @param innerWidth - Width inside the frame borders
 * @param hints - Array of hint strings
 */
export declare function drawSimpleFooter(innerWidth: number, hints: string[]): void;
//# sourceMappingURL=shared.d.ts.map