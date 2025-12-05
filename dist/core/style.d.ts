/**
 * QuarkTUI - Text Styling
 *
 * Utilities for styling text with colors and formatting.
 * Uses the theme system for consistent styling across the application.
 */
/**
 * Available style types that can be applied to text.
 */
export type StyleType = "dim" | "bold" | "success" | "warning" | "error" | "info" | "accent" | "highlight" | "muted" | "text" | "border";
/**
 * Apply one or more styles to text.
 *
 * @param text - The text to style
 * @param styles - One or more style types to apply
 * @returns The styled text with ANSI escape codes
 *
 * @example
 * ```ts
 * style("Hello", "bold")           // Bold text
 * style("Error!", "error")         // Red error text
 * style("Note", "bold", "success") // Bold green text
 * style("Tip", "dim", "muted")     // Dimmed muted text
 * ```
 */
export declare function style(text: string, ...styles: StyleType[]): string;
/**
 * Apply raw ANSI codes to text.
 * Use this when you need specific colors not covered by style types.
 *
 * @param text - The text to style
 * @param codes - ANSI escape codes to apply
 * @returns The styled text
 *
 * @example
 * ```ts
 * raw("Custom", "\x1b[35m") // Magenta text
 * ```
 */
export declare function raw(text: string, ...codes: string[]): string;
/**
 * Strip ANSI escape codes from a string.
 * Useful for calculating the visible length of styled text.
 *
 * @param str - String potentially containing ANSI codes
 * @returns String with all ANSI codes removed
 */
export declare function stripAnsi(str: string): string;
/**
 * Get the visible length of a string (excluding ANSI codes).
 *
 * @param str - String potentially containing ANSI codes
 * @returns Number of visible characters
 */
export declare function visibleLength(str: string): number;
/**
 * Repeat a string n times.
 *
 * @param char - String to repeat
 * @param count - Number of times to repeat
 * @returns The repeated string
 */
export declare function repeat(char: string, count: number): string;
/**
 * Pad a string on the right to a specified width.
 * Accounts for ANSI codes in the input string.
 *
 * @param text - Text to pad
 * @param width - Target width
 * @param padChar - Character to use for padding (default: space)
 * @returns Padded string
 */
export declare function padRight(text: string, width: number, padChar?: string): string;
/**
 * Pad a string on the left to a specified width.
 * Accounts for ANSI codes in the input string.
 *
 * @param text - Text to pad
 * @param width - Target width
 * @param padChar - Character to use for padding (default: space)
 * @returns Padded string
 */
export declare function padLeft(text: string, width: number, padChar?: string): string;
/**
 * Center a string within a specified width.
 * Accounts for ANSI codes in the input string.
 *
 * @param text - Text to center
 * @param width - Target width
 * @param padChar - Character to use for padding (default: space)
 * @returns Centered string
 */
export declare function padCenter(text: string, width: number, padChar?: string): string;
/**
 * Truncate a string to a maximum visible length.
 * Accounts for ANSI codes and adds ellipsis if truncated.
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum visible length
 * @param ellipsis - String to append when truncated (default: "...")
 * @returns Truncated string
 */
export declare function truncate(text: string, maxLength: number, ellipsis?: string): string;
/**
 * @deprecated Use `style(text, "dim")` instead
 */
export declare function formatDim(text: string): string;
/**
 * @deprecated Use `style(text, "bold")` instead
 */
export declare function formatBold(text: string): string;
/**
 * @deprecated Use `style(text, "success")` instead
 */
export declare function formatSuccess(text: string): string;
/**
 * @deprecated Use `style(text, "error")` instead
 */
export declare function formatError(text: string): string;
/**
 * @deprecated Use `style(text, "warning")` instead
 */
export declare function formatWarning(text: string): string;
/**
 * @deprecated Use `style(text, "info")` instead
 */
export declare function formatInfo(text: string): string;
//# sourceMappingURL=style.d.ts.map